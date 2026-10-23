# Offline English training prompts

These 91 English shared prompts are internal-test assets generated locally with
the installed Windows **Microsoft Zira Desktop** voice. No commercial
redistribution permission has been verified. The generation process does not
establish a licence for release. Chinese source recordings remain unchanged.

On Windows with that voice and ffmpeg/ffprobe already installed, run from the
repository root using Windows PowerShell 5 (System.Speech):

```powershell
powershell.exe -NoProfile -NonInteractive -File app/tools/trainer_voice/build_english_sapi.ps1
python app/tools/trainer/import_voice.py --check
```

Each run creates a unique timestamp + UUID staging batch. It never overwrites
the App's existing English assets, metadata, or previous source WAVs. Failed
batches remain isolated and have no `COMPLETE.json`. Only after all recordings
have been encoded, decoded and verified does it write candidate metadata and
that completion marker. It does not publish or install the candidate.

For a first import, review the completed candidate then copy it into a fresh
App asset destination, refusing any existing target. Later revisions must stay
in their own candidate batch for review; replacing the accepted App package is
a separate explicit operation, with the prior package retained. `--check`
above verifies the currently installed package, not an unpublished candidate.

The script uses file output only and never plays speech. It reads the complete
wording and synthesis rate from `english-text.json`, preserves source WAV files
under `output/sdk-step1-device-20261023/voice-audit/english-<batch>`, trims leading
and trailing silence, encodes AAC-LC, and decodes each final file to PCM to measure
the scheduler duration. `source-manifest.json` records tools, voice, text,
SHA-256, byte counts, source WAV hashes and the exact processing filter. Exact
audio reproduction requires the recorded Windows voice/runtime and ffmpeg
version; hashes make version differences visible.

`--check` validates the immutable Chinese provenance separately from generated
English assets. The Chinese importer refuses to replace a bilingual package;
the English builder preserves Chinese audio and source metadata.

The App passes its active language to `loadTrainerVoiceSource`, which adapts
English ordinal phrases (`Set three`, `Round two`) and singular units through
the SDK's public `VoiceSource` API. Shared semantic calls and the SDK audio
queue remain unchanged. English and Chinese have no action-specific narration.
Other languages retain chimes. Synthesis, decoding and checksums can be checked
offline; naturalness and device playback still require listening acceptance.
