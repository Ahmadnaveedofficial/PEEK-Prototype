/* A dated, deliberately small catalogue. Scores describe the prototype's
   comparison scenario; they are not device benchmarks or compatibility tests. */
(() => {
  const checked = "2026-10-23";
  const mi = (slug) => `https://www.mi.com/pk/product/${slug}/specs/`;
  const store = (slug) => `https://mistore.pk/products/${slug}`;
  const devices = [
    {
      id: "s23",
      brand: "Samsung",
      name: "Galaxy S23 Ultra",
      variant: "12 GB / 512 GB",
      chip: "Snapdragon 8 Gen 2 for Galaxy",
      gpu: "Adreno 740",
      display: "6.8″ Dynamic AMOLED 2X",
      hz: 120,
      ram: 12,
      storage: 512,
      camera: "200 + 12 + 10 + 10 MP",
      front: "12 MP",
      battery: 5000,
      charging: 45,
      network: "5G",
      build: "Victus 2 / Armor Aluminum",
      price: null,
      priceSource: null,
      source:
        "https://www.samsung.com/ph/smartphones/galaxy-s/galaxy-s23-ultra-phantom-black-512gb-sm-s918bzkqphl/",
      color: "#a9b7a4",
      scores: [86, 92, 78, 94, 80],
      studio: true,
      note: "Reference 3D experience",
      launch: "1 February 2023 · global announcement",
      launchSource:
        "https://www.samsungmobilepress.com/articles/take-your-passions-further-with-the-new-samsung-galaxy-s23-series-designed-for-a-premium-experience-today-and-beyond",
    },
    {
      id: "a16",
      brand: "Samsung",
      name: "Galaxy A16 4G",
      variant: "8 GB / 256 GB",
      chip: "Octa-core processor",
      gpu: null,
      display: "6.7″ Super AMOLED",
      hz: 90,
      ram: 8,
      storage: 256,
      camera: "50 + 5 + 2 MP",
      front: "13 MP",
      battery: 5000,
      charging: 25,
      network: "4G",
      build: "IP54",
      price: 61999,
      priceSource:
        "https://www.samsung.com/pk/smartphones/galaxy-a/galaxy-a16-black-256gb-sm-a165fzkipkd/buy/",
      source:
        "https://www.samsung.com/levant/smartphones/galaxy-a/galaxy-a16-light-gray-128gb-sm-a165fzadmea/",
      color: "#a6a0bc",
      scores: [61, 73, 62, 78, 80],
      note: "Everyday essentials",
    },
    {
      id: "note14",
      brand: "Xiaomi",
      name: "Redmi Note 14 4G",
      variant: "8 GB / 256 GB",
      chip: "Helio G99-Ultra",
      gpu: "Mali-G57 MC2",
      display: "6.67″ AMOLED",
      hz: 120,
      ram: 8,
      storage: 256,
      camera: "108 + 2 + 2 MP",
      front: "20 MP",
      battery: 5500,
      charging: 33,
      network: "4G",
      build: "Gorilla Glass 5",
      price: 61999,
      priceSource: store("redmi-note-14-8gb-256gb"),
      source: mi("redmi-note-14"),
      color: "#a5c6c2",
      scores: [63, 78, 65, 84, 86],
      note: "AMOLED & battery balance",
    },
    {
      id: "note14pro",
      brand: "Xiaomi",
      name: "Redmi Note 14 Pro 4G",
      variant: "8 GB / 256 GB",
      chip: "Helio G100-Ultra",
      gpu: "Mali-G57 MC2",
      display: "6.67″ AMOLED",
      hz: 120,
      ram: 8,
      storage: 256,
      camera: "200 + 8 + 2 MP",
      front: "32 MP",
      battery: 5500,
      charging: 45,
      network: "4G",
      build: "Gorilla Glass Victus 2 / IP64",
      price: 82999,
      priceSource: store("redmi-note-14-pro-8gb-256gb"),
      source: mi("redmi-note-14-pro"),
      color: "#b1a7cf",
      scores: [65, 87, 70, 87, 87],
      note: "Camera-focused configuration",
    },
    {
      id: "x7pro",
      brand: "POCO",
      name: "POCO X7 Pro 5G",
      variant: "12 GB / 512 GB · global battery variant",
      chip: "Dimensity 8400-Ultra",
      gpu: "Mali-G720",
      display: "6.67″ CrystalRes AMOLED",
      hz: 120,
      ram: 12,
      storage: 512,
      camera: "50 + 8 MP",
      front: "20 MP",
      battery: 6000,
      charging: 90,
      network: "5G",
      build: "Gorilla Glass 7i",
      price: 139999,
      priceSource: store("poco-x7-pro-5g"),
      source: "https://www.mi.com/global/product/poco-x7-pro/specs/",
      color: "#d9cb79",
      scores: [94, 82, 91, 92, 94],
      note: "Performance-focused configuration",
    },
    {
      id: "redmi13",
      brand: "Xiaomi",
      name: "Redmi 13",
      variant: "8 GB / 128 GB",
      chip: "Helio G91-Ultra",
      gpu: "Mali-G52 MC2",
      display: "6.79″ FHD+ LCD",
      hz: 90,
      ram: 8,
      storage: 128,
      camera: "108 + 2 MP",
      front: "13 MP",
      battery: 5030,
      charging: 33,
      network: "4G",
      build: "Glass back",
      price: 35999,
      priceSource: store("redmi-13"),
      source: mi("redmi-13"),
      color: "#c6b0c8",
      scores: [45, 67, 48, 63, 78],
      note: "Lower-budget configuration",
    },
    {
      id: "iphone18",
      brand: "Apple",
      name: "iPhone 18 · concept",
      variant: "Supplied concept reference",
      chip: null,
      gpu: null,
      display: null,
      hz: null,
      ram: null,
      storage: null,
      camera: null,
      front: null,
      battery: null,
      charging: null,
      network: null,
      build: null,
      price: null,
      priceSource: null,
      source: null,
      color: "#a2adc7",
      scores: null,
      concept: true,
      note: "Concept artwork · specifications unverified",
    },
  ].map((d) => ({ ...d, checked, launch: d.launch || null }));
  const apps = [
    {
      id: "pubg",
      name: "PUBG MOBILE",
      catalogId: 1330123889,
      icon: "app-icons/1330123889.jpg",
      kind: "gaming",
      load: 72,
      detail: "Competitive gaming",
      guidance:
        "Begin with lower graphics and test frame stability on the exact game version.",
    },
    {
      id: "cod",
      name: "Call of Duty: Mobile",
      catalogId: 1287282214,
      icon: "app-icons/1287282214.jpg",
      kind: "gaming",
      load: 76,
      detail: "Action gaming",
      guidance:
        "Check the graphics and frame-rate options available for your exact model.",
    },
    {
      id: "genshin",
      name: "Genshin Impact",
      catalogId: 1517783697,
      icon: "app-icons/1517783697.jpg",
      kind: "gaming",
      load: 91,
      detail: "Demanding open-world gaming",
      guidance:
        "Sustained performance matters; test a longer session before increasing quality.",
    },
    {
      id: "capcut",
      name: "CapCut",
      catalogId: 1500855883,
      icon: "app-icons/1500855883.jpg",
      kind: "creation",
      load: 73,
      detail: "Video editing",
      guidance:
        "Start with a 1080p timeline; effects, project length and export settings change the workload.",
    },
    {
      id: "lightroom",
      name: "Lightroom",
      catalogId: 878783582,
      icon: "app-icons/878783582.jpg",
      kind: "creation",
      load: 66,
      detail: "Photo editing",
      guidance:
        "Large RAW files and AI effects need more memory than basic photo adjustments.",
    },
    {
      id: "youtube",
      name: "YouTube",
      catalogId: 544007664,
      icon: "app-icons/544007664.jpg",
      kind: "streaming",
      load: 27,
      detail: "Video streaming",
      guidance:
        "Video resolution, network conditions and brightness influence the experience.",
    },
  ];
  const get = (id) => devices.find((d) => d.id === id);
  function overall(d) {
    return d?.scores
      ? Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length) / 10
      : null;
  }
  function suitability(d, app, quality = "balanced") {
    if (!d?.scores || !app) return null;
    const [compute, camera, creative, screen, battery] = d.scores;
    let base =
      app.kind === "gaming"
        ? compute * 0.72 + screen * 0.18 + battery * 0.1
        : app.kind === "creation"
          ? creative * 0.6 + compute * 0.25 + camera * 0.15
          : screen * 0.65 + battery * 0.35;
    return Math.round(
      Math.max(
        10,
        Math.min(
          98,
          base +
            (65 - app.load) * 0.24 +
            (quality === "light" ? 8 : quality === "demanding" ? -12 : 0),
        ),
      ),
    );
  }
  function find({
    appId,
    budget,
    brand = "all",
    minRam = 0,
    sort = "fit",
    quality = "balanced",
  }) {
    const app = apps.find((a) => a.id === appId);
    if (!app || !Number.isFinite(budget) || budget <= 0) return [];
    const matches = devices
      .filter(
        (d) =>
          !d.concept &&
          d.price !== null &&
          d.price <= budget &&
          (brand === "all" || d.brand === brand) &&
          d.ram >= minRam,
      )
      .map((d) => ({ ...d, fit: suitability(d, app, quality) }));
    return matches.sort((a, b) =>
      sort === "price"
        ? a.price - b.price || b.fit - a.fit
        : b.fit - a.fit || a.price - b.price,
    );
  }
  window.PEEKData = { devices, apps, get, overall, suitability, find, checked };
})();
