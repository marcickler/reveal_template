// Example demo: hydrogen 1s density, stepped by fragments (data from scripts/h1s_data.py).
// step -1: exact only, 0: + one Gaussian, 1: + STO-3G, 2: log axis to show the tails.

demo("h1s", (() => {
  const D = DATA.h1s;
  const S = [["exact", C.ink, "exact $e^{-2r}/\\pi$"], ["gauss1", C.compare, "1 Gaussian"], ["sto3g", C.model, "STO-3G (3 Gaussians)"]];
  let c, ax, x, y, line, paths, legend;
  const pts = (k) => D.r.map((r, i) => [r, D.series[k][i]]);
  return {
    init() {
      c = chart("#h1s-chart", { margin: { top: 20, right: 30, bottom: 80, left: 110 } });
      x = d3.scaleLinear().range([0, c.w]);
      y = d3.scaleLinear().range([c.h, 0]);
      line = d3.line().x((d) => x(d[0])).y((d) => y(Math.max(d[1], 1e-12)));
      ax = c.g.append("g"); // redrawn on every view change, below the curves
      c.g.append("defs").append("clipPath").attr("id", "h1s-clip").append("rect").attr("width", c.w).attr("height", c.h);
      paths = c.g.append("g").attr("clip-path", "url(#h1s-clip)").selectAll("path").data(S).join("path")
        .attr("fill", "none").attr("stroke", (d) => d[1]).attr("stroke-width", 3.5);
      legend = S.map(([, col, lab], i) =>
        tex(c.g, lab, { x: c.w - 20, y: 20 + i * 40, anchor: "end", color: col, size: 23 }).attr("opacity", i ? 0 : 1));
      this.view(false, 0);
    },
    // linear axis near the nucleus, or log axis over a wider range
    view(log, dur) {
      x.domain(log ? [0, 8] : [0, 3]);
      y = log ? d3.scaleLog().domain([1e-7, 1]).range([c.h, 0]) : d3.scaleLinear().domain([0, 0.42]).range([c.h, 0]);
      ax.selectAll("*").remove();
      axes({ ...c, g: ax }, x, y, { xlabel: "$r$ (bohr)", ylabel: "$\\rho(r)$ (bohr$^{-3}$)", yticks: log ? [1e-6, 1e-4, 1e-2, 1] : 4, yfmt: log ? pow10 : null });
      paths.transition().duration(dur).attr("d", (d) => line(pts(d[0])));
    },
    step(i) {
      paths.attr("opacity", (_, k) => (k <= i + 1 ? 1 : 0));
      legend.forEach((l, k) => l.attr("opacity", k <= i + 1 ? 1 : 0));
      const log = i >= 2;
      if (log !== this.log) this.view((this.log = log), 700);
    },
  };
})());
