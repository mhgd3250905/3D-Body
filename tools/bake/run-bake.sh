#!/bin/bash
# Rebuild the Flare bake from the current repo state (see tools/bake/*.mjs).
#   PORT=8810 [BAKE_VER=v41] tools/bake/run-bake.sh   -> tools/bake/out/
# Needs: npm install, playwright + chromium (npx playwright install chromium, or set
# PLAYWRIGHT_BROWSERS_PATH / PLAYWRIGHT_MODULE), ffmpeg for the MP4.
set -e
cd "$(dirname "$0")/../.."
PORT=${PORT:-8810}; OUT=tools/bake/out; export BAKE_VER=${BAKE_VER:-v41}
export BAKE_SOURCE=${BAKE_SOURCE:-"Flare $BAKE_VER runtime (git $(git rev-parse --short HEAD))"}
npm run build
node tools/server.mjs --port $PORT & SRV=$!; trap "kill $SRV" EXIT; sleep 1
node tools/bake/capture.mjs --port $PORT --fps 60 --out $OUT/capture.json
node tools/bake/build-glb.mjs --capture $OUT/capture.json --out $OUT
node tools/bake/render-preview.mjs --glb $OUT/flare-coach-$BAKE_VER-animated.glb --dir $OUT/frames --fps 30
ffmpeg -y -loglevel error -framerate 30 -i $OUT/frames/f%04d.png -c:v libx264 -pix_fmt yuv420p -crf 26 -movflags +faststart $OUT/flare-$BAKE_VER-baked-preview.mp4
echo "done: $OUT"
