"""Screenshot slides after animations settle: .venv/bin/python scripts/shots.py OUTDIR 3 4/0/2 ...

Each spec is a reveal.js index h[/v[/f]] (f = fragment index). Needs `uv run playwright install chromium` once,
or CHROME=/path/to/chrome for an existing binary. Console errors are printed.
"""

import os
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

out = Path(sys.argv[1])
out.mkdir(parents=True, exist_ok=True)
index = Path(__file__).parents[1] / "index.html"
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get("CHROME"), args=["--no-sandbox"])
    page = b.new_page(viewport={"width": 1600, "height": 900})
    page.on("console", lambda m: print("console:", m.text) if m.type in ("error", "warning") else None)
    page.on("pageerror", lambda e: print("pageerror:", e))
    page.goto(f"file://{index}")
    page.wait_for_timeout(500)
    for spec in sys.argv[2:]:
        page.evaluate(f"Reveal.slide(...'{spec}'.split('/').map(Number))")
        page.wait_for_timeout(2500)
        page.screenshot(path=str(out / f"s_{spec.replace('/', '_')}.png"))
    b.close()
