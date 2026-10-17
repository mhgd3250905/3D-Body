"""Recoverable two-slot HipLab render queue; preserves all existing outputs.

Example: python run_queue.py --app E:/AII-3D/3D-Hip --output <batch>
         --wait-pids <8860-python-pid> <8861-python-pid>
Use --dry-run to inspect without creating files, waiting, or starting processes.
"""
from __future__ import annotations

import argparse
import ctypes
from ctypes import wintypes
from datetime import datetime
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
import time


REPO = Path(__file__).resolve().parents[2]
BATCH = Path(__file__).with_name("render_batch.py")
PORTS = (8860, 8861)
INITIAL = {8860: ("n-chair-wiper",), 8861: ("s-9090", "s-seated-fold", "h-squat")}
TERMINAL = {"pass", "review", "error"}
MIN_FREE = 15 * 1024 ** 3


def now():
    return datetime.now().astimezone().isoformat(timespec="seconds")


def read_json(path, strict=False):
    for attempt in range(3):
        try:
            return json.loads(path.read_text(encoding="utf-8-sig"))
        except FileNotFoundError:
            return None
        except (OSError, ValueError):
            if attempt < 2:
                time.sleep(0.05)
            elif strict:
                raise
    return None


def write_json(path, value):
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(temporary, path)


class ProcessWatch:
    """Read-only Windows process handle, including identity to detect PID reuse."""

    def __init__(self, pid, expected_created=None):
        if os.name != "nt":
            raise RuntimeError("Process monitoring requires Windows; --dry-run is portable")
        self.pid, self.handle, self.created = int(pid), None, None
        kernel = self.kernel = ctypes.WinDLL("kernel32", use_last_error=True)
        kernel.OpenProcess.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
        kernel.OpenProcess.restype = wintypes.HANDLE
        kernel.GetExitCodeProcess.argtypes = [wintypes.HANDLE, ctypes.POINTER(wintypes.DWORD)]
        kernel.GetExitCodeProcess.restype = wintypes.BOOL
        kernel.WaitForSingleObject.argtypes = [wintypes.HANDLE, wintypes.DWORD]
        kernel.WaitForSingleObject.restype = wintypes.DWORD
        kernel.GetProcessTimes.argtypes = [wintypes.HANDLE] + [ctypes.POINTER(wintypes.FILETIME)] * 4
        kernel.GetProcessTimes.restype = wintypes.BOOL
        kernel.CloseHandle.argtypes = [wintypes.HANDLE]
        kernel.CloseHandle.restype = wintypes.BOOL
        self.handle = kernel.OpenProcess(0x00100000 | 0x1000, False, self.pid)
        if not self.handle:
            error = ctypes.get_last_error()
            if error in (87, 1168):
                return
            raise ctypes.WinError(error)
        times = [wintypes.FILETIME() for _ in range(4)]
        if not kernel.GetProcessTimes(self.handle, *[ctypes.byref(t) for t in times]):
            error = ctypes.get_last_error()
            self.close()
            raise ctypes.WinError(error)
        self.created = (times[0].dwHighDateTime << 32) | times[0].dwLowDateTime
        if expected_created is not None and self.created != expected_created:
            self.close()  # The original process ended and its PID was reused.

    def poll(self):
        if not self.handle:
            return True, None
        result = self.kernel.WaitForSingleObject(self.handle, 0)
        if result == 258:
            return False, None
        if result != 0:
            raise ctypes.WinError(ctypes.get_last_error())
        code = wintypes.DWORD()
        if not self.kernel.GetExitCodeProcess(self.handle, ctypes.byref(code)):
            raise ctypes.WinError(ctypes.get_last_error())
        return True, code.value

    def close(self):
        if self.handle:
            self.kernel.CloseHandle(self.handle)
            self.handle = None


class InstanceLock:
    """OS releases this lock after a crash; a second manager cannot dispatch."""

    def __init__(self, path):
        import msvcrt
        self.file = path.open("a+b")
        self.file.seek(0, 2)
        if self.file.tell() == 0:
            self.file.write(b"0")
            self.file.flush()
        self.file.seek(0)
        try:
            msvcrt.locking(self.file.fileno(), msvcrt.LK_NBLCK, 1)
        except OSError:
            self.file.close()
            raise RuntimeError("Another queue manager holds this batch lock") from None

    def close(self):
        self.file.close()


def outputs(output, sid):
    master = output / "master"
    paths = [master / (sid + ext) for ext in (".mp4", ".gif", "-sheet.png")]
    paths.append(master / "metrics" / (sid + ".json"))
    return [str(path) for path in paths if path.exists()]


