/* Phone finder: understands "mujhe PUBG ke liye 50k tak ka phone batao" (English / Urdu / Hindi in Latin script).
   Pulls out a budget, an app and how it is used, then ranks the catalog with the same simulation as the Performance page.
   NOTE: PRICE holds SAMPLE prices (PKR) for the demo catalog. Replace them with live prices before launch. */
(() => {
  const { hardware, classify, evaluate } = PeekSim,
    { DV, S, tn, FK } = window.PeekCtx;
  const PRICE = window.PeekCtx.PRICE; // sample prices live in lab.js
  const VL_GAME = [
      "Excellent",
      "Smooth",
      "Playable",
      "Struggles",
      "Not recommended",
    ],
    VL_APP = ["Excellent", "Smooth", "Usable", "Sluggish", "Not recommended"];
  const VC = ["#5be3a2", "#8fe36b", "#ffb454", "#ff8a5b", "#ff6b7a"];
  const ALIASES = [
    [/pubg|bgmi|battlegrounds/i, "PUBG MOBILE", "Games"],
    [/call of duty|\bcod\b/i, "Call of Duty: Mobile", "Games"],
    [/genshin/i, "Genshin Impact", "Games"],
    [/free ?fire/i, "Free Fire", "Games"],
    [/capcut|video ?edit/i, "CapCut", "Photo & Video"],
    [/lightroom|photo ?edit/i, "Lightroom", "Photo & Video"],
    [/insta(gram)?\b|reels/i, "Instagram", "Photo & Video"],
    [/youtube|\byt\b/i, "YouTube", "Photo & Video"],
    [/tiktok/i, "TikTok", "Social Networking"],
    [/netflix/i, "Netflix", "Entertainment"],
    [/maps|navigation/i, "Google Maps", "Navigation"],
    [/\bgam(e|es|ing|er)\b|khel/i, "Battle royale game", "Games"],
  ];
  const EXAMPLES = [
    "mujhe PUBG ke liye 50k tak ka phone batao",
    "CapCut video editing ke liye 1 lakh tak",
    "Instagram aur YouTube ke liye 40 hazar mein phone",
    "Genshin Impact, 2 ghante roz, battery acha ho, 2 lakh tak",
  ];
  const rs = (n) => "Rs " + Math.round(n).toLocaleString("en-PK"),
    f0 = Math.round;
  let last = null,
    requestVersion = 0;

  function parseBudget(t) {
    const re =
      /(?:rs\.?|pkr|₨|rupees?|inr|₹|\$)?\s*(\d[\d,]*(?:\.\d+)?)\s*(k|hazar|hazaar|hajar|thousand|lakh|lacs?|lakhs|million)?\b/gi;
    let m;
    while ((m = re.exec(t))) {
      const raw = +m[1].replace(/,/g, ""),
        u = (m[2] || "").toLowerCase();
      if (!isFinite(raw)) continue;
      const mult = !u
          ? 1
          : /^(k|hazar|hazaar|hajar|thousand)$/.test(u)
            ? 1e3
            : /^(lakh|lacs?|lakhs)$/.test(u)
              ? 1e5
              : 1e6,
        v = raw * mult,
        after = t
          .slice(m.index + m[0].length)
          .trimStart()
          .slice(0, 8)
          .toLowerCase();
      if (
        !u &&
        (v < 5000 || /^(fps|hz|min|ghant|hour|hr|gb|mp|mah)/.test(after))
      )
        continue;
      return v;
    }
    return null;
  }
  function parseMins(t) {
    const h = t.match(/(\d+(?:\.\d+)?)\s*(?:ghant\w*|hours?|hrs?|h)\b/i),
      m = t.match(/(\d+)\s*min\w*/i);
    const v = h
      ? +h[1] * 60
      : m
        ? +m[1]
        : /lamb\w+|long|marathon|roz|daily|raat/i.test(t)
          ? 60
          : null;
    return v == null
      ? { mins: 30, assumed: true }
      : {
          mins: [15, 30, 60, 120].reduce((a, b) =>
            Math.abs(b - v) < Math.abs(a - v) ? b : a,
          ),
          assumed: false,
        };
  }
  function parse(t) {
    const hit = ALIASES.find(([re]) => re.test(t));
    return {
      budget: parseBudget(t),
      app: hit
        ? {
            name: hit[1],
            genre: hit[2],
            generic: hit[1] === "Battle royale game",
          }
        : null,
      ...parseMins(t),
      want: {
        battery: /battery|charg|lamb\w+ chal/i.test(t),
        cool: /garam|heat|\bhot\b|thanda|cool|thermal|throttl/i.test(t),
        smooth: /smooth|\b(60|90|120) ?fps|high fps/i.test(t),
      },
    };
  }

  function score(r, ev, game, want) {
    let k = game
      ? (r.verdict <= 1 && r.peakT <= 46 ? 1000 : 0) +
        ev.auto * 100 +
        r.avgFps * 0.5 +
        r.score * 0.2
      : -r.verdict * 300 + r.score * 3 + r.hours * 2;
    if (want.battery) k += r.hours * (game ? 15 : 6);
    if (want.cool) k -= Math.max(0, r.peakT - 38) * 20;
    if (want.smooth) k += r.avgFps * 1.5;
    return k;
  }
  function rank(q) {
    const c = classify(q.app),
      game = c.cls == "game",
      list = [];
    for (const d of DV) {
      const price = PRICE[d.id];
      if (price == null) continue;
      const hw = hardware(d, FK),
        ev = evaluate(hw, c, q.mins, q.app.name + hw.id),
        r = ev.rows[ev.auto];
      list.push({
        d,
        hw,
        r,
        preset: r.pr.name,
        price,
        k: score(r, ev, game, q.want),
        vl: game ? VL_GAME : VL_APP,
        game,
      });
    }
    list.sort((a, b) => b.k - a.k);
    if (q.budget == null)
      return { within: list.slice(0, 3), stretch: null, all: list };
    const within = list.filter((x) => x.price <= q.budget).slice(0, 3),
      over = list.filter((x) => x.price > q.budget);
    let stretch = over.filter((x) => x.price <= q.budget * 1.3)[0] || null;
    if (stretch && within.length && stretch.k <= within[0].k) stretch = null; // only suggest stretching when it is really better
    if (!within.length && !stretch)
      stretch = over.sort((a, b) => a.price - b.price)[0] || null;
    return { within, stretch, all: list };
  }

  function why(x, q) {
    const r = x.r,
      app = safe(q.app.name),
      t = `${q.mins} min`;
    const fps =
      r.throttleMin == null
        ? `${x.game ? "hold about" : "run at about"} <b>${f0(r.avgFps)} FPS</b>`
        : `start near <b>${f0(r.fpsStart)} FPS</b> and settle around <b>${f0(r.fpsEnd)} FPS</b> once it heats up (~${f0(r.throttleMin)} min)`;
    return `In this simulation, <b>${app}</b> would ${fps} at <b>${x.preset}</b> over a ${t} session, peaking near ${r.peakT.toFixed(1)} °C. Battery use is about ${f0(r.drain)}% per hour (~${r.hours.toFixed(1)} h).`;
  }
  function card(x, i, q, extra) {
    const f = (k) => safe(x.d.f[FK.indexOf(k)] || "Not available"),
      v = x.r.verdict;
    return `<li class="fx-card"><div class="fx-top"><span class="fx-rank" aria-hidden="true">${i + 1}</span><div class="fx-name"><h3>${tn(x.d)}</h3>${x.d.fictional ? '<span class="v3-profile-tag">Fictional demo</span>' : x.d.concept ? '<span class="v3-profile-tag">Unverified concept</span>' : ""}<p class="fx-price">${rs(x.price)} <small>${x.d.catalog?.price !== null && x.d.catalog?.price !== undefined ? "dated source listing" : "sample price"}</small></p></div><span class="fx-chip" style="--c:${VC[v]}">${x.vl[v]}</span></div>${extra ? `<p class="fx-flag">${extra}</p>` : ""}<p class="fx-why">${why(x, q)}</p><dl class="fx-facts"><div><dt>Chipset</dt><dd>${f("cpu")}</dd></div><div><dt>RAM</dt><dd>${f("ram")}</dd></div><div><dt>Battery</dt><dd>${f("bat")}</dd></div><div><dt>Display</dt><dd>${f("size")} · ${f("hz")}</dd></div></dl><button class="primary" onclick="PeekFinder.open('${x.d.id}')">Full performance breakdown →</button></li>`;
  }

  function understood(q) {
    const chip = (l, v, ok) =>
      `<span class="fx-u${ok ? "" : " miss"}"><b>${l}</b> ${v}</span>`;
    return `<div class="fx-understood" aria-label="What we understood">${chip("Budget", q.budget == null ? "not found — showing best overall" : "up to " + rs(q.budget), q.budget != null)}${chip("App", q.app ? q.app.name : "not found", !!q.app)}${chip("Session", q.mins + " min" + (q.assumed ? " (assumed)" : ""), true)}${q.want.battery ? chip("Priority", "battery life", true) : ""}${q.want.cool ? chip("Priority", "stays cool", true) : ""}${q.want.smooth ? chip("Priority", "high frame rate", true) : ""}</div>`;
  }

  function ask(e, text) {
    if (e) e.preventDefault();
    const input = document.getElementById("finder-q"),
      out = document.getElementById("finder-out"),
      t = (text ?? input.value).trim();
    if (text != null) input.value = text;
    if (!t) {
      out.innerHTML =
        '<div class="state-inline" role="alert"><p>Type what you need first, for example: “mujhe PUBG ke liye 50k tak ka phone batao”.</p></div>';
      input.focus();
      return;
    }
    if (/\$|₹|\b(?:USD|INR)\b/i.test(t)) {
      out.innerHTML =
        '<div class="state-inline" role="alert">Please give your budget in PKR. Currency conversion is not connected.</div>';
      return;
    }
    const request = ++requestVersion,
      token = scene;
    out.setAttribute("aria-busy", "true");
    out.innerHTML =
      '<p class="search-status"><span class="search-spinner"></span> Finding phones…</p>';
    setTimeout(() => {
      if (request !== requestVersion || scene !== token || !out.isConnected)
        return;
      try {
        const q = parse(t);
        last = q;
        if (!q.app) {
          out.innerHTML =
            understood(q) +
            '<div class="state-inline" role="alert"><p>Which app or game is it for? Add a name like PUBG, CapCut, Instagram or YouTube — or just say “gaming”.</p></div>';
          return;
        }
        const res = rank(q);
        let html = understood(q);
        if (!res.within.length && q.budget != null)
          html += `<div class="state-inline" role="status"><p>No phone in the sample catalog is within ${rs(q.budget)}.${res.stretch ? " The closest option is shown below." : ""}</p></div>`;
        html +=
          '<ol class="fx-list">' +
          res.within.map((x, i) => card(x, i, q)).join("") +
          (res.stretch
            ? card(
                res.stretch,
                res.within.length,
                q,
                `${rs(res.stretch.price - q.budget)} over your budget (+${f0((res.stretch.price / q.budget - 1) * 100)}%)${res.within.length ? " — worth stretching for" : ""}`,
              )
            : "") +
          "</ol>";
        html +=
          '<p class="note">Some prices are imported sample placeholders; others are dated source listings from the current catalogue. Performance and recommendation reasoning are simulated scenarios, not benchmark results or purchase advice. Confirm all prices and variants with the seller.</p>';
        out.innerHTML = html;
      } catch (err) {
        console.error(err);
        out.innerHTML =
          '<div class="state-inline" role="alert"><p>Something went wrong while finding phones.</p><button class="primary" onclick="PeekFinder.ask()">Try again</button></div>';
      } finally {
        out.setAttribute("aria-busy", "false");
      }
    }, 250);
  }

  function open(id) {
    const app = last && last.app;
    if (!app) return;
    S.pd = id;
    S.cmp = 0;
    const match = appCatalog.find((a) =>
      a.name.toLowerCase().includes(app.name.toLowerCase()),
    );
    pickedApp = match || {
      id: app.name,
      name: app.name,
      genre: app.genre,
      publisher: "",
      icon: "",
      url:
        "https://apps.apple.com/us/search?term=" + encodeURIComponent(app.name),
    };
    PeekPerf.reset();
    PeekPerf.set("mins", last.mins);
    location.hash = "performance";
  }
  window.PeekFinder = { ask, open, parse, rank };
  window.mountLanguageFinder = function () {
    last = null;
    document.getElementById("v3-language-finder").innerHTML =
      `<section class="finder"><span class="dis-kicker">ASK IN YOUR OWN WORDS</span><h2>Tell us the app and budget.</h2><p>English, Roman Urdu or Hindi — including session length and battery or cooling priorities. This is a local phrase parser, not AI.</p><form class="finder-form" role="search" onsubmit="PeekFinder.ask(event)"><label for="finder-q" class="sr-only">Describe the phone you need</label><input id="finder-q" type="text" placeholder="e.g. mujhe PUBG ke liye 50k tak ka phone batao" autocomplete="off" enterkeyhint="search"><button class="primary" type="submit">Find phones ↗</button></form><div class="finder-examples"><span>Try:</span>${EXAMPLES.map((x) => `<button type="button" onclick="PeekFinder.ask(null,this.dataset.q)" data-q="${x}">${x}</button>`).join("")}</div><div id="finder-out" aria-live="polite" aria-busy="false"></div></section>`;
  };
})();
