"""Create a zero-overwrite R15 local archive, then verify every ZIP member.

Run after the accepted release manifest and motion-v42-r15 tag are ready.
Python standard library only. --check-only performs all input checks without writing.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import stat
import subprocess
import sys
from datetime import datetime, timezone
import zipfile


ROOT = Path(__file__).absolute().parents[2]
EXPECTED_ROOT = Path(r"E:\AII-3D\3D-Body")
VIEWER = Path(r"E:\AII-MotionLab\reference-viewer-20261017\r15-preview")
TAG = "motion-v42-r15"
RELEASE = ROOT / "tools/motion-v42-r15/releases/v42-r15.json"
ARCHIVE_NAME = "Flare-v42-R15-accepted-20261017"
DESTINATION = ROOT / "output/releases" / (ARCHIVE_NAME + ".zip")
RECEIPT = DESTINATION.with_suffix(".receipt.json")
BUFFER = 8 * 1024 * 1024
EXCLUDED_DIRS = {"node_modules", "venv", ".venv", ".git", "__pycache__"}


def same_path(a: Path, b: Path) -> bool:
    return os.path.normcase(os.path.abspath(a)) == os.path.normcase(os.path.abspath(b))


def safe_path(path: Path, allowed_root: Path, *, must_exist: bool = True) -> Path:
    """Reject escapes and all symlink/junction/reparse components, not just leaves."""
    path = Path(os.path.abspath(path))
    allowed_root = Path(os.path.abspath(allowed_root))
    if os.path.commonpath([str(path), str(allowed_root)]) != str(allowed_root):
        raise ValueError(f"Path escapes the expected root: {path}")
    cursor = Path(path.anchor)
    for part in path.parts[1:]:
        cursor /= part
        try:
            info = cursor.lstat()
        except FileNotFoundError:
            if must_exist:
                raise
            continue
        if stat.S_ISLNK(info.st_mode) or getattr(info, "st_file_attributes", 0) & getattr(stat, "FILE_ATTRIBUTE_REPARSE_POINT", 0x400):
            raise ValueError(f"Refusing symlink/junction/reparse path: {cursor}")
    return path


def read_bytes(path: Path, allowed_root: Path) -> bytes:
    safe_path(path, allowed_root)
    return path.read_bytes()


def read_json(path: Path, allowed_root: Path) -> dict:
    return json.loads(read_bytes(path, allowed_root).decode("utf-8-sig"))


def digest_stream(stream) -> tuple[int, str]:
    size, digest = 0, hashlib.sha256()
    while block := stream.read(BUFFER):
        size += len(block)
        digest.update(block)
    return size, digest.hexdigest()


def fingerprint(path: Path, allowed_root: Path) -> tuple[int, str]:
    safe_path(path, allowed_root)
    with path.open("rb") as stream:
        return digest_stream(stream)


def relative_child(root: Path, name: str) -> Path:
    value = PurePosixPath(name)
    if value.is_absolute() or not value.parts or any(p in ("..", ".") or ":" in p or "\\" in p for p in value.parts):
        raise ValueError(f"Invalid relative release path: {name}")
    return safe_path(root.joinpath(*value.parts), root)


def git(*args: str) -> str:
    return subprocess.run(["git", *args], cwd=ROOT, text=True, encoding="utf-8", check=True,
                          stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=30).stdout.strip()


def git_identity() -> dict:
    head = git("rev-parse", "--verify", "HEAD")
    tag_object = git("rev-parse", "--verify", f"refs/tags/{TAG}")
    tag_commit = git("rev-parse", "--verify", f"refs/tags/{TAG}^{{commit}}")
    if tag_commit != head:
        raise ValueError(f"{TAG} must point to current HEAD; tag={tag_commit}, HEAD={head}")
    return {"head": head, "tag": TAG, "tagObject": tag_object, "tagCommit": tag_commit,
            "tagObjectType": git("cat-file", "-t", tag_object),
            "worktreeDirty": bool(git("status", "--porcelain"))}


def asset_map(manifest: dict) -> dict:
    assets = manifest.get("assets", [])
    if len(assets) != 2 or {a.get("kind") for a in assets} != {"coach", "training"}:
        raise ValueError("Release must identify exactly the coach and training assets")
    return {a["kind"]: a for a in assets}


def verify_assets(directory: Path, assets: dict, *, root: Path) -> None:
    for kind, item in assets.items():
        expected = item.get("sha256", "")
        if not re.fullmatch(r"[0-9a-f]{64}", expected):
            raise ValueError(f"Missing/invalid {kind} release SHA256")
        source = relative_child(directory, item["file"])
        count, sha = fingerprint(source, root)
        if count != item["bytes"] or sha != expected:
            raise ValueError(f"Accepted asset differs from release manifest: {source}")


def walk_regular_files(directory: Path, root: Path):
    safe_path(directory, root)
    for entry in sorted(directory.iterdir(), key=lambda p: p.name.casefold()):
        safe_path(entry, root)
        if entry.is_dir():
            if entry.name.casefold() in EXCLUDED_DIRS:
                if entry.name.casefold() != "__pycache__":
                    raise ValueError(f"Unexpected dependency/repository directory in archive input: {entry}")
                continue
            yield from walk_regular_files(entry, root)
        elif entry.is_file() and entry.suffix.casefold() not in {".pyc", ".pyo"}:
            yield entry
        elif not entry.is_file():
            raise ValueError(f"Unexpected special file: {entry}")


def prepare() -> tuple[dict, dict, list[dict], dict[str, bytes]]:
    if not same_path(ROOT, EXPECTED_ROOT):
        raise ValueError(f"This fixed release script must run from {EXPECTED_ROOT}; found {ROOT}")
    safe_path(ROOT, ROOT)
    safe_path(VIEWER, VIEWER)
    for destination in (DESTINATION, RECEIPT):
        safe_path(destination, ROOT, must_exist=False)
        if destination.exists():
            raise FileExistsError(f"Zero-overwrite release already exists: {destination}")
    release = read_json(RELEASE, ROOT)
    if release.get("gitTag") != TAG or release.get("status") != "accepted-independent-motion-version":
        raise ValueError("R15 release manifest is missing its accepted identity or tag")
    output_name = release["originalOutput"]
    parts = PurePosixPath(output_name).parts
    if len(parts) != 2 or parts[0] != "output" or not parts[1].startswith("flare-v42-r15-"):
        raise ValueError("originalOutput must identify a direct R15 batch under output/")
    batch = relative_child(ROOT, output_name)
    accepted_assets = asset_map(release)
    verify_assets(batch, accepted_assets, root=ROOT)

    viewer_release = read_json(VIEWER / "accepted-release.json", VIEWER)
    if viewer_release.get("status") != "accepted-independent-motion-version":
        raise ValueError("Standalone preview has no accepted-release state")
    viewer_accepted = asset_map(viewer_release)
    viewer_candidates = asset_map(read_json(VIEWER / "candidate-manifest.json", VIEWER))
    for kind in accepted_assets:
        expected = accepted_assets[kind]["sha256"]
        if viewer_accepted[kind]["sha256"] != expected or viewer_candidates[kind]["sha256"] != expected:
            raise ValueError(f"Standalone preview {kind} does not match the accepted R15 asset")
    verify_assets(VIEWER, viewer_candidates, root=VIEWER)

    identity = git_identity()
    selected: dict[str, tuple[Path, Path]] = {}

    def add_file(source: Path, root: Path, archive_path: str):
        safe_path(source, root)
        if archive_path in selected:
            raise ValueError(f"Duplicate archive member: {archive_path}")
        selected[archive_path] = source, root

    def add_tree(directory: Path, root: Path, prefix: str):
        for source in walk_regular_files(directory, root):
            add_file(source, root, prefix + "/" + source.relative_to(directory).as_posix())

    add_tree(batch, ROOT, output_name)
    add_tree(ROOT / "tools/motion-v42-r15", ROOT, "tools/motion-v42-r15")
    documents = sorted((ROOT / "docs").glob("flare-v42-r15*"))
    if not documents:
        raise FileNotFoundError("No docs/flare-v42-r15* release document is ready")
    for source in documents:
        if source.is_dir():
            add_tree(source, ROOT, source.relative_to(ROOT).as_posix())
        else:
            add_file(source, ROOT, source.relative_to(ROOT).as_posix())
    r14 = ROOT / "output/flare-v42-r14-20261016"
    r14_release_path = ROOT / "tools/motion-v42-r14/releases/v42-r14.json"
    verify_assets(r14, asset_map(read_json(r14_release_path, ROOT)), root=ROOT)
    for name in ("flare-coach-v42-candidate.glb", "flare-training-v42-candidate.glb",
                 "recovery-samples.json", "comparison-clock.json", "bake-manifest.json"):
        source = r14 / name
        add_file(source, ROOT, source.relative_to(ROOT).as_posix())
    add_file(r14_release_path, ROOT, r14_release_path.relative_to(ROOT).as_posix())
    for name in ("flare-coach-v41-base.glb", "coach-v41-rig.json"):
        source = ROOT / "app/scene/source/coach" / name
        add_file(source, ROOT, source.relative_to(ROOT).as_posix())
    add_tree(VIEWER, VIEWER, "standalone-preview/r15-preview")

    members = []
    for archive_path, (source, root) in sorted(selected.items()):
        size, sha = fingerprint(source, root)
        members.append({"path": archive_path, "bytes": size, "sha256": sha,
                        "source": str(source), "allowedRoot": str(root)})
    readme = f"""Flare v42 / R15 accepted local archive — 2026-10-17

