# peek — Chrome New Tab Dashboard — Design

**Date:** 2026-07-07
**Status:** Approved design, pre-implementation

## Purpose

Replace Chrome's new tab with a fast, glanceable, offline dashboard ("peek at
everything"). No backend, no database, no telemetry, open source under GPL-2.
Everything fits one screen — no scroll. Serves both general users and
students/devs.

## Non-negotiable constraints

- **No backend / hosting / database.** All state in `chrome.storage.local`.
- **No telemetry.** Nothing leaves the machine except direct, user-opted API
  calls (weather, GitHub).
- **No Google Fonts, no Google favicon service** (both leak data / hit Google).
- **GPL-2 licensed.** All dependencies must be GPL-2 compatible (MIT, OFL, BSD, ISC).
- **Fits one screen, no scroll**, at common desktop resolutions.
- **Fast**: instant local load; animations quick and honor `prefers-reduced-motion`.

## Stack

- **Vite + React + TypeScript + Tailwind 4 + Radix Colors**
- Bun toolchain
- **Plain Vite build** → static `index.html` + `manifest.json`. MV3,
  `chrome_url_overrides.newtab`. No background service worker, no content
  scripts, no `@crxjs`.
- **react-grid-layout** (MIT) for the bento drag/resize grid.
- No calendar lib, no date lib, no icon-fetch service — native `Date` / `Intl`
  and Chrome's local favicon cache instead.

### License note on Chord

Chord (dqnamo/Chord) is the visual reference: React + Tailwind 4 + Radix Colors
+ Base UI. Its repo states **no license**, so its files will **not** be copied
verbatim. We **rebuild/adapt** the look from Radix Color tokens and Tailwind,
keeping the aesthetic while staying license-clean. Verify Chord's license before
using any file as-is.

## Architecture — everything is a widget

The whole UI is a **bento grid of widgets** rendered by `react-grid-layout`.

- **Widget registry** (`widgets/registry.ts`): each widget declares
  `{ id, title, component, defaultSize, minSize }`. Adding a feature = add one
  registry entry + one component. Widgets are isolated: each owns its own state
  and its own `chrome.storage.local` key, and communicates only through the
  registry interface. You can understand/test a widget without reading others.
- **Edit mode** toggle (top-level UI state):
  - ON → drag handles, resize handles, add/remove widgets from a palette.
  - OFF → clean static "peek" (no handles, no chrome).
  - Layout serializes to storage on change (debounced).
- **Default layout** ships sane and complete; user rearranges from there.

```
App
├─ ThemeProvider (CSS vars from Radix scales)
├─ Toolbar (edit toggle, settings, add-widget)
└─ BentoGrid (react-grid-layout)
   └─ WidgetShell[]  ← title bar + remove btn (edit mode only)
      └─ <Widget/>   ← one of the registry components
```

## Storage layer (`lib/store.ts`)

Single wrapper over `chrome.storage.local`:

- `get(key)`, `set(key, value)` with **debounced writes** (batch rapid updates).
- Typed keys, one namespace per concern: `layout`, `links`, `folders`, `theme`,
  `fonts`, `notes`, `todos`, `settings`, `github` (incl. PAT), `weather`,
  `timezones`, `deadlines`.
- A tiny `useStored<T>(key, default)` hook for widgets (read + write + live
  sync across open tabs via `chrome.storage.onChanged`).

## Theming + fonts

- **CSS variables** driven by Radix Colors scales. Modes: **light**, **dark**,
  **custom** (user picks accent hue + background). Theme swap = swap the
  variable set; instant, no reload.
- **Fonts self-hosted**, bundled in the extension as local assets, declared via
  `@font-face`. Ship OFL fonts: **Inter** (UI), **JetBrains Mono** (mono), one
  serif (e.g. Source Serif / Newsreader). Font choice in settings. No network.

## Favicons (no telemetry)

Fallback chain for link icons:

1. **Chrome `_favicon/` API** via the `"favicon"` manifest permission — reads
   Chrome's *own local* favicon cache. No network, no third party.
2. Site's own `/favicon.ico` (direct to the site the user already visits).
3. **User upload / drag-drop** — stored as a data-URL in `links`. Always wins
   when present.

Never use Google's `s2/favicons` service (leaks the user's link list to Google).

## Widgets (v1 scope — all in)

| Widget | Notes | Deps |
|---|---|---|
| **Clock + timezones** | Local time + N extra zones | `Intl`, none |
| **Weather** | Open-Meteo (no API key). Location via geolocation permission OR manual city (Open-Meteo geocoding). Cached, refreshed on interval. | fetch |
| **Links** | Custom links, working favicons (chain above), add/edit/upload icon | storage |
| **Folders** | Collapsible link groups (proj / school / …), click to expand | storage |
| **Calendar** | Month grid, native `Date` + `Intl` | none |
| **GitHub PRs** | Local **PAT** (stored in `chrome.storage.local` only) → Search API for PRs authored by you + review-requested. Poll on load + interval. | fetch |
| **Quick search** | Web search (pick engine) OR filter own links. Keyboard-first. | none |
| **Notes / scratchpad** | Persistent text card | storage |
| **Todo** | Small task list | storage |
| **Pomodoro** | Focus timer | none |
| **Deadline countdown** | Countdown to next exam / deadline / due date | storage |

## Data flow

- Widgets read/write their own storage key via `useStored`.
- Network widgets (weather, GitHub) fetch on mount + interval, cache result in
  storage, render cache first (instant), then refresh. Degrade gracefully
  offline (show cached + stale indicator).
- No cross-widget coupling; layout is the only shared/global state.

## Error handling

- Network failures (weather/GitHub): show last cached value + subtle stale/error
  state, never block the page.
- Missing/invalid GitHub PAT: widget shows a "connect" prompt, not an error.
- Favicon miss: fall through the chain to a generated letter tile.
- Storage quota: debounced writes + keep uploaded icons reasonably sized.

## Accessibility / UX

- Keyboard navigation, visible focus states, ARIA on interactive widgets.
- `prefers-reduced-motion` respected; animations short and killable.
- Follows Laws of UX / patterns from `~/docs` (accessibility.md,
  ux-laws-and-patterns.md, design-reference.md).
- One screen, no scroll at common desktop resolutions.

## Dependencies (all GPL-2 compatible)

- `react`, `react-dom` (MIT)
- `react-grid-layout` (MIT)
- `tailwindcss` (MIT), `@radix-ui/colors` (MIT)
- Fonts: Inter, JetBrains Mono, a serif — all OFL
- Build: `vite`, `typescript` (MIT/Apache-2 — GPL-2 compatible for tooling)

No runtime dependency on any hosted service.

## Build phases (spec whole, build incremental)

0. **Scaffold** — Vite + React + TS + Tailwind, `manifest.json`, load-unpacked works.
1. **Bento core** — react-grid-layout, edit mode, storage layer, theme system, fonts.
2. **Links** — links widget, favicon chain, upload, folders.
3. **Time/date/weather** — clock+timezones, calendar, weather (Open-Meteo).
4. **GitHub PRs** — PAT settings, PR fetch widget.
5. **Extras** — quick search, notes, todo, pomodoro, deadline countdown.
6. **Polish** — settings panel, animation pass, a11y pass, one-screen verification.

## Out of scope (v1)

- Firefox / other browsers (Chrome MV3 only for now).
- Sync across machines (local only; revisit `chrome.storage.sync` later if quota allows).
- Any account, login, or hosted component.

## Open items to confirm during build

- Exact default widget set + positions in the shipped layout.
- Which serif font to bundle.
- GitHub PR query specifics (org filters, draft handling).
