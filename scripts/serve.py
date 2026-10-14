"""Serve the deck without browser caching (so edits show up on a normal reload).

    python3 scripts/serve.py [PORT]      # then open http://localhost:PORT (forward the port via ssh/VS Code)
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class NoCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
handler = partial(NoCache, directory=str(Path(__file__).parents[1]))
print(f"serving on http://localhost:{port}")
ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()