Git tag: {TAG}
Git HEAD: {identity['head']}
Git tag object: {identity['tagObject']}
Accepted batch: {output_name}

This is a local snapshot, not an App release or a complete build environment.
App remains L47 / v42-R12. Original R14 inputs are copied without modification.

To reproduce baking/checks: obtain the repository at the exact Git tag above,
install its locked root and app/scene Node dependencies, and restore these copied
inputs at their repository-relative paths. Follow tools/motion-v42-r15/README.md.
The complete old runtime/source dependencies are preserved by that Git version;
node_modules, Python environments, SMPL-X, and the entire repository are omitted.

The independent preview includes its vendor JavaScript, assets, and accepted hash
state. Serve standalone-preview/r15-preview with a local HTTP server and open
index.html through HTTP (not file://). It does not require a Node dependency install.
The optional bundled reference clip is an approximate, uncalibrated visual aid.

The external .receipt.json is written with status=success only after every ZIP
member has been streamed back, byte-count/SHA256 checked, and CRC integrity tested.
Archive and receipt paths are exclusive-create; this script never overwrites them.
"""
    generated = {"ARCHIVE-README.txt": readme.encode("utf-8"),
                 "ARCHIVE-IDENTITY.json": json.dumps({"git": identity, "releaseManifest": release,
                    "releaseManifestSha256": fingerprint(RELEASE, ROOT)[1]}, ensure_ascii=False, indent=2).encode("utf-8")}
    return release, identity, members, generated


def create_archive(check_only: bool = False) -> None:
    release, identity, members, generated = prepare()
    if check_only:
        print(json.dumps({"status": "inputs-verified-no-files-written", "archive": str(DESTINATION),
              "sourceFiles": len(members), "sourceBytes": sum(m["bytes"] for m in members),
              "git": identity}, ensure_ascii=False, indent=2))
        return
    safe_path(DESTINATION.parent, ROOT, must_exist=False)
    DESTINATION.parent.mkdir(parents=True, exist_ok=True)
    expected = {m["path"]: {k: m[k] for k in ("bytes", "sha256")} for m in members}
    with zipfile.ZipFile(DESTINATION, "x", compression=zipfile.ZIP_DEFLATED,
                         compresslevel=6, allowZip64=True) as archive:
        for member in members:
            source = Path(member["source"])
            safe_path(source, Path(member["allowedRoot"]))
            count, digest = 0, hashlib.sha256()
            with source.open("rb") as original, archive.open(member["path"], "w", force_zip64=True) as output:
                while block := original.read(BUFFER):
                    output.write(block)
                    count += len(block)
                    digest.update(block)
            if count != member["bytes"] or digest.hexdigest() != member["sha256"]:
                raise RuntimeError(f"Input changed during archiving: {source}; partial ZIP preserved")
        for name, data in generated.items():
            archive.writestr(name, data)
            expected[name] = {"bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}
    with zipfile.ZipFile(DESTINATION, "r") as archive:
        names = archive.namelist()
        if len(names) != len(set(names)) or set(names) != set(expected):
            raise RuntimeError("ZIP member inventory differs from the planned snapshot")
        for name in names:
            with archive.open(name, "r") as restored:
                size, sha = digest_stream(restored)
            if size != expected[name]["bytes"] or sha != expected[name]["sha256"]:
                raise RuntimeError(f"ZIP member readback failed: {name}")
        bad = archive.testzip()
        if bad is not None:
            raise RuntimeError(f"ZIP CRC integrity check failed: {bad}")
    final_identity = git_identity()
    if any(final_identity[key] != identity[key] for key in ("head", "tagObject", "tagCommit")):
        raise RuntimeError("Git HEAD/tag changed during archiving; success receipt withheld")
    size, sha = fingerprint(DESTINATION, ROOT)
    result = {"schemaVersion": 1, "status": "success", "checkedAt": datetime.now(timezone.utc).isoformat(),
              "archive": str(DESTINATION), "bytes": size, "sha256": sha, "git": identity,
              "release": release["id"], "originalOutput": release["originalOutput"],
              "sourceFiles": len(members), "verifiedMembers": len(expected),
              "zipCrcCheck": "passed", "memberStreamSha256Check": "passed",
              "members": [{"path": name, **data} for name, data in sorted(expected.items())],
              "reproductionRequiresExactGitVersionAndInstalledDependencies": True,
              "independentPreviewIncluded": True, "appRelease": False}
    safe_path(RECEIPT, ROOT, must_exist=False)
    with RECEIPT.open("x", encoding="utf-8") as receipt:
        json.dump(result, receipt, ensure_ascii=False, indent=2)
        receipt.write("\n")
    print(json.dumps({k: result[k] for k in ("status", "archive", "bytes", "sha256", "verifiedMembers")}, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check-only", action="store_true", help="Verify inputs/tag/hashes; create no files")
    arguments = parser.parse_args()
    try:
        create_archive(arguments.check_only)
    except Exception as error:
        print(f"R15 archive stopped: {error}", file=sys.stderr)
        print("Existing files and any partial archive are preserved; no success receipt was issued.", file=sys.stderr)
        sys.exit(1)
