# PlayCount for Millennium (Steam Desktop)

A port of [playcount-decky](https://github.com/itsOwen/playcount-decky) from Decky Loader (Steam Deck) to **Millennium** (Desktop Steam Client via [steambrew.app](https://steambrew.app/)).

Shows real-time player counts for your Steam games in the library and store.

## Features

- Live player count badge on library game pages
- Player count on Steam Store pages
- Detailed stats modal (24h peak, 7/30-day averages, trends)
- Interactive charts via Recharts
- Customizable badge position, size, colors, and icons
- Cached data to reduce API calls

## Prerequisites

- [Millennium](https://github.com/SteamClientHomebrew/Millennium) installed (alpha/beta channel for Lua plugin support)
- Node.js 18+ and pnpm (or npm)

## Setup & Building

```bash
# Clone or copy this folder
cd playcount-millennium

# Install dependencies
pnpm install
# or: npm install

# Build for development (with source maps)
pnpm run dev
# or: npm run dev

# Build for production
pnpm run build
# or: npm run build
```

## Installing

1. Copy (or symlink) the entire `playcount-millennium` folder into your Millennium plugins directory:
   - **Windows:** `C:\Program Files (x86)\Steam\plugins\playcount`
   - **Linux:** `~/.local/share/millennium/plugins/playcount`

2. Open Steam, go to **Steam → Millennium → Plugins**, and enable **PlayCount**.

3. Click **Save Changes** and restart Steam.

## Architecture Changes from Decky Version

| Aspect | Decky (Steam Deck) | Millennium (Desktop) |
|--------|-------------------|---------------------|
| Package imports | `@decky/ui`, `@decky/api` | `@steambrew/client` |
| HTTP requests | `fetchNoCors()` | Lua backend via `callable()` |
| Backend language | Python | Lua |
| Build system | Rollup (`@decky/rollup`) | `millennium-ttc` |
| Plugin config | `plugin.json` (Decky schema) | `plugin.json` (Millennium schema) |
| Plugin structure | `src/index.tsx` | `frontend/index.tsx` + `backend/main.lua` |

## Credits

- Original plugin by [itsOwen](https://github.com/itsOwen/playcount-decky)
- [Millennium](https://github.com/SteamClientHomebrew/Millennium) by SteamClientHomebrew
- License: BSD-3-Clause (same as original)
