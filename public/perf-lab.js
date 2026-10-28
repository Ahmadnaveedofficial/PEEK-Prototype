/* PEEK detailed performance dashboard.
   Replaces the old 4-bar result with charts, stats, setting comparison and insights for ANY app.
   Needs: perf-sim.js (engine), window.PeekCtx (exposed by lab.js), globals from experience.js (pickedApp, appCatalog, foundApps, safe). */
(() => {
  const { hardware, classify, evaluate, meta, clamp, avg } = PeekSim,
    { S, D, FK } = window.PeekCtx;
  const PL = { pre: "auto", mins: 30 };
  const COL = {
    a: "#8f8bff",
    b: "#4fd8c0",
    gray: "#8d929e",
    amber: "#ffb454",
    red: "#ff6b7a",
    green: "#5be3a2",
    violet: "#c28bff",
    pink: "#ff9bd2",
  };
  const VC = ["#5be3a2", "#8fe36b", "#ffb454", "#ff8a5b", "#ff6b7a"];
  const VL_GAME = [
      "Excellent",
      "Smooth",
      "Playable",
      "Struggles",
      "Not recommended",
    ],
    VL_APP = ["Excellent", "Smooth", "Usable", "Sluggish", "Not recommended"];
  const KNOWN =
    /pubg|call of duty|genshin|lightroom|capcut|^instagram|^youtube/i;
  const f0 = (v) => Math.round(v),
    f1 = (v) => (Math.round(v * 10) / 10).toFixed(1),
    pad = (n) => String(n).padStart(2, "0");
  const clock = (m) => Math.floor(m) + ":" + pad(Math.round((m % 1) * 60) % 60);
  const mb = (v) => (v >= 1000 ? (v / 1000).toFixed(1) + " GB" : v + " MB");

  /* ---------- SVG line chart with hover tooltip ---------- */
  const CH = {},
    W = 640,
    H = 250,
    M = { l: 50, r: 14, t: 16, b: 28 };
  function ticks(lo, hi, n = 5) {
    const raw = (hi - lo || 1) / n,
      pw = Math.pow(10, Math.floor(Math.log10(raw))),
      m = raw / pw,
      st = (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * pw,
      t = [];
    for (
      let v = Math.floor(lo / st) * st;
      v <= Math.ceil(hi / st) * st + st / 2;
      v += st
    )
      t.push(+v.toFixed(8));
    return t;
  }
  function chart(id, o) {
    const all = o.series
      .flatMap((s) => s.d)
      .concat((o.refs || []).map((r) => r.v));
    let lo = o.ymin != null ? o.ymin : Math.min(...all),
      hi = o.ymax != null ? o.ymax : Math.max(...all);
    if (o.ymin == null) lo -= (hi - lo) * 0.06;
    if (o.ymax == null) hi += (hi - lo) * 0.06;
    const tk = ticks(lo, hi, 4);
    if (o.ymin == null) lo = tk[0];
    if (o.ymax == null) hi = tk[tk.length - 1];
    const n = o.x.length,
      xm = o.x[n - 1] || 1,
      X = (i) => M.l + (i / (n - 1)) * (W - M.l - M.r),
      Y = (v) => M.t + (1 - (v - lo) / (hi - lo || 1)) * (H - M.t - M.b),
      dec = o.dec || 0;
    const xs = xm <= 15 ? 3 : xm <= 30 ? 5 : 10;
    let xt = "";
    for (let v = 0; v <= xm + 0.01; v += xs)
      xt += `<text x="${M.l + (v / xm) * (W - M.l - M.r)}" y="${H - 8}" text-anchor="middle">${v}m</text>`;
    const grid = tk
      .filter((v) => v >= lo - 1e-9 && v <= hi + 1e-9)
      .map(
        (v) =>
          `<line x1="${M.l}" x2="${W - M.r}" y1="${Y(v)}" y2="${Y(v)}" class="gl"/><text x="${M.l - 8}" y="${Y(v) + 3.5}" text-anchor="end">${(+v.toFixed(dec)).toLocaleString()}</text>`,
      )
      .join("");
    const paths = o.series
      .map((s, k) => {
        const d =
          "M" +
          s.d.map((v, i) => X(i).toFixed(1) + "," + Y(v).toFixed(1)).join("L");
        const fill = s.fill
          ? `<path d="${d}L${X(n - 1)},${H - M.b}L${M.l},${H - M.b}Z" fill="url(#g-${id}-${k})"/><defs><linearGradient id="g-${id}-${k}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${s.c}" stop-opacity=".32"/><stop offset="1" stop-color="${s.c}" stop-opacity="0"/></linearGradient></defs>`
          : "";
        return (
          fill +
          `<path d="${d}" fill="none" stroke="${s.c}" stroke-width="${s.w || 2}" ${s.dash ? `stroke-dasharray="${s.dash}"` : ""} stroke-linejoin="round" stroke-linecap="round"/>`
        );
      })
      .join("");
    const refs = (o.refs || [])
      .map(
        (r) =>
          `<line x1="${M.l}" x2="${W - M.r}" y1="${Y(r.v)}" y2="${Y(r.v)}" stroke="${r.c}" stroke-dasharray="5 4" opacity=".75"/><text x="${W - M.r - 4}" y="${Y(r.v) - 5}" text-anchor="end" fill="${r.c}" class="rl">${r.l}</text>`,
      )
      .join("");
    const vl = (o.vlines || [])
      .map(
        (v) =>
          `<line x1="${M.l + (v.x / xm) * (W - M.l - M.r)}" x2="${M.l + (v.x / xm) * (W - M.l - M.r)}" y1="${M.t}" y2="${H - M.b}" stroke="${v.c}" stroke-dasharray="3 4"/><text x="${M.l + (v.x / xm) * (W - M.l - M.r) + 5}" y="${M.t + 10}" fill="${v.c}" class="rl">${v.l}</text>`,
      )
      .join("");
    CH[id] = Object.assign({}, o, { lo, hi, Y, X, n });
    const legend = o.series
      .filter((s) => s.n)
      .map((s) => `<span><i style="background:${s.c}"></i>${safe(s.n)}</span>`)
      .join("");
    return `<figure class="pl-card"><figcaption><div><h3>${o.title}</h3><p>${o.sub || ""}</p></div></figcaption><div class="pl-legend">${legend}</div>
  <div class="pl-c" data-id="${id}" tabindex="0" role="group" aria-label="${safe(o.title)} chart. Use the left and right arrow keys to read values."><svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${grid}${xt}${refs}${vl}${paths}<line class="cross" y1="${M.t}" y2="${H - M.b}" x1="0" x2="0"/>${o.series.map((s) => `<circle class="dot" r="4" fill="${s.c}"/>`).join("")}</svg><div class="pl-tip" aria-live="polite"></div></div></figure>`;
  }
  function hover(c, e) {
    const o = CH[c.dataset.id];
    if (!o) return;
    const svg = c.querySelector("svg"),
      r = svg.getBoundingClientRect(),
      px = ((e.clientX - r.left) / r.width) * W,
      fx = clamp((px - M.l) / (W - M.l - M.r), 0, 1),
      i = Math.round(fx * (o.n - 1)),
      x = o.X(i),
      cr = c.querySelector(".cross");
    cr.setAttribute("x1", x);
    cr.setAttribute("x2", x);
    cr.style.opacity = 1;
    c.querySelectorAll(".dot").forEach((d, k) => {
      d.setAttribute("cx", x);
      d.setAttribute("cy", o.Y(o.series[k].d[i]));
      d.style.opacity = 1;
    });
    const tip = c.querySelector(".pl-tip");
    tip.innerHTML =
      `<b>${clock(o.x[i])} min</b>` +
      o.series
        .filter((s) => s.n)
        .map(
          (s) =>
            `<div><i style="background:${s.c}"></i><span>${safe(s.n)}</span><b>${(+s.d[i].toFixed(o.dec || 0)).toLocaleString()} ${o.unit || ""}</b></div>`,
        )
        .join("");
    tip.style.opacity = 1;
    tip.style.left = (x / W) * 100 + "%";
    tip.style.transform =
      fx > 0.55 ? "translateX(calc(-100% - 12px))" : "translateX(12px)";
  }
  function leave(c) {
    c.querySelector(".cross").style.opacity = 0;
    c.querySelectorAll(".dot").forEach((d) => (d.style.opacity = 0));
    c.querySelector(".pl-tip").style.opacity = 0;
  }

  /* ---------- Metrics ---------- */
  function metrics(sim, hw, c, pr) {
    const L = [],
      P = (k, l, raw, txt, u, hint, better) =>
        L.push({ k, l, raw, txt, u, hint, better }),
      tg = sim.target,
      aF = avg(sim.f),
      game = c.cls == "game";
    P(
      "fps",
      "Average FPS",
      sim.avgFps,
      f0(sim.avgFps),
      "FPS",
      "Target " + tg + " FPS",
      "hi",
    );
    P(
      "low",
      "1% low FPS",
      sim.low1,
      f0(sim.low1),
      "FPS",
      "Worst-case moments",
      "hi",
    );
    P(
      "stab",
      "Stability",
      sim.stab,
      f0(sim.stab),
      "%",
      "1% low ÷ average",
      "hi",
    );
    P("ft", "Frame time", sim.ft, f1(sim.ft), "ms", "Average per frame", "lo");
    P(
      "temp",
      "Peak temperature",
      sim.peakT,
      f1(sim.peakT),
      "°C",
      "Back-panel estimate",
      "lo",
    );
    P(
      "thr",
      "Thermal throttling",
      sim.throttleMin == null ? 999 : sim.throttleMin,
      sim.throttleMin == null ? "None" : "~" + f0(sim.throttleMin) + " min",
      "",
      "FPS " + f0(sim.fpsStart) + " → " + f0(sim.fpsEnd),
      "hi",
    );
    P(
      "drain",
      "Battery drain",
      sim.drain,
      f1(sim.drain),
      "% / hour",
      "Average over the session",
      "lo",
    );
    P(
      "hours",
      "Use time per charge",
      sim.hours,
      f1(sim.hours),
      "hours",
      f0(hw.mAh).toLocaleString() + " mAh battery",
      "hi",
    );
    P(
      "pwr",
      "Average power",
      sim.avgP,
      f1(sim.avgP),
      "W",
      "Screen + chip + radios",
      "lo",
    );
    P(
      "ram",
      "RAM in use",
      sim.ramAvg,
      f1(sim.ramAvg),
      "GB",
      "of " + hw.ram + " GB · peak " + f1(sim.ramPeak),
      "lo",
    );
    if (c.cls == "videoedit") {
      const sec =
        60 /
        clamp(
          (1.4 * (hw.cpuCap * 0.6 + hw.gpuCap * 0.4) * aF) / pr.xw,
          0.15,
          8,
        );
      P(
        "ex",
        "Export · 1-minute clip",
        sec,
        f0(sec),
        "sec",
        "Estimated render time",
        "lo",
      );
      P(
        "x",
        "Data use",
        pr.net,
        mb(pr.net),
        "/ hour",
        "Local project, mostly offline",
        null,
      );
    } else if (c.cls == "photoedit") {
      const sec = (pr.xw * 2.4) / (hw.cpuCap * aF),
        ms = 8 + (pr.cpu * 1.6) / ((hw.cpuCap / 100) * aF);
      P(
        "ex",
        "Export per photo",
        sec,
        f1(sec),
        "sec",
        "Full-resolution export",
        "lo",
      );
      P(
        "x",
        "Slider response",
        ms,
        f0(ms),
        "ms",
        "Time to update the preview",
        "lo",
      );
    } else if (c.cls == "stream") {
      P(
        "ex",
        "Max smooth resolution",
        hw.maxRes,
        hw.maxRes >= 4320 ? "8K" : hw.maxRes >= 2160 ? "4K" : hw.maxRes + "p",
        "",
        "Estimated from chipset class",
        "hi",
      );
      P("x", "Data use", pr.net, mb(pr.net), "/ hour", "At this quality", null);
    } else if (c.cls == "nav") {
      const n = Math.max(1, String(hw.gps).split(",").length),
        s = clamp(9 / (1 + 0.45 * n), 2, 8);
      P(
        "ex",
        "GPS lock time",
        s,
        f1(s),
        "sec",
        n + " satellite system" + (n > 1 ? "s" : ""),
        "lo",
      );
      P(
        "x",
        "Data use",
        pr.net,
        mb(pr.net),
        "/ hour",
        "Map tiles and traffic",
        null,
      );
    } else if (game) {
      P(
        "ex",
        "FPS drift",
        sim.fpsEnd - sim.fpsStart,
        (sim.fpsEnd - sim.fpsStart >= 0 ? "+" : "") +
          f0(sim.fpsEnd - sim.fpsStart),
        "FPS",
        "First vs last minutes",
        "hi",
      );
      P("x", "Data use", pr.net, mb(pr.net), "/ hour", "Online play", null);
    } else {
      const cs = clamp(
          0.4 + 55 / hw.cpuCap + (10 - hw.storScore) * 0.07,
          0.5,
          4,
        ),
        dr = Math.max(0, 1 - sim.avgFps / tg) * 100 + 0.3;
      P(
        "ex",
        "Cold start time",
        cs,
        f1(cs),
        "sec",
        "Launch from a closed app",
        "lo",
      );
      P("x", "Dropped frames", dr, f1(dr), "%", "While scrolling", "lo");
    }
    return L;
  }

  /* ---------- Insights ---------- */
  function insights(app, c, m, hw, ev, pick, sim, VL) {
    const out = [],
      pr = sim.pr,
      name = safe(app.name),
      prs = ev.rows,
      game = c.cls == "game";
    if (sim.avgG >= 92 && sim.avgG >= sim.avgC)
      out.push([
        "warn",
        "Graphics are the limit",
        "The " +
          safe(hw.gpuName || "GPU") +
          " runs at about " +
          f0(sim.avgG) +
          "% load while the CPU sits near " +
          f0(sim.avgC) +
          "%. Lowering graphics quality helps more than lowering the frame-rate target.",
      ]);
    else if (sim.avgC >= 90)
      out.push([
        "warn",
        "The processor is the limit",
        "CPU load averages " +
          f0(sim.avgC) +
          "% while the GPU is at " +
          f0(sim.avgG) +
          "%. Heavy scenes, physics or background work will cost frames first.",
      ]);
    else
      out.push([
        "good",
        "Plenty of headroom",
        "CPU averages " +
          f0(sim.avgC) +
          "% and GPU " +
          f0(sim.avgG) +
          "%, so " +
          name +
          " at this setting is not pushing " +
          safe(hw.name) +
          " to its limit.",
      ]);
    if (sim.throttleMin != null)
      out.push([
        "warn",
        "Heat slows the chip after ~" + f0(sim.throttleMin) + " minutes",
        "The back panel reaches " +
          f1(sim.peakT) +
          " °C. The main CPU cores fall from " +
          f0(Math.max(...sim.cpuBig)) +
          " to about " +
          f0(sim.cpuBig[sim.cpuBig.length - 1]) +
          " MHz and FPS moves from " +
          f0(sim.fpsStart) +
          " to " +
          f0(sim.fpsEnd) +
          ". " +
          safe(hw.coolTxt) +
          " cooling is what sets how long this lasts.",
      ]);
    else
      out.push([
        "good",
        "No thermal throttling in " + sim.mins + " minutes",
        "Temperature peaks at " +
          f1(sim.peakT) +
          " °C, below the point where clocks start to drop, so performance stays steady for the whole session.",
      ]);
    if (game || c.cls == "videoedit") {
      const up = prs[pick.i + 1];
      if (pick.i < ev.auto && sim.verdict > 1)
        out.push([
          "info",
          "A lower setting would run better",
          "Dropping to <b>" +
            safe(ev.rows[ev.auto].pr.name) +
            "</b> gives about " +
            f0(ev.rows[ev.auto].avgFps) +
            " FPS average with a peak of " +
            f1(ev.rows[ev.auto].peakT) +
            " °C on this device.",
        ]);
      else if (up && !up.unsupported && up.avgFps < up.target * 0.9)
        out.push([
          "info",
          "Why not one step higher?",
          "<b>" +
            safe(up.pr.name) +
            "</b> would average only " +
            f0(up.avgFps) +
            " of " +
            up.target +
            " FPS here and peak at " +
            f1(up.peakT) +
            " °C, so " +
            safe(pr.name) +
            " is the better balance.",
        ]);
      else if (up && up.unsupported)
        out.push([
          "info",
          "Limited by the display",
          safe(up.pr.unsupported) + ".",
        ]);
    }
    if (sim.drain > 38)
      out.push([
        "warn",
        "Heavy battery drain",
        "About " +
          f0(sim.drain) +
          "% per hour means roughly " +
          f1(sim.hours) +
          " hours from a full charge. Battery saver, a lower refresh rate or a lower setting will stretch that.",
      ]);
    else
      out.push([
        "good",
        "Comfortable battery use",
        "About " +
          f0(sim.drain) +
          "% per hour, or ~" +
          f1(sim.hours) +
          " hours from 100% at this workload.",
      ]);
    if (sim.ramPeak / hw.ram > 0.6)
      out.push([
        "warn",
        "RAM is getting tight",
        "The app can use up to " +
          f1(sim.ramPeak) +
          " GB of the " +
          hw.ram +
          " GB, so other apps in the background may be reloaded when you switch back.",
      ]);
    if (c.cls == "stream" && pr.res)
      out.push([
        "info",
        "Data usage",
        "Streaming at " +
          safe(pr.name) +
          " uses roughly " +
          mb(pr.net) +
          " per hour.",
      ]);
    if (c.cls == "videoedit" && sim.verdict > 1)
      out.push([
        "info",
        "Editing tip",
        "Turn on proxy media or preview at 1080p while cutting, then switch to full 4K only for export.",
      ]);
    return out;
  }

  /* ---------- Page pieces ---------- */
  const ring = (score, col) =>
    `<svg class="pl-ring" viewBox="0 0 80 80" role="img" aria-label="Score ${score} out of 100"><circle cx="40" cy="40" r="33" fill="none" stroke="#2a2c40" stroke-width="7"/><circle cx="40" cy="40" r="33" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${score * 2.0734} 207.34" transform="rotate(-90 40 40)"/><text x="40" y="46" text-anchor="middle">${score}</text></svg>`;
  function verdictBox(label, col, hw, sim, pr, VL, m, note, tag) {
    return `<div class="pl-verdict"><div class="who" style="--c:${col}"><span>${tag ? `<i style="background:${tag}"></i>` : ""}${safe(hw.name)}</span></div>${ring(sim.score, VC[sim.verdict])}<div><b class="vd" style="color:${VC[sim.verdict]}">${VL[sim.verdict]}</b><span class="vs">${safe(pr.name)}${note ? " · " + safe(note) : ""}</span><small>${f0(sim.avgFps)} FPS avg · ${f0(sim.low1)} FPS 1% low · ${f1(sim.peakT)} °C peak</small></div></div>`;
  }
  function statCards(LA, LB) {
    return `<div class="pl-stats">${LA.map((a, i) => {
      const b = LB && LB[i],
        w =
          b && a.better
            ? a.raw === b.raw
              ? 0
              : (a.better == "hi" ? a.raw > b.raw : a.raw < b.raw)
                ? 1
                : 2
            : 0;
      return `<div class="pl-stat"><span>${a.l}</span><strong class="${w == 1 ? "win" : ""}"><i class="dotA"></i>${a.txt}<small>${a.u}</small></strong>${b ? `<strong class="b ${w == 2 ? "win" : ""}"><i class="dotB"></i>${b.txt}<small>${b.u}</small></strong>` : ""}<em>${a.hint}</em></div>`;
    }).join("")}</div>`;
  }
  function presetTable(ev, pickI, name, tag) {
    return `<div class="pl-card"><h3>${tag ? `<i class="tg" style="background:${tag}"></i>` : ""}Every setting on ${safe(name)}</h3><p>Click a row to load that setting into all the charts above.</p><div class="pl-tw"><table><thead><tr><th>Setting</th><th>Avg FPS</th><th>1% low</th><th>Peak °C</th><th>Battery / h</th><th>Rating</th></tr></thead><tbody>${ev.rows.map((r, i) => (r.unsupported ? `<tr class="off"><td>${safe(r.pr.name)}</td><td colspan="5">Not supported · ${safe(r.pr.unsupported)}</td></tr>` : `<tr class="${i == pickI ? "sel" : ""}" tabindex="0" onclick="PeekPerf.set('pre',${i})" aria-current="${i == pickI}" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();PeekPerf.set('pre',${i})}"><td>${safe(r.pr.name)}${i == ev.auto ? '<b class="best">Best</b>' : ""}</td><td>${f0(r.avgFps)} <small>/ ${r.target}</small></td><td>${f0(r.low1)}</td><td>${f1(r.peakT)}</td><td>${f0(r.drain)}%</td><td><span class="chip" style="--c:${VC[r.verdict]}">${(ev.vl || VL_APP)[r.verdict]}</span></td></tr>`)).join("")}</tbody></table></div></div>`;
  }
  function buckets(sims, hws) {
    const lab = [
        "Locked to target",
        "Mostly smooth",
        "Noticeable drops",
        "Poor",
      ],
      bc = ["#5be3a2", "#8fe36b", "#ffb454", "#ff6b7a"];
    return `<div class="pl-card"><h3>Frame consistency</h3><p>Share of the session spent at each smoothness level.</p>${sims.map((s, i) => `<div class="pl-bk"><span>${safe(hws[i].name)}</span><div>${s.buckets.map((v, k) => `<i style="width:${v}%;background:${bc[k]}" title="${lab[k]} · ${f0(v)}%"></i>`).join("")}</div></div>`).join("")}<div class="pl-legend">${lab.map((l, k) => `<span><i style="background:${bc[k]}"></i>${l}</span>`).join("")}</div></div>`;
  }
  function hwTable(hws) {
    const rows = [
      ["Chipset", (h) => h.chip || "Not specified"],
      ["Graphics", (h) => h.gpuName || "Not specified"],
      ["CPU clock range", (h) => f0(h.cpuMin) + " – " + f0(h.cpuMax) + " MHz"],
      ["GPU clock range", (h) => f0(h.gpuMin) + " – " + f0(h.gpuMax) + " MHz"],
      ["RAM", (h) => h.ram + " GB"],
      [
        "Battery",
        (h) => f0(h.mAh).toLocaleString() + " mAh · ~" + f1(h.wh) + " Wh",
      ],
      ["Display", (h) => h.size + " in · up to " + h.hz + " Hz"],
      ["Cooling", (h) => h.coolTxt],
      ["CPU / GPU rating", (h) => f1(h.proc) + " / " + f1(h.gfx) + " of 10"],
    ];
    return `<div class="pl-card"><h3>Hardware behind this estimate</h3><p>Taken from the device specifications. Clock ranges are estimated from the chipset class.</p><div class="pl-tw"><table class="pl-hw"><thead><tr><th></th>${hws.map((h) => `<th>${safe(h.name)}</th>`).join("")}</tr></thead><tbody>${rows.map(([l, fn]) => `<tr><td>${l}</td>${hws.map((h) => `<td>${safe(fn(h))}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>`;
  }

  /* ---------- Main render ---------- */
  function renderSelected() {
    const el = document.getElementById("selected-app");
    if (!pickedApp || !el) return;
    for (const k of Object.keys(CH)) delete CH[k];
    const a = pickedApp,
      d = S.pd && D(S.pd),
      e = S.cmp && D(S.pb),
      known = KNOWN.test(a.name || "");
    const ic = a.icon
      ? `<img src="${safe(a.icon)}" alt="${safe(a.name)} icon">`
      : `<span class="app-letter big">${safe(a.name[0])}</span>`;
    const c = classify(a),
      m = meta(c),
      VL = c.cls == "game" ? VL_GAME : VL_APP;
    const head = `<div class="selected-app-heading">${ic}<div><span class="eyebrow">SIMULATED PERFORMANCE</span><h2>${safe(a.name)}</h2><p>${safe(a.publisher || "")} · ${safe(a.genre || "App")}</p><p class="pl-kind"><b>${safe(m.label)}</b> · ${known ? "Included illustrative workload" : "Profile inferred from the app category"}</p></div><button onclick="pickedApp=null;document.getElementById('selected-app').hidden=true" aria-label="Close app details">×</button></div>`;
    const foot = `<a class="official-app-link" href="${safe(a.url)}" target="_blank" rel="noopener">View official app listing ↗</a>`;
    el.hidden = false;
    if (!d) {
      el.innerHTML =
        head +
        "<p>Choose a smartphone above to see the full performance breakdown.</p>" +
        foot;
      return;
    }
    const key = String(a.id || a.name),
      ha = hardware(d, FK),
      hb = e ? hardware(e, FK) : null,
      evA = evaluate(ha, c, PL.mins, key + ha.id),
      evB = hb ? evaluate(hb, c, PL.mins, key + hb.id) : null;
    evA.vl = VL;
    if (evB) evB.vl = VL;
    const pick = (ev) => {
      let i = PL.pre == "auto" ? ev.auto : +PL.pre,
        note = "";
      if (!ev.rows[i] || ev.rows[i].unsupported) {
        note = ev.rows[i]
          ? "unsupported here, showing " + ev.rows[ev.auto].pr.name
          : "";
        i = ev.auto;
      }
      return { i, r: ev.rows[i], note };
    };
    const pa = pick(evA),
      pb = evB && pick(evB),
      sa = pa.r,
      sb = pb && pb.r;
    const opts =
      `<option value="auto" ${PL.pre == "auto" ? "selected" : ""}>${c.cls == "game" ? "Auto · best sustainable setting" : "Auto · typical use"}</option>` +
      evA.prs
        .map(
          (p, i) =>
            `<option value="${i}" ${PL.pre == i ? "selected" : ""}>${safe(p.name)}${p.unsupported || (evB && evB.rows[i].unsupported) ? " (not on every device)" : ""}</option>`,
        )
        .join("");
    const controls = `<div class="pl-controls"><label>${c.cls == "game" ? "Graphics &amp; frame rate" : "What are you doing?"}<select onchange="PeekPerf.set('pre',this.value)">${opts}</select></label><label>Session length<select onchange="PeekPerf.set('mins',+this.value)">${[15, 30, 60, 120].map((v) => `<option value="${v}" ${PL.mins == v ? "selected" : ""}>${v} minutes</option>`).join("")}</select></label>${evB ? '<span class="pl-pill">Comparing two devices</span>' : ""}<span class="pl-pill">SIMULATED SCENARIO</span></div>`;
    const verdicts = `<div class="pl-verdicts ${evB ? "two" : ""}">${verdictBox(0, 0, ha, sa, sa.pr, VL, m, pa.note, evB ? COL.a : null)}${evB ? verdictBox(0, 0, hb, sb, sb.pr, VL, m, pb.note, COL.b) : ""}</div>`;
    const summary = (sim, hw, pr) =>
      `In this simulation, ${safe(hw.name)} runs ${safe(a.name)} at <b>${safe(pr.name)}</b> and ${c.cls == "game" ? "averages" : "holds about"} <b>${f0(sim.avgFps)} FPS</b> (1% low ${f0(sim.low1)}). ${sim.throttleMin == null ? "It stays cool and steady" : "Heat builds up and throttling begins after about " + f0(sim.throttleMin) + " minutes"}, peaking at ${f1(sim.peakT)} °C, while using roughly ${f0(sim.drain)}% battery per hour.`;
    const sum = `<p class="pl-sum">${summary(sa, ha, sa.pr)}${evB ? "<br>" + summary(sb, hb, sb.pr) : ""}</p>`;
    const LA = metrics(sa, ha, c, sa.pr),
      LB = evB ? metrics(sb, hb, c, sb.pr) : null,
      x = sa.t,
      two = !!evB;
    const nA = safe(ha.name),
      nB = hb ? safe(hb.name) : "";
    const ser = (k, nm, cA, cB, opt) => {
      const s = [
        {
          n: two ? nA + (nm ? " · " + nm : "") : nm,
          c: two ? COL.a : cA,
          d: sa[k],
          fill: !two && opt && opt.fill,
        },
      ];
      if (two) s.push({ n: nB + (nm ? " · " + nm : ""), c: COL.b, d: sb[k] });
      return s;
    };
    const vlA =
      sa.throttleMin != null
        ? [{ x: sa.throttleMin, l: "Throttling starts", c: COL.amber }]
        : [];
    const fpsSeries = two
      ? [
          { n: nA, c: COL.a, d: sa.fps, fill: 0 },
          { n: nB, c: COL.b, d: sb.fps },
        ]
      : [
          { n: m.metric, c: COL.a, d: sa.fps, fill: 1 },
          { n: "1% low", c: COL.b, d: sa.low, w: 1.4 },
        ];
    const clocks = two
      ? [
          { n: nA + " · CPU", c: COL.a, d: sa.cpuBig },
          { n: nA + " · GPU", c: COL.a, d: sa.gpuMHz, dash: "4 3", w: 1.6 },
          { n: nB + " · CPU", c: COL.b, d: sb.cpuBig },
          { n: nB + " · GPU", c: COL.b, d: sb.gpuMHz, dash: "4 3", w: 1.6 },
        ]
      : [
          { n: "CPU prime cores", c: COL.a, d: sa.cpuBig },
          { n: "CPU efficiency cores", c: COL.gray, d: sa.cpuLit, w: 1.5 },
          { n: "GPU", c: COL.b, d: sa.gpuMHz },
        ];
    const util = two
      ? [
          { n: nA + " · CPU", c: COL.a, d: sa.uC },
          { n: nA + " · GPU", c: COL.a, d: sa.uG, dash: "4 3", w: 1.6 },
          { n: nB + " · CPU", c: COL.b, d: sb.uC },
          { n: nB + " · GPU", c: COL.b, d: sb.uG, dash: "4 3", w: 1.6 },
        ]
      : [
          { n: "CPU load", c: COL.a, d: sa.uC },
          { n: "GPU load", c: COL.b, d: sa.uG },
        ];
    const ramS = two
      ? [
          { n: nA, c: COL.a, d: sa.ram },
          { n: nB, c: COL.b, d: sb.ram },
        ]
      : [{ n: "RAM used", c: COL.pink, d: sa.ram, fill: 1 }];
    const tgA = sa.target;
    const charts =
      chart("fps", {
        title: m.metric + " over time",
        sub:
          "How smoothly " +
          safe(a.name) +
          " runs, sampled every 15 seconds. Hover the chart for exact values.",
        x,
        series: fpsSeries,
        unit: "FPS",
        ymin: Math.max(
          0,
          Math.floor((Math.min(...sa.low, ...(sb ? sb.low : [])) * 0.6) / 10) *
            10,
        ),
        ymax:
          Math.ceil(
            ((two ? Math.max(sa.target, sb.target) : sa.target) * 1.08) / 10,
          ) * 10,
        refs:
          (two && sa.target == sb.target) || !two
            ? [{ v: tgA, l: "Target " + tgA + " FPS", c: "#9aa0b4" }]
            : [],
        vlines: two ? [] : vlA,
      }) +
      '<div class="pl-grid">' +
      chart("clk", {
        title: "Clock speed over time",
        sub: "Processor and graphics frequency. Dips show thermal throttling.",
        x,
        series: clocks,
        unit: "MHz",
        ymin: 0,
        vlines: two ? [] : vlA,
      }) +
      chart("tmp", {
        title: "Temperature over time",
        sub: "Estimated back-panel temperature you would feel in your hand.",
        x,
        series: ser("temp", "Temperature", COL.amber),
        unit: "°C",
        dec: 1,
        ymin: 28,
        ymax: 50,
        refs: [
          { v: 41.5, l: "Throttling begins", c: COL.amber },
          { v: 46, l: "Uncomfortably hot", c: COL.red },
        ],
        vlines: [],
      }) +
      chart("pwr", {
        title: "Power draw over time",
        sub: "Total watts used by the screen, chip and radios.",
        x,
        series: ser("pwr", "Power", COL.violet, 0, { fill: 1 }),
        unit: "W",
        dec: 1,
        ymin: 0,
      }) +
      chart("bat", {
        title: "Battery level",
        sub: "Starting from a full charge.",
        x,
        series: ser("batt", "Battery", COL.green, 0, { fill: 1 }),
        unit: "%",
        dec: 1,
        ymin: Math.max(
          0,
          Math.floor((100 - Math.max(sa.used, sb ? sb.used : 0) * 1.15) / 5) *
            5,
        ),
        ymax: 100,
      }) +
      chart("use", {
        title: "CPU &amp; GPU load",
        sub: "How hard each part is working. Near 100% means a bottleneck.",
        x,
        series: util,
        unit: "%",
        ymin: 0,
        ymax: 100,
      }) +
      chart("ram", {
        title: "Memory usage",
        sub: "RAM held by the app over the session.",
        x,
        series: ramS,
        unit: "GB",
        dec: 1,
        ymin: 0,
        ymax: Math.ceil(Math.max(sa.ramPeak, sb ? sb.ramPeak : 0) + 1),
        refs: two
          ? []
          : [
              { v: ha.ram, l: "Device RAM " + ha.ram + " GB", c: "#9aa0b4" },
            ].filter((r) => r.v <= Math.ceil(sa.ramPeak + 1)),
      }) +
      "</div>";
    const sims = two ? [sa, sb] : [sa],
      hws = two ? [ha, hb] : [ha];
    const tables = `<div class="pl-grid">${buckets(sims, hws)}${hwTable(hws)}</div><div class="pl-grid pl-settings">${presetTable(evA, pa.i, ha.name, two ? COL.a : null)}${two ? presetTable(evB, pb.i, hb.name, COL.b) : ""}</div>`;
    const ins = insights(a, c, m, ha, evA, pa, sa, VL).map(
      ([t, h, p]) => `<div class="pl-ins ${t}"><b>${h}</b><p>${p}</p></div>`,
    );
    const insB = two
      ? insights(a, c, m, hb, evB, pb, sb, VL).map(
          ([t, h, p]) =>
            `<div class="pl-ins ${t}"><b>${h}</b><p>${p}</p></div>`,
        )
      : null;
    const insights_ = `<div class="pl-card"><h3>What this means${two ? " · " + nA : ""}</h3><div class="pl-insg">${ins.join("")}</div></div>${insB ? `<div class="pl-card"><h3>What this means · ${nB}</h3><div class="pl-insg">${insB.join("")}</div></div>` : ""}`;
    el.innerHTML =
      head +
      controls +
      '<div class="v3-simulation-note"><b>Simulation, not a benchmark.</b> These charts use an illustrative model, including assumed clock ranges, cooling and missing inputs. They do not establish actual app compatibility or measured device performance. Concept and fictional profiles are labelled in the device selector.</div>' +
      verdicts +
      sum +
      statCards(LA, LB) +
      charts +
      tables +
      insights_ +
      '<p class="note">Simulation only. These figures come from a model that combines each device’s specifications with the app category, not from real benchmark runs. Real results vary with software version, settings, ambient temperature, case and device condition.</p>' +
      foot;
    el.querySelectorAll(".pl-c").forEach((c) => {
      c.addEventListener("pointermove", (ev) => hover(c, ev));
      c.addEventListener("pointerleave", () => leave(c));
      c.addEventListener("pointerdown", (ev) => hover(c, ev));
      c.addEventListener("keydown", (ev) => {
        const o = CH[c.dataset.id];
        if (!o || !/^(ArrowLeft|ArrowRight|Home|End)$/.test(ev.key)) return;
        ev.preventDefault();
        let i = c._i == null ? 0 : c._i;
        i =
          ev.key == "Home"
            ? 0
            : ev.key == "End"
              ? o.n - 1
              : clamp(i + (ev.key == "ArrowRight" ? 1 : -1), 0, o.n - 1);
        c._i = i;
        const r = c.querySelector("svg").getBoundingClientRect();
        hover(c, { clientX: r.left + (o.X(i) / W) * r.width });
      });
      c.addEventListener("blur", () => leave(c));
    });
  }
  window.refreshSelectedApp = function () {
    try {
      renderSelected();
    } catch (err) {
      console.error(err);
      const el = document.getElementById("selected-app");
      if (el) {
        el.hidden = false;
        el.innerHTML =
          '<div class="state-inline" role="alert"><p>The performance breakdown could not be built for this app and device.</p><button class="primary" onclick="refreshSelectedApp()">Try again</button></div>';
      }
    }
  };
  window.PeekPerf = {
    set(k, v) {
      if (k === "mins") {
        v = +[15, 30, 60, 120].find((n) => n === +v) || 30;
      }
      if (k === "pre" && v !== "auto" && !Number.isInteger(+v)) return;
      PL[k] = v;
      const y = scrollY;
      window.refreshSelectedApp();
      scrollTo(0, y);
    },
    reset() {
      PL.pre = "auto";
    },
  };
  // Choosing a new app resets the setting and scrolls to the top of the detailed view.
  window.chooseApp = function (i, source) {
    pickedApp = (source === "popular" ? appCatalog : foundApps)[i];
    PL.pre = "auto";
    window.refreshSelectedApp();
    document
      .getElementById("selected-app")
      .scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
  };
})();
