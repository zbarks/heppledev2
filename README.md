# Hepple Spirits — Brand Site

Static marketing site for Hepple Spirits Company.

**Designed by [Barker Digital](https://barkerdigital.co.uk)**

---

## Stack

Pure HTML / CSS / JS — no framework, no build step, no npm install at deploy time.

- Self-hosted Proxima Nova (OTF) — brand typography, non-negotiable
- Scroll-scrubbed H.264/WebM hero video (monotonic — forward-only, no rewind)
- Hash router: `/`, `#/story`, `#/estate`, `#/cocktails`, `#/visit`, `#/shop`, `#/shop/:slug`
- 818-style product carousels (prev/next buttons with scroll-snap)
- Process stepper on Our Story (numbered 1-5, animated transitions)
- Animated number counters (IntersectionObserver + easeOutExpo)
- Fake shop with localStorage cart, product detail pages, qty stepper, add-to-cart toast

## Structure

```
.
├── index.html
├── styles.css
├── app.js
├── vercel.json
├── package.json
├── README.md
├── .gitignore
└── assets/
    ├── hero.mp4                            # 1.6MB intro video
    ├── hero.webm                           # 1.2MB fallback
    ├── hero-poster.jpg
    ├── brand/
    │   ├── hepple-logotype-blue.png        # Real Hepple logo, transparent BG
    │   └── hepple-logotype-blue-web.png
    ├── fonts/
    │   ├── ProximaNova-Regular.otf
    │   ├── ProximaNova-Semibold.otf
    │   ├── Proxima_Nova_Bold.otf
    │   ├── Proxima_Nova_Black.otf
    │   ├── Proxima_Nova_Extrabold.otf
    │   └── Proxima_Nova_Thin.otf
    └── products/
        ├── hepple-gin.jpg
        ├── douglas-fir.jpg
        ├── wheat-vodka.jpg
        ├── aquavit.jpg
        ├── negroni.jpg
        ├── lineup.jpg                       # Three-bottle family shot
        └── gin-giftbox.jpg                  # Pink gift box
```

## Run locally

```bash
npx serve .
# → http://localhost:3000
```

**Why a server?** All asset paths (`assets/...`, `styles.css`, `app.js`) are now relative — they work both from a server AND from double-clicking `index.html` on Windows/Mac. Previously they used leading slashes (`/assets/...`) which only resolved on a web root, so opening the file directly on Windows showed a blank page. If you ever change a path back to a leading slash, the local-file-double-click workflow breaks again.

## Deploy to Netlify / Vercel

1. `git init && git add . && git commit -m "init"`
2. Push to GitHub
3. [vercel.com](https://vercel.com) → Add New → Project → import
4. Framework preset: **Other** (already configured via `vercel.json`)
5. Deploy

`vercel.json` sets `buildCommand: null` and `outputDirectory: "."` — no build step, repo root is served directly.

## Behaviour notes

- **Hepple logo** in nav/footer always takes you back to `/` and replays the intro video, even if you've already seen it this session.
- **Intro scroll** is monotonic — scrolling up does NOT rewind the video. Once the headline text has faded in, it stays.
- **Session memory** — on second-visit-within-same-tab home visits (not via the logo), the intro is skipped.
- **Cart** persists in `localStorage` under `hepple:cart`. Clear it with `localStorage.removeItem('hepple:cart')`.

## Copy

All body copy is Latin (Lorem Ipsum) placeholder. Structural UI text (buttons, nav, "Shop", "Add to cart", etc.) stays in English because it's UI, not copy.

Real lines preserved from the brand deck: "Come in.", "We're making drinks.", "A very good drink in a very good place."

## Brand tokens

```css
--hepple-blue:     #003087;   /* PMS 287C  */
--hepple-ink:      #1b1a2e;   /* PMS 5255C */
--juniper-pink:    #EC008C;
--doug-fir-green:  #007A53;   /* PMS 341C */
--moorland-teal:   #0a6b80;
--ground:          #EDE8E0;   /* PMS 11-4201 TCX */
```

All defined at the top of `styles.css` — brand compliance is one-file wide.

## Accessibility

- Respects `prefers-reduced-motion` (video scrub disabled, transitions snap)
- Semantic HTML, keyboard-navigable carousels and stepper
- Logo and cart have `aria-label`s
- Focusable qty stepper with numeric input fallback