def progress(output):
    results = {}
    for path in sorted(output.glob("progress*.json")):
        data = read_json(path)
        if not isinstance(data, dict) or not isinstance(data.get("items"), dict):
            continue
        for sid, item in data["items"].items():
            if not isinstance(item, dict):
                continue
            previous = results.get(sid, {})
            if previous.get("status") not in ("pass", "review") or item.get("status") == "pass":
                results[sid] = {**item, "progress_file": str(path)}
    return results


def reconcile(items, output, evidence, protected):
    for sid, row in items.items():
        if sid in protected:
            continue
        observed = evidence.get(sid, {})
        if observed.get("status") in ("pass", "review"):
            row.update(observed, preserved=True)
        elif row.get("status") in TERMINAL:
            continue
        elif existing := outputs(output, sid):
            row.update(status="review", preserved=True, reason="Existing outputs preserved; acceptance not established", outputs=existing)


def queue_order(drills):
    # Stable content order within each group: missing videos receive first service.
    return sorted(drills, key=lambda sid: drills[sid].get("media", {}).get("status") == "video")


def finish(sid, row, output, evidence, code):
    observed = evidence.get(sid, {})
    existing = outputs(output, sid)
    if observed.get("status") in TERMINAL:
        row.update(observed)
    elif existing:
        row.update(status="review", reason="Worker ended with preserved outputs but no completed QA record", outputs=existing)
    else:
        row.update(status="error", reason="Worker ended without completed outputs or QA record")
    if code not in (None, 0):
        row.update(status="error", reason="Worker exited unsuccessfully")
    row.update(exit_code=code, finished=now())


def preview_ready(output, sid):
    root = output / "preview-work"
    return (root / sid / "c" / "still.png").is_file() and (root / (sid + ".spec.json")).is_file() and any((root / sid / "fr").glob("met-*.json"))


