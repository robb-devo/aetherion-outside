@echo off
title Aetherion Outside — Harbour of Dusk
cd /d "%~dp0"

echo.
echo   AETHERION OUTSIDE — Harbour of Dusk
echo   Starting a game window (Edge/Chrome app mode)...
echo.
echo   Close the game window when you are done.
echo   If a harbour console stays in the tray, close it too.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0launch.ps1"
if %ERRORLEVEL% NEQ 0 (
  echo Launch helper failed. Starting the simple server instead...
  set PORT=8088
  start "" "http://127.0.0.1:8088/?app=1"
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
  pause
)
