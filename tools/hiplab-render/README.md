# HipLab local HD and greenscreen production

This additive producer imports the reviewed drill sources without editing the
frozen `tools/drill-anim` engine, model, or motion files. Its overlays select the
accepted `training-human-v2` profile, disable clavicle realignment, and sample
the original timelines at true 30 fps. Output is 1080 square, supersampled with
`--pr 2` (2160 square source RGBA passes), using `themes/glow-b.json`.

The first source batch is PR #119 at
`175ff31c29895f5730fc344519da6cbe1108ab30`, merged into master as
`ae81d96f271a18129abbf6afc7064cfd9dd1d8c3` on 2026-10-17. Source validation
does not assert full-loop motion acceptance. New production records retain the
original QA result, and composition success never upgrades a motion review.

## Setup and production

Use the existing Node/Playwright/Chromium, ffmpeg, Python numpy/scipy/Pillow, and
root Vite dependencies. Prepare the ignored `tools/drill-anim/config.json` from
its Windows example with this machine's installed dependency paths. Keep all
batch outputs on the project drive. No paid services are used.

From this repository root:

```text
python tools/hiplab-render/render_batch.py gpu --app <HipLab checkout> --output <new batch>
python tools/hiplab-render/render_batch.py preview --app <HipLab checkout> --output <batch> --ids n-chair-wiper --frames 0,60,120
python tools/hiplab-render/render_batch.py render --app <HipLab checkout> --output <batch> --ids n-chair-wiper --port 8860
```

Rendering defaults to `--format green`. The new compositor retains original
placement and exactly preserves the original glow-pass edge QA calculations;
the delivered main pass instead uses straight alpha once. It omits flattened
gradient, floor shadows and external glow. Full-loop pose QA runs with the
original thresholds, followed by green export and full CPU video decoding.
`--format dark` is available for separate reference batches. Existing outputs
are never overwritten automatically.

`run_queue.py` manages two slots, prioritizes missing App videos, previews and
checks each action before full rendering, records reviews/errors separately,
and stops new dispatch below 15 GiB free. It can recover live workers using
Windows process identity and never kills existing workers. Its optional
`--wait-pids` bootstraps the initial manually started slots; subsequent restores
normally use the saved status alone.

```text
python tools/hiplab-render/run_queue.py --app <HipLab checkout> --output <batch> --dry-run
python tools/hiplab-render/run_queue.py --app <HipLab checkout> --output <batch>
```

## Green and alpha derivatives

```text
python tools/hiplab-render/export_greenscreen.py --output <batch> --ids n-chair-wiper --once --keep-alpha
```

The exporter reads the original RGBA passes and the recorded placement, without
solving or rendering the motion again. Each completed source needs all frames,
true 30 fps metadata, and completed original QA. Source QA may be `review`, which
remains explicit in the derivative record. An unavailable source stays pending.

Products live under `greenscreen/`: `media/master/*-greenscreen.mp4` (1080 H.264
yuv420p, CRF 14), PNG posters, white/dark key comparisons, and optional exact
placed RGBA PNG sequences in `alpha/`. Keep the source RGBA passes too. Necessary
props and muscle highlights remain part of the foreground. A fixed chroma-key
sample verifies foreground and highlight retention; ordinary keying can retain
a thin green fringe from antialiasing and chroma subsampling. Exact alpha avoids
that reconstruction loss. No green video is automatically installed in the App.

`--watch` may export selected old-style dark-reference workers in parallel with
their production. Do not let a watcher and a green-primary worker export the
same action simultaneously; their exclusive locks deliberately reject that.
`jobs/<id>/result.json` is published last and binds input/output SHA hashes,
recipe, frame count, codec validation and inherited QA. Results and partial
files are preserved. Changed sources/recipes require a new output batch.

`queue-status.json` describes the entire production queue. Green manifest
`requested_ids` describes the current export invocation; use
`all_batch_derivatives_complete` for the complete source batch. No completed
keyframe preview or subset is evidence of full-batch completion.

## Checks

```text
python -m unittest discover -s tools/hiplab-render -p test_*.py -v
python -m py_compile tools/hiplab-render/render_batch.py tools/hiplab-render/run_queue.py tools/hiplab-render/composite_alpha.py tools/hiplab-render/export_greenscreen.py
```

The first batch additionally compared three actual previews (12 frames) with
the frozen compositor: placement matched exactly, edge differences were zero,
and straight-alpha foregrounds matched the unmasked source placement pixel for
pixel. Canvas/v7/fit, nonzero edge cases and the original `-1:0` CLI behavior
were checked separately. These checks do not replace full-loop motion review.
