# Player Count for Steam 🎮

A [Millennium](https://steambrew.app/) plugin that displays real-time player counts for your Steam games. Ported from [playcount-decky](https://github.com/itsOwen/playcount-decky) (Steam Deck / Decky Loader) to the desktop Steam client.

## Features

- **Live Player Count Badge** — Appears on game pages in your Steam library
- **Color-Coded Status** — Badge color changes based on player count (green → blue → silver → gold → red)
- **Click to View SteamCharts** — Click the badge to open the SteamCharts page for that game
- **Customizable** — Adjust position, alignment, and offsets via the settings panel

## Installation

### Prerequisites

- [Millennium](https://github.com/SteamClientHomebrew/Millennium) installed (alpha/beta channel for Lua plugin support)

### From Release

1. Download the latest release zip from the [Releases](https://github.com/BarterClub/playcount-steambrew/releases) page
2. Extract the `PlayerCount` folder into your Steam plugins directory:
   - **Windows:** `C:\Program Files (x86)\Steam\plugins\`
   - **Linux:** `~/.local/share/millennium/plugins/`
3. Open Steam → **Millennium** → **Plugins**, enable **Player Count**
4. Click **Save Changes** and restart Steam

### From Source

```bash
git clone https://github.com/BarterClub/playcount-steambrew.git
cd playcount-steambrew
npm install
npm run build
```

Then copy the built plugin (the folder containing `.millennium/Dist/`, `backend/`, and `plugin.json`) into your plugins directory.

## Settings

Access settings via **Steam → Millennium → Player Count**:

| Setting | Default | Description |
|---------|---------|-------------|
| Show Player Count | On | Toggle the badge on/off |
| Align to Right | On | Position badge on the right side of the header |
| Horizontal Offset | 0px | Distance from the aligned edge |
| Vertical Offset | 0px | Distance from the top |

## Project Structure

```
├── frontend/                 # TypeScript frontend (runs in Steam UI)
│   ├── index.tsx             # Plugin entry point (definePlugin)
│   ├── services/
│   │   ├── api.ts            # Steam API calls via Lua backend
│   │   ├── logger.ts         # Console logging
│   │   └── settings.ts       # Settings persistence
│   ├── display/
│   │   ├── badge.ts          # Player count badge (plain DOM)
│   │   └── styles.ts         # CSS injection
│   └── injection/
│       ├── detector.ts       # Game page detection
│       └── observer.ts       # MutationObserver setup
├── backend/
│   └── main.lua              # Lua backend (HTTP requests via callable)
├── webkit/
│   └── index.tsx             # Webkit module (minimal)
├── types/                    # Lua type definitions
├── plugin.json               # Millennium plugin manifest
├── package.json              # Node dependencies
└── tsconfig.json             # TypeScript config
```

## How It Works

1. **Window Hook** — `Millennium.AddWindowCreateHook` detects when Steam windows are created
2. **MutationObserver** — Watches for DOM changes to detect game page navigation
3. **Detection** — Reads `MainWindowBrowserManager.m_lastLocation.pathname` to extract the app ID
4. **Lua Backend** — Frontend calls `fetch_player_count` via `callable()`, which makes the HTTP request to Steam's API server-side
5. **Badge Injection** — Injects a styled HTML badge into the game header container

## Credits

- Original Decky plugin by [itsOwen](https://github.com/itsOwen/playcount-decky)
- [Millennium](https://github.com/SteamClientHomebrew/Millennium) by SteamClientHomebrew
- [HLTB for Millennium](https://github.com/jcdoll/hltb-millennium-plugin) — reference for Millennium plugin architecture

## License

BSD-3-Clause — see [LICENSE](LICENSE)
