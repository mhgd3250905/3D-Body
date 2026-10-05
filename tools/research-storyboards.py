"""Inspect a public tutorial's yt-dlp storyboard, without republishing it."""
from email import policy
from email.parser import BytesParser
from pathlib import Path
from io import BytesIO
import json
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
directory = root / 'output' / 'research'
message = BytesParser(policy=policy.default).parsebytes((directory / 'vincanitv-frames.mhtml').read_bytes())
frames = []
start = 0.0
for part in message.iter_parts():
    if part.get_content_type() != 'image/jpeg':
        continue
    picture = Image.open(BytesIO(part.get_payload(decode=True)))
    duration = float(part['X.yt-dlp.Duration'])
    columns, rows = picture.width // 320, picture.height // 180
    count = columns * rows
    for index in range(count):
        left, top = (index % columns) * 320, (index // columns) * 180
        tile = picture.crop((left, top, left + 320, top + 180))
        frames.append((start + index * duration / count, tile))
    start += duration

selected_times = [48, 50, 52, 60, 64, 68, 72, 78, 86, 92, 96, 102, 118, 124, 130, 142, 163, 193, 197, 203, 207, 211, 229, 235]
sheet = Image.new('RGB', (1280, 6 * 210), '#202820')
draw = ImageDraw.Draw(sheet)
records = []
for index, time in enumerate(selected_times):
    timestamp, tile = min(frames, key=lambda item: abs(item[0] - time))
    x, y = index % 4 * 320, index // 4 * 210
    sheet.paste(tile, (x, y + 26))
    draw.text((x + 8, y + 6), f'VincaniTV ~{int(timestamp // 60)}:{timestamp % 60:04.1f}', fill='#e8efe0')
    records.append({'requestedSeconds': time, 'approximateSeconds': timestamp})
sheet.save(directory / 'vincanitv-observed-sequence.jpg', quality=95)
(directory / 'vincanitv-observed-sequence.json').write_text(json.dumps({'source': 'https://www.youtube.com/watch?v=Sz5rd22PCSI', 'note': 'Public storyboard samples; timestamps approximate, not a motion-capture measurement.', 'frames': records}, indent=2), encoding='utf-8')
print(json.dumps({'samples': len(frames), 'sheet': str(directory / 'vincanitv-observed-sequence.jpg')}))
