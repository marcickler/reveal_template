# Slides

reveal.js deck: `index.html`, styles in `css/style.css`, animations in `js/`, generated data in `data/`.

- Plain, minimal science style.
- Little text on slides; details, sources and numbers go in `<aside class="notes">`.
- All math in TeX (`$...$`, `$$...$$`), never Unicode math. Use `tex()` for labels inside SVG.
- Fixed 1600×900 canvas. Colours only from the CSS variables (`C.*` in JS).
- Animated slides: `data-demo="name"` + `demo("name", {init, enter, leave, step})`; `step(i)` gets the fragment index.
- Generate plot data with `scripts/*.py` into `data/*.js`.
- Check changed slides with `scripts/shots.py`.
- Python via `uv` (`.venv/bin/python`).
