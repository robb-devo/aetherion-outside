#!/usr/bin/env bash
# One-click local/web start (macOS / Linux). Windows players should use
# release/windows/Play Aetherion Outside.vbs instead.
set -euo pipefail
cd "$(dirname "$0")/.."
if [[ ! -d node_modules ]]; then
  npm install
fi

open_browser() {
  local url="http://127.0.0.1:5173"
  for _ in $(seq 1 50); do
    if command -v curl >/dev/null 2>&1 && curl -sf "$url" >/dev/null 2>&1; then
      if command -v xdg-open >/dev/null 2>&1; then
        xdg-open "$url" >/dev/null 2>&1 || true
      elif command -v open >/dev/null 2>&1; then
        open "$url" >/dev/null 2>&1 || true
      fi
      return 0
    fi
    sleep 0.2
  done
}

open_browser &
exec npm start
