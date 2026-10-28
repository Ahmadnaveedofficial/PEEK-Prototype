// Specifications are sample profiles. Scores reproduce the user's illustrative ratings.
const specGroups = [
  [
    "Overview",
    "Release, size and materials at a glance.",
    [
      ["Release date", "2023-02"],
      ["Operating system at launch", "Android 13, One UI 5.1"],
      ["Dimensions", "163.4 × 78.1 × 8.9 mm"],
      ["Weight", "234 g · varies slightly by market"],
      ["Build materials", "Gorilla Glass Victus 2, Armor Aluminum frame"],
    ],
  ],
  [
    "Processor & Graphics",
    "The compute platform behind the device.",
    [
      ["Processor", "Snapdragon 8 Gen 2 for Galaxy"],
      ["CPU", "Octa-core · up to 3.36 GHz"],
      ["Graphics", "Not available"],
      ["Performance data", "Illustrative score; no benchmark has been run"],
    ],
  ],
  [
    "Memory & Storage",
    "Selected sample configuration.",
    [
      ["Memory", "12 GB"],
      ["Storage", "512 GB · selected sample"],
      ["Other storage variants", "256 GB / 1 TB"],
      ["Available space", "Varies with installed software"],
    ],
  ],
  [
    "Display",
    "Panel, resolution and refresh rate.",
    [
      ["Panel", "Dynamic AMOLED 2X"],
      ["Size", "6.8 inches"],
      ["Resolution", "3088 × 1440"],
      ["Maximum refresh rate", "120 Hz"],
      ["S Pen support", "Yes"],
    ],
  ],
  [
    "Camera",
    "Imaging modules in the sample device.",
    [
      ["Rear cameras", "200 MP + 12 MP + 10 MP + 10 MP"],
      ["Front camera", "12 MP"],
      ["Optical zoom", "3× and 10×"],
      ["Optical stabilization", "Yes"],
      ["Video recording", "Up to 8K at 30 fps"],
    ],
  ],
  [
    "Battery & Charging",
    "Energy storage and charging connections.",
    [
      ["Battery capacity", "5,000 mAh · typical"],
      ["Charging connector", "USB-C"],
      ["Wired charging", "Up to 45 W · compatible charger required"],
      ["Wireless charging", "Supported"],
      ["Removable battery", "No"],
    ],
  ],
  [
    "Connectivity",
    "Wired and wireless connections.",
    [
      ["Mobile network", "5G · bands vary by market"],
      ["Wi-Fi", "802.11 a/b/g/n/ac/ax · 2.4 / 5 / 6 GHz"],
      ["Bluetooth", "5.3"],
      ["NFC / UWB", "Supported"],
      ["USB", "USB-C · USB 3.2 Gen 1"],
    ],
  ],
  [
    "Audio & Sensors",
    "Audio playback and device sensing.",
    [
      ["Speakers", "Stereo"],
      ["Audio connector", "USB-C"],
      ["Sensors", "Accelerometer, barometer, gyro, proximity and light"],
      ["Biometrics", "Fingerprint sensor"],
      ["Other sensors", "Geomagnetic and Hall sensors"],
    ],
  ],
  [
    "Software",
    "Launch software and profile notes.",
    [
      ["Operating system at launch", "Android 13"],
      ["Interface at launch", "One UI 5.1"],
      [
        "Installed software version",
        "Not available · depends on device updates",
      ],
      ["Samsung DeX", "Supported"],
      ["Profile", "Sample device specifications"],
    ],
  ],
];

