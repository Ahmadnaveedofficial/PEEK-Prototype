const $ = (s) => document.querySelector(s);
const names = [
  "Display assembly",
  "Camera system",
  "Logic board",
  "Battery",
  "Charging module",
  "Rear enclosure",
];
const descriptions = [
  "OLED panel, touch digitizer and protective glass.",
  "Lens stack, image sensor and optical stabilizer.",
  "Processor, memory and connectivity on a printed circuit board.",
  "Rechargeable cell, protection circuit and connector.",
  "USB-C port, microphone and speaker assembly.",
  "Protective frame, wireless charging coil and back cover.",
];
const subs = [
  ["Cover glass", "Touch digitizer", "OLED panel"],
  ["Lens stack", "Image sensor", "Stabilizer"],
  ["Processor", "Memory", "Connectivity"],
  ["Battery cell", "Protection circuit", "Connector"],
  ["USB-C port", "Microphone", "Speaker"],
  ["Back glass", "Charging coil", "Frame"],
];
let selected = 0,
  detail = false,
  explode = true,
  auto = true,
  angle = 0.45,
  tilt = 0.6,
  frame,
  scene = 0,
  model = 0;
const devices = ["iPhone 18 · concept demo", "Samsung S23 Ultra · demo"];
function info(t, p) {
  $("#dialog-title").textContent = t;
  $("#dialog-text").textContent = p;
  $("#dialog").showModal();
}
function toast(t) {
  $("#toast").textContent = t;
  $("#toast").style.opacity = 1;
  setTimeout(() => ($("#toast").style.opacity = 0), 3500);
}
function intro(k, t, p) {
  return `<section class="intro"><div><div class="eyebrow">${k}</div><h1>${t}</h1><p>${p}</p></div><span class="tag"><i></i> Interactive concept prototype</span></section>`;
}
function options(n = 0) {
  return devices
    .map(
      (x, i) =>
        `<option value="${i}" ${i === n ? "selected" : ""}>${x}</option>`,
    )
    .join("");
}
function upload(id) {
  return `<label class="upload">↑ Upload image<input type="file" accept="image/*" onchange="preview(this,'${id}')"></label>`;
}
function preview(input, id) {
  let f = input.files[0];
  if (!f) return;
  if (!f.type.startsWith("image/")) return toast("Please select an image.");
  if (f.size > 10000000)
    return toast("Please use an image smaller than 10 MB.");
  let el = document.getElementById(id);
  let img = document.createElement("img");
  img.alt = "Your selected device";
  img.src = URL.createObjectURL(f);
  img.onload = () => URL.revokeObjectURL(img.src);
  el.replaceChildren(img);
  toast(
    "Image preview added. Choose a demo model; image recognition is not connected.",
  );
}
function route() {
  cancelAnimationFrame(frame);
  scene++;
  let p = location.hash.slice(1) || "home";
  if (!["home", "comparison", "performance", "about"].includes(p)) p = "home";
  document
    .querySelectorAll("nav a")
    .forEach((a) => a.classList.toggle("active", a.hash === "#" + p));
  ({ home, comparison, performance: performancePage, about })[p]();
  window.scrollTo(0, 0);
}
function home() {
  detail = false;
  $("#main").innerHTML =
    intro(
      "The device discovery studio",
      "A closer look.<br><em>A whole new perspective.</em>",
      "Explore Technology inside out. Start with a device. Discover what’s within.",
    ) +
    `<section class="workspace"><div class="toolbar"><div class="tooltitle"><span class="iconbox">◇</span><div><strong>Your device, uncovered</strong><small>Choose a sample or preview your own image</small></div><div id="uploaded" style="max-width:45px;max-height:40px;overflow:hidden"></div></div><div class="toolbar-actions"><select aria-label="Demo device" onchange="model=+this.value;toast('Demo model selected')">${options(model)}</select>${upload("uploaded")}</div></div><div class="explorer"><div class="stage"><div class="stage-top"><span class="breadcrumb" id="crumb">Device / Exploded view</span><span class="badge">ILLUSTRATIVE 3D</span></div><canvas aria-label="Rotatable three-dimensional phone component illustration"></canvas><div class="person"><div class="head"></div><div class="body"></div><div class="arm"></div><div class="legs"></div></div><div class="view-controls"><button id="explode" class="on" onclick="explode=!explode;this.classList.toggle('on',explode)">Exploded</button><button id="spin" class="on" onclick="auto=!auto;this.classList.toggle('on',auto)">Auto rotate</button><button onclick="angle=.45;tilt=.6;detail=false;selectPart(0)">Reset</button></div><span class="drag-hint">Drag to rotate · Select a module to inspect</span></div><aside class="sidebar"><span class="overline">UNDER THE SURFACE</span><h3>Beautifully connected.</h3><p>Six illustrated assemblies. A world of detail.</p>${names.map((n, i) => `<button class="component ${i === 0 ? "active" : ""}" onclick="detail=false;selectPart(${i})"><span class="num">0${i + 1}</span><span>${n}</span>↗</button>`).join("")}<div class="spec-card" id="spec"></div></aside></div><div class="statusbar"><span>● Live interactive model</span><span>Illustrative geometry · Demo specifications · No image recognition</span></div></section><section class="strip"><article><span class="iconbox">◎</span><div><b>Go beyond specifications</b><p>Rotate assemblies and discover their subcomponents.</p></div></article><article><span class="iconbox">⇄</span><div><b>See the differences</b><p>Compare the parts that matter to you.</p></div></article><article><span class="iconbox">↗</span><div><b>Find your everyday fit</b><p>Explore illustrative app and gaming performance.</p></div></article></section><section class="blue-banner"><div><h2>Two devices. One clear picture.</h2><p>Put their components side by side.</p></div><button onclick="location.hash='comparison'">Compare devices ↗</button></section>`;
  selectPart(0);
  render3D();
}
function selectPart(i) {
  selected = i;
  document
    .querySelectorAll(".component")
    .forEach((e, j) => e.classList.toggle("active", i === j));
  $("#spec").innerHTML =
    `<b>${names[i]}</b><p>${descriptions[i]}</p><button onclick="detail=!detail;selectPart(selected)">${detail ? "← Full device" : "Explore subcomponents ↗"}</button>${detail ? "<p>" + subs[i].join(" · ") + "</p>" : ""}`;
  $("#crumb").textContent = detail
    ? "Device / " + names[i] + " / Subcomponents"
    : "Device / " + names[i];
}
function render3D() {
  let c = $("canvas"),
    ctx = c.getContext("2d"),
    drag = false,
    last,
    token = scene,
    hits = [];
  c.onpointerdown = (e) => {
    drag = true;
    last = [e.clientX, e.clientY];
    c.setPointerCapture(e.pointerId);
  };
  c.onpointermove = (e) => {
    if (!drag) return;
    angle += (e.clientX - last[0]) * 0.008;
    tilt = Math.max(-1.1, Math.min(1.1, tilt + (e.clientY - last[1]) * 0.005));
    last = [e.clientX, e.clientY];
  };
  c.onpointerup = () => (drag = false);
  c.ondblclick = (e) => {
    let r = c.getBoundingClientRect(),
      h = hits.find(
        (p) =>
          Math.hypot(p.x - (e.clientX - r.left), p.y - (e.clientY - r.top)) <
          80,
      );
    if (h) {
      selectPart(h.i);
      detail = true;
      selectPart(h.i);
    }
  };
  function draw() {
    if (token !== scene) return;
    let w = c.clientWidth,
      h = c.clientHeight,
      d = devicePixelRatio || 1;
    if (c.width !== w * d || c.height !== h * d) {
      c.width = w * d;
      c.height = h * d;
    }
    ctx.setTransform(d, 0, 0, d, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (auto && !drag) angle += 0.003;
    let scale = Math.min(w / 600, h / 520) * 0.85;
    function project(x, y, z) {
      let X = x * Math.cos(angle) + z * Math.sin(angle),
        Z = -x * Math.sin(angle) + z * Math.cos(angle);
      return [
        w / 2 + X * scale,
        h / 2 + (y * Math.cos(tilt) - Z * Math.sin(tilt)) * scale,
        Z * Math.cos(tilt) + y * Math.sin(tilt),
      ];
    }
    function poly(points, color, stroke) {
      ctx.beginPath();
      points.forEach((p, i) => {
        let a = project(...p);
        i ? ctx.lineTo(a[0], a[1]) : ctx.moveTo(a[0], a[1]);
      });
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = stroke || "#ffffff55";
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
    function box(x, y, z, bw, bh, depth, color) {
      let a = [x - bw / 2, y - bh / 2, z],
        b = [x + bw / 2, y - bh / 2, z],
        cc = [x + bw / 2, y + bh / 2, z],
        dd = [x - bw / 2, y + bh / 2, z];
      poly([a, b, [b[0], b[1], z - depth], [a[0], a[1], z - depth]], "#9494a8");
      poly(
        [b, cc, [cc[0], cc[1], z - depth], [b[0], b[1], z - depth]],
        "#535367",
      );
      poly([a, b, cc, dd], color);
    }
    function ring(x, y, z, r) {
      let p = project(x, y, z);
      ctx.save();
      ctx.translate(p[0], p[1]);
      ctx.scale(
        Math.max(0.28, Math.abs(Math.cos(angle))),
        Math.max(0.4, Math.cos(tilt)),
      );
      let g = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 1, 0, 0, r);
      g.addColorStop(0, "#9394d4");
      g.addColorStop(0.35, "#252851");
      g.addColorStop(0.6, "#080b19");
      g.addColorStop(0.8, "#8d8b9c");
      g.addColorStop(1, "#262636");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, r * scale, 0, 7);
      ctx.fill();
      ctx.restore();
    }
    hits = [];
    let count = detail ? 3 : 6;
    let layers = Array.from({ length: count }, (_, i) => {
      let z = (i - (count - 1) / 2) * (explode ? 57 : 7);
      return { i, z, dep: project(0, 0, z)[2] };
    }).sort((a, b) => a.dep - b.dep);
    layers.forEach(({ i, z }) => {
      let kind = detail ? selected : i,
        bw =
          kind === 1
            ? 115
            : kind === 2
              ? 135
              : kind === 3
                ? 132
                : kind === 4
                  ? 143
                  : 165,
        bh =
          kind === 1
            ? 86
            : kind === 2
              ? 140
              : kind === 3
                ? 190
                : kind === 4
                  ? 45
                  : 305,
        y =
          kind === 1
            ? -90
            : kind === 2
              ? -65
              : kind === 3
                ? 30
                : kind === 4
                  ? 122
                  : 0;
      if (detail) {
        bw = 145;
        bh = 190;
        y = 0;
      }
      let colors = [
        "#232441",
        "#676477",
        "#164f46",
        "#35343e",
        "#245b50",
        "#aaa8b8",
      ];
      box(0, y, z, bw, bh, 7, colors[kind]);
      if (kind === 0) {
        for (let n = 0; n < 7; n++)
          box(
            0,
            y - 100 + n * 30,
            z + 1,
            140,
            22,
            1,
            `hsl(${240 + n * 6} 85% ${40 + n * 5}%)`,
          );
      }
      if (kind === 1) {
        ring(-28, y - 15, z + 3, 23);
        ring(28, y - 15, z + 3, 23);
        ring(0, y + 25, z + 3, 18);
      }
      if (kind === 2 || kind === 4) {
        for (let n = 0; n < 14; n++) {
          let x = -50 + (n % 4) * 32,
            yy = y - 35 + Math.floor(n / 4) * 25;
          box(x, yy, z + 2, 17, 14, 2, n % 3 ? "#b4a885" : "#292b35");
        }
        box(0, y, z + 5, 48, 48, 4, "#20212b");
      }
      if (kind === 3) {
        let p = project(0, y, z + 2);
        ctx.fillStyle = "#bebdc9";
        ctx.font = "11px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PEEK Li-ion", p[0], p[1]);
        ctx.fillText("ILLUSTRATIVE CELL", p[0], p[1] + 18);
      }
      if (kind === 5) {
        for (let r = 30; r < 63; r += 5) {
          let p = project(0, 20, z + 1);
          ctx.strokeStyle = "#d2bc8f";
          ctx.beginPath();
          ctx.ellipse(
            p[0],
            p[1],
            r * scale * Math.max(0.2, Math.abs(Math.cos(angle))),
            r * scale * 0.85,
            0,
            0,
            7,
          );
          ctx.stroke();
        }
      }
      let p = project(bw / 2, y, z);
      hits.push({ x: p[0], y: p[1], i });
      ctx.strokeStyle = "#7774bb";
      ctx.beginPath();
      ctx.moveTo(p[0], p[1]);
      ctx.lineTo(p[0] + 24, p[1] - 12);
      ctx.lineTo(p[0] + 64, p[1] - 12);
      ctx.stroke();
      ctx.textAlign = "left";
      ctx.font = (i === selected ? "bold " : "") + "10px Arial";
      ctx.fillStyle = "#353351";
      ctx.fillText(
        detail ? subs[selected][i] : names[i],
        Math.min(w - 105, p[0] + 28),
        p[1] - 17,
      );
    });
    frame = requestAnimationFrame(draw);
  }
  draw();
}
let choices = [0, 1];
const values = [
  ["Concept display · unverified", "6.8-inch Dynamic AMOLED 2X · 120 Hz"],
  ["Reference camera layout · unverified", "200 MP + 12 MP + 10 MP + 10 MP"],
  ["Not verified", "Snapdragon 8 Gen 2 for Galaxy"],
  ["Not verified", "12 GB / 512 GB · selected variant"],
  ["Not verified", "5,000 mAh typical"],
  ["Concept USB-C assembly", "USB-C · up to 45 W wired"],
  ["Reference concept enclosure", "Gorilla Glass Victus 2 / Armor Aluminum"],
  ["8.8 / 10 · simulated", "8.6 / 10 · simulated"],
];
function deviceCard(i) {
  return `<article class="device-card"><div id="preview${i}"><div class="mini-phone"></div></div><div><span class="overline">DEVICE ${i + 1}</span><select aria-label="Device ${i + 1}" onchange="choices[${i}]=+this.value;updateTable()">${options(choices[i])}</select>${upload("preview" + i)}</div></article>`;
}
function comparison() {
  $("#main").innerHTML =
    intro(
      "Side by side",
      "Find your <em>better fit.</em>",
      "A component-by-component look at two illustrative devices.",
    ) +
    `<section class="content"><div class="two">${deviceCard(0)}${deviceCard(1)}</div><p class="note">Uploads are local previews. Select sample models manually. iPhone 18 uses your supplied concept reference; its specifications are unverified. Samsung specifications describe the selected variant. Scores are simulated.</p><div class="table-wrap" id="compare-table"></div></section>`;
  updateTable();
}
function updateTable() {
  $("#compare-table").innerHTML =
    `<table><thead><tr><th>Component</th><th>${devices[choices[0]]}</th><th>${devices[choices[1]]}</th></tr></thead><tbody>${["Display", "Camera", "Processor", "Memory / storage", "Battery", "Charging", "Construction", "Overall demo rating"].map((n, i) => `<tr><td>${n}</td><td class="${i === 7 ? "rating" : ""}">${values[i][choices[0]]}</td><td class="${i === 7 ? "rating" : ""}">${values[i][choices[1]]}</td></tr>`).join("")}</tbody></table><p class="note">Overall ratings are illustrative scores, not measured benchmarks. Samsung specifications: <a href="https://www.samsung.com/ph/smartphones/galaxy-s/galaxy-s23-ultra-phantom-black-512gb-sm-s918bzkqphl/" target="_blank" rel="noopener">Samsung product specifications ↗</a>.</p>`;
}
function performancePage() {
  $("#main").innerHTML =
    intro(
      "Built for your everyday",
      "Your apps. <em>Understood.</em>",
      "Explore how different device tiers could handle the things you love.",
    ) +
    `<section class="content"><div class="toolbar"><strong>Performance sandbox</strong><select id="perf-model" aria-label="Performance device" onchange="apps()">${options(model)}</select><select id="quality" aria-label="Workload" onchange="apps()"><option value="1">Balanced workload</option><option value="0.72">Demanding workload</option></select></div><p class="note">Simulated estimates for the selected demo. iPhone 18 results are concept placeholders. Not measured app benchmarks. Actual results vary with settings, temperature and software.</p><div class="apps" id="apps"></div></section>`;
  apps();
}
function apps() {
  let m = +$("#perf-model").value,
    q = +$("#quality").value;
  $("#apps").innerHTML = [
    "CapCut",
    "PUBG Mobile",
    "Genshin Impact",
    "Adobe Lightroom",
    "YouTube",
    "Call of Duty Mobile",
  ]
    .map((n, i) => {
      let score = Math.round(([91, 94, 82, 87, 99, 92][i] - m * 3) * q);
      return `<article class="app-card"><span class="app-icon">${["✂", "P", "G", "Lr", "▶", "C"][i]}</span><h3>${n}</h3><p>${["Video editing & export", "Competitive gaming", "Open-world gaming", "Photo processing", "Video streaming", "Action gaming"][i]}</p><div class="metric"><span>Simulated suitability</span><b>${score}/100</b></div><div class="bar"><i style="width:${score}%"></i></div><p class="note">${score > 80 ? "Comfortable for this workload" : score > 60 ? "Good fit with adjusted settings" : "Lighter settings suggested"}</p></article>`;
    })
    .join("");
}
function about() {
  $("#main").innerHTML =
    intro(
      "Meet PEEK",
      "Technology, <em>opened up.</em>",
      "Explore Technology inside out.",
    ) +
    `<section class="content"><article class="about-hero"><span class="eyebrow">Curiosity starts here</span><h2>Every device has a story inside.</h2><p>PEEK is a device exploration and comparison concept that brings specifications, internal components and everyday performance into one place. Our vision is to let you look inside technology, rotate its modules in 3D and explore the smaller parts that make each module work.</p><p>For students, curious buyers and shopkeepers, PEEK aims to make complex technology easier to understand. Our vision extends across device categories, with free access at the heart of the experience.</p></article><div class="about-grid"><article><h3>Explore</h3><p>Understand how assemblies and subcomponents fit together through interactive visual explanations.</p></article><article><h3>Compare</h3><p>Look beyond a headline specification to compare the details that shape your experience.</p></article><article><h3>Understand</h3><p>Connect hardware capabilities with the apps, games and creative work you care about.</p></article></div><p class="note">Prototype scope: this website uses illustrative models and simulated data. Image identification, verified device catalogs, prices and manufacturer-specific geometry are not connected yet.</p></section>`;
}
async function startDemo() {
  if ((location.hash || "#home") !== "#home") {
    location.hash = "home";
    await new Promise((r) => setTimeout(r, 100));
  }
  if ($(".demo-caption")) return;
  let token = scene,
    s = $(".stage"),
    caption = document.createElement("div");
  caption.className = "demo-caption";
  s.append(caption);
  auto = true;
  explode = true;
  const steps = [
    ["Start with a sample device.", () => {}, 1800],
    [
      "Look inside. Rotate every assembly.",
      () => s.classList.add("demo-out"),
      4000,
    ],
    [
      "Choose a module to discover more.",
      () => {
        s.classList.remove("demo-out");
        selectPart(1);
      },
      2200,
    ],
    [
      "Explore the lens, sensor and stabilizer.",
      () => {
        detail = true;
        selectPart(1);
      },
      3500,
    ],
  ];
  for (let [text, fn, time] of steps) {
    if (scene !== token) return;
    caption.textContent = text;
    fn();
    await new Promise((r) => setTimeout(r, time));
  }
  if (scene === token) {
    caption.remove();
    detail = false;
    selectPart(0);
  }
}
window.addEventListener("hashchange", route);
route();
