/* Product pages share a catalogue. The home studio remains owned by
   samsung-studio.js and is intentionally not modified here. */
(() => {
  const D = window.PEEKData,
    q = (s) => document.querySelector(s),
    e = (s) => safe(s ?? ""),
    money = (n) =>
      n === null ? "Price unavailable" : `PKR ${n.toLocaleString("en-PK")}`;
  let comparisonIds = ["s23", "note14pro"],
    differencesOnly = false,
    comparisonFilter = "",
    perfDevice = "s23",
    perfQuality = "balanced";
  let finderState = {
    appId: "pubg",
    budget: 90000,
    brand: "all",
    minRam: 0,
    sort: "fit",
    quality: "balanced",
  };
  const icon = (n) =>
    ({ compare: "⇄", performance: "↗", finder: "⌕", about: "◎" })[n];
  const link = (href, text) =>
    href
      ? `<a href="${e(href)}" target="_blank" rel="noopener noreferrer">${text} ↗</a>`
      : "<span>Not available</span>";
  const appOptions = (id) =>
    D.apps
      .map(
        (a) =>
          `<option value="${a.id}" ${a.id === id ? "selected" : ""}>${a.name}</option>`,
      )
      .join("");
  const deviceOptions = (id) =>
    D.devices
      .map(
        (d) =>
          `<option value="${d.id}" ${d.id === id ? "selected" : ""}>${d.name.startsWith(d.brand) ? "" : d.brand + " "}${d.name} · ${d.variant}</option>`,
      )
      .join("");
  function phone(d, small = false) {
    return `<span class="dis-phone ${small ? "is-small" : ""} ${d.concept ? "is-concept" : ""}" style="--device-tint:${d.color}" aria-hidden="true"><i></i><i></i><i></i><b>${d.brand === "POCO" ? "POCO" : d.brand === "Samsung" ? "SAMSUNG" : d.concept ? "CONCEPT" : "Redmi"}</b></span>`;
  }
  function heading(page, kicker, title, copy) {
    return `<section class="dis-heading"><div><span class="dis-kicker">${icon(page)} &nbsp; ${kicker}</span><h1>${title}</h1><p>${copy}</p></div><span class="dis-status"><i></i> THE PEEK DEVICE LAB</span></section>`;
  }
  const evidenceStrip = () =>
    `<div class="dis-evidence-strip"><span><i class="evidence-dot sourced"></i> Source-linked specifications</span><span><i class="evidence-dot estimated"></i> Illustrative scores</span><span><i class="evidence-dot unavailable"></i> Unknowns stay unavailable</span></div>`;
  const value = (v, suffix = "") =>
    v === null || v === undefined
      ? '<span class="dis-unavailable">Not available</span>'
      : e(v) + suffix;
  const priceNote = (d) =>
    d.price === null
      ? "No sourced PKR price in this catalogue."
      : `Approximate listing · ${d.checked} · ${link(d.priceSource, "Price source")}`;
  const sourceNote = (d) =>
    d.concept
      ? "Supplied concept reference · no manufacturer verification."
      : `${link(d.source, "Manufacturer specifications")} · Checked ${d.checked}`;
  const score = (d) => {
    const n = D.overall(d);
    return n === null
      ? '<span class="dis-unavailable">Not available</span>'
      : `<b class="dis-number">${n.toFixed(1)}<small>/10</small></b><span class="dis-label">Illustrative rating</span>`;
  };
  const sourceDetails = () =>
    `<details class="dis-method"><summary>How to read the data <span>＋</span></summary><div><p>Specifications link to manufacturer pages and describe the selected memory, storage and regional variant. Approximate PKR prices are saved seller or manufacturer listings checked on 23 October 2026; confirm price, warranty, PTA status and stock with the seller. A listing is not a live availability check.</p><p>Ratings and app suitability are transparent demonstration scenarios, not measured benchmarks or verified buying recommendations. There are no validated FPS, temperature or battery-drain tests in this catalogue. Unknown information stays unavailable. An App Store listing identifies an app; it does not verify Android compatibility.</p><p>Launch dates are labelled by geography and announcement/release status when sourced. Pakistan launch dates and current installed software are unavailable here. The iPhone 18 entry is your supplied concept reference, not a verified product profile.</p></div></details>`;

  comparison = function () {
    q("#main").innerHTML =
      `<div class="discovery-page">${heading("compare", "COMPARE / UNDERSTAND", "Two devices.<br><em>Every detail in perspective.</em>", "Compare the components, configurations and capabilities that matter to you.")}${evidenceStrip()}<section class="dis-compare-grid">${[0, 1].map((i) => `<article class="dis-panel dis-picker"><div class="dis-panel-title"><span>DEVICE ${i ? "B" : "A"}</span><button data-action="clear-device" data-slot="${i}">Clear</button></div><label class="dis-search"><span>⌕</span><input id="dis-search-${i}" type="search" placeholder="Search brand or model…" aria-label="Search Device ${i ? "B" : "A"}"></label><div id="dis-options-${i}" class="dis-options"></div><div id="dis-picked-${i}"></div><label class="dis-upload">↑ Add device photo<input type="file" accept="image/jpeg,image/png,image/webp" data-photo="${i}"><span>Local preview</span></label><div id="dis-photo-${i}" class="dis-photo"></div></article>`).join("")}<span class="dis-versus" aria-hidden="true">VS</span></section><p class="dis-muted dis-upload-copy">A photo stays in your browser. Confirm its exact model from the catalogue; automatic image recognition is not connected.</p><section id="dis-comparison-results" aria-live="polite"></section>${sourceDetails()}<div class="dis-next"><div><span class="dis-kicker">START WITH WHAT YOU DO</span><h2>Have an app and a budget in mind?</h2></div><a class="dis-button primary" href="#finder">Open Finder ↗</a></div></div>`;
    [0, 1].forEach((i) => renderPicker(i, ""));
    renderComparison();
  };
  function renderPicker(i, term) {
    const list = D.devices.filter((d) =>
      (d.brand + " " + d.name + " " + d.variant)
        .toLowerCase()
        .includes(term.toLowerCase().trim()),
    );
    q(`#dis-options-${i}`).innerHTML = list.length
      ? list
          .map(
            (d) =>
              `<button class="dis-device-option ${comparisonIds[i] === d.id ? "selected" : ""}" data-action="pick-device" data-slot="${i}" data-id="${d.id}" aria-pressed="${comparisonIds[i] === d.id}">${phone(d, true)}<span><strong>${d.brand === "Samsung" ? "Samsung " : ""}${d.name}</strong><small>${d.variant}</small></span><b>${comparisonIds[i] === d.id ? "✓" : "＋"}</b></button>`,
          )
          .join("")
      : '<p class="dis-empty-small">No matching model. Try Samsung, Redmi or POCO.</p>';
    const d = D.get(comparisonIds[i]);
    q(`#dis-picked-${i}`).innerHTML = d
      ? `<div class="dis-picked-device">${phone(d)}<div><span class="dis-kicker">${d.concept ? "CONCEPT REFERENCE" : d.brand}</span><h2>${d.name}</h2><p>${d.variant}</p><strong>${money(d.price)}</strong><small>${priceNote(d)}</small>${d.studio ? '<button data-action="studio" class="dis-text-link">Explore inside in 3D ↗</button>' : ""}</div></div>`
      : '<div class="dis-picked-empty"><span>＋</span><h3>Choose your device</h3><p>Search or select a model above.</p></div>';
  }
  const rows = [
    ["Processor", (d) => value(d.chip)],
    ["Graphics", (d) => value(d.gpu)],
    ["Memory", (d) => value(d.ram, " GB")],
    ["Storage", (d) => value(d.storage, " GB")],
    ["Display", (d) => value(d.display)],
    ["Refresh rate", (d) => value(d.hz, " Hz")],
    ["Rear cameras", (d) => value(d.camera)],
    ["Front camera", (d) => value(d.front)],
    ["Battery (typical)", (d) => value(d.battery, " mAh")],
    ["Wired charging (up to)", (d) => value(d.charging, " W")],
    ["Connectivity", (d) => value(d.network)],
    ["Construction / protection", (d) => value(d.build)],
    ["Approximate PKR price", (d) => money(d.price)],
    [
      "Launch information",
      (d) =>
        d.launch
          ? `${e(d.launch)}<br>${link(d.launchSource, "Launch source")}`
          : '<span class="dis-unavailable">Not available</span>',
    ],
    [
      "3D component coverage",
      (d) =>
        d.studio
          ? "S23 Ultra reference studio"
          : "No interactive model in this catalogue",
    ],
  ];
  function renderComparison() {
    const box = q("#dis-comparison-results");
    if (!box) return;
    const [a, b] = comparisonIds.map(D.get);
    if (!a || !b) {
      box.innerHTML =
        '<div class="dis-empty"><span>⇄</span><h2>A clearer picture starts with two.</h2><p>Select a device in each column to compare.</p></div>';
      return;
    }
    box.innerHTML = `<div class="dis-section-heading"><div><span class="dis-kicker">COMPONENT BY COMPONENT</span><h2>Look beyond the headline.</h2></div><button data-action="swap">⇄ Swap devices</button></div>${a.id === b.id ? '<p class="dis-notice">You selected the same model twice. Pick a different device to see differences.</p>' : ""}`;
  }

  performancePage = function () {
    const token = scene;
    q("#main").innerHTML =
      `<div class="discovery-page">${heading("performance", "PERFORMANCE / EVERYDAY POTENTIAL", "Your apps.<br><em>Your kind of performance.</em>", "Explore how hardware relates to the apps and games you care about.")}<form class="app-search-form dis-app-search" onsubmit="event.preventDefault();searchAppCatalog()"><span aria-hidden="true">⌕</span><input id="app-search" type="search" placeholder="Search an app — PUBG, CapCut, YouTube…" aria-label="Search apps" autocomplete="off"><button class="primary" type="submit">Search apps ↗</button></form><p class="dis-muted">Search Apple’s public app catalogue, or choose a popular app below.</p><section class="dis-panel dis-perf-controls"><div><span class="dis-kicker">01 / CHOOSE YOUR DEVICE</span><h3>Set the stage.</h3></div><label>Device & variant<select id="perf-model">${deviceOptions(perfDevice)}</select></label><label>Workload<select id="quality">${[
        ["balanced", "Balanced"],
        ["light", "Lighter workload"],
        ["demanding", "Demanding workload"],
      ]
        .map(
          ([id, name]) =>
            `<option value="${id}" ${perfQuality === id ? "selected" : ""}>${name}</option>`,
        )
        .join(
          "",
        )}</select></label></section><section id="app-search-results" aria-live="polite" hidden></section><div class="dis-section-heading"><div><span class="dis-kicker">02 / CHOOSE YOUR APP</span><h2>A good place to start.</h2></div><span class="dis-muted">PLAY / CREATE / STREAM</span></div><div id="popular-apps" class="popular-apps"><p>Loading popular apps…</p></div><section id="selected-app" class="dis-performance-result" aria-live="polite" hidden></section>${sourceDetails()}<div class="dis-next"><div><span class="dis-kicker">FIND YOUR NEXT DEVICE</span><h2>Start with an app. Stay within budget.</h2></div><a class="dis-button primary" href="#finder">Try Finder ↗</a></div></div>`;
    fetch("app-catalog.json")
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then((data) => {
        appCatalog = data;
        if (scene !== token) return;
        renderPopular();
        if (pickedApp) refreshSelectedApp();
      })
      .catch(() => {
        if (scene === token)
          q("#popular-apps").innerHTML =
            "<p>App suggestions could not load. Refresh to retry.</p>";
      });
  };
  refreshSelectedApp = function () {
    const box = q("#selected-app");
    if (!pickedApp || !box) return;
    const d = D.get(q("#perf-model").value),
      profile = D.apps.find((a) => a.catalogId === pickedApp.id),
      quality = q("#quality").value;
    const fit = D.suitability(d, profile, quality);
    box.hidden = false;
    box.innerHTML = `<div class="dis-section-heading"><div class="dis-selected-app"><img src="${e(pickedApp.icon)}" alt="${e(pickedApp.name)} icon"><div><span class="dis-kicker">YOUR APP / YOUR DEVICE</span><h2>${e(pickedApp.name)}</h2><p>${e(d.name)} · ${e(d.variant)}</p></div></div><button data-action="close-app" aria-label="Close app details">×</button></div>${
      fit === null
        ? `<div class="dis-empty-small"><h3>No performance profile yet.</h3><p>${d.concept ? "This concept device has no verified hardware specification." : "This app has no included workload scenario. Choose a popular app to explore a demonstration."}</p></div>`
        : `<div class="dis-perf-result-grid"><article class="dis-fit-hero"><span class="dis-kicker">ILLUSTRATIVE SUITABILITY</span><strong>${fit}<small>/100</small></strong><div class="dis-meter"><i style="width:${fit}%"></i></div><h3>${fit >= 80 ? "More headroom in this scenario" : fit >= 60 ? "Balanced scenario fit" : "Lighter settings in this scenario"}</h3><p>${profile.guidance}</p><span class="dis-chip amber">DEMONSTRATION · NOT A BENCHMARK</span></article><div class="dis-evidence-grid">${[
            [
              "Frame rate",
              "Insufficient data",
              "No exact-model game test is linked.",
            ],
            [
              "Heat",
              "Not measured",
              "Temperature needs a controlled device test.",
            ],
            [
              "Battery drain",
              "Not measured",
              "Capacity alone cannot establish app drain.",
            ],
            [
              "Hardware context",
              d.chip || "Not available",
              `${d.ram} GB RAM · ${d.battery.toLocaleString()} mAh typical`,
            ],
          ]
            .map(
              ([title, v, note]) =>
                `<article><span>${title}</span><h3>${e(v)}</h3><p>${e(note)}</p></article>`,
            )
            .join(
              "",
            )}</div></div><p class="dis-muted dis-score-note">This scenario combines a sample hardware profile with app workload and selected settings. It does not predict FPS, thermals or battery consumption. App versions, OS, region and sustained use can change results.</p>`
    }<div class="dis-source-columns"><p>${link(pickedApp.url, "Official app listing")}<br>Listing does not verify performance or Android compatibility.</p><p>${sourceNote(d)}</p></div>${profile ? `<button class="dis-button" data-action="find-for-app" data-id="${profile.id}">Find devices for this app ↗</button>` : ""}`;
  };

  function finder() {
    q("#main").innerHTML =
      `<div class="discovery-page">${heading("finder", "FINDER / MADE FOR YOUR NEEDS", "The right device.<br><em>For what you love doing.</em>", "Choose an app, set your budget, and explore a shortlist with reasons behind every match.")}<div class="dis-finder-layout"><aside class="dis-panel dis-finder-form"><div class="dis-panel-title"><span>BUILD YOUR SHORTLIST</span><span>01 / 03</span></div><form id="finder-form"><label>Your app or game<select name="appId" id="finder-app">${appOptions(finderState.appId)}</select></label><label>Maximum budget <span>PKR</span><input id="finder-budget" name="budget" type="number" min="1" max="2000000" step="1" required value="${finderState.budget}" inputmode="numeric"></label><div class="dis-budget-presets">${[40000, 65000, 90000, 150000].map((n) => `<button type="button" data-action="budget-preset" data-budget="${n}">${n / 1000}k</button>`).join("")}</div><label>Preferred brand<select name="brand" id="finder-brand"><option value="all">All brands</option>${["Samsung", "Xiaomi", "POCO"].map((b) => `<option ${finderState.brand === b ? "selected" : ""}>${b}</option>`).join("")}</select></label><div class="dis-form-pair"><label>Minimum RAM<select name="minRam"><option value="0">Any</option>${[8, 12].map((n) => `<option value="${n}" ${finderState.minRam === n ? "selected" : ""}>${n} GB</option>`).join("")}</select></label><label>Workload<select name="quality">${[
        ["light", "Lighter"],
        ["balanced", "Balanced"],
        ["demanding", "Demanding"],
      ]
        .map(
          ([id, n]) =>
            `<option value="${id}" ${finderState.quality === id ? "selected" : ""}>${n}</option>`,
        )
        .join(
          "",
        )}</select></label></div><button type="submit" class="primary dis-find-submit">Find my device <span>↗</span></button><button type="button" class="dis-reset" data-action="reset-finder">Reset filters</button></form><div class="dis-finder-note"><span>⌕</span><p>Browse a small, source-linked catalogue. Prices are approximate; app fit is an illustrative scenario.</p></div></aside><section class="dis-finder-results"><div class="dis-section-heading"><div><span class="dis-kicker">02 / YOUR POSSIBILITIES</span><h2 id="finder-count">Your shortlist</h2></div><label class="dis-sort">Sort by<select id="finder-sort"><option value="fit" ${finderState.sort === "fit" ? "selected" : ""}>Scenario fit</option><option value="price" ${finderState.sort === "price" ? "selected" : ""}>Lowest price</option></select></label></div><div id="finder-summary" class="dis-filter-summary"></div><div id="finder-results" aria-live="polite"></div></section></div>${sourceDetails()}<section class="dis-panel dis-finder-how"><span class="dis-kicker">03 / MAKE IT YOURS</span><h2>A shortlist, with context.</h2><div>${[
        [
          "01",
          "Start with the task",
          "The selected app defines the workload scenario.",
        ],
        [
          "02",
          "Respect the budget",
          "Only profiles with a sourced PKR price inside your limit are shown.",
        ],
        [
          "03",
          "Look a little closer",
          "Compare the exact variants and confirm current prices before deciding.",
        ],
      ]
        .map(
          ([n, t, p]) =>
            `<article><b>${n}</b><h3>${t}</h3><p>${p}</p></article>`,
        )
        .join("")}</div></section></div>`;
    renderFinder();
  }
  function renderFinder() {
    if (!q("#finder-results")) return;
    const app = D.apps.find((a) => a.id === finderState.appId),
      matches = D.find(finderState);
    q("#finder-count").textContent =
      `${matches.length} device${matches.length === 1 ? "" : "s"} within your budget`;
    q("#finder-summary").innerHTML =
      `<span>${e(app.name)}</span><span>Up to ${money(finderState.budget)}</span><span>${finderState.quality} workload</span>`;
    q("#finder-results").innerHTML = matches.length
      ? matches
          .map(
            (d, i) =>
              `<article class="dis-panel dis-match"><div class="dis-match-visual">${phone(d)}<span>${String(i + 1).padStart(2, "0")}</span></div><div class="dis-match-body"><div class="dis-match-top"><div><span class="dis-kicker">${e(d.brand)}</span><h3>${e(d.name)}</h3><p>${e(d.variant)}</p></div><div class="dis-fit-number"><b>${d.fit}<small>/100</small></b><span>Scenario fit</span></div></div><div class="dis-match-specs"><span>${e(d.chip)}</span><span>${d.ram} GB RAM</span><span>${d.battery.toLocaleString()} mAh</span><span>${d.hz} Hz</span></div><p class="dis-match-reason">${finderReason(d, app)} ${money(finderState.budget - d.price)} below your budget.</p><div class="dis-match-bottom"><div><strong>≈ ${money(d.price)}</strong><small>Listing checked ${d.checked} · ${link(d.priceSource, "Source")}</small></div><div><button data-action="compare-match" data-id="${d.id}">Compare ↗</button><button data-action="performance-match" data-id="${d.id}">App details ↗</button></div></div><p class="dis-match-evidence">Illustrative fit, not measured app performance. ${link(d.source, "Hardware source")}</p></div></article>`,
          )
          .join("")
      : `<div class="dis-empty"><span>⌕</span><h2>No exact matches yet.</h2><p>Try a higher budget, another brand or a lower RAM requirement. Devices without sourced prices are excluded.</p><button data-action="reset-finder">Reset filters ↺</button></div>`;
  }
  function finderReason(d, app) {
    return app.kind === "gaming"
      ? `${d.chip} and a ${d.hz} Hz display contribute to this gaming scenario.`
      : app.kind === "creation"
        ? `${d.ram} GB RAM and ${d.storage} GB storage provide context for your editing workflow.`
        : `A ${d.display} display and ${d.battery.toLocaleString()} mAh battery contribute to this streaming scenario.`;
  }

  about = function () {
    q("#main").innerHTML =
      `<div class="discovery-page">${heading("about", "ABOUT / A CLOSER LOOK", "Understand the technology.<br><em>Choose with confidence.</em>", "PEEK brings device exploration, component explanations and guided comparisons into one experience.")}<section class="dis-about-story"><div><span class="dis-kicker">THE IDEA BEHIND PEEK</span><h2>More understanding.<br>Less searching.</h2><p>Choosing a device often means jumping between specifications, reviews and technical terms. PEEK connects those details to the things you actually want to do.</p><p>Explore the parts inside a device, compare exact configurations, and build an app-and-budget shortlist. We are starting with smartphones in Pakistan, with a wider vision for electronic-device exploration.</p><a href="#home" class="dis-button primary">Explore technology inside out ↗</a></div><div class="dis-about-orbit" aria-hidden="true"><span>PEEK</span><i>EXPLORE</i><i>COMPARE</i><i>DISCOVER</i></div></section><section class="dis-about-features">${[
        [
          "01",
          "Look inside",
          "Explore a reference device, rotate its components and discover subcomponents.",
          "#home",
        ],
        [
          "02",
          "See the difference",
          "Compare specifications and configurations side by side.",
          "#comparison",
        ],
        [
          "03",
          "Connect the dots",
          "Understand app workloads and distinguish scenarios from measured evidence.",
          "#performance",
        ],
        [
          "04",
          "Find your fit",
          "Filter a source-linked catalogue by app, budget, brand and RAM.",
          "#finder",
        ],
      ]
        .map(
          ([n, t, p, href]) =>
            `<a class="dis-panel" href="${href}"><span class="dis-kicker">${n} / DISCOVERY</span><h3>${t} ↗</h3><p>${p}</p></a>`,
        )
        .join(
          "",
        )}</section><section class="dis-panel dis-about-audience"><div><span class="dis-kicker">BUILT FOR CURIOUS MINDS</span><h2>From first-time buyers<br>to lifelong enthusiasts.</h2></div><div><span>Students</span><span>Gamers</span><span>Device buyers</span><span>Content creators</span><span>Shopkeepers</span><span>Technology enthusiasts</span></div></section><section class="dis-about-scope"><div><span class="dis-kicker">WHERE WE ARE TODAY</span><h2>A working idea.<br>A clear path forward.</h2><p>Core exploration is free, with no account required. This prototype uses a limited catalogue, a curated S23 Ultra component studio and illustrative performance scenarios.</p><p>AI image recognition, a broader verified device library and repeatable performance testing are planned. Selected photos currently stay in your browser; a photo does not automatically identify a device.</p></div><div class="dis-panel"><h3>Our approach to information</h3><ul><li>Show the exact model and regional variant.</li><li>Link specifications and dated price listings.</li><li>Separate estimates from measurements.</li><li>Leave missing evidence clearly unavailable.</li></ul></div></section><section class="dis-team"><div class="dis-section-heading"><div><span class="dis-kicker">THE PEOPLE BEHIND THE PROJECT</span><h2>Eight minds. One closer look.</h2></div></div><div class="dis-team-grid">${[
        ["Ahmad Naveed", "CEO & Team Lead"],
        ["Ahmad Zafar", "Marketing & Communications Lead"],
        ["Fiza Shahid", "Frontend Developer"],
        ["Unbreen Fatima", "HR Manager"],
        ["Saqib Imran", "Business Development Executive"],
        ["Talha Jameel", "Creative Design Lead"],
        ["Wania Shahid", "Visual Designer"],
        ["Ukasha Abid", "QA Tester"],
      ]
        .map(
          ([name, role]) =>
            `<article><span>${name
              .split(" ")
              .map((n) => n[0])
              .join("")}</span><h3>${name}</h3><p>${role}</p></article>`,
        )
        .join(
          "",
        )}</div><div class="dis-mentors"><span>Instructor <b>Aimen Fatima</b></span><span>Coach <b>Asma Abubakar</b></span><span>Department <b>Software Engineering</b></span></div></section></div>`;
  };

  function readFinder() {
    const data = new FormData(q("#finder-form"));
    finderState = {
      ...finderState,
      appId: data.get("appId"),
      budget: Number(data.get("budget")),
      brand: data.get("brand"),
      minRam: Number(data.get("minRam")),
      quality: data.get("quality"),
    };
    renderFinder();
  }
  q("#main").addEventListener("submit", (event) => {
    if (event.target.id === "finder-form") {
      event.preventDefault();
      readFinder();
    }
  });
  q("#main").addEventListener("input", (event) => {
    const t = event.target;
    if (/^dis-search-[01]$/.test(t.id))
      renderPicker(Number(t.id.slice(-1)), t.value);
    if (t.id === "dis-spec-filter") {
      const start = t.selectionStart;
      comparisonFilter = t.value;
      renderComparison();
      const input = q("#dis-spec-filter");
      input.focus();
      input.setSelectionRange(start, start);
    }
  });
  q("#main").addEventListener("change", async (event) => {
    const t = event.target;
    if (t.id === "dis-differences") {
      differencesOnly = t.checked;
      renderComparison();
    }
    if (t.id === "perf-model") {
      perfDevice = t.value;
      refreshSelectedApp();
    }
    if (t.id === "quality") {
      perfQuality = t.value;
      refreshSelectedApp();
    }
    if (t.id === "finder-sort") {
      finderState.sort = t.value;
      renderFinder();
    }
    if (t.dataset.photo !== undefined) {
      const file = t.files[0],
        box = q("#dis-photo-" + t.dataset.photo);
      if (!file) return;
      if (
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 10e6
      ) {
        toast("Choose a JPG, PNG or WebP under 10 MB.");
        t.value = "";
        return;
      }
      const url = URL.createObjectURL(file),
        img = new Image();
      img.src = url;
      try {
        await img.decode();
      } catch {
        URL.revokeObjectURL(url);
        toast("This image could not be read.");
        return;
      }
      if (!box.isConnected) {
        URL.revokeObjectURL(url);
        return;
      }
      img.alt = "Your device photo, shown locally";
      img.onload = () => URL.revokeObjectURL(url);
      box.replaceChildren(img);
      URL.revokeObjectURL(url);
      const note = document.createElement("span");
      note.textContent = "Photo ready. Confirm the exact model above.";
      box.append(note);
    }
  });
  q("#main").addEventListener("click", (event) => {
    const b = event.target.closest("[data-action]");
    if (!b) return;
    switch (b.dataset.action) {
      case "pick-device":
        comparisonIds[+b.dataset.slot] = b.dataset.id;
        renderPicker(+b.dataset.slot, q("#dis-search-" + b.dataset.slot).value);
        renderComparison();
        break;
      case "clear-device":
        comparisonIds[+b.dataset.slot] = null;
        renderPicker(+b.dataset.slot, q("#dis-search-" + b.dataset.slot).value);
        renderComparison();
        break;
      case "swap":
        comparisonIds.reverse();
        [0, 1].forEach((i) => renderPicker(i, q("#dis-search-" + i).value));
        renderComparison();
        break;
      case "studio":
        startDemo();
        break;
      case "close-app":
        pickedApp = null;
        q("#selected-app").hidden = true;
        break;
      case "budget-preset":
        q("#finder-budget").value = b.dataset.budget;
        readFinder();
        break;
      case "reset-finder":
        finderState = {
          appId: "pubg",
          budget: 90000,
          brand: "all",
          minRam: 0,
          sort: "fit",
          quality: "balanced",
        };
        finder();
        break;
      case "find-for-app":
        finderState.appId = b.dataset.id;
        finderState.quality = perfQuality;
        location.hash = "finder";
        break;
      case "compare-match":
        comparisonIds = [
          b.dataset.id,
          b.dataset.id === "s23" ? "note14" : "s23",
        ];
        location.hash = "comparison";
        break;
      case "performance-match":
        perfDevice = b.dataset.id;
        perfQuality = finderState.quality;
        {
          const app = D.apps.find((a) => a.id === finderState.appId);
          pickedApp = appCatalog.find((a) => a.id === app.catalogId) || {
            id: app.catalogId,
            name: app.name,
            icon: app.icon,
            url: "https://apps.apple.com/app/id" + app.catalogId,
          };
        }
        location.hash = "performance";
        break;
    }
  });
  const previousRoute = route;
  window.removeEventListener("hashchange", previousRoute);
  route = function () {
    const page = location.hash.slice(1) || "home";
    document.body.classList.toggle(
      "discovery-route",
      ["comparison", "performance", "finder", "about"].includes(page),
    );
    if (page === "finder") {
      cancelAnimationFrame(frame);
      scene++;
      finder();
      document
        .querySelectorAll("nav a")
        .forEach((a) => a.classList.toggle("active", a.hash === "#finder"));
      window.scrollTo(0, 0);
    } else previousRoute();
    document
      .querySelectorAll("nav a")
      .forEach((a) =>
        a.classList.contains("active")
          ? a.setAttribute("aria-current", "page")
          : a.removeAttribute("aria-current"),
      );
  };
  window.addEventListener("hashchange", route);
})();
