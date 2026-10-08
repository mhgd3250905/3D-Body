"""Reproduce the offline content import from the user-supplied Flare package.

Only creates derivatives. Source JSON, TypeScript, and PNG files are never edited.
Usage: python app/assets/data/import_content.py [unpacked-package-directory]
Requires bundled Pillow; no network access or image generation.
"""

from pathlib import Path
import hashlib
import json
import re
import shutil
import sys

from PIL import Image


ROOT = Path(__file__).resolve().parents[3]
PACKAGE = Path(sys.argv[1]) if len(sys.argv) > 1 else (
    ROOT / ".reference/flare-app-info-20261008/unpacked/flare-app-package"
)
DATA = ROOT / "app/assets/data"
IMAGES = ROOT / "app/assets/drills"


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def write_json(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main():
    DATA.mkdir(parents=True, exist_ok=True)
    IMAGES.mkdir(parents=True, exist_ok=True)
    files = []
    for relative, name in [
        ("06_肌群数据/phase-muscles.json", "phase-muscles.json"),
        ("06_肌群数据/phase-muscles.schema.json", "phase-muscles.schema.json"),
        ("07_训练库/drills.json", "drills.json"),
        ("07_训练库/drills.schema.json", "drills.schema.json"),
        ("09_实施计划/code/src/features/path/stages.ts", "stages-source.ts"),
    ]:
        source = PACKAGE / relative
        output = DATA / name
        shutil.copyfile(source, output)
        files.append({"source": relative, "asset": f"assets/data/{name}", "sha256": sha(source)})

    # The inspected source contains only literal stage declarations. Convert
    # this literal to JSON, without executing user-supplied JavaScript.
    stages_source = (DATA / "stages-source.ts").read_text(encoding="utf-8")
    match = re.search(r"export const STAGES: Stage\[\] = (\[[\s\S]*?\n\]);", stages_source)
    if not match:
        raise ValueError("Stage source format changed; inspect before importing")
    literal = re.sub(r"([{,]\s*)([A-Za-z]\w*)\s*:", r'\1"\2":', match.group(1))
    literal = literal.replace("'", '"')
    literal = re.sub(r",\s*([}\]])", r"\1", literal)
    stages = json.loads(literal)
    titles = ["基础准备", "支撑控制", "腿部绕环", "半圈托马斯", "完整托马斯", "连续托马斯"]
    for stage in stages:
        stage["id"] = f"stage-{stage['n']}"
        stage["title"] = titles[stage["n"] - 1]
        for lesson in stage["lessons"]:
            lesson["id"] = f"stage-{stage['n']}-lesson-{lesson['n']}"
        # Preserve original suggested monetization and AI criteria in the
        # source declarations; the live domain maps them to free self-review.
    write_json(DATA / "course-stages.json", {
        "meta": {
            "status": "draft-unreviewed",
            "note": "课程为用户提供包中的第一版草稿，尚待 breaking 教练审核；周数仅为示意。进度由本人记录，不代表动作掌握、AI 评分或医疗评估。全部阶段可浏览。",
            "source": "09_实施计划/code/src/features/path/stages.ts",
        },
        "stages": stages,
    })

    drills = json.loads((DATA / "drills.json").read_text(encoding="utf-8"))
    illustrations = {}
    known_notes = {
        "forearms-A": "包内标记：手腕方向示意有轻微瑕疵，动作以文字要点为准。",
        "adductors-B": "包内标记：哥本哈根侧撑姿势示意有轻微瑕疵，动作以文字要点为准。",
        "quadriceps-A": "包内标记：反向北欧姿势示意有轻微瑕疵，动作以文字要点为准。",
    }
    for tiers in drills["drills"].values():
        for drill in tiers.values():
            relative = f"07_训练库/{drill['image']}"
            source = PACKAGE / relative
            with Image.open(source) as im:
                im = im.convert("RGB")
                original_size = list(im.size)
                full = IMAGES / f"{drill['id']}.webp"
                thumbnail = IMAGES / f"{drill['id']}-512.webp"
                im.save(full, "WEBP", quality=82, method=6)
                im.resize((512, 512), Image.Resampling.LANCZOS).save(thumbnail, "WEBP", quality=82, method=6)
            illustrations[drill["id"]] = {
                "source": relative,
                "sourceSha256": sha(source),
                "sourceSize": original_size,
                "imageAsset": f"assets/drills/{full.name}",
                "imageSha256": sha(full),
                "thumbnailAsset": f"assets/drills/{thumbnail.name}",
                "thumbnailSha256": sha(thumbnail),
                "note": known_notes.get(drill["id"]),
            }
    if len(illustrations) != 51 or len(stages) != 6 or sum(len(s["lessons"]) for s in stages) != 18:
        raise ValueError("Unexpected package content count")
    manifest = {
        "version": 1,
        "sourcePackage": "flare-app-info.zip/flare-app-package",
        "source": "用户提供的 2026-10-08 Flare App 制作包；原 PNG 保留在 .reference 的未修改解压副本中。",
        "attribution": "51 张训练图是包内 AI 生成的教学示意图，非真人示范。本次仅以 Pillow 作离线 WebP 转码和缩略，未调用生成服务。素材来源说明见包内 07_训练库/README.md 与 数据结构.md。",
        "conversion": {"format": "webp", "quality": 82, "sizes": [1024, 512], "network": False},
        "files": files,
        "images": illustrations,
    }
    write_json(DATA / "source-manifest.json", manifest)
    total = sum(p.stat().st_size for p in IMAGES.glob("*.webp"))
    print(json.dumps({"groups": 17, "phases": 8, "drills": len(illustrations), "lessons": 18, "webpBytes": total}))


if __name__ == "__main__":
    main()
