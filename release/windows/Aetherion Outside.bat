@echo off
title Aetherion Outside — Harbour of Dusk
cd /d "%~dp0"

echo.
echo   AETHERION OUTSIDE
echo   Harbour of Dusk
echo.
echo   Leave this window open while you play.
echo   Close it to stop the harbour server.
echo.

set PORT=8088
set URL=http://127.0.0.1:%PORT%/

if exist "runtime\node.exe" (
  start "" "%URL%"
  "runtime\node.exe" serve.mjs
  goto :eof
)

where node >nul 2>nul
if %ERRORLEVEL%==0 (
  start "" "%URL%"
  node serve.mjs
  goto :eof
)

start "" "%URL%"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Could not start the harbour.
  echo Install Node.js LTS from https://nodejs.org then double-click this file again.
  pause
)
