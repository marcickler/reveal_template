# reveal.js talk template

A template for scientific talks in plain HTML: reveal.js slides, d3 charts and animations, and KaTeX math, with a
Beamer-like look. There is no build step, and all libraries are vendored, so the deck works offline.

The look is deliberately plain: a clean, minimal science talk.

Live example: https://marcickler.github.io/reveal_template/

## Run

Locally, just open `index.html` in a browser. On a remote machine, start the server there and forward the port:

```bash
python3 scripts/serve.py 8000             # on the server
ssh -L 8000:localhost:8000 host           # on your laptop, then open http://localhost:8000
```

`serve.py` is `python3 -m http.server` with caching disabled, so edits show up on a normal reload, and bound to
localhost only. In the browser, press `S` for speaker notes, `Esc` for the overview, and `F` for full screen.

## Working with an agent

What worked well for me: leave the code to the agent and spend the time thinking about content, about which
figures, animations or tables would help the listeners most, and then look at the result as a listener would.
Animations are quick to iterate on this way, so they become an easy option rather than a big investment.

`AGENTS.md` collects the conventions the agent follows in this repo.

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
