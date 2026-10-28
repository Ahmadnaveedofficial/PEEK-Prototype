/* Integration layer: data, charts and product workflows from the supplied ZIP.
   The current samsung-studio.js remains the only active 3D implementation. */
(() => {
  const C = window.PeekCtx,
    P = window.PEEKData,
    K = window.PeekHomeKnowledge,
    q = (s) => document.querySelector(s),
    esc = (s) => safe(s ?? "");
  let partId = "rearcam",
    subId = null;
  const name = (d) => C.tn(d);
  const tag = (d) =>
    d.concept
      ? "Unverified concept"
      : d.fictional
        ? "Fictional demo"
        : d.catalog
          ? "Source-linked catalogue"
          : "User-supplied sample";
  const meta = (d) => `<span class="v3-profile-tag">${tag(d)}</span>`;
  function evidence(d) {
    return `<div class="v3-record-note">${meta(d)}<p>${d.concept ? "This is the supplied iPhone 18 concept profile. Expected and rumoured specifications remain unverified; simulations may use assumed values." : d.fictional ? "This brand and device are fictional records imported from your ZIP for demonstrations." : "Imported extended fields and ratings are sample data. The current catalogue retains its source links and exact memory/storage variant."}</p>${d.catalog?.source ? `<a href="${esc(d.catalog.source)}" target="_blank" rel="noopener">Manufacturer source ↗</a>` : ""}${d.catalog?.price ? `<p>Approximate listing: PKR ${d.catalog.price.toLocaleString("en-PK")} · checked ${d.catalog.checked}. <a href="${esc(d.catalog.priceSource)}" target="_blank" rel="noopener">Price source ↗</a></p>` : d.samplePrice ? `<p>Imported sample price: PKR ${d.samplePrice.toLocaleString("en-PK")} · placeholder, not a seller quotation.</p>` : ""}</div>`;
  }

  const basePerf = performancePage;
  performancePage = function () {
    basePerf();
    const root = document.createElement("div");
    root.className = "v3-performance";
    const main = q("#main");
    while (main.firstChild) root.append(main.firstChild);
    main.append(root);
    const row = q(".performance-device");
    row.innerHTML = C.perfRow();
    q(".performance-content>.note").textContent =
      "All charts, settings comparisons and metrics below are simulated scenarios, not measured benchmark results. Actual performance depends on software, device condition, app support and settings.";
    if (pickedApp) refreshSelectedApp();
  };

  const baseComparison = comparison;
  comparison = function () {
    baseComparison();
    augmentComparison();
  };
  function augmentComparison() {
    q("#v3-comparison-details")?.remove();
    const aName = q("#dis-picked-0 h2")?.textContent,
      bName = q("#dis-picked-1 h2")?.textContent;
    const aRecord = P.devices.find((d) => d.name === aName),
      bRecord = P.devices.find((d) => d.name === bName);
    if (!aRecord || !bRecord) return;
    const a = C.D(aRecord.id),
      b = C.D(bRecord.id);
    if (!a || !b) return;
    const root = document.createElement("section");
    root.id = "v3-comparison-details";
    root.className = "lab v3-comparison-details";
    root.innerHTML = `<div class="cols">${[a, b].map((d) => `<article class="c"><h2>${esc(name(d))}</h2>${evidence(d)}${C.SG.map((g) => `<details><summary>${g[0]}</summary>${C.grp(d, g, true)}</details>`).join("")}${d.id === "s23" ? '<button data-merged="studio" class="bt o s">Open current 3D studio ↗</button>' : ""}</article>`).join("")}</div><div class="c"><h2>Component scores & differences</h2><div class="ov"><table class="tbl"><thead><tr><th>Category</th><th>${esc(name(a))}</th><th>${esc(name(b))}</th><th>Sample result</th></tr></thead><tbody>${C.CR.map(
      ([title, fields, key]) => {
        const [result, note] = C.cmpR(a, b, key);
        return `<tr><th scope="row">${title}</th><td>${fields.map((f) => esc(C.fm(a, f))).join(" · ")}${key ? `<br><small>${C.rt(a, key) ?? "Not rated"}/10</small>` : ""}</td><td>${fields.map((f) => esc(C.fm(b, f))).join(" · ")}${key ? `<br><small>${C.rt(b, key) ?? "Not rated"}/10</small>` : ""}</td><td><span class="tg">${result}</span><small>${note}</small></td></tr>`;
      },
    ).join("")}</tbody></table></div></div>${C.dash(a, b)}`;
    q("#dis-comparison-results").after(root);
    syncComparisonDetails(root);
  }
  function syncComparisonDetails(root) {
    const cols = root.querySelectorAll(":scope > .cols > article.c");
    if (cols.length !== 2) return;
    const lists = [...cols].map((col) =>
      Array.from(col.querySelectorAll(":scope > details")),
    );
    root.addEventListener(
      "toggle",
      (event) => {
        const source = event.target;
        if (!(source instanceof HTMLDetailsElement)) return;
        const side = lists[0].indexOf(source) >= 0 ? 0 : 1;
        const index = lists[side].indexOf(source);
        if (index < 0) return;
        const twin = lists[1 - side][index];
        if (twin && twin.open !== source.open) twin.open = source.open;
      },
      true,
    );
  }
  const observer = new MutationObserver((mutations) => {
    if (mutations.some((m) => m.target.id === "dis-comparison-results"))
      augmentComparison();
  });
  observer.observe(q("#main"), { childList: true, subtree: true });

  function mountComponentKnowledge() {
    if (q("#home-component-knowledge")) return;
    partId = "rearcam";
    subId = null;
    const section = document.createElement("section");
    section.id = "home-component-knowledge";
    section.className = "lab v3-home-knowledge";
    section.setAttribute("aria-labelledby", "component-knowledge-title");
    section.innerHTML = `<div class="c"><div class="v3-section-top"><span class="dis-kicker">COMPONENT KNOWLEDGE</span><h2 id="component-knowledge-title">Understand what each part does.</h2><p>Explore the role of every component and the smaller parts that make it work.</p></div><div class="v3-component-layout"><div class="v3-part-list" aria-label="Component explanations">${Object.entries(
      K.parts,
    )
      .map(
        ([id, part]) =>
          `<button class="li ${id === partId ? "on" : ""}" data-merged="part" data-id="${id}" aria-pressed="${id === partId}">${esc(part.name)}</button>`,
      )
      .join(
        "",
      )}</div><div id="v3-component-detail" aria-live="polite"></div></div></div>`;
    q(".device-information")?.after(section);
    renderPart();
  }
  function renderPart() {
    const d = C.D("s23"),
      p = K.parts[partId],
      context = C.CI[partId];
    if (!p || !q("#v3-component-detail")) return;
    q("#v3-component-detail").innerHTML =
      `<span class="dis-kicker">${esc(context?.[3] || "INTERNAL ASSEMBLY / EDUCATIONAL REFERENCE")}</span><h3>${esc(p.name)}</h3><p>${esc(p.what)}</p><div class="knowledge-explanation"><h4>How it works</h4><p>${esc(p.how)}</p><h4>What it changes in everyday use</h4><p>${esc(p.impact)}</p></div>${context?.[5]?.length ? `<details class="knowledge-specs"><summary>Reference device specifications</summary><dl>${context[5].map((k) => `<dt>${C.FL[k]}</dt><dd>${esc(C.fm(d, k))}</dd>`).join("")}</dl></details>` : ""}<h4>Inside this assembly <span class="knowledge-count">${p.sub.length} subcomponents</span></h4><p class="knowledge-small">Select a part to explore its role. Some items are functional layers or circuits, not separately removable modules.</p><div class="v3-related knowledge-subparts">${p.sub.map(([title], i) => `<button data-merged="subpart" data-id="${i}" aria-pressed="${subId === i}">${esc(title)}</button>`).join("")}</div><div id="v3-subpart-detail" aria-live="polite">${subId !== null && p.sub[subId] ? `<article class="knowledge-subdetail"><span class="dis-kicker">SUBCOMPONENT / ${esc(p.name)}</span><h4>${esc(p.sub[subId][0])}</h4><p>${esc(p.sub[subId][1])}</p></article>` : ""}</div>${p.related.length ? `<h4>Connected systems</h4><div class="v3-related">${p.related.map((id) => `<button data-merged="part" data-id="${id}">${esc(K.parts[id].name)} ↗</button>`).join("")}</div>` : ""}<p class="knowledge-small">General working principles with a curated S23 Ultra reference. Exact chip positions, internal dimensions and replaceability are not established by the illustrative model.</p>`;
    document.querySelectorAll(".v3-part-list .li").forEach((b) => {
      const active = b.dataset.id === partId;
      b.classList.toggle("on", active);
      b.setAttribute("aria-pressed", String(active));
    });
  }
  function renderDeviceInformation() {
    const groups = K.groups;
    q("#main").insertAdjacentHTML(
      "beforeend",
      `<section class="device-information home-complete-specs" aria-labelledby="device-information-title"><div class="info-title-line"><h2 id="device-information-title">Device information</h2><span>Samsung Galaxy S23 Ultra · 12 GB / 512 GB reference</span></div><div class="info-chips"><span>${groups.length} categories</span><span>Source-linked reference</span><span>Illustrative ratings</span></div><div class="spec-tabs" role="tablist" aria-label="Device specification categories">${groups.map(([title], i) => `<button role="tab" id="spec-tab-${i}" aria-selected="${i === 0}" aria-controls="spec-content" tabindex="${i === 0 ? 0 : -1}" data-home-tab="${i}">${title}</button>`).join("")}</div><article id="spec-content" class="spec-content" role="tabpanel" aria-labelledby="spec-tab-0" tabindex="0"></article><details class="knowledge-sources"><summary>Sources, regional variants & rating notes</summary><p>Product facts use manufacturer references. Sources can describe different regional or storage variants; the model shown here uses a 12 GB / 512 GB sample configuration. Ratings remain fixed illustrative values, not benchmark measurements.</p><div>${K.sources.map(([label, url]) => `<a href="${url}" target="_blank" rel="noopener">${label} ↗</a>`).join("")}</div></details></section>`,
    );
    const tabs = [...document.querySelectorAll("[data-home-tab]")];
    const select = (i) => {
      const [title, description, rows, ratings] = groups[i],
        content = q("#spec-content");
      tabs.forEach((tab, j) => {
        tab.setAttribute("aria-selected", String(i === j));
        tab.tabIndex = i === j ? 0 : -1;
      });
      content.setAttribute("aria-labelledby", "spec-tab-" + i);
      content.innerHTML = `<h3>${title}</h3><p>${description}</p>${rows.length ? `<dl class="spec-data">${rows.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl>` : ""}${
        ratings.length
          ? `<div class="home-rating-list"><span class="dis-kicker">ILLUSTRATIVE PROFILE SCORES / NOT MEASURED</span>${ratings
              .map((key) => {
                const value = C.rt(C.D("s23"), key);
                return value === null || value === undefined
                  ? ""
                  : ratingRows([
                      [
                        C.RL[key],
                        value,
                        "Illustrative sample rating; not a measured hardware or app test.",
                      ],
                    ]);
              })
              .join("")}</div>`
          : ""
      }`;
    };
    tabs.forEach((tab, i) => {
      tab.onclick = () => select(i);
      tab.onkeydown = (event) => {
        let next;
        if (event.key === "ArrowRight") next = (i + 1) % tabs.length;
        else if (event.key === "ArrowLeft")
          next = (i - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        else return;
        event.preventDefault();
        select(next);
        tabs[next].focus();
        tabs[next].scrollIntoView({ block: "nearest", inline: "nearest" });
      };
    });
    select(0);
  }
  const baseAbout = about;
  about = function () {
    baseAbout();
    q(".dis-about-story").insertAdjacentHTML(
      "afterend",
      `<section class="v3-about-additions"><article class="dis-panel"><span class="dis-kicker">THE PLATFORM</span><h3>From the whole device to the smallest module.</h3><p>PEEK's vision is AI-powered electronic-device exploration: upload a product image or enter a brand and model, then connect specifications with components, modules and subcomponents. Click each part to understand its function, capabilities and contribution to overall performance.</p><p>The working prototype demonstrates that journey with curated models and simulated analysis. AI recognition belongs to the planned full software.</p></article><article class="dis-panel"><span class="dis-kicker">FREE CORE ACCESS</span><h3>Built for understanding.</h3><p>Device information is scattered across websites, technical documents and review videos. PEEK brings visual explanations, comparisons, app scenarios, approximate prices and launch information into one guided experience.</p><p>Core access stays free. Advertising and optional premium features are future plans, not active subscriptions.</p></article></section>`,
    );
  };
  mountDeviceInformation = function () {
    if (q(".device-information")) return;
    renderDeviceInformation();
    mountComponentKnowledge();
  };

  q("#main").addEventListener("click", (event) => {
    const b = event.target.closest("[data-merged]");
    if (!b) return;
    switch (b.dataset.merged) {
      case "part":
        partId = b.dataset.id;
        subId = null;
        renderPart();
        break;
      case "subpart":
        subId = Number(b.dataset.id);
        renderPart();
        q('.knowledge-subparts [data-id="' + subId + '"]')?.focus({
          preventScroll: true,
        });
        break;
      case "studio":
        startDemo();
        break;
      case "performance":
        C.S.pd = b.dataset.id;
        location.hash = "performance";
        break;
    }
  });
  // Adapt existing Finder result actions to the imported chart dashboard.
  q("#main").addEventListener(
    "click",
    (event) => {
      const b = event.target.closest('[data-action="performance-match"]');
      if (!b) return;
      event.stopImmediatePropagation();
      C.S.pd = b.dataset.id;
      C.S.cmp = 0;
      const app = P.apps.find((a) => a.id === q("#finder-app").value);
      pickedApp = appCatalog.find((a) => a.id === app.catalogId) || {
        id: app.catalogId,
        name: app.name,
        icon: app.icon,
        genre: app.kind === "gaming" ? "Games" : "Photo & Video",
        url: "https://apps.apple.com/app/id" + app.catalogId,
      };
      PeekPerf.reset();
      location.hash = "performance";
    },
    true,
  );
  const beforeRoute = route;
  window.removeEventListener("hashchange", beforeRoute);
  route = function () {
    let page = location.hash.slice(1) || "home";
    if (page === "explore") {
      history.replaceState(null, "", "#home");
      page = "home";
    }
    beforeRoute();
    document.title =
      ({
        home: "Home",
        comparison: "Comparison",
        performance: "Performance",
        finder: "Finder",
        about: "About",
      }[page] || "Home") + " — PEEK";
  };
  window.addEventListener("hashchange", route);
})();
