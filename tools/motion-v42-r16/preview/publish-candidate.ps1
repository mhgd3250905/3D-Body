param(
    [switch]$CheckOnly,
    [string]$SourceBatch = 'E:\AII-3D\3D-Body\output\flare-v42-r16-20261017'
)
$ErrorActionPreference = 'Stop'
$candidatePython = 'E:\AII-MotionLab\venv\Scripts\python.exe'
$candidatePublisher = Join-Path $PSScriptRoot 'publish-candidate.py'
if ($CheckOnly) {
    & $candidatePython $candidatePublisher --source-batch $SourceBatch --check-only
} else {
    & $candidatePython $candidatePublisher --source-batch $SourceBatch
}
if ($LASTEXITCODE -ne 0) { throw 'Candidate publication failed' }
