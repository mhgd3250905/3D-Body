"""Import pinned SmartFit shared voice assets, or verify the offline copy.

No synthesis, download, audio processing, or changes to the source repository.
Run from any directory: python app/tools/trainer/import_voice.py --check
"""

import argparse
import copy
import hashlib
import json
from pathlib import Path
import re
import subprocess


SOURCE_COMMIT = "952c61701b63c3b7178bea5dd95cf9b49cc793bd"
COMMON = "assets/packs/_common/pack.json"
BUNDLE = "assets/voice_lc32/v1/manifest.json"
COMMON_SHA = "bd4b18e54ac2dc36f42db52a65b8398162b444a3f688ae0032ef87107eff79ef"
BUNDLE_SHA = "5ebcf4211e44ca17930c8426a33bb3df932db0929d5caebd123b0e2d81c756c4"
HIPLAB_COMMIT = "71decd211969ca807142520111f7bdf999767651"
HIPLAB_MANIFEST = "assets/voice/manifest.json"
HIPLAB_MANIFEST_SHA = "f797320fbf4114284405f079b8df9a4b915de19093e876643ccb99d5eb168564"
RIGHT_ASSET = "assets/voice/zh/p.switch_right.m4a"
RIGHT_SHA = "a9140aadf077366e931ccee5dc4f8c36af0673c3bc43e77ee72ef4665d07d20a"
APP = Path(__file__).resolve().parents[2]
DEST = APP / "assets/trainer_voice"


def digest(data):
    return hashlib.sha256(data).hexdigest()


