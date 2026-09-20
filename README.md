# Aetherion Outside

Standalone **stylized 3D action-RPG** slice inspired by Peter’s Aetherion MMO-R network.

**Not** Minecraft. **Not** a plugin client. **Not** a capsule tech demo. Third-person harbour fantasy with a World of Warcraft-style camera, action bar, quest log, and zone atmosphere.

Minecraft plugins in `aetherion-plugins` are **read-only inspiration**. This repository never modifies that tree. See [`docs/aetherion-design-notes.md`](docs/aetherion-design-notes.md).

## Why a Chromium game window (not Unity / Godot / Electron .exe)

Godot and Unity are not on this VM. Electron’s Windows `.exe` is too large to keep in git (~150MB). The slice is therefore **WebGL in a desktop app window**:

- **Quality:** same engine as the playable harbour (dusk lighting, bloom, water, WoW HUD)
- **Launch:** one double-click opens Edge or Chrome in `--app` mode (no tabs, no URL bar)
- **Quit:** close the window, or title-screen **Exit** (F11 fullscreen)

## Play on Windows (one click)

Copy the **entire** folder `release/windows/` to:

`C:\Users\Robbi\Desktop\Aetherion Outside\`

Double-click:

`C:\Users\Robbi\Desktop\Aetherion Outside\Play Aetherion Outside.vbs`

Fallback (shows a console): `Aetherion Outside.bat`

Details: [`release/windows/COPY-TO-DESKTOP.txt`](release/windows/COPY-TO-DESKTOP.txt).

Rebuild after code changes: `npm run package:windows`

## Play in a browser (dev)

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. **Enter the Harbour**.

## Controls (WoW-like)

| Input | Action |
| --- | --- |
| Hold **right mouse** | Look |
| **Wheel** | Zoom |
| **Both mouse buttons** | Walk forward |
| WASD | Move |
| Shift | Sprint |
| Space | Jump |
| **1** or F | Strike |
| **Tab** | Target / cycle |
| E | Talk, gather, mine, fish, jump pad |
| 5 | Drink harbour tonic |
| C | Character / skills (all five professions) |
| B or I | Bags |
| **L** | Quest log |
| M | Map |
| H | Primer |
| F11 | Fullscreen |
| Esc | Close / clear target |

## Systems in this slice

| System | In the harbour |
| --- | --- |
| Hub | Authored Harbour of Dusk + distant isles (Eldervale, Farm, Fishing, Amethyst Mines) |
| Combat | Shade-rats, Tab target, Strike (1), target frame |
| Foraging | Moonpetals |
| Mining | Amethyst chips at plaza / hill crystals |
| Fishing | Repeatable dusk line at the pier |
| Farming | On the character sheet, locked to Farm Isle |
| Quest | **Dusk Lanterns** — Corin → 3 petals + 3 rats → shards + Dusk Lantern |
| Economy | Shards, Lila buys petals / sells tonic |

Save is local (`Continue` on the title if you have been here).

## What’s next

- Farm Isle / Eldervale as walkable zones behind the gate
- Tab-target dungeon beat
- Auction-style shard board
- Optional multiplayer on the existing snapshot + `registry` handles
