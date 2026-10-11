#!/usr/bin/env python3
"""Import the 51 App drill videos from a pinned 3D-Pose release, without transcoding.

Run from any directory:
  python app/tools/import-drill-media.py --source E:/AII-3D/3D-Pose

All selected source hashes, headers and full CPU decodes are checked before copying.
Existing destination media must have the same hash; unrelated files are preserved.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import shutil
import subprocess
from datetime import datetime, timedelta, timezone
from fractions import Fraction
from pathlib import Path


APP = Path(__file__).resolve().parents[1]
KNOWN_LIMITATIONS = {
    "adductors-B": ["Approved support-hold version; the failed dynamic draft is not selected."],
    "deltoids-B": ["Half Turkish get-up to high bridge, not a full standing get-up.",
                    "Source support-elbow skin to mat gap remains about 10.31 mm."],
    "hip-abductors-B": ["Source engine pass is true with 240 solver-warning frames retained."],
}
ATTRIBUTION = """# Training drill media attribution

51 training videos and their posters were copied without transcoding from the
user-approved 3D-Pose v1.0.0 action library (2026-10-11), using the frozen paths
and SHA-256 values in its `交接/素材索引.json`. The user authorized reuse in this App.
Per-action provenance, source versions, hashes and known limitations are retained
in `assets/data/drill-media-manifest.json`.

Snow Rig © Blender Foundation | studio.blender.org
Source: https://studio.blender.org/characters/snow/
License: Creative Commons Attribution 4.0 International
https://creativecommons.org/licenses/by/4.0/

The videos use the existing modified Snow-derived training character and compact
deformation rig, with the drill renderer's grey mannequin head, clothing/shoe
materials, toon lighting and outlines, props, and target-muscle teaching highlights.
The head reference is derived from Blender Studio Human Base Meshes, recorded as
CC0 in the source project's public/anatomy/ATTRIBUTION.md. These are prerecorded
videos, not new interactive 3D clips; this import does not change App 3D characters.

Muscle colors indicate training targets, not measured activation percentages.
Source QA and known exceptions remain separately recorded; playback and decode
checks do not certify posture quality or remove source limitations. In particular,
adductors-B remains the approved support-hold version, deltoids-B is a half Turkish
get-up only to high bridge with about 10.31 mm support-elbow gap, and hip-abductors-B
retains 240 source solver-warning frames despite its recorded engine pass.