const sampleRatings = [
  [
    "Overall",
    8.6,
    "Weighted prototype score across rated categories (illustrative).",
  ],
  ["Camera", 9.2, "Sample score for overall camera capability."],
  ["Battery", 8.6, "Sample score for endurance and battery size."],
  ["Display", 9.4, "Sample score for sharpness, brightness and smoothness."],
  ["Processor", 9, "Sample score for everyday speed and heavy-task headroom."],
];
const panelEscape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function ratingRows(rows) {
  return rows
    .map(
      ([name, value, note]) =>
        `<div class="spec-rating"><div><span>${name}</span><b>${value.toFixed(1)}/10 · ${value >= 9 ? "Excellent" : "Great"}</b></div><div class="spec-rating-track" role="meter" aria-label="${name} illustrative rating" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${value}"><i style="width:${value * 10}%"></i></div><small>${note}</small></div>`,
    )
    .join("");
}
function mountDeviceInformation() {
  document
    .querySelector("#main")
    .insertAdjacentHTML(
      "beforeend",
      `<section class="device-information" aria-labelledby="device-information-title"><div class="info-title-line"><h2 id="device-information-title">Device information</h2><span>Samsung Galaxy S23 Ultra</span></div><div class="info-chips"><span>Sample specifications</span><span>Illustrative ratings</span><span>Unknown = Not available</span></div><div class="spec-tabs" role="tablist" aria-label="Device specification categories">${specGroups.map(([title], i) => `<button role="tab" id="spec-tab-${i}" aria-selected="${i === 0}" aria-controls="spec-content" tabindex="${i === 0 ? 0 : -1}" data-spec-tab="${i}">${title}</button>`).join("")}</div><article id="spec-content" class="spec-content" role="tabpanel" aria-labelledby="spec-tab-0" tabindex="0"></article><p class="spec-profile-note">Specifications describe a sample configuration; availability varies by market. Ratings are prototype values, not measured benchmarks. <a href="https://www.samsung.com/africa_en/smartphones/galaxy-s/galaxy-s23-ultra-green-256gb-sm-s918bzgcafc/" target="_blank" rel="noopener">Samsung specifications ↗</a></p></section>`,
    );
  const tabs = [...document.querySelectorAll("[data-spec-tab]")];
  const select = (i) => {
    tabs.forEach((t, j) => {
      t.setAttribute("aria-selected", String(i === j));
      t.tabIndex = i === j ? 0 : -1;
    });
    const [title, description, rows] = specGroups[i],
      content = document.querySelector("#spec-content");
    content.setAttribute("aria-labelledby", "spec-tab-" + i);
    content.innerHTML = `<h3>${title}</h3><p>${description}</p><dl class="spec-data">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>${i === 0 ? ratingRows(sampleRatings) : ratingRows(sampleRatings.filter(([n]) => title.includes(n) || (i === 1 && n === "Processor")))} `;
  };
  tabs.forEach((tab, i) => {
    tab.onclick = () => select(i);
    tab.onkeydown = (e) => {
      let j;
      if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === "Home") j = 0;
      else if (e.key === "End") j = tabs.length - 1;
      else return;
      e.preventDefault();
      select(j);
      tabs[j].focus();
      tabs[j].scrollIntoView({ block: "nearest", inline: "nearest" });
    };
  });
  select(0);
}
const comparisonCatalog = [
  {
    id: "iphone18",
    name: "Apple iPhone 18 (concept)",
    note: "Concept profile · specifications unverified",
    color: "#b64c8d",
    values: [
      "Concept display · unverified",
      "Reference layout · unverified",
      "Not available",
      "Not available",
      "Not available",
      "Concept USB-C module",
      "Reference enclosure · unverified",
    ],
    score: 8.8,
  },
  {
    id: "s23",
    name: "Samsung Galaxy S23 Ultra",
    note: "Sample profile · 12 GB / 512 GB",
    color: "#80b0a0",
    values: [
      "6.8-inch Dynamic AMOLED 2X · 120 Hz",
      "200 MP + 12 MP + 10 MP + 10 MP",
      "Snapdragon 8 Gen 2 for Galaxy",
      "12 GB / 512 GB",
      "5,000 mAh typical",
      "USB-C · up to 45 W wired",
      "Gorilla Glass Victus 2 / Armor Aluminum",
    ],
    score: 8.6,
  },
  {
    id: "infinix",
    name: "Infinix Note 40 Pro",
    note: "Catalog entry · specifications not added",
    color: "#c3a46a",
    values: Array(7).fill("Not available"),
    score: null,
  },
  {
    id: "aster",
    name: "Aster Aurora 5 Pro",
    note: "Fictional demo device",
    color: "#7376df",
    values: Array(7).fill("Not available"),
    score: null,
  },
  {
    id: "nimbus",
    name: "Nimbus Zen 3",
    note: "Fictional demo device",
    color: "#7e8a92",
    values: Array(7).fill("Not available"),
    score: null,
  },
];
let selectedComparison = [null, null];
comparison = function () {
  document.body.classList.remove("studio-page");
  document.querySelector("#main").innerHTML =
    `<section class="comparison-heading"><div><span class="eyebrow">SIDE BY SIDE</span><h1>Find your <em>better fit.</em></h1><p>Pick two sample devices, then compare their specifications and illustrative ratings.</p></div><span class="comparison-prototype"><i></i> Interactive concept prototype</span></section><section class="comparison-workspace"><div class="device-picker-grid">${[0, 1].map((i) => `<article class="device-picker"><h2>Device ${i === 0 ? "A" : "B"}</h2><label class="sr-only" for="compare-search-${i}">Search Device ${i === 0 ? "A" : "B"}</label><input id="compare-search-${i}" type="search" placeholder="Search smartphones…" autocomplete="off"><div class="device-picker-list" id="device-picker-list-${i}" aria-live="polite"></div><div class="picker-selected" id="picker-selected-${i}"></div></article>`).join("")}</div><div id="new-comparison-results" class="new-comparison-results" aria-live="polite"></div><p class="comparison-data-note">Unknown specifications stay unavailable. iPhone 18 is a concept profile; Aster and Nimbus are fictional samples. Ratings are illustrative.</p></section>`;
  [0, 1].forEach((i) => {
    const input = document.querySelector("#compare-search-" + i);
    input.oninput = () => renderDevicePicker(i, input.value);
    renderDevicePicker(i, "");
  });
  renderComparisonResults();
};
function renderDevicePicker(i, term) {
  const matches = comparisonCatalog.filter((d) =>
    d.name.toLowerCase().includes(term.toLowerCase().trim()),
  );
  document.querySelector("#device-picker-list-" + i).innerHTML = matches.length
    ? matches
        .map(
          (d) =>
            `<button class="picker-device ${selectedComparison[i] === d.id ? "selected" : ""}" data-id="${d.id}" aria-pressed="${selectedComparison[i] === d.id}"><span class="picker-phone" style="--phone-color:${d.color}"><i></i></span><span><b>${d.name}</b><small>${d.note}</small></span><span class="picker-check">${selectedComparison[i] === d.id ? "✓" : "↗"}</span></button>`,
        )
        .join("")
    : '<p class="picker-empty">No matches. Try “Samsung” or “iPhone”.</p>';
  document.querySelectorAll("#device-picker-list-" + i + " [data-id]").forEach(
    (button) =>
      (button.onclick = () => {
        selectedComparison[i] = button.dataset.id;
        renderDevicePicker(
          i,
          document.querySelector("#compare-search-" + i).value,
        );
        renderComparisonResults();
      }),
  );
  const d = comparisonCatalog.find((d) => d.id === selectedComparison[i]);
  document.querySelector("#picker-selected-" + i).innerHTML = d
    ? `<span>SELECTED DEVICE</span><strong>${d.name}</strong>${d.id === "s23" ? '<button class="picker-explore">Open 3D studio ↗</button>' : ""}`
    : "<span>Choose a device above to begin.</span>";
  const explore = document.querySelector(
    "#picker-selected-" + i + " .picker-explore",
  );
  if (explore) explore.onclick = () => startDemo();
}
function renderComparisonResults() {
  const container = document.querySelector("#new-comparison-results"),
    [a, b] = selectedComparison.map((id) =>
      comparisonCatalog.find((d) => d.id === id),
    );
  if (!a || !b) {
    container.innerHTML = `<div class="compare-empty-state"><span>⇄</span><div><h3>Your comparison starts here.</h3><p>Select ${a || b ? "one more device" : "a device in each column"} to see specifications side by side.</p></div></div>`;
    return;
  }
  const categories = [
    "Display",
    "Camera",
    "Processor",
    "Memory & storage",
    "Battery",
    "Charging",
    "Construction",
  ];
  container.innerHTML = `<div class="comparison-result-title"><div><span class="eyebrow">THE DETAILS THAT MATTER</span><h2>Your devices, side by side.</h2></div><button id="clear-comparison">Clear selection ↺</button></div><div class="comparison-table-wrap"><table><thead><tr><th>Category</th><th>${a.name}</th><th>${b.name}</th></tr></thead><tbody>${categories.map((n, i) => `<tr><th scope="row">${n}</th><td>${a.values[i]}</td><td>${b.values[i]}</td></tr>`).join("")}<tr class="comparison-overall"><th scope="row">Overall sample rating</th><td>${a.score === null ? "Not available" : a.score.toFixed(1) + " / 10"}</td><td>${b.score === null ? "Not available" : b.score.toFixed(1) + " / 10"}</td></tr></tbody></table></div><div class="comparison-result-note">${a.id === b.id ? "You selected the same device in both columns. Choose a different model to compare differences." : "Overall scores are illustrative prototype ratings, not measured benchmarks."}</div>`;
  document.querySelector("#clear-comparison").onclick = () => {
    selectedComparison = [null, null];
    [0, 1].forEach((i) =>
      renderDevicePicker(
        i,
        document.querySelector("#compare-search-" + i).value,
      ),
    );
    renderComparisonResults();
  };
}
