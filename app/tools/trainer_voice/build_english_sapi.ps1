param([string]$GeneratedDate = '2026-10-23')
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech
$appRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$repoRoot = Split-Path -Parent $appRoot
$batch = 'english-' + [DateTime]::UtcNow.ToString('yyyyMMddTHHmmssfffZ') + '-' + [Guid]::NewGuid().ToString('N')
$relativeBatch = 'output/sdk-step1-device-20261023/voice-audit/' + $batch
$workRoot = Join-Path $repoRoot $relativeBatch
$assetDir = Join-Path $workRoot 'candidate/assets/trainer_voice/_common/voice/en'
$packPath = Join-Path $workRoot 'candidate/assets/trainer_voice/_common/pack.json'
$manifestPath = Join-Path $workRoot 'candidate/assets/trainer_voice/source-manifest.json'
$textPath = Join-Path $PSScriptRoot 'english-text.json'
$spec = Get-Content -LiteralPath $textPath -Raw -Encoding UTF8 | ConvertFrom-Json
$pack = Get-Content -LiteralPath (Join-Path $appRoot 'assets/trainer_voice/_common/pack.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$manifest = Get-Content -LiteralPath (Join-Path $appRoot 'assets/trainer_voice/source-manifest.json') -Raw -Encoding UTF8 | ConvertFrom-Json
# Every run is an isolated candidate. Never write to the installed asset tree,
# an earlier batch, or the original source WAVs, even on a failed run.
if (Test-Path -LiteralPath $workRoot) { throw 'Batch already exists; refusing replacement.' }
$null = New-Item -ItemType Directory -Path $workRoot
$null = New-Item -ItemType Directory -Path $assetDir
$ffmpeg = (Get-Command ffmpeg -ErrorAction Stop).Source
$ffprobe = (Get-Command ffprobe -ErrorAction Stop).Source
$filter = 'silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB:start_silence=0.03,areverse,silenceremove=start_periods=1:start_duration=0.01:start_threshold=-45dB:start_silence=0.05,areverse'
$utf8 = New-Object System.Text.UTF8Encoding($false)
function Write-Json($Value, [string]$Path) {
    if (Test-Path -LiteralPath $Path) { throw "Refusing replacement: $Path" }
    $json = ($Value | ConvertTo-Json -Depth 30).Replace("`r`n", "`n")
    [System.IO.File]::WriteAllText($Path, $json + "`n", $utf8)
}
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$files = @()
try {
    $voice = $synth.GetInstalledVoices() | Where-Object { $_.Enabled -and $_.VoiceInfo.Name -eq $spec.voice } | Select-Object -First 1
    if (-not $voice) { throw 'Required installed offline voice is unavailable.' }
    if ($voice.VoiceInfo.Culture.Name -ne $spec.culture) { throw 'Voice culture mismatch.' }
    $synth.SelectVoice($spec.voice)
    $synth.Rate = [int]$spec.rate
    $synth.Volume = 100
    foreach ($phrase in $spec.phrases.PSObject.Properties) {
        $key = $phrase.Name
        if ($key -notmatch '^[a-z0-9_.]+$') { throw 'Unsafe phrase key.' }
        $text = [string]$phrase.Value
        $raw = Join-Path $workRoot ($key + '.source.wav')
        $encoded = Join-Path $assetDir ($key + '.m4a')
        $decoded = Join-Path $workRoot ($key + '.decoded.wav')
        if ((Test-Path -LiteralPath $raw) -or (Test-Path -LiteralPath $encoded) -or (Test-Path -LiteralPath $decoded)) { throw "Batch file exists: $key" }
        # File output only; never send generated speech to the sound device.
        $synth.SetOutputToWaveFile($raw)
        $synth.Speak($text)
        $synth.SetOutputToNull()
        & $ffmpeg -v error -n -i $raw -af $filter -ac 1 -ar 22050 -c:a aac -profile:a aac_low -b:a 32k $encoded
        if ($LASTEXITCODE -ne 0) { throw "Encoding failed: $key" }
        & $ffmpeg -v error -n -i $encoded -ac 1 -ar 22050 -c:a pcm_s16le $decoded
        if ($LASTEXITCODE -ne 0) { throw "Decode failed: $key" }
        $seconds = & $ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $decoded
        if ($LASTEXITCODE -ne 0) { throw "Duration probe failed: $key" }
        $ms = [int][Math]::Round([double]::Parse($seconds, [Globalization.CultureInfo]::InvariantCulture) * 1000)
        if ($ms -le 0) { throw "Empty decoded speech: $key" }
        $entry = $pack.voice.lines | Where-Object { $_.id -eq $key } | Select-Object -First 1
        if (-not $entry) {
            $entry = [pscustomobject]@{id=$key;role='phrase';text=[pscustomobject]@{};ms=[pscustomobject]@{}}
            $pack.voice.lines = @($pack.voice.lines) + @($entry)
        }
        $entry.text | Add-Member -NotePropertyName en -NotePropertyValue $text -Force
        $entry.ms | Add-Member -NotePropertyName en -NotePropertyValue $ms -Force
        $files += [pscustomobject]@{
            asset = 'assets/trainer_voice/_common/voice/en/' + $key + '.m4a'
            bytes = (Get-Item -LiteralPath $encoded).Length
            sha256 = (Get-FileHash -LiteralPath $encoded -Algorithm SHA256).Hash.ToLowerInvariant()
            line = $key
            lang = 'en'
            decodedMs = $ms
            text = $text
            sourceAsset = $relativeBatch + '/' + $key + '.source.wav'
            sourceSha256 = (Get-FileHash -LiteralPath $raw -Algorithm SHA256).Hash.ToLowerInvariant()
        }
    }
    if ($files.Count -ne @($spec.phrases.PSObject.Properties).Count) { throw 'Incomplete candidate.' }
    foreach ($file in $files) {
        $candidate = Join-Path (Join-Path $workRoot 'candidate') $file.asset
        if ((Get-Item -LiteralPath $candidate).Length -ne $file.bytes -or
            (Get-FileHash -LiteralPath $candidate -Algorithm SHA256).Hash.ToLowerInvariant() -ne $file.sha256) { throw 'Candidate verification failed.' }
    }
    $pack.voice.languages = @('zh','en')
    $pack.voice.voices | Add-Member -NotePropertyName en -NotePropertyValue $spec.voice -Force
    $manifest.languages = @('zh','en')
    $manifest.scope = 'Shared Chinese and English prompts and counts only; no action-specific voice.'
    $manifest.files = @($manifest.files | Where-Object { $_.lang -ne 'en' }) + $files
    # Preserve existing recordings while keeping the pack inventory consistent
    # with the authoritative imported/generated file manifest.
    $pack.files.PSObject.Properties.Remove('pack.json')
    foreach ($asset in ($manifest.files | Where-Object { $_.kind -ne 'adapted-manifest' })) {
        $relative = $asset.asset -replace '^assets/trainer_voice/_common/', ''
        $pack.files | Add-Member -NotePropertyName $relative -NotePropertyValue ([pscustomobject]@{
            bytes = $asset.bytes
            sha256 = $asset.sha256
        }) -Force
    }
    $englishSource = [pscustomobject]@{
        generatedDate = $GeneratedDate
        engine = 'Windows desktop System.Speech / SAPI; installed offline voice'
        voice = $spec.voice
        culture = $spec.culture
        rate = $spec.rate
        os = [Environment]::OSVersion.VersionString
        systemSpeechAssembly = [System.Speech.Synthesis.SpeechSynthesizer].Assembly.FullName
        ffmpeg = (& $ffmpeg -version | Select-Object -First 1)
        generator = 'tools/trainer_voice/build_english_sapi.ps1'
        generatorSha256 = (Get-FileHash -LiteralPath $PSCommandPath -Algorithm SHA256).Hash.ToLowerInvariant()
        textSpec = 'tools/trainer_voice/english-text.json'
        textSpecSha256 = (Get-FileHash -LiteralPath $textPath -Algorithm SHA256).Hash.ToLowerInvariant()
        encoding = 'AAC-LC, 32 kbit/s, 22050 Hz mono; decoded PCM duration rounded to milliseconds'
        silenceFilter = $filter
        offline = $true
        audioPlaybackPerformed = $false
        licenseBoundary = 'Internal-test generated assets only. No commercial redistribution permission has been verified; offline generation is not a license determination.'
        qualityBoundary = 'Synthesis, decode duration and checksums verified; naturalness and device listening are separate acceptance checks.'
    }
    $manifest | Add-Member -NotePropertyName englishSource -NotePropertyValue $englishSource -Force
    $pack.credits | Add-Member -NotePropertyName voiceEn -NotePropertyValue 'Windows Microsoft Zira Desktop offline SAPI; internal test only, commercial redistribution permission not verified. See source-manifest.json.' -Force
    Write-Json $pack $packPath
    $packEntry = $manifest.files | Where-Object { $_.kind -eq 'adapted-manifest' } | Select-Object -First 1
    $packEntry.bytes = (Get-Item -LiteralPath $packPath).Length
    $packEntry.sha256 = (Get-FileHash -LiteralPath $packPath -Algorithm SHA256).Hash.ToLowerInvariant()
    Write-Json $manifest $manifestPath
    Write-Json $files (Join-Path $workRoot 'generated-files.json')
    Write-Json ([pscustomobject]@{status='complete';clips=$files.Count;candidate=$workRoot;published=$false}) (Join-Path $workRoot 'COMPLETE.json')
    Write-Output ('Verified candidate only; existing assets unchanged: ' + $workRoot)
} finally {
    $synth.Dispose()
}
