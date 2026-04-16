# Hepple Spirits — Brand Site

Static marketing site for Hepple Spirits Company. Single-page app with hash-based routing, scroll-scrubbed hero video, and a multi-page structure ready for content expansion.

**Designed by [Barker Digital](https://barkerdigital.co.uk)**

---

## Stack

- Pure static HTML / CSS / JS — no framework, no build step
- Scroll-scrubbed H.264 video intro with WebM fallback + poster frame
- Hash-based router (`/`, `#/story`, `#/estate`, `#/cocktails`, `#/visit`, `#/shop`)
- Google Fonts: Manrope, Cormorant Garamond, Caveat

## Structure

```
.
├── index.html                 # Single-page shell, all routes
├── styles.css                 # Brand tokens + all section styles
├── app.js                     # Router, scroll scrub, drawer
├── vercel.json                # Caching + security headers
├── package.json               # Dev/serve scripts
├── .gitignore
└── assets/
    ├── hero.mp4               # Intro video (H.264 1080p, ~1.6MB)
    ├── hero.webm              # Intro video (VP9 fallback, ~1.2MB)
    ├── hero-poster.jpg        # Poster frame
    ├── gin-box.jpg            # Wild Juniper Gin packaging render
    └── scenes/
        ├── moor.svg           # Estate landscape illustration
        ├── cocktail.svg       # Moorland Spritz scene
        ├── diary-lovage.svg   # Diary card — harvesting
        ├── diary-secret.svg   # Diary card — bar moment
        └── diary-company.svg  # Diary card — fireside
```

## Run locally

```bash
npx serve .
# → http://localhost:3000
```

Or any other static server (`python3 -m http.server`, Live Server, etc.).

## Deploy to Vercel

### Option A — Git + Vercel dashboard (recommended)

1. `git init && git add . && git commit -m "init"`
2. Push to GitHub / GitLab / Bitbucket
3. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo
4. Framework preset: **Other** (Vercel auto-detects static)
5. Deploy. Done.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel
```

No environment variables, no build step — Vercel serves the files as-is.

## Notes on assets

- **Product bottle images** (Wild Juniper Gin, Douglas Fir Vodka, Moorland Vodka) are currently loaded from Hepple's own Shopify CDN (`hepplespirits.com/cdn/shop/files/...`). These URLs are stable and public. To host them locally instead, drop your own PNGs into `/assets/products/` and update the three `<img src>` values in `index.html` inside `.range__grid`.
- **Lifestyle imagery** in the Estate, Cocktail, and Diary sections uses bespoke SVG illustrations in `/assets/scenes/`. Swap them for real photography by replacing the files (same paths) or by editing the CSS `background-image` rules for `.estate__img`, `.cocktail__img`, and the three `.diary__imgbg` elements.
- **Intro video** is at `/assets/hero.mp4`. Replace with a new MP4 at the same path; match the encoding settings with FFmpeg:
  ```bash
  ffmpeg -i input.mp4 -vf "scale=1920:-2" -c:v libx264 -preset slow -crf 23 \
    -pix_fmt yuv420p -movflags +faststart -an hero.mp4
  ```
- **Fonts**: Google-hosted free substitutes for the brand guide's Proxima Nova (→ Manrope) and Coquette Lemonade Script (→ Caveat). For production, swap in the licensed webfonts via `@font-face` in `styles.css`.

## Brand tokens

All colours and type scale are defined as CSS custom properties at the top of `styles.css`:

- `--hepple-blue` `#003087` (PMS 287C) — primary / wordmark
- `--hepple-ink` `#1b1a2e` (PMS 5255C) — body copy
- `--juniper-pink` `#EC008C` — Wild Juniper Gin accent
- `--doug-fir-green` `#007A53` (PMS 341C) — Douglas Fir accent
- `--moorland-teal` `#0a6b80` — Moorland Vodka accent
- `--ground` `#EDE8E0` (PMS 11-4201 TCX) — label / page ground

Sourced from `HEPPLE_BRAND_COLOUR_SYSTEM.pdf`.

## Routes

The home page (`/`) shows the scroll-locked intro on first visit, then the full homepage. Other routes show a designed "Not yet configured by Barker Digital" placeholder — ready to be filled in with real content.

On return visits within the same browser session, the intro is skipped (stored in `sessionStorage`). Clear `hepple:seenIntro` to see it again.

## Accessibility

- Respects `prefers-reduced-motion` — skips the video scrub entirely
- Semantic HTML, keyboard-navigable
- All decorative images have empty or descriptive `aria-label`s on their containers
