performancePage = function () {
  const token = scene;
  $("#main").innerHTML =
    `<section class="performance-intro"><div class="eyebrow">THE APP PERFORMANCE LAB</div><h1>Find your app.<br><em>Explore its potential.</em></h1><p>Search the app catalog or start with a popular pick.</p><form class="app-search-form" role="search" onsubmit="event.preventDefault();searchAppCatalog()"><span aria-hidden="true">⌕</span><input id="app-search" type="search" placeholder="Search any app — CapCut, PUBG, Instagram…" aria-label="Search apps" autocomplete="off"><button class="primary" type="submit">Search apps ↗</button></form><p class="catalog-note">Search uses Apple’s public app catalog. Availability may vary by region.</p></section><section class="content performance-content"><div class="performance-device"></div><section id="app-search-results" aria-live="polite" hidden></section><section id="selected-app" aria-live="polite" hidden></section><div class="popular-heading"><div><span class="eyebrow">A GOOD PLACE TO START</span><h2>Popular apps</h2></div><span>CREATE · PLAY · STREAM</span></div><div class="popular-apps" id="popular-apps" aria-busy="true"><p class="search-status"><span class="search-spinner"></span> Loading apps…</p></div><p class="note"></p></section>`;
  loadPopular(token);
};
function loadPopular(token) {
  fetch("app-catalog.json")
    .then((r) => {
      if (!r.ok) throw Error(r.status);
      return r.json();
    })
    .then((data) => {
      appCatalog = data;
      if (token !== scene) return;
      const el = $("#popular-apps");
      el.setAttribute("aria-busy", "false");
      el.innerHTML = appCatalog
        .map((a, i) => appCard(a, i, "popular"))
        .join("");
      if (pickedApp) refreshSelectedApp();
    })
    .catch(() => {
      if (token !== scene) return;
      const el = $("#popular-apps");
      el.setAttribute("aria-busy", "false");
      el.innerHTML =
        '<div class="state-inline" role="alert"><p>Popular apps could not load.</p><button class="primary" onclick="retryPopular()">Try again</button></div>';
    });
}
function retryPopular() {
  const el = $("#popular-apps");
  el.setAttribute("aria-busy", "true");
  el.innerHTML =
    '<p class="search-status"><span class="search-spinner"></span> Loading apps…</p>';
  loadPopular(scene);
}
function appCard(app, i, source) {
  const ic = app.icon
    ? `<img src="${safe(app.icon)}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">`
    : `<span class="app-letter" aria-hidden="true">${safe(app.name[0])}</span>`;
  return `<button class="popular-app" onclick="chooseApp(${i},'${source}')">${ic}<span class="app-card-copy"><strong>${safe(app.name)}</strong><small>${safe(app.genre || "App")}</small></span><span class="app-open" aria-hidden="true">↗</span></button>`;
}
async function searchAppCatalog() {
  const term = $("#app-search").value.trim(),
    box = $("#app-search-results");
  if (!term) {
    box.hidden = true;
    return;
  }
  const request = ++searchSequence,
    token = scene;
  box.hidden = false;
  box.setAttribute("aria-busy", "true");
  box.innerHTML =
    '<p class="search-status"><span class="search-spinner"></span> Searching the app catalog…</p>';
  const local = appCatalog.filter((a) =>
    a.name.toLowerCase().includes(term.toLowerCase()),
  );
  try {
    const results = await appSearchRequest(term);
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
  const el = $("#app-search-results");
  el.setAttribute("aria-busy", "false");
  el.innerHTML = `<div class="results-title"><h2>Results for “${safe(term)}”</h2><span>${foundApps.length} ${offline ? "local matches" : "apps"}</span></div>${offline ? '<div class="state-inline" role="alert"><p>The live catalog is unavailable (check your connection). Showing matches from the included demo apps.</p><button class="primary" onclick="searchAppCatalog()">Retry search</button></div>' : ""}${foundApps.length ? `<div class="popular-apps">${foundApps.map((a, i) => appCard(a, i, "search")).join("")}</div>` : "<p>No matching apps found. Try a different name or choose a popular app below.</p>"}`;
}
function appSearchRequest(term) {
  return new Promise((resolve, reject) => {
    const name =
        "peekAppSearch_" +
        Date.now() +
        "_" +
        Math.random().toString(36).slice(2),
      script = document.createElement("script");
    let timer;
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