The source checkout has no single project-wide LICENSE. The user authorization for
this import and the named upstream asset licenses must not be generalized into an
MIT license for all local rendering code or all media. Existing Snow and anatomy
attribution files remain available in the App's license collection.
"""


def digest(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def checked_source(root: Path, relative: str, sha256: str, size: int) -> Path:
    path = (root / relative).resolve()
    if not path.is_relative_to(root) or not path.is_file():
        raise ValueError(f"Missing or out-of-root source: {relative}")
    if path.stat().st_size != size or digest(path) != sha256:
        raise ValueError(f"Source hash/size mismatch: {relative}")
    return path


def probe(executable: str, path: Path) -> dict:
    result = subprocess.run(
        [executable, "-v", "error", "-select_streams", "v:0", "-show_streams",
         "-show_format", "-of", "json", str(path)],
        capture_output=True, text=True, encoding="utf-8", errors="replace",
        check=True, timeout=60,
    )
    data = json.loads(result.stdout)
    if len(data.get("streams", [])) != 1:
        raise ValueError(f"Expected a video stream: {path}")
    stream = data["streams"][0]
    rate = stream.get("avg_frame_rate", "0/1")
    return {
        "codec": stream["codec_name"], "width": stream["width"],
        "height": stream["height"], "fps": float(Fraction(rate)) if rate != "0/0" else 0,
        "duration_seconds": float(stream.get("duration", data["format"].get("duration", 0))),
        "frames": int(stream["nb_frames"]) if stream.get("nb_frames", "N/A") != "N/A" else None,
    }


def copy_exclusive(source: Path, destination: Path, expected: str) -> bool:
    if destination.exists():
        if digest(destination) != expected:
            raise ValueError(f"Refusing to overwrite different media: {destination}")
        return False
    destination.parent.mkdir(parents=True, exist_ok=True)
    created = False
    try:
        with destination.open("xb") as out, source.open("rb") as inp:
            created = True
            shutil.copyfileobj(inp, out, length=1024 * 1024)
        if digest(destination) != expected:
            raise ValueError(f"Copied hash mismatch: {destination}")
    except BaseException:
        if created:
            destination.unlink(missing_ok=True)
        raise
    return True


def collect_ids(value: object) -> set[str]:
    found: set[str] = set()
    if isinstance(value, dict):
        candidate = value.get("id")
        if isinstance(candidate, str) and candidate.endswith(("-A", "-B", "-C")):
            found.add(candidate)
        for child in value.values():
            found.update(collect_ids(child))
    elif isinstance(value, list):
        for child in value:
            found.update(collect_ids(child))
    return found


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--ffprobe", default=shutil.which("ffprobe") or "ffprobe")
    parser.add_argument("--ffmpeg", default=shutil.which("ffmpeg") or "ffmpeg")
    args = parser.parse_args()
    root = args.source.resolve()
    index_path = root / "交接/素材索引.json"
    index = json.loads(index_path.read_text(encoding="utf-8-sig"))
    if index["project_version"] != "v1.0.0":
        raise ValueError("This import is pinned to the approved v1.0.0 release")
    ids = collect_ids(json.loads((APP / "assets/data/drills.json").read_text(encoding="utf-8-sig")))
    if len(ids) != 51:
        raise ValueError(f"Expected 51 App drill IDs, got {len(ids)}")
    selected = {item["id"]: item for item in index["actions"] if item["id"] in ids}
    if selected.keys() != ids:
        raise ValueError(f"Missing source action IDs: {sorted(ids - selected.keys())}")
    manifest_path = APP / "assets/data/drill-media-manifest.json"
    existing = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else None
    if existing and (existing.get("schema_version") != 1 or existing.get("source_project_version") != "v1.0.0"):
        raise ValueError("Refusing to overwrite an unrelated manifest")
    credit_path = APP / "assets/licenses/Drill-media-ATTRIBUTION.md"
    if credit_path.exists() and credit_path.read_text(encoding="utf-8") != ATTRIBUTION:
        raise ValueError("Refusing to overwrite modified drill attribution")

    # Preflight every input and destination before copying any media.
    inputs = []
    for action_id in sorted(ids):
        action = selected[action_id]
        files = {}
        for kind, extension in (("mp4", "mp4"), ("poster", "jpg")):
            record = action[kind]
            relative = record["frozen_path"]
            if not relative.startswith("版本归档/v1.0.0/"):
                raise ValueError(f"Not a pinned source: {relative}")
            source = checked_source(root, relative, record["sha256"], record["bytes"])
            asset = f"assets/drill_media/{action_id}.{extension}"
            destination = APP / asset
            if destination.exists() and digest(destination) != record["sha256"]:
                raise ValueError(f"Refusing to overwrite different media: {destination}")
            files[kind] = (source, destination, asset, record)
        inputs.append((action_id, action, files))

    entries = {}
    copies = []
    for number, (action_id, action, files) in enumerate(inputs, 1):
        source, destination, asset, record = files["mp4"]
        headers = probe(args.ffprobe, source)
        expected = record["format"]
        for key in ("codec", "width", "height", "frames"):
            if headers[key] != expected[key]:
                raise ValueError(f"{action_id}: unexpected {key}: {headers[key]}")
        if not math.isclose(headers["fps"], expected["fps"], abs_tol=0.001) or not math.isclose(
            headers["duration_seconds"], expected["duration_s"], abs_tol=1 / expected["fps"]
        ):
            raise ValueError(f"{action_id}: unexpected frame rate/duration")
        poster_source, poster_destination, poster_asset, poster_record = files["poster"]
        poster_headers = probe(args.ffprobe, poster_source)
        if poster_headers["codec"] != "mjpeg" or min(poster_headers["width"], poster_headers["height"]) <= 0:
            raise ValueError(f"{action_id}: invalid JPEG poster")
        # Explicit software decode, serial, no render or GPU job.
        subprocess.run(
            [args.ffmpeg, "-nostdin", "-v", "error", "-xerror", "-err_detect", "explode",
             "-hwaccel", "none", "-threads", "2", "-i", str(source), "-map", "0:v:0",
             "-an", "-f", "null", "-"],
            capture_output=True, text=True, encoding="utf-8", errors="replace",
            check=True, timeout=120,
        )
        entries[action_id] = {
            "id": action_id, "name": action["name"], "group": action["group"],
            "muscles": action["muscles"], "action_version": action["action_version"],
            "video_asset": asset, "poster_asset": poster_asset,
            "duration_seconds": headers["duration_seconds"],
            # v1.0.0 publisher: original posters use -ss 1; three local
            # revisions publish c/0060.png at 30 fps. Preserve those frames.
            "poster_time_seconds": 2 if action["action_version"] == "v3-local" else 1,
            "source_path": record["frozen_path"], "source_url": record.get("source_url"),
            "sha256": record["sha256"], "bytes": record["bytes"],
            "codec": headers["codec"], "width": headers["width"], "height": headers["height"],
            "fps": headers["fps"], "frames": headers["frames"],
            "poster_source_path": poster_record["frozen_path"],
            "poster_sha256": poster_record["sha256"], "poster_bytes": poster_record["bytes"],
            "poster_width": poster_headers["width"], "poster_height": poster_headers["height"],
            "notes": action.get("notes"), "local_revision_note": action.get("local_revision_note"),
            "draft_status": action.get("draft_status"), "source_qa": action.get("qa"),
            "known_limitations": KNOWN_LIMITATIONS.get(action_id, []),
            "verification": {"sha256": "pass", "headers": "pass", "full_cpu_decode": "pass"},
        }
        copies.extend(((source, destination, record["sha256"]),
                       (poster_source, poster_destination, poster_record["sha256"])))
        print(f"[{number:02}/{len(inputs)}] {action_id}: hashes, headers, full CPU decode PASS", flush=True)

    copied = sum(copy_exclusive(src, dst, sha) for src, dst, sha in copies)
    manifest = {
        "schema_version": 1, "source_project_version": index["project_version"],
        "source_project": "3D-Pose", "source_index": "交接/素材索引.json",
        "source_index_sha256": digest(index_path),
        "imported_at": existing.get("imported_at") if existing else datetime.now(timezone(timedelta(hours=8))).isoformat(timespec="seconds"),
        "media_kind": "prerecorded_video", "transcoded": False,
        "summary": {"actions": len(entries), "videos": len(entries), "posters": len(entries),
                    "video_bytes": sum(entry["bytes"] for entry in entries.values()),
                    "poster_bytes": sum(entry["poster_bytes"] for entry in entries.values())},
        "verification": {"source_and_destination_hashes": "pass", "video_headers": "pass",
                         "full_cpu_decode": "pass", "decoded_videos": len(entries),
                         "scope": "Media integrity only; not a new source posture/3D QA certification"},
        "actions": entries,
    }
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    text = json.dumps(manifest, ensure_ascii=False, indent=2) + "\n"
    if not manifest_path.exists() or manifest_path.read_text(encoding="utf-8") != text:
        manifest_path.write_text(text, encoding="utf-8", newline="\n")
    credit_path.parent.mkdir(parents=True, exist_ok=True)
    if not credit_path.exists():
        credit_path.write_text(ATTRIBUTION, encoding="utf-8", newline="\n")
    print(f"Imported {len(entries)} actions; copied {copied} new files, reused {len(copies) - copied}; {manifest_path}")


if __name__ == "__main__":
    main()
