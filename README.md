# reveal.js talk template

A template for scientific talks in plain HTML: reveal.js slides, d3 charts and animations, and KaTeX math, with a
Beamer-like look. There is no build step, and all libraries are vendored, so the deck works offline.

The look is deliberately plain. The deck should read as a clean, minimal science talk, not as something
agent-generated: no cards, gradients, shadows, emoji or icon grids, just one clear figure per slide with
little text.

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

## Data and screenshots

```bash
uv sync
.venv/bin/python scripts/h1s_data.py                  # regenerate data/h1s.js
uv run playwright install chromium                    # once
.venv/bin/python scripts/shots.py shots 3 4/0/2       # slide 3, and slide 4 at fragment 2
```

## Working with an agent

`AGENTS.md` holds the conventions an agent should follow in this repo. The workflow that worked for me:

1. Write an outline (`draft.md`): for each slide, what it should show and which figure or animation it needs.
2. Let the agent draft a whole section. State the constraints up front, such as images over text and animations welcome.
3. Review the live deck and give concrete feedback by slide number ("on slide 12 the log axis starts at 10^0 ...").
4. The agent checks its changes with `shots.py` before reporting back.
5. Generate every plot from a script on the real results, and ask the physics questions as well. Answers go into the
   speaker notes.
6. Commit at milestones. Add a line to `AGENTS.md` whenever you correct the same thing twice.