def canonical(value):
    return (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode("utf-8")


def checked(data, expected, label):
    if digest(data) != expected:
        raise ValueError(f"SHA-256 mismatch: {label}")
    return data


def git_blob(source, path, commit=SOURCE_COMMIT):
    return subprocess.check_output(
        ["git", "-C", str(source), "show", f"{commit}:{path}"]
    )


def asset_path(asset):
    path = (APP / asset).resolve()
    if not path.is_relative_to(DEST.resolve()):
        raise ValueError(f"Asset escapes trainer voice root: {asset}")
    return path


def verify():
    manifest = json.loads((DEST / "source-manifest.json").read_text("utf-8"))
    if manifest["source"]["commit"] != SOURCE_COMMIT:
        raise ValueError("Unexpected source commit")
    for entry in manifest["files"]:
        data = asset_path(entry["asset"]).read_bytes()
        checked(data, entry["sha256"], entry["asset"])
        if len(data) != entry["bytes"]:
            raise ValueError(f"Size mismatch: {entry['asset']}")
    pack = json.loads((DEST / "_common/pack.json").read_text("utf-8"))
    speech = {entry["line"]: entry for entry in manifest["files"] if "line" in entry}
    if len(speech) != 85 or pack["voice"]["languages"] != ["zh"]:
        raise ValueError("Unexpected speech inventory")
    right = speech["p.switch_right"]
    if (right["sha256"] != RIGHT_SHA or right["bytes"] != 7618
            or right["decodedMs"] != 789 or right["sourceCommit"] != HIPLAB_COMMIT):
        raise ValueError("Unexpected HipLab right-side recording")
    for line in pack["voice"]["lines"]:
        if line["ms"] != {"zh": speech[line["id"]]["decodedMs"]}:
            raise ValueError(f"Incorrect decoded duration: {line['id']}")
    print(json.dumps({"verifiedFiles": len(manifest["files"]),
                      "speech": len(speech), "chimes": len(pack["chimes"]),
                      "sourceCommit": SOURCE_COMMIT}))


def import_assets(source, hiplab, refresh_metadata=False):
    # Read immutable Git blobs; never rely on uncommitted source modifications.
    common_data = checked(git_blob(source, COMMON), COMMON_SHA, COMMON)
    bundle_data = checked(git_blob(source, BUNDLE), BUNDLE_SHA, BUNDLE)
    common = copy.deepcopy(json.loads(common_data))
    bundle = json.loads(bundle_data)
    clips = {entry["line"]: entry for entry in bundle["clips"]
             if entry["pack"] == "_common" and entry["lang"] == "zh"}
    if len(clips) != 84 or common["voice"]["languages"] != ["zh"]:
        raise ValueError("Source common vocabulary changed")
    writes = {}
    entries = []
    for line in common["voice"]["lines"]:
        key = line["id"]
        if not re.fullmatch(r"[a-z][a-z0-9_.]*", key):
            raise ValueError(f"Invalid voice key: {key}")
        clip = clips[key]
        data = checked(git_blob(source, clip["asset"]), clip["sha256"], key)
        if len(data) != clip["bytes"]:
            raise ValueError(f"Source size mismatch: {key}")
        asset = f"assets/trainer_voice/_common/voice/zh/{key}.m4a"
        writes[asset] = data
        entries.append({"asset": asset, "bytes": len(data), "sha256": digest(data),
                        "line": key, "lang": "zh", "decodedMs": clip["decoded_ms"],
                        "sourceAsset": clip["asset"], "original": clip["source"]})
        # Scheduling must use the re-encoded LC32 file's measured duration.
        line["ms"] = {"zh": clip["decoded_ms"]}
    hip_manifest = json.loads(checked(
        git_blob(hiplab, HIPLAB_MANIFEST, HIPLAB_COMMIT),
        HIPLAB_MANIFEST_SHA, HIPLAB_MANIFEST))
    if hip_manifest["clips"]["zh"]["p.switch_right"] != 789:
        raise ValueError("HipLab right-side duration changed")
    if hip_manifest["lines"]["p.switch_right"]["zh"] != "换右边":
        raise ValueError("HipLab right-side wording changed")
    data = checked(git_blob(hiplab, RIGHT_ASSET, HIPLAB_COMMIT), RIGHT_SHA, RIGHT_ASSET)
    if len(data) != 7618:
        raise ValueError("HipLab right-side size changed")
    asset = "assets/trainer_voice/_common/voice/zh/p.switch_right.m4a"
    writes[asset] = data
    entries.append({"asset": asset, "bytes": len(data), "sha256": RIGHT_SHA,
                    "line": "p.switch_right", "lang": "zh", "decodedMs": 789,
                    "sourceAsset": RIGHT_ASSET, "sourceProject": "HipLab",
                    "sourceCommit": HIPLAB_COMMIT})
    common["voice"]["lines"].append({"id": "p.switch_right", "role": "phrase",
                                      "text": {"zh": "换右边"}, "ms": {"zh": 789}})
    for name, chime in sorted(common["chimes"].items()):
        if chime["file"] != f"chime/{name}.m4a" or not name.isalpha():
            raise ValueError(f"Invalid chime path: {name}")
        source_asset = f"assets/packs/_common/{chime['file']}"
        data = git_blob(source, source_asset)
        asset = f"assets/trainer_voice/_common/{chime['file']}"
        writes[asset] = data
        entries.append({"asset": asset, "bytes": len(data), "sha256": digest(data),
                        "sourceAsset": source_asset, "kind": "chime"})
    common["voice"]["postProcess"] = (
        "SmartFit LC32 v1: AAC-LC mono 22050 Hz 32000 bps; "
        "ms replaced with manifest decoded_ms. p.switch_right: HipLab v4.1 "
        "AAC mono 44100 Hz 64000 bps. All audio bytes unchanged."
    )
    asset = "assets/trainer_voice/_common/pack.json"
    data = canonical(common)
    writes[asset] = data
    entries.append({"asset": asset, "bytes": len(data), "sha256": digest(data),
                    "sourceAsset": COMMON, "kind": "adapted-manifest"})
    manifest = {
        "schema": "flarelab-trainer-voice-source@1",
        "source": {"project": "SmartFit", "commit": SOURCE_COMMIT,
                   "commonManifest": {"path": COMMON, "sha256": COMMON_SHA},
                   "lc32Manifest": {"path": BUNDLE, "sha256": BUNDLE_SHA}},
        "languages": ["zh"],
        "supplements": [{"project": "HipLab", "commit": HIPLAB_COMMIT,
                         "manifest": {"path": HIPLAB_MANIFEST, "sha256": HIPLAB_MANIFEST_SHA},
                         "line": "p.switch_right", "text": "换右边",
                         "audit": "docs/voice-audit-2026-10-18.md",
                         "reason": "Preserve FlareLab left-first side order; SmartFit has no right-switch line."}],
        "scope": "Shared prompts and counts only; no action-specific voice or translated speech.",
        "licenseBoundary": {
            "generator": "Microsoft Edge read-aloud via edge-tts; zh-CN-XiaoxiaoNeural",
            "sourceNotice": "tools/voice/build_voice.py:31-33",
            "notice": "Source records unclear commercial-use terms; internal-test provenance only. "
                      "It calls for official Azure Speech regeneration before store release. "
                      "This import does not establish a new commercial license.",
        },
        "files": entries,
    }
    writes["assets/trainer_voice/source-manifest.json"] = canonical(manifest)
    # Audio is immutable. Explicit metadata refresh only updates generated
    # manifests; it never permits replacement of an existing recording.
    metadata = {"assets/trainer_voice/_common/pack.json",
                "assets/trainer_voice/source-manifest.json"}
    for asset, data in writes.items():
        path = asset_path(asset)
        if (path.exists() and path.read_bytes() != data
                and not (refresh_metadata and asset in metadata)):
            raise ValueError(f"Refusing to overwrite different existing asset: {asset}")
    for asset, data in writes.items():
        path = asset_path(asset)
        path.parent.mkdir(parents=True, exist_ok=True)
        if not path.exists() or (refresh_metadata and asset in metadata):
            path.write_bytes(data)
    verify()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, help="SmartFit checkout containing the pinned commit")
    parser.add_argument("--hiplab", type=Path, help="HipLab checkout containing the pinned right-switch recording")
    parser.add_argument("--refresh-metadata", action="store_true",
                        help="Refresh only generated metadata; never overwrite existing audio")
    parser.add_argument("--check", action="store_true", help="Verify local files without a source checkout")
    args = parser.parse_args()
    if args.check:
        verify()
    elif args.source and args.hiplab:
        import_assets(args.source.resolve(), args.hiplab.resolve(), args.refresh_metadata)
    else:
        parser.error("Provide --source and --hiplab for import, or --check for offline verification")
