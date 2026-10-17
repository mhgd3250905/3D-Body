"""Versioned HipLab production overlay; the frozen renderer/specs stay unchanged."""
from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import time


REPO = Path(__file__).resolve().parents[2]
ROOT = REPO / "tools" / "drill-anim"


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    content = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    if path.exists() and path.read_text(encoding="utf-8") == content:
        return
    temporary = path.with_name(path.name + f".{os.getpid()}.tmp")
    temporary.write_text(content, encoding="utf-8", newline="\n")
    temporary.replace(path)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("stage", choices=["prepare", "gpu", "preview", "render"])
    ap.add_argument("--app", required=True, type=Path)
    ap.add_argument("--output", required=True, type=Path)
    ap.add_argument("--ids", nargs="+")
    ap.add_argument("--pr", type=float, default=2)
    ap.add_argument("--frames", default="0,60,120")
    ap.add_argument("--port", type=int, default=8859)
    ap.add_argument("--format", choices=["green", "dark"], default="green")
    a = ap.parse_args()
    output = a.output.resolve()
    app = a.app.resolve()
    output.mkdir(parents=True, exist_ok=True)
    content = json.loads((app / "assets/hip/hip-content.json").read_text(encoding="utf-8"))
    drills = {d["id"]: d for d in content["drills"]}
    ids = a.ids or list(drills)
    if any(s not in drills for s in ids):
        ap.error("Unknown content drill id")

    # Machine paths are confined to the ignored configuration and batch output.
    config_path = ROOT / "config.json"
    if not config_path.exists():
        ap.error("Prepare tools/drill-anim/config.json from config.windows.example.json first")
    template = json.loads(config_path.read_text(encoding="utf-8"))
    template.update({
        "app_url": "http://127.0.0.1:8859", "app_port": 8859,
        "app_dir": str(REPO),
        "ref_dir": str(output / "references"),
        "out_dir": str(output / "master"), "work_dir": str(output / "work"),
    })
    source_sha = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=REPO, text=True).strip()
    entries = []
    for sid in drills:
        source = ROOT / "specs" / (sid + ".js")
        target = output / "specs" / (sid + ".js")
        # Import the original module, preserving every pose and timing track.
        # Production only opts into the accepted human profile and true 30fps.
        overlay = (
            "// HipLab HD batch: original pose/camera/timing preserved.\n"
            "import source from " + json.dumps(source.as_uri()) + ";\n"
            "export default {...source, fps:30, modelProfile:'training-human-v2', alignClavicles:false};\n"
        )
        target.parent.mkdir(parents=True, exist_ok=True)
        if not target.exists() or target.read_text(encoding="utf-8") != overlay:
            target.write_text(overlay, encoding="utf-8", newline="\n")
        entries.append({"id": sid, "source_sha256": hashlib.sha256(source.read_bytes().replace(b"\r\n", b"\n")).hexdigest(),
                        "source": str(source.relative_to(REPO)), "overlay": str(target),
                        "original_app_status": drills[sid]["media"]["status"]})
    manifest_path = output / "source-manifest.json"
    previous_manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else None
    batch_source_commit = previous_manifest["source_commit"] if previous_manifest else source_sha
    manifest = {"source_commit":batch_source_commit, "profile":"training-human-v2", "fps":30,
        "output_size":1080, "pixel_ratio":a.pr, "pose_camera_timing_unchanged":True, "drills":entries}
    if previous_manifest is not None and previous_manifest != manifest:
        raise RuntimeError("Batch source/recipe changed; preserve this batch and use a new output directory")
    if previous_manifest is None:
        write_json(manifest_path, manifest)

    # Contact-sheet reference tiles are explicitly identified, never new evidence.
    from PIL import Image, ImageDraw, ImageFont
    ref_dir = output / "references"
    ref_dir.mkdir(exist_ok=True)
    for sid, d in drills.items():
        ref = ref_dir / (sid + ".png")
        if ref.exists():
            continue
        poster = d["media"].get("poster")
        im = Image.open(app / poster).convert("RGB").resize((540, 540)) if poster else Image.new("RGB", (540, 540), (18, 18, 20))
        if not poster:
            draw = ImageDraw.Draw(im)
            draw.text((30, 240), "No prior app media", fill=(190, 190, 190), font=ImageFont.truetype(template["font"], 28))
        im.save(ref)
    if a.stage == "prepare":
        print("Prepared", len(drills), "source-preserving overlays at", output)
        return

    os.environ.update(PYTHONUTF8="1", PYTHONIOENCODING="utf-8", DRILL_PR=str(a.pr),
                      APP_PORT=str(a.port), APP_URL=f"http://127.0.0.1:{a.port}",
                      APP_DIR=str(REPO), REF_DIR=str(ref_dir),
                      OUT_DIR=str(output / "master"), WORK_DIR=str(output / "work"))
    module = importlib.util.spec_from_file_location("hiplab_original_drill", ROOT / "drill.py")
    drill = importlib.util.module_from_spec(module)
    module.loader.exec_module(drill)

    def spec_path(sid):
        if sid not in drills:
            raise ValueError("Unknown batch id: " + sid)
        return str(output / "specs" / (sid + ".js"))

    drill.spec_path = spec_path
    os.chdir(ROOT)
    theme = str(ROOT / "themes/glow-b.json")
    if a.stage == "gpu":
        with drill.Vite():
            subprocess.run(["node", str(Path(__file__).with_name("gpu_probe.mjs")), str(output / "gpu.json")], cwd=ROOT, check=True)
        return
    if a.stage == "preview":
        # Preview keeps its scratch separate from full-loop production frames.
        os.environ["WORK_DIR"] = str(output / "preview-work")
        drill.WORK = os.environ["WORK_DIR"]
        drill.C["work_dir"] = drill.WORK
        drill.ENV["WORK_DIR"] = drill.WORK
        Path(drill.WORK).mkdir(exist_ok=True)
        sys.argv = ["drill.py", "render", *ids, "--theme", theme, "--jobs", "1", "--pr", str(a.pr), "--frames", a.frames]
        drill.main()
        return

    ledger_path = output / f"progress-{a.port}.json"
    ledger = json.loads(ledger_path.read_text(encoding="utf-8")) if ledger_path.exists() else {"items": {}}
    if a.format == "green":
        # Keep the original pose solver and metrics. Only replace expensive dark
        # background/bloom compositing with the exact-placed alpha derivative.
        original_run, original_popen = drill.run, drill.popen

        def alpha_command(args):
            args = list(args)
            if len(args) > 1 and Path(args[1]).resolve() == (ROOT / "lib/comp.py").resolve():
                args[1] = str(Path(__file__).with_name("composite_alpha.py"))
            return args

        drill.run = lambda args, **kw: original_run(alpha_command(args), **kw)
        drill.popen = lambda args, **kw: original_popen(alpha_command(args), **kw)
    with drill.Vite():
        for sid in ids:
            if ledger["items"].get(sid, {}).get("status") in ("pass", "review"):
                print("RESUME keep", sid, flush=True)
                continue
            started = time.time()
            ledger["items"][sid] = {"status":"rendering", "started":time.strftime("%Y-%m-%dT%H:%M:%S%z"),
                                    "format":a.format, "source_commit":batch_source_commit,
                                    "tooling_commit":source_sha, "fps":30, "pixel_ratio":a.pr}
            write_json(ledger_path, ledger)
            try:
                drill.ensure_outputs(sid, False)
                fr, cdir, spec, _ = drill.render(sid, theme, jobs=1)
                if a.format == "dark":
                    drill.encode(sid, cdir, spec)
                drill.sheet(sid, cdir, spec)
                drill.qa(sid, fr)
                qa = json.loads((output / "master/metrics" / (sid + ".json")).read_text(encoding="utf-8"))
                if a.format == "green":
                    subprocess.run([sys.executable, str(Path(__file__).with_name("export_greenscreen_hq.py")),
                        "--output", str(output), "--ids", sid, "--once", "--keep-alpha"], check=True)
                    result_path = output / "greenscreen/jobs" / sid / "result.json"
                    product = json.loads(result_path.read_text(encoding="utf-8"))
                    good = (product.get("status") == "green_media_complete" and product.get("composition_qa_pass") is True
                            and product.get("video_validation", {}).get("full_cpu_decode") is True)
                    decode_errors = "" if good else "Green derivative validation did not complete"
                    ledger["items"][sid]["green_result"] = str(result_path)
                else:
                    decode = subprocess.run(["ffmpeg", "-v", "error", "-i", str(output / "master" / (sid + ".mp4")), "-f", "null", "-"], capture_output=True, text=True)
                    good = decode.returncode == 0 and not decode.stderr.strip()
                    decode_errors = decode.stderr
                ledger["items"][sid].update(status="pass" if qa.get("pass") and good else "review", qa_pass=qa.get("pass"), decode_pass=good,
                    elapsed_seconds=round(time.time()-started,1), frames=qa.get("frames"), warnings=qa.get("solver_warning_frames"), decode_errors=decode_errors)
            except Exception as exc:
                ledger["items"][sid].update(status="error", error=str(exc), elapsed_seconds=round(time.time()-started,1))
            write_json(ledger_path, ledger)
            print("BATCH_RESULT", sid, json.dumps(ledger["items"][sid]), flush=True)


if __name__ == "__main__":
    main()
