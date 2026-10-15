"""Encode render-flare-loading.mjs output into transparent animated WebP.

Run from any directory with Python and Pillow 12:
  python app/tools/encode-flare-loading.py
Animated masks remain white; Flutter applies its current orange with srcIn.
"""
import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageChops

ROOT = Path(__file__).resolve().parents[2]
parser = argparse.ArgumentParser()
parser.add_argument("--input", default=str(ROOT / "output/flare-loading-20261011/three"))
parser.add_argument("--name", default="flare-loading", help="Asset basename; use a new name for a new motion version.")
args = parser.parse_args()
if not args.name or any(c not in "abcdefghijklmnopqrstuvwxyz0123456789-_" for c in args.name):
    parser.error("--name must contain only lowercase letters, digits, '-' and '_'.")
source = Path(args.input).resolve()
source.relative_to(ROOT)
metadata = json.loads((source / "render-metadata.json").read_text(encoding="utf-8"))
width, height = metadata["width"], metadata["height"]
count = metadata["renderedFrameCount"]
frames = []
bounds = []
for index in range(count):
    with Image.open(source / "frames" / f"frame-{index:03}.png") as rendered:
        alpha = rendered.getchannel("A").resize((width, height), Image.Resampling.LANCZOS)
    # Only alpha carries shape; no texture, lighting, face, or garment tones.
    frame = Image.new("RGBA", (width, height), (255, 255, 255, 0))
    frame.putalpha(alpha)
    bbox = alpha.getbbox()
    assert bbox and min(bbox[:2]) > 1 and bbox[2] < width - 1 and bbox[3] < height - 1, (index, bbox)
    frames.append(frame)
    bounds.append(bbox)

frame_milliseconds = metadata["imageDurationSeconds"] * 1000 / count
durations = [round((i + 1) * frame_milliseconds) - round(i * frame_milliseconds) for i in range(count)]
assets = ROOT / "app/assets/brand"
assets.mkdir(exist_ok=True)
animated = assets / f"{args.name}.webp"
still = assets / f"{args.name}-still.webp"
frames[0].save(animated, format="WEBP", save_all=True, append_images=frames[1:], duration=durations, loop=0,
               lossless=True, method=6, minimize_size=True)
frames[0].save(still, format="WEBP", lossless=True, method=6)

# Decode the deliverable, checking transparency, exact lossless alpha, count,
# and container duration rather than trusting encoder options alone.
decoded_durations = []
with Image.open(animated) as decoded:
    assert decoded.n_frames == count
    assert decoded.size == (width, height)
    for index in range(count):
        decoded.seek(index)
        rgba = decoded.convert("RGBA")
        assert ImageChops.difference(rgba.getchannel("A"), frames[index].getchannel("A")).getbbox() is None
        decoded_durations.append(decoded.info["duration"])
    assert sum(decoded_durations) == sum(durations)

# Reviewing this contact sheet checks source geometry and full-body framing;
# it is an asset render, not phone/App visual acceptance.
cell, caption = 192, 26
sheet = Image.new("RGB", (cell * 4, (cell + caption) * 3), (30, 31, 35))
draw = ImageDraw.Draw(sheet)
sample_count = min(12, count)
for position, index in enumerate(round(i * count / sample_count) for i in range(sample_count)):
    thumb = frames[index].resize((cell, cell), Image.Resampling.LANCZOS)
    orange = Image.new("RGBA", thumb.size, (255, 96, 47, 255))
    orange.putalpha(thumb.getchannel("A"))
    x, y = (position % 4) * cell, (position // 4) * (cell + caption)
    sheet.paste(orange, (x, y), orange)
    draw.text((x + 8, y + cell + 3), f"{index * frame_milliseconds / 1000:.2f}s", fill=(240, 240, 240))
sheet.save(source / "silhouette-contact.png")

def describe(file):
    return {"path": file.relative_to(ROOT).as_posix(), "bytes": file.stat().st_size,
            "sha256": hashlib.sha256(file.read_bytes()).hexdigest()}

metadata.update({
    "format": "lossless animated WebP RGBA, infinite loop",
    "frameDurationsMilliseconds": sorted(set(decoded_durations)),
    "totalDurationMilliseconds": sum(decoded_durations),
    "fullCycleAlphaBounds": [min(b[0] for b in bounds), min(b[1] for b in bounds), max(b[2] for b in bounds), max(b[3] for b in bounds)],
    "verification": f"All {count} frames decoded; alpha bit-identical to downsampled captures; every frame has transparent margins on all sides.",
    "animated": describe(animated), "reducedMotionStill": describe(still),
    "reproduce": [
        f"node app/tools/render-flare-loading.mjs --source {metadata['source']} --animation {metadata['animation']}" + (f" --duration {metadata['sourceDurationSeconds']}" if metadata["imageDurationSeconds"] == metadata["sourceDurationSeconds"] else "") + f" --output {source.relative_to(ROOT).as_posix()} --playwright-root <existing Playwright package directory> --browser <existing Chromium executable>",
        f"python app/tools/encode-flare-loading.py --input {source.relative_to(ROOT).as_posix()} --name {args.name}"
    ],
})
(assets / f"{args.name}.json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(json.dumps(metadata, ensure_ascii=True, indent=2))
