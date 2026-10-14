# reveal.js talk template

A template for scientific talks in plain HTML: reveal.js slides, d3 charts and animations, and KaTeX math, with a
Beamer-like look. There is no build step, and all libraries are vendored, so the deck works offline.

The look is deliberately plain: a clean, minimal science talk.

## Run

```bash
python3 scripts/serve.py 8000     # open http://localhost:8000
```

On a remote machine, forward the port: `ssh -L 8000:localhost:8000 host`. In the browser, press `S` for speaker notes,
`Esc` for the overview, and `F` for full screen.

## Layout

| path | content |
| --- | --- |
| `index.html` | slides, one `<section>` each; speaker notes in `<aside class="notes">` |
| `css/style.css` | look and layout classes (`.slide`, `.body`, `.col`, `.steps`, `table.res`, ...), colours as CSS variables |
| `js/common.js` | demo registry, `chart()` / `axes()` for d3 plots, `tex()` / `texTicks()` for KaTeX inside SVG |
| `js/demos.js` | one demo per animated slide |
| `data/*.js` | generated data (`window.DATA`), loaded as scripts so `file://` works too |
| `scripts/*.py` | data generation, `serve.py` (no-cache server), `shots.py` (headless screenshots) |
| `lib/` | reveal.js 5.1.0, KaTeX 0.16.11, d3 7.9.0, Latin Modern Sans; licenses in `lib/licenses/` |

An animated slide names a demo, and the demo is called on fragment changes:

```html
<section data-demo="h1s"> ... <span class="fragment"></span> ... </section>
```
```js
demo("h1s", { init(section) {}, enter() {}, leave() {}, step(i) {} });  // i = highest visible fragment, -1 = none
```

## Working with an agent

Don't edit the code yourself. Spend your time looking at the slides and making them intuitive for your listeners, and
tell the agent what to change. Animations are quick to iterate on, so there is no real limit to what can go on a slide.

`AGENTS.md` holds the conventions the agent follows in this repo.
