@echo off
cd /d "%~dp0app"
if not exist "build\web\index.html" (
  call flutter pub get
  if errorlevel 1 exit /b 1
  call flutter build web --no-web-resources-cdn
  if errorlevel 1 exit /b 1
)
start "" "http://127.0.0.1:8820/"
node tools\serve.mjs
