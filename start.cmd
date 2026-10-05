@echo off
cd /d "%~dp0"
echo Flare Anatomy Studio
echo Open http://127.0.0.1:8810 in your browser.
echo Keep this window open. Press Ctrl+C to stop.
node tools/server.mjs
pause
