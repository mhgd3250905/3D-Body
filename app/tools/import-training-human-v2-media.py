#!/usr/bin/env python3
"""Select the current 51 App drills from a frozen training-human-v2 package.

The importer preserves all previous media before replacing App copies, validates
the selected package hashes and full video decodes, and retains source QA states.
It does not edit the frozen package, render 3D, or add the other 43 library jobs.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
import re
import shutil
import subprocess
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from fractions import Fraction
from pathlib import Path


def digest(path: Path) -> str:
    value = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            value.update(block)
    return value.hexdigest()


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")


def record(path: Path, relative: str | None = None) -> dict:
    return {"path": relative or str(path), "bytes": path.stat().st_size, "sha256": digest(path)}


def within(root: Path, relative: str) -> Path:
    path = (root / relative).resolve()
    if not path.is_relative_to(root.resolve()):
        raise ValueError(f"Path outside expected root: {relative}")
    return path


def checked_file(root: Path, relative: str, index: dict) -> Path:
    path = within(root, relative)
    expected = index[relative]
    if not path.is_file() or path.stat().st_size != expected["bytes"] or digest(path) != expected["sha256"]:
        raise ValueError(f"Frozen source hash or size mismatch: {relative}")
    return path


def preserve(source: Path, destination: Path, expected: str) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.exists():
        if digest(destination) != expected:
            raise ValueError(f"Refusing to overwrite different backup: {destination}")
    else:
        if digest(source) != expected:
            raise ValueError(f"Original media differs from its manifest: {source}")
        shutil.copy2(source, destination)
    if digest(destination) != expected:
        raise ValueError(f"Backup readback mismatch: {destination}")


def probe(executable: str, path: Path) -> dict:
    result = subprocess.run(
        [executable, "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)],
        capture_output=True, text=True, encoding="utf-8", errors="replace", check=True, timeout=60,
    )
    data = json.loads(result.stdout)
    videos = [s for s in data["streams"] if s.get("codec_type") == "video"]
    if len(videos) != 1 or len(data["streams"]) != 1:
        raise ValueError(f"Expected one video stream and no audio: {path}")
    stream = videos[0]
    rate = stream.get("avg_frame_rate", "0/1")
    return {
        "codec": stream["codec_name"], "width": stream["width"], "height": stream["height"],
        "pixel_format": stream.get("pix_fmt"),
        "fps": float(Fraction(rate)) if rate not in ("0/0", "0/1") else 0,
        "frames": int(stream["nb_frames"]) if stream.get("nb_frames", "N/A") != "N/A" else None,
        "duration_seconds": float(stream.get("duration", data.get("format", {}).get("duration", 0))),
    }


def full_decode(executable: str, path: Path, expected_frames: int) -> dict:
    command = [executable, "-v", "error", "-xerror", "-err_detect", "explode", "-threads", "1",
               "-i", str(path), "-map", "0:v:0", "-an", "-progress", "pipe:1", "-nostats", "-f", "null", "-"]
    result = subprocess.run(command, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=120)
    frames = [int(v) for v in re.findall(r"^frame=(\d+)$", result.stdout, re.MULTILINE)]
    count = frames[-1] if frames else 0
    if result.returncode or result.stderr.strip() or count != expected_frames or "progress=end" not in result.stdout:
        raise ValueError(f"Full decode failed: {path}; frames={count}; {result.stderr[:400]}")
    return {"pass": True, "complete": True, "decoded_frames": count, "exit_code": result.returncode}


def mp4_faststart(path: Path) -> bool:
    positions = {}
    length = path.stat().st_size
    with path.open("rb") as stream:
        offset = 0
        while offset + 8 <= length:
            stream.seek(offset)
            header = stream.read(8)
            size, kind = int.from_bytes(header[:4], "big"), header[4:].decode("ascii", errors="replace")
            if size == 1:
                size = int.from_bytes(stream.read(8), "big")
            elif size == 0:
                size = length - offset
            if size < 8 or offset + size > length:
                raise ValueError(f"Invalid MP4 box: {path}")
            positions.setdefault(kind, offset)
            offset += size
    return "moov" in positions and "mdat" in positions and positions["moov"] < positions["mdat"]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--report-dir", type=Path, required=True)
    parser.add_argument("--app-root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--ffmpeg", default="ffmpeg")
    parser.add_argument("--ffprobe", default="ffprobe")
    args = parser.parse_args()
    source, app, report_dir = args.source.resolve(), args.app_root.resolve(), args.report_dir.resolve()
    if any(str(p.drive).lower() != "e:" for p in (source, app, report_dir)):
        raise ValueError("Project resources and backups must remain on the E drive")
    before = report_dir / "before"
    app_manifest = app / "assets/data/drill-media-manifest.json"
    baseline_manifest = before / "drill-media-manifest.json"
    baseline = read_json(baseline_manifest if baseline_manifest.exists() else app_manifest)
    if baseline.get("source_project") != "3D-Pose" or len(baseline["actions"]) != 51:
        raise ValueError("Expected the preserved 51-action 3D-Pose baseline")
    package_index = {item["path"]: item for item in read_json(source / "directory-manifest.json")["files"]}
    catalog = read_json(checked_file(source, "portable-catalog.json", package_index))
    package = read_json(checked_file(source, "package-manifest.json", package_index))
    audit = read_json(checked_file(source, "manifest.json", package_index))
    if catalog.get("modelId") != "training-human-v2" or catalog.get("modelVersion") != "2.0.1":
        raise ValueError("Unexpected model profile or version")
    if package.get("kind") != "curated_media_selection" or package["selection"]["revision"] != "erectors-B-footfix-20261013":
        raise ValueError("Expected the frozen foot-correction selection")
    jobs = {job["id"]: job for job in catalog["jobs"]}
    audits = {job["id"]: job for job in audit["jobs"]}
    if len(jobs) != 94 or len(audits) != 94 or set(baseline["actions"]) - jobs.keys():
        raise ValueError("Incomplete or ambiguous action ID mapping")

    # Verify all backups before permitting any change to App media.
    if baseline_manifest.exists():
        before_proof = read_json(before / "backup-manifest.json")
        if digest(baseline_manifest) != before_proof["manifest"]["sha256"]:
            raise ValueError("Baseline manifest backup hash mismatch")
    else:
        before.mkdir(parents=True, exist_ok=True)
        preserve(app_manifest, baseline_manifest, digest(app_manifest))
    backup_entries = []
    for action_id, old in baseline["actions"].items():
        for kind, extension, hash_key in (("video", "mp4", "sha256"), ("poster", "jpg", "poster_sha256")):
            destination = before / f"{action_id}.{extension}"
            preserve(app / old[f"{kind}_asset"], destination, old[hash_key])
            backup_entries.append({"id": action_id, "kind": kind, **record(destination, destination.name)})
    before_proof = {"manifest": record(baseline_manifest, baseline_manifest.name), "files": backup_entries,
                    "files_verified": 103, "original_selection": "App L43 51-action media"}
    write_json(before / "backup-manifest.json", before_proof)

    selection = []
    for action_id, old in baseline["actions"].items():
        job, audited = jobs[action_id], audits[action_id]
        if job["auditStatus"] != audited["status"] or job["auditStatus"] not in ("ready", "review_required"):
            raise ValueError(f"Missing or inconsistent audit state: {action_id}")
        if job["posterTimeSeconds"] != old["poster_time_seconds"] or job["durationSeconds"] != old["duration_seconds"]:
            raise ValueError(f"Unexpected App timing change: {action_id}")
        links = job["packageLinks"]
        video = checked_file(source, links["media"]["mobile"], package_index)
        poster = checked_file(source, links["media"]["poster"], package_index)
        if digest(video) != audited["media"]["mobile"]["sha256"] or digest(poster) != audited["poster"]["sha256"]:
            raise ValueError(f"Audit-selected media identity differs: {action_id}")
        evidence = {name: record(checked_file(source, path, package_index), path)
                    for name, path in links["evidence"].items()}
        authored = {name: record(checked_file(source, links[name], package_index), links[name])
                    for name in ("authoredSpec", "authoredTheme")}
        derived = None
        # The footfix package catalog says 1 s, while its actual still is 2 s.
        # Preserve the App's 1 s poster/playback time by extracting the selected
        # master video, without modifying the package or rerendering the motion.
        if audited["poster"]["timeSeconds"] != old["poster_time_seconds"]:
            if action_id != "erectors-B" or audited["poster"]["timeSeconds"] != 2 or old["poster_time_seconds"] != 1:
                raise ValueError(f"Unexpected poster time conflict: {action_id}")
            master = checked_file(source, links["media"]["master"], package_index)
            derived = {"kind": "frame_extraction", "master": record(master, links["media"]["master"]),
                       "frozen_package_poster": record(poster, links["media"]["poster"]),
                       "catalog_time_seconds": job["posterTimeSeconds"], "package_poster_time_seconds": 2,
                       "app_poster_time_seconds": 1, "package_unchanged": True}
            poster = report_dir / "derived/erectors-B-footfix-app-1s.jpg"
            poster.parent.mkdir(parents=True, exist_ok=True)
            if not poster.exists():
                command = [args.ffmpeg, "-v", "error", "-threads", "1", "-i", str(master), "-ss", "1",
                           "-vf", "scale=540:540", "-frames:v", "1", "-q:v", "2", "-update", "1", "-n", str(poster)]
                subprocess.run(command, capture_output=True, check=True, timeout=60)
            derived["output"] = record(poster)
        selection.append({"id": action_id, "old": old, "job": job, "audit": audited,
                          "video": video, "poster": poster, "evidence": evidence, "authored": authored,
                          "derived": derived})

    def validate(item: dict) -> dict:
        video, poster = item["video"], item["poster"]
        vp, pp = probe(args.ffprobe, video), probe(args.ffprobe, poster)
        if (vp["codec"], vp["width"], vp["height"], vp["pixel_format"], vp["fps"], vp["frames"]) != (
                "h264", 720, 720, "yuv420p", 30, item["job"]["frames"]):
            raise ValueError(f"Mobile video format mismatch: {item['id']}")
        if abs(vp["duration_seconds"] - item["job"]["durationSeconds"]) > 0.02 or not mp4_faststart(video):
            raise ValueError(f"Video timing or faststart mismatch: {item['id']}")
        if (pp["codec"], pp["width"], pp["height"]) != ("mjpeg", 540, 540):
            raise ValueError(f"Poster format mismatch: {item['id']}")
        return {"video_probe": vp, "poster_probe": pp, "faststart": True,
                "video_decode": full_decode(args.ffmpeg, video, item["job"]["frames"]),
                "poster_decode": full_decode(args.ffmpeg, poster, 1)}

    with ThreadPoolExecutor(max_workers=4) as pool:
        checks = list(pool.map(validate, selection))
    print(f"Validated 51 videos and 51 posters; backup readback verified before App changes.", flush=True)

    new = {key: copy.deepcopy(value) for key, value in baseline.items() if key != "actions"}
    new["legacy_import"] = {key: copy.deepcopy(value) for key, value in baseline.items() if key != "actions"}
    new.update({"source_project": "3D-Body", "source_project_version": "training-human-v2@2.0.1",
                "source_index": f"output/{source.name}/portable-catalog.json",
                "source_index_sha256": digest(source / "portable-catalog.json"),
                "imported_at": datetime.now(timezone(timedelta(hours=8))).isoformat(timespec="seconds"),
                "transcoded": False, "model_profile": "training-human-v2", "model_version": "2.0.1",
                "appearance_baseline_version": "2.0.0", "media_revision": "training-human-v2-footfix-20261013",
                "source_package": {"path": f"output/{source.name}", "selection": package["selection"],
                                   "catalog": record(source / "portable-catalog.json", "portable-catalog.json"),
                                   "audit": record(source / "manifest.json", "manifest.json"),
                                   "manifest": record(source / "package-manifest.json", "package-manifest.json"),
                                   "directory_manifest": record(source / "directory-manifest.json", "directory-manifest.json")},
                "actions": {}})
    mappings = []
    for item, check in zip(selection, checks):
        action_id, old, job, audited = item["id"], item["old"], item["job"], item["audit"]
        video_asset, poster_asset = old["video_asset"], old["poster_asset"]
        inputs = {"video": record(item["video"], job["packageLinks"]["media"]["mobile"]),
                  "poster": record(item["poster"])}
        outputs = {}
        for kind, asset, baseline_hash in (("video", video_asset, old["sha256"]),
                                           ("poster", poster_asset, old["poster_sha256"])):
            path = app / asset
            expected = inputs[kind]["sha256"]
            if path.exists() and digest(path) not in (baseline_hash, expected):
                raise ValueError(f"Refusing to overwrite unrelated App change: {asset}")
            if not path.exists() or digest(path) != expected:
                shutil.copy2(item[kind], path)
            outputs[kind] = record(path, asset)
            if outputs[kind]["sha256"] != expected:
                raise ValueError(f"App media readback mismatch: {asset}")
        limitations = list(dict.fromkeys(old.get("known_limitations", []) + job["knownLimitations"]
                                        + [issue["message"] for issue in audited["issues"]]))
        if action_id == "quadriceps-A":
            limitations.append("New-body left-hand surface estimate 4.02 mm for 6/240 frames (old 3.19 mm); exceeds 4 mm by 0.02 mm. K6 surface estimate, not exact point-to-triangle distance. Source qa.pass=false and review_required retained.")
        qa = {key: value for key, value in audited["qa"].items() if key != "per_frame"}
        entry = {key: copy.deepcopy(old[key]) for key in ("id", "name", "group", "muscles", "action_version")}
        entry.update({"video_asset": video_asset, "poster_asset": poster_asset,
                      "duration_seconds": check["video_probe"]["duration_seconds"],
                      "poster_time_seconds": old["poster_time_seconds"],
                      "source_path": f"output/{source.name}/{job['packageLinks']['media']['mobile']}",
                      "source_url": None, "sha256": outputs["video"]["sha256"], "bytes": outputs["video"]["bytes"],
                      "codec": "h264", "pixel_format": "yuv420p", "width": 720, "height": 720,
                      "fps": 30, "frames": check["video_probe"]["frames"], "faststart": True,
                      "poster_source_path": str(item["poster"]) if item["derived"] else f"output/{source.name}/{job['packageLinks']['media']['poster']}",
                      "poster_sha256": outputs["poster"]["sha256"], "poster_bytes": outputs["poster"]["bytes"],
                      "poster_width": 540, "poster_height": 540,
                      "model_profile": catalog["modelId"], "model_version": catalog["modelVersion"],
                      "media_revision": job.get("mediaRevision", "training-human-v2-20261013"),
                      "audit_status": job["auditStatus"], "producer_status": job["producerStatus"],
                      "draft_status": job["auditStatus"], "source_qa": qa,
                      "baseline_source_qa": {k: v for k, v in (audited.get("baselineQa") or {}).items() if k != "per_frame"},
                      "source_qa_evidence": item["evidence"], "authored_source": item["authored"],
                      "motion_invariance_scope": audited["motionInvarianceScope"],
                      "motion_audit": audited.get("fullCycleJointAudit"),
                      "motion_correction": job.get("motionCorrection"), "poster_derivation": item["derived"],
                      "new_body_flags": job["newBodyFlags"], "inherited_body_flags": job["inheritedBodyFlags"],
                      "known_limitations": limitations, "notes": "Media copied from the frozen current training-human-v2 selection; source QA and audit state retained. Integrity verification is not posture or device certification.",
                      "legacy_media": copy.deepcopy(old),
                      "verification": {"sha256": "pass", "headers": "pass", "full_cpu_decode": "pass",
                                       "decoded_frames": check["video_decode"]["decoded_frames"], "poster_decode": "pass"}})
        new["actions"][action_id] = entry
        mappings.append({"id": action_id, "legacy": {"video": record(before / f"{action_id}.mp4"),
                                                     "poster": record(before / f"{action_id}.jpg")},
                         "source": inputs, "destination": outputs, "check": check,
                         "poster_time_seconds": old["poster_time_seconds"], "poster_derivation": item["derived"],
                         "audit_status": job["auditStatus"], "producer_status": job["producerStatus"],
                         "qa_pass": qa.get("pass"), "known_limitations": limitations})
    states = dict(Counter(entry["audit_status"] for entry in new["actions"].values()))
    new["summary"] = {"actions": 51, "videos": 51, "posters": 51,
                      "video_bytes": sum(a["bytes"] for a in new["actions"].values()),
                      "poster_bytes": sum(a["poster_bytes"] for a in new["actions"].values()),
                      "audit_states": states, "all_posture_qa_passed": False, "excluded_library_actions": 43}
    new["verification"] = {"source_and_destination_hashes": "pass", "video_headers": "pass",
                           "full_cpu_decode": "pass", "decoded_videos": 51, "decoded_posters": 51,
                           "backup_files_verified": 103, "poster_times_preserved": True,
                           "scope": "Media integrity, exact App51 mapping, format and duration only; source review_required/false QA remains. No new posture or device certification."}
    write_json(app_manifest, new)
    after = {"schema_version": 1, "app_root": str(app), "source_package": str(source),
             "model_profile": catalog["modelId"], "model_version": catalog["modelVersion"],
             "appearance_baseline_version": "2.0.0", "selection_revision": package["selection"]["revision"],
             "summary": new["summary"], "verification": new["verification"], "mapping": mappings,
             "before_manifest": before_proof["manifest"], "after_manifest": record(app_manifest),
             "tools": {"ffmpeg": args.ffmpeg, "ffprobe": args.ffprobe},
             "source_package_unchanged": True, "added_app_drills": 0}
    write_json(report_dir / "media-upgrade-report.json", after)
    write_json(report_dir / "drill-media-manifest.after.json", new)
    print(json.dumps({"matched": 51, "unmatched": 0, "states": states, "video_bytes": new["summary"]["video_bytes"],
                      "poster_bytes": new["summary"]["poster_bytes"], "report": str(report_dir / "media-upgrade-report.json")}, ensure_ascii=False))


if __name__ == "__main__":
    main()
