let appCatalog = [],
  searchSequence = 0;
const safe = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const labHome = home;
home = function () {
  labHome();
  $(".upload-hero").insertAdjacentHTML(
    "afterbegin",
    `<div class="live-background space-background" aria-hidden="true"><div class="space-haze"></div><div class="silver-planet"><span></span></div><div class="silver-moon"></div><div class="star-field"></div>${Array.from({ length: 14 }, (_, i) => `<i class="space-rock" style="--x:${(i * 37 + 3) % 100}%;--y:${(i * 23 + 8) % 94}%;--size:${8 + ((i * 7) % 23)}px;--time:${25 + i * 3}s;--delay:-${i * 4}s;--turn:${i * 29}deg"></i>`).join("")}</div>`,
  );
};
performancePage = function () {
  let token = scene;
  $("#main").innerHTML =
    `<section class="performance-intro"><div class="eyebrow">THE APP PERFORMANCE LAB</div><h1>Find your app.<br><em>Explore its potential.</em></h1><p>Search the app catalog or start with a popular pick.</p><form class="app-search-form" onsubmit="event.preventDefault();searchAppCatalog()"><span aria-hidden="true">⌕</span><input id="app-search" type="search" placeholder="Search any app — CapCut, PUBG, Instagram…" aria-label="Search apps" autocomplete="off"><button class="primary" type="submit">Search apps ↗</button></form><p class="catalog-note">Search uses Apple’s public app catalog. Availability may vary by region.</p></section><section class="content performance-content"><div class="performance-device"><div><span class="overline">YOUR DEMO DEVICE</span><strong>Set the stage.</strong></div><select id="perf-model" aria-label="Performance device" onchange="model=+this.value;refreshSelectedApp()">${options(model)}</select><select id="quality" aria-label="Workload" onchange="refreshSelectedApp()"><option value="1">Balanced workload</option><option value="0.72">Demanding workload</option></select><span class="simulation-pill">SIMULATED ESTIMATES</span></div><section id="app-search-results" aria-live="polite" hidden></section><section id="selected-app" hidden></section><div class="popular-heading"><div><span class="eyebrow">A GOOD PLACE TO START</span><h2>Popular apps</h2></div><span>CREATE · PLAY · STREAM</span></div><div class="popular-apps" id="popular-apps"><p>Loading app icons…</p></div><p class="note">App icons and names come from their App Store listings. Performance scores are demonstration values, not measured benchmarks. iPhone 18 uses a concept profile.</p></section>`;
  fetch("app-catalog.json")
    .then((r) => {
      if (!r.ok) throw Error();
      return r.json();
    })
    .then((data) => {
      appCatalog = data;
      if (token === scene) renderPopular();
    })
    .catch(() => {
      if (token === scene)
        $("#popular-apps").innerHTML =
          "<p>App suggestions could not load. Please refresh to try again.</p>";
    });
};
let pickedApp = null;
function appCard(app, i, source) {
  return `<button class="popular-app" onclick="chooseApp(${i},'${source}')"><img src="${safe(app.icon)}" alt="${safe(app.name)} app icon" loading="lazy" onerror="this.style.visibility='hidden'"><span class="app-card-copy"><strong>${safe(app.name)}</strong><small>${safe(app.genre || "App")}</small></span><span class="app-open">↗</span></button>`;
}
function renderPopular() {
  $("#popular-apps").innerHTML = appCatalog
    .map((a, i) => appCard(a, i, "popular"))
    .join("");
}
let foundApps = [];
function chooseApp(i, source) {
  pickedApp = (source === "popular" ? appCatalog : foundApps)[i];
  refreshSelectedApp();
  $("#selected-app").scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
    block: "center",
  });
}
function refreshSelectedApp() {
  if (!pickedApp || !$("#selected-app")) return;
  let a = pickedApp,
    known = appCatalog.findIndex((x) => x.id === a.id),
    m = +$("#perf-model").value,
    q = +$("#quality").value,
    score = Math.round((88 + (known % 4) * 2 - m * 3) * q),
    el = $("#selected-app");
  el.hidden = false;
  el.innerHTML = `<div class="selected-app-heading"><img src="${safe(a.icon)}" alt="${safe(a.name)} icon"><div><span class="eyebrow">${known < 0 ? "APP DISCOVERED" : "DEMO PERFORMANCE PROFILE"}</span><h2>${safe(a.name)}</h2><p>${safe(a.publisher || "")} · ${safe(a.genre || "App")}</p></div><button onclick="pickedApp=null;document.getElementById('selected-app').hidden=true" aria-label="Close app details">×</button></div>${known >= 0 ? `<div class="demo-metrics"><div><span>Illustrative suitability</span><strong>${score}<small>/100</small></strong></div><div><span>Selected demo</span><b>${safe(devices[m])}</b></div><div><span>Workload</span><b>${q === 1 ? "Balanced" : "Demanding"}</b></div></div><div class="bar"><i style="width:${score}%"></i></div><p class="note">Simulation only. This score is not measured app performance or a verified compatibility result.</p>` : "<p>This app is available in the catalog, but a performance profile is not available in this prototype yet.</p>"}<a class="official-app-link" href="${safe(a.url)}" target="_blank" rel="noopener">View official app listing ↗</a>`;
}
async function searchAppCatalog() {
  let term = $("#app-search").value.trim(),
    container = $("#app-search-results");
  if (!term) {
    container.hidden = true;
    return;
  }
  let request = ++searchSequence,
    token = scene;
  container.hidden = false;
  container.innerHTML =
    '<p class="search-status"><span class="search-spinner"></span> Searching the app catalog…</p>';
  let local = appCatalog.filter((a) =>
    a.name.toLowerCase().includes(term.toLowerCase()),
  );
  try {
    let results = await appSearchRequest(term);
    if (request !== searchSequence || scene !== token) return;
    foundApps = results.map((r) => ({
      id: r.trackId,
      name: r.trackName,
      icon: r.artworkUrl100,
      publisher: r.sellerName,
      url: r.trackViewUrl,
      genre: r.primaryGenreName,
    }));
    displaySearch(term, false);
  } catch (e) {
    if (request !== searchSequence || scene !== token) return;
    foundApps = local;
    displaySearch(term, true);
  }
}
function displaySearch(term, offline) {
  let el = $("#app-search-results");
  el.innerHTML = `<div class="results-title"><h2>Results for “${safe(term)}”</h2><span>${foundApps.length} ${offline ? "local matches" : "apps"}</span></div>${offline ? '<p class="note">The live catalog is unavailable. Showing matches from the included demo apps.</p>' : ""}${foundApps.length ? `<div class="popular-apps">${foundApps.map((a, i) => appCard(a, i, "search")).join("")}</div>` : "<p>No matching apps found. Try a different name or choose a popular app below.</p>"}`;
}
function appSearchRequest(term) {
  return new Promise((resolve, reject) => {
    let name =
        "peekAppSearch_" +
        Date.now() +
        "_" +
        Math.random().toString(36).slice(2),
      script = document.createElement("script"),
      timer;
    function cleanup() {
      clearTimeout(timer);
      script.remove();
      delete window[name];
    }
    window[name] = (data) => {
      cleanup();
      resolve(
        (data.results || []).filter(
          (r) => r.trackName && r.artworkUrl100 && r.trackViewUrl,
        ),
      );
    };
    script.onerror = () => {
      cleanup();
      reject(Error("Catalog unavailable"));
    };
    timer = setTimeout(() => {
      cleanup();
      reject(Error("Catalog timeout"));
    }, 12000);
    script.src =
      "https://itunes.apple.com/search?entity=software&country=us&limit=12&term=" +
      encodeURIComponent(term) +
      "&callback=" +
      name;
    document.head.append(script);
  });
}
route();