def preflight(output, sid, logfile):
    """Run original QA, preserving its thresholds; omit only full-loop completeness."""
    root = output / "preview-work"
    directory = root / sid
    result_path = directory / "queue-preflight.json"
    command = [sys.executable, str(REPO / "tools/drill-anim/lib/qa.py"), str(directory / "fr"),
               str(root / (sid + ".spec.json")), str(result_path), str(directory / "c")]
    try:
        with logfile.open("ab", buffering=0) as stream:
            stream.write(("\nQUEUE_PREFLIGHT " + now() + "\n").encode("utf-8"))
            result = subprocess.run(command, cwd=REPO, stdout=stream, stderr=subprocess.STDOUT,
                timeout=30, creationflags=subprocess.CREATE_NO_WINDOW,
                env={**os.environ, "PYTHONUTF8": "1", "PYTHONIOENCODING": "utf-8"})
        if result.returncode:
            return {"status": "error", "reason": "Preview QA process failed", "exit_code": result.returncode}
        qa = read_json(result_path, strict=True)
        if not isinstance(qa, dict):
            raise ValueError("Preview QA produced no result")
        # Exactly the booleans used by qa.py's final pass expression. Its full-loop
        # frames_complete flag is expected to be false for three-frame previews.
        required = ("below_floor", "pins", "straight", "limits", "self_clip", "hand_clip", "frame_edge_touch_frames", "frames_complete")
        if any(key not in qa for key in required) or qa.get("frames", 0) < 3:
            raise ValueError("Preview QA is incomplete")
        failures = []
        if qa["below_floor"]:
            failures.append("below_floor")
        if qa["frame_edge_touch_frames"]:
            failures.append("frame_edge_touch_frames")
        for group in ("pins", "straight", "hand_clip"):
            for name, check in qa[group].items():
                if isinstance(check, dict) and check.get("ok") is False:
                    failures.append(group + "." + name)
        for key in ("knee_flex_backward", "elbow_flex_forward", "hip_ok", "waist_ok"):
            if qa["limits"].get(key) is not True:
                failures.append("limits." + key)
        if qa["self_clip"].get("ok") is not True:
            failures.append("self_clip")
        if not any((directory / "c").glob("edge-*.json")):
            failures.append("missing_frame_edge_evidence")
        return {"status": "review" if failures else "ready", "checks_pass": not failures,
                "failed_checks": failures, "frames_complete": qa["frames_complete"],
                "frames": qa["frames"], "metrics": str(result_path), "checked": now(),
                "scope": "Preview samples only; full-loop QA required after rendering"}
    except (OSError, ValueError, subprocess.TimeoutExpired) as exc:
        return {"status": "error", "reason": "Preview QA could not complete: " + str(exc)}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--app", required=True, type=Path)
    ap.add_argument("--output", required=True, type=Path)
    ap.add_argument("--wait-pids", nargs=2, type=int, metavar=("PID_8860", "PID_8861"))
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    if a.wait_pids and (min(a.wait_pids) <= 0 or len(set(a.wait_pids)) != 2):
        ap.error("--wait-pids requires two distinct positive Python PIDs, ordered by ports 8860 and 8861")
    app, output = a.app.resolve(), a.output.resolve()
    content = read_json(app / "assets/hip/hip-content.json", strict=True)
    if not content or not isinstance(content.get("drills"), list):
        ap.error("App content has no drills list")
    drills = {d["id"]: d for d in content["drills"]}
    if len(drills) != len(content["drills"]) or any(not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_-]*", sid) for sid in drills):
        ap.error("Duplicate or unsafe content drill id")
    status_path = output / "queue-status.json"
    previous = read_json(status_path, strict=True) or {}
    if previous and (previous.get("app") != str(app) or previous.get("output") != str(output)):
        ap.error("Saved queue belongs to a different app or batch")
    items = {sid: {"status": "pending", "original_app_status": d.get("media", {}).get("status"), **previous.get("items", {}).get(sid, {})} for sid, d in drills.items()}
    evidence = progress(output)
    initial_ids = {sid for ids in INITIAL.values() for sid in ids if sid in drills}
    saved_slots = previous.get("slots", [])
    protected = initial_ids if a.wait_pids else set()
    protected |= {sid for slot in saved_slots for sid in slot.get("ids", [])}
    reconcile(items, output, evidence, protected)
    pending = [sid for sid in queue_order(drills) if sid not in protected and items[sid]["status"] not in TERMINAL]
    if a.dry_run:
        print(json.dumps({"dry_run": True, "content_count": len(drills), "ports": list(PORTS),
            "wait_pids": a.wait_pids, "initial_ids": sorted(protected), "queue_count": len(pending),
            "queue": [{"id": sid, "original_app_status": items[sid]["original_app_status"],
                       "next_stage": "preflight" if preview_ready(output, sid) else "preview"} for sid in pending],
            "preserved": {sid: row["status"] for sid, row in items.items() if sid not in protected and row["status"] in TERMINAL},
            "minimum_free_bytes": MIN_FREE}, ensure_ascii=False, indent=2))
        return 0
    if os.name != "nt":
        ap.error("This queue's process monitoring and lock require Windows")
    output.mkdir(parents=True, exist_ok=True)
    lock = InstanceLock(output / "queue-manager.lock")
    logs = output / "queue-logs"
    logs.mkdir(exist_ok=True)
    state = {"schema": 1, "app": str(app), "output": str(output), "manager_pid": os.getpid(),
             "started": previous.get("started", now()), "resumed": now(), "items": items,
             "ports": list(PORTS), "minimum_free_bytes": MIN_FREE, "status": "running", "slots": []}
    active, handles = {}, {}
    low_disk = False

    def save():
        state.update(updated=now(), slots=[slot["record"] for slot in active.values()],
            pending=[sid for sid in queue_order(drills) if items[sid]["status"] not in TERMINAL and not any(sid in s["record"]["ids"] for s in active.values())])
        state["counts"] = {name: sum(row["status"] == name for row in items.values()) for name in ("pending", "waiting", "running", "pass", "review", "error")}
        write_json(status_path, state)

    try:
        # Recover live workers from a previous manager before considering new work.
        for record in saved_slots:
            port = record["port"]
            if port not in PORTS or port in active:
                raise RuntimeError("Saved queue has conflicting/unknown worker slots")
            watch = ProcessWatch(record["pid"], record.get("created"))
            handles[port] = watch
            active[port] = {"record": record, "watch": watch}
        if a.wait_pids:
            for port, pid in zip(PORTS, a.wait_pids):
                if port in active:
                    continue
                # An already-finished initial slot recorded by this queue need not be watched again.
                if all(items[sid]["status"] in TERMINAL for sid in INITIAL[port] if sid in items):
                    continue
                watch = ProcessWatch(pid)
                handles[port] = watch
                record = {"port": port, "pid": pid, "created": watch.created, "kind": "initial",
                          "ids": [sid for sid in INITIAL[port] if sid in items], "started": now()}
                active[port] = {"record": record, "watch": watch}
                for sid in record["ids"]:
                    items[sid].update(status="waiting", pid=pid, port=port)
        save()
        while True:
            evidence = progress(output)
            for port, slot in list(active.items()):
                done, code = slot["watch"].poll()
                if not done:
                    continue
                process = slot.get("process")
                if process is not None:
                    code = process.wait()
                if slot.get("log"):
                    slot["log"].close()
                for sid in slot["record"]["ids"]:
                    if slot["record"].get("stage") == "preview":
                        if code in (None, 0) and preview_ready(output, sid):
                            items[sid].update(status="pending", preview_finished=now())
                        else:
                            items[sid].update(status="error", reason="Preview failed or lacks complete sample evidence", exit_code=code, finished=now())
                    else:
                        finish(sid, items[sid], output, evidence, code)
                    print("QUEUE_RESULT", sid, items[sid]["status"], flush=True)
                slot["watch"].close()
                handles.pop(port, None)
                del active[port]
            protected = {sid for slot in active.values() for sid in slot["record"]["ids"]}
            reconcile(items, output, evidence, protected)
            pending = [sid for sid in queue_order(drills) if sid not in protected and items[sid]["status"] not in TERMINAL]
            free = shutil.disk_usage(output).free
            state["free_bytes"] = free
            if free < MIN_FREE:
                low_disk = True
                state["reason"] = "Less than 15 GiB free; dispatch stopped, existing workers allowed to finish"
            if not low_disk:
                for port in PORTS:
                    if port in active or not pending:
                        continue
                    sid = pending.pop(0)
                    # Recheck immediately before dispatch so a late completed product is preserved.
                    reconcile(items, output, progress(output), protected)
                    if items[sid]["status"] in TERMINAL:
                        continue
                    logfile = logs / (sid + ".log")
                    stage = "preview"
                    if preview_ready(output, sid):
                        checked = preflight(output, sid, logfile)
                        items[sid]["preflight"] = checked
                        if checked["status"] != "ready":
                            items[sid].update(status=checked["status"], reason="Preflight prevented full-loop rendering", finished=now())
                            print("QUEUE_PREFLIGHT", sid, checked["status"], flush=True)
                            continue
                        stage = "render"
                    command = [sys.executable, "-u", str(BATCH), stage, "--app", str(app), "--output", str(output),
                               "--ids", sid, "--port", str(port), "--pr", "2"]
                    if stage == "preview":
                        command.extend(["--frames", "0,60,120"])
                    if shutil.disk_usage(output).free < MIN_FREE:
                        low_disk = True
                        state["reason"] = "Less than 15 GiB free; dispatch stopped, existing workers allowed to finish"
                        break
                    stream = logfile.open("ab", buffering=0)
                    stream.write(("\nQUEUE_START " + now() + " " + json.dumps(command) + "\n").encode("utf-8"))
                    try:
                        process = subprocess.Popen(command, cwd=REPO, stdout=stream, stderr=subprocess.STDOUT,
                            creationflags=subprocess.CREATE_NO_WINDOW, env={**os.environ, "PYTHONUTF8": "1", "PYTHONIOENCODING": "utf-8"})
                        # Save PID before opening its read-only monitor, so a monitor failure is recoverable.
                        record = {"port": port, "pid": process.pid, "created": None, "kind": "child", "stage": stage, "ids": [sid], "started": now(), "log": str(logfile)}
                        items[sid].update(status="running", pid=process.pid, port=port, log=str(logfile), started=now())
                        active[port] = {"record": record, "process": process, "log": stream}
                        save()
                        watch = ProcessWatch(process.pid)
                        handles[port] = watch
                        active[port]["watch"] = watch
                        record["created"] = watch.created
                    except OSError as exc:
                        if port in active:
                            raise
                        stream.close()
                        items[sid].update(status="error", error=str(exc), finished=now())
                        print("QUEUE_RESULT", sid, "error", str(exc), flush=True)
                        continue
                    print("QUEUE_START", sid, stage, "port", port, "pid", process.pid, flush=True)
                    break
            save()
            if not active and (not pending or low_disk):
                break
            time.sleep(3)
        state["status"] = "paused_low_disk" if low_disk and pending else "completed_with_issues" if any(row["status"] in ("review", "error") for row in items.values()) else "completed"
        state["finished"] = now()
        save()
        print("QUEUE_END", state["status"], json.dumps(state["counts"]), flush=True)
        return 2 if state["status"] == "paused_low_disk" else 1 if any(row["status"] == "error" for row in items.values()) else 0
    except BaseException as exc:
        state.update(status="interrupted" if isinstance(exc, KeyboardInterrupt) else "failed", error=str(exc), finished=now())
        save()
        raise
    finally:
        # Closing handles/logs never terminates workers; recovered runs can monitor them.
        for slot in active.values():
            if slot.get("log"):
                slot["log"].close()
        for watch in handles.values():
            watch.close()
        lock.close()


if __name__ == "__main__":
    raise SystemExit(main())
