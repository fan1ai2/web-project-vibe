# AI Voice Transcription — SoundWise.ai Frontend Replica Design Spec

**Date**: 2026-06-15
**Status**: Approved
**Tech Stack**: Hugo static site (方案 A)

## Overview

Build a frontend-only Hugo site at `/root/web-project/AI voice/` replicating the core UI of [SoundWise.ai](https://soundwise.ai) — an AI-powered audio/video transcription tool. No backend. All transcription output is simulated with pre-written data.

### Goals

- Visually replicate SoundWise.ai's homepage and tool page
- Bilingual (zh-CN / en) via Hugo i18n
- SEO-optimized content structure per page
- Key interactions clickable: upload, simulated transcription, audio player with transcript sync, export

### Non-Goals

- Real AI transcription or backend integration
- User authentication or persistence
- Bulk upload or API
- The `mysoundwise.com` audio-selling platform (different product)

---

## Architecture

```
AI voice/
├── hugo.toml
├── content/
│   ├── _index.md                 # Homepage (default)
│   ├── tool.md                   # Tool page (default)
│   ├── en/_index.md + tool.md
│   └── zh-CN/_index.md + tool.md
├── i18n/
│   ├── zh-CN.yaml
│   └── en.yaml
├── layouts/
│   ├── _default/
│   │   ├── baseof.html
│   │   ├── home.html
│   │   └── tool.html
│   └── partials/
│       ├── head.html
│       ├── header.html
│       ├── footer.html
│       ├── upload-zone.html
│       ├── audio-player.html
│       ├── transcript-panel.html
│       └── export-bar.html
├── assets/
│   ├── css/main.css
│   ├── css/homepage.css
│   ├── css/tool.css
│   └── js/
│       ├── upload.js
│       ├── player.js
│       └── simulate.js
├── static/images/
└── data/
    └── transcript_sample.json    # Fake transcript data
```

Hugo handles routing, i18n, SEO meta, and page structure. JavaScript handles three interactive modules: file upload UX, audio playback with transcript sync, and simulated transcription flow. Each JS file stays under one responsibility.

---

## Pages

### Homepage (`/`, `/zh-CN/`, `/en/`)

| Section | Content | SEO Keywords |
|---------|---------|:---:|
| Nav | Logo + links + language switcher + CTA | - |
| Hero | Headline, subtitle, description, primary CTA button → tool page | Core |
| Feature Cards | 4 cards: 99.8% accuracy, 90+ languages, local privacy, interactive proofing | Yes |
| How It Works | 3 steps: Upload → AI Transcribe → Proofread & Export | - |
| Supported Formats | Format icon wall: MP3, WAV, M4A, AAC, MP4, MOV, MKV | Yes |
| Use Cases | 5 scenario cards: students, podcasters, journalists, enterprise, legal | Yes |
| Pricing | Free vs Pro 2-column comparison | Yes |
| FAQ | 6-8 collapsible Q&A items | Long-tail |
| Footer | Links, copyright, privacy notice | - |

### Tool Page (`/tool/`, `/zh-CN/tool/`, `/en/tool/`)

| Section | Content |
|---------|---------|
| Upload Zone | Drag-and-drop area + file picker button + format hints + file info display |
| Simulated Progress | Fake progress bar with 3-5s animation, rotating status text |
| Audio Player | Custom controls: play/pause, seek bar, time display, speed selector |
| Transcript Panel | Timestamped segments, speaker labels, clickable words, active-line highlight |
| Export Bar | TXT / DOCX / PDF / SRT download buttons |
| Privacy Badge | "Processed locally, files never uploaded" indicator |

---

## Key Interactions

### 1. Upload → Simulated Transcription

```
[Drop/select file] → [Show filename + size + duration]
  → [Click "Start Transcribing"] → [3-5s fake progress with rotating status text]
  → [Audio player + transcript panel appear with fake data]
```

Real `<input type="file">` accepts audio files. The file is NOT uploaded — it's assigned to `<audio>` element for real playback. Transcript data comes from pre-written JSON.

### 2. Interactive Audio Player

Custom-styled `<audio>` controls: play/pause, clickable seek bar, time readout (current / total), playback speed selector (0.5x / 0.75x / 1x / 1.5x / 2x). Dark background bar.

### 3. Transcript Panel — Bidirectional Sync

- **Click a word/segment** → player seeks to that timestamp
- **During playback** → current sentence highlighted, auto-scroll follows
- Each segment: `{start, end, speaker, text}`
- Speakers differentiated by color
- ~10 pre-written segments (fake data covering a tech topic)

### 4. Export

Four buttons generate text from fake data and trigger browser download via Blob + `URL.createObjectURL`. TXT is plain text, DOCX/PDF/SRT are simulated format headers (full fidelity not required — visual replica).

---

## Visual Design

### Design Tokens

| Token | Value |
|-------|-------|
| Primary | `#4F46E5` (Indigo 600) |
| Primary Gradient | `#4F46E5 → #7C3AED` |
| Accent (success) | `#10B981` (Emerald) |
| Background | `#F8FAFC` (Slate 50) page, `#FFFFFF` cards |
| Text Primary | `#0F172A` (Slate 900) |
| Text Body | `#475569` (Slate 600) |
| Border | `#E2E8F0` (Slate 200) |
| Border Radius | Buttons/inputs: 8px; Cards: 12px; Containers: 16px |
| Card Shadow | `0 1px 3px rgba(0,0,0,0.08)` |
| Card Shadow Hover | `0 4px 12px rgba(0,0,0,0.12)` |
| Font | System font stack incl. "Noto Sans SC" for Chinese |

### Key Visual Elements

- **Hero**: Gradient background, centered large heading + subtitle
- **Cards**: White bg, fine border, subtle shadow, icon-top text-below
- **Upload Zone**: Dashed border, solid + primary color highlight on drag-over
- **Player**: Dark (`#1E293B`) bar, white text, primary-colored progress
- **Transcript Panel**: White card, gray left timestamps, primary left-border marker on current line

---

## File Details

### `hugo.toml`
- `defaultContentLanguage = "zh-CN"`
- Two languages configured: `zh-CN`, `en`
- Menu entries for each language
- SEO: site title, description, base URL (placeholder)

### Content Files (`.md`)
- Frontmatter: title, description, SEO keywords array
- Minimal body content; layout partials drive structure

### i18n Files (`.yaml`)
- All UI strings keyed by semantic name (e.g., `upload_drop_text`, `start_transcribe_btn`)
- ~40-50 keys per language

### Fake Transcript Data (`data/transcript_sample.json`)
- Array of segments: `[{start, end, speaker, text}, ...]`
- ~10 segments covering a tech conversation topic

### CSS
- `main.css`: CSS custom properties (design tokens), reset, typography, nav, footer, shared utilities
- `homepage.css`: Hero, feature cards, steps, formats, use cases, pricing, FAQ
- `tool.css`: Upload zone, progress bar, player, transcript panel, export bar

### JS
- `upload.js`: File input handling, drag-and-drop events, file info display, trigger simulation
- `player.js`: Custom audio controls, seek bar, speed selector, time formatting
- `simulate.js`: Progress bar animation, transcript data injection, word-click-to-seek binding, export function

---

## Spec Self-Review

- [x] No placeholders or TBDs — all sections concrete
- [x] Internal consistency: architecture matches feature list, visual tokens match component descriptions
- [x] Scope check: single project, 2 pages, 3 JS modules, reasonable for one implementation plan
- [x] Ambiguity check: all values specified (color hex, timing, data format), choices explicit
