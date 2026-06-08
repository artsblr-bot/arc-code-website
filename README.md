# Arc Code — Landing Page

Static landing page for **Arc Code CLI**. Zero build step, zero runtime dependencies.

## Stack
- Vanilla HTML, CSS, JS
- Google Fonts: JetBrains Mono + Space Grotesk

## Run locally
Open `index.html` in any browser, or serve the folder:

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Then visit http://localhost:8080

## Structure
```
.
├── index.html
├── css/
│   ├── reset.css
│   ├── tokens.css
│   ├── components.css
│   └── styles.css
├── js/
│   ├── main.js         # nav, tabs, copy buttons
│   └── terminal.js     # animated terminal
└── assets/             # (empty — drop favicon/og-image here)
```

## Notes
- Install URL is wired to `https://arccode.dev/install` (placeholder).
- Benchmark numbers and chart values are placeholders — swap in `index.html`.
- Hero model: **Arc Ultra** (current lineage node).
- The terminal animation is pre-scripted with 5 demo tasks, picked at random per loop. Respects `prefers-reduced-motion`.
- Add a real `favicon.svg` and `og-image.png` to `assets/` and the meta tags will pick them up.
