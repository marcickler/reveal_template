"""Hydrogen 1s density: exact vs one optimal Gaussian vs STO-3G -> data/h1s.js (window.DATA.h1s).

    .venv/bin/python scripts/h1s_data.py
"""

import json
from pathlib import Path

import numpy as np

OUT = Path(__file__).parents[1] / "data" / "h1s.js"
r = np.linspace(1e-4, 8, 4000)
BASES = {
    # optimal single Gaussian: alpha = 8 / (9 pi), E = -4 / (3 pi)
    "gauss1": ([8 / (9 * np.pi)], [1.0]),
    # STO-3G hydrogen (zeta = 1.24), normalized primitives
    "sto3g": ([3.42525091, 0.62391373, 0.16885540], [0.15432897, 0.53532814, 0.44463454]),
}


def energy(psi):
    # E = <T> + <V> for a spherically symmetric orbital on the radial grid, in hartree
    w = 4 * np.pi * r**2
    norm = np.trapezoid(psi**2 * w, r)
    dpsi = np.gradient(psi, r)
    return np.trapezoid((0.5 * dpsi**2 - psi**2 / r) * w, r) / norm, norm


out = {"r": [], "series": {}, "table": []}
psis = {"exact": np.exp(-r) / np.sqrt(np.pi)}
for name, (alpha, coef) in BASES.items():
    psis[name] = sum(c * (2 * a / np.pi) ** 0.75 * np.exp(-a * r**2) for a, c in zip(alpha, coef))
idx = np.unique(np.r_[np.arange(0, 400, 2), np.arange(400, len(r), 20)])  # dense near the cusp
out["r"] = np.round(r[idx], 4).tolist()
for name, psi in psis.items():
    E, norm = energy(psi)
    rho = psi**2 / norm
    out["series"][name] = [float(f"{v:.4g}") for v in rho[idx]]
    out["table"].append({"name": name, "n_gauss": len(BASES.get(name, ([],))[0]), "E": round(float(E), 4), "rho0": round(float(rho[0]), 4)})
    print(name, out["table"][-1])
OUT.write_text("window.DATA = Object.assign(window.DATA || {}, { h1s: " + json.dumps(out, separators=(",", ":")) + " });\n")
