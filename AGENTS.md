# Slides

reveal.js deck: `index.html`, styles in `css/style.css`, animations in `js/`, generated data in `data/`.

- Plain, minimal science style: no cards, gradients, shadows, emoji or icons.
- Little text on slides; details, sources and numbers go in `<aside class="notes">`.
- All math in TeX (`$...$`, `$$...$$`), never Unicode math. Use `tex()` for labels inside SVG.
- Fixed 1600×900 canvas. Colours only from the CSS variables (`C.*` in JS).
- Animated slides: `data-demo="name"` + `demo("name", {init, enter, leave, step})`; `step(i)` gets the fragment index.
- Plot data comes from `scripts/*.py` writing `data/*.js`; never hand-type numbers into charts.
- After changing a slide, screenshot it with `scripts/shots.py` and check for overflow, overlap and console errors.
- Python via `uv` (`.venv/bin/python`).
