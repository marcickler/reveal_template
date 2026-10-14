// Demo registry: a slide with data-demo="name" gets init(section) once, then
// enter/leave on navigation and step(index) on fragment changes (index -1 = none shown).
const DEMOS = {};
const demo = (name, obj) => (DEMOS[name] = obj);
const C = Object.fromEntries(
  ["ink", "muted", "faint", "grid", "model", "ref", "compare", "highlight", "ood", "accent"].map((k) => [
    k,
    getComputedStyle(document.documentElement).getPropertyValue(`--${k}`).trim(),
  ])
);

(() => {
  const state = new Map();
  const get = (section) => {
    const name = section?.dataset.demo;
    if (!name || !DEMOS[name]) return null;
    if (!state.has(section)) {
      const d = DEMOS[name];
      d.init?.(section);
      state.set(section, d);
    }
    return state.get(section);
  };
  // highest data-fragment-index among visible fragments (robust to direct navigation)
  const fragIndex = () =>
    Math.max(-1, ...[...Reveal.getCurrentSlide().querySelectorAll(".fragment.visible")].map((f) => +f.dataset.fragmentIndex));
  Reveal.on("ready", (e) => {
    const d = get(e.currentSlide);
    d?.enter?.(e.currentSlide);
    d?.step?.(fragIndex());
  });
  Reveal.on("slidechanged", (e) => {
    get(e.previousSlide)?.leave?.();
    const d = get(e.currentSlide);
    d?.enter?.(e.currentSlide);
    setTimeout(() => d?.step?.(fragIndex()), 0);
  });
  const onFrag = () => get(Reveal.getCurrentSlide())?.step?.(fragIndex());
  Reveal.on("fragmentshown", onFrag);
  Reveal.on("fragmenthidden", onFrag);
  // keep keyboard navigation away from sliders/buttons after use
  document.addEventListener("pointerup", (e) => {
    if (e.target.matches("input, button")) setTimeout(() => e.target.blur(), 0);
  });
})();

// SVG chart scaffold sized to its box (viewBox in CSS pixels of the 1600×900 slide).
function chart(svgSel, { margin = { top: 20, right: 30, bottom: 70, left: 90 } } = {}) {
  const svg = d3.select(svgSel);
  const box = svg.node().parentNode;
  const W = box.clientWidth || 800;
  const H = box.clientHeight || 500;
  // pin the measured size so the SVG cannot feed back into the surrounding flex layout
  svg.attr("viewBox", `0 0 ${W} ${H}`).attr("preserveAspectRatio", "xMidYMid meet").style("width", `${W}px`).style("height", `${H}px`);
  svg.selectAll("*").remove();
  const w = W - margin.left - margin.right;
  const h = H - margin.top - margin.bottom;
  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
  return { svg, g, w, h, W, H, margin };
}

function axes(c, x, y, { xlabel, ylabel, xticks, yticks, xfmt, yfmt, grid = true } = {}) {
  // ticks: a count (with optional d3 format specifier or function) or an explicit list of values
  const fmt = (axis, n, f) =>
    Array.isArray(n) ? axis.tickValues(n).tickFormat(typeof f === "function" ? f : null)
      : typeof f === "function" ? axis.ticks(n).tickFormat(f) : axis.ticks(n, f);
  if (grid) c.g.append("g").attr("class", "grid").call(fmt(d3.axisLeft(y), yticks ?? 5).tickSize(-c.w).tickFormat(""));
  const ax = fmt(d3.axisBottom(x), xticks ?? 6, xfmt).tickSizeOuter(0);
  const ay = fmt(d3.axisLeft(y), yticks ?? 5, yfmt).tickSizeOuter(0);
  c.g.append("g").attr("class", "axis").attr("transform", `translate(0,${c.h})`).call(ax).call(texTicks);
  c.g.append("g").attr("class", "axis").call(ay).call(texTicks);
  if (xlabel) tex(c.g, xlabel, { x: c.w / 2, y: c.h + 52, anchor: "middle" });
  if (ylabel) tex(c.g, ylabel, { x: -c.margin.left + 24, y: c.h / 2, anchor: "middle", rotate: -90 });
}

// Text with inline $…$ math rendered by KaTeX, placed in an SVG via foreignObject.
// (x, y) is the anchor point; y is the vertical centre of the line.
const texHTML = (s) => s.replace(/\$(.+?)\$/g, (_, m) => katex.renderToString(m, { throwOnError: false }));
function tex(sel, s, { x = 0, y = 0, anchor = "start", rotate = 0, size = 21, color = C.ink, weight = 400 } = {}) {
  const W = 1000, H = 70;
  const g = sel.append("g").attr("transform", `translate(${x},${y}) rotate(${rotate})`).attr("pointer-events", "none");
  g.append("foreignObject").attr("x", anchor === "start" ? 0 : anchor === "end" ? -W : -W / 2).attr("y", -H / 2).attr("width", W).attr("height", H)
    .append("xhtml:div")
    .attr("style", `display:flex;height:${H}px;align-items:center;justify-content:${{ start: "flex-start", middle: "center", end: "flex-end" }[anchor]};` +
      `font-size:${size}px;font-weight:${weight};color:${color};white-space:nowrap;font-family:var(--font)`)
    .append("xhtml:span").html(texHTML(s));
  return g;
}
// Overlay axis tick labels that contain $…$ with KaTeX (call after every axis render).
// The SVG text is only hidden so that d3 axis updates keep working.
function texTicks(axisG) {
  axisG.selectAll(".tick").each(function () {
    const t = d3.select(this).select("text");
    d3.select(this).selectAll("g.texlab").remove();
    if (t.empty() || !t.text().includes("$")) return t.attr("opacity", null);
    const left = t.attr("x") !== null && +t.attr("x") < 0;
    tex(d3.select(this), t.text(), left ? { x: +t.attr("x"), y: 0, anchor: "end", size: 19, color: C.muted } : { x: 0, y: 22, anchor: "middle", size: 19, color: C.muted })
      .attr("class", "texlab");
    t.attr("opacity", 0);
  });
}

// tick format for log axes: only decades, as $10^{-3}$ etc.
const pow10 = (d) => {
  const e = Math.log10(d);
  return Math.abs(e - Math.round(e)) > 1e-6 ? "" : `$10^{${Math.round(e)}}$`;
};
