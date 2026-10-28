/* Non-3D data and comparison summaries ported from the supplied ZIP. */
(() => {
  const esc = (s) => safe(s);
  const RK = [
    "proc",
    "gfx",
    "cam",
    "batt",
    "disp",
    "mem",
    "stor",
    "chg",
    "build",
    "photo",
    "low",
    "vid",
    "stab",
    "fcam",
    "overall",
  ];
  const RL = {
    proc: "Processor",
    gfx: "Graphics",
    cam: "Camera",
    batt: "Battery",
    disp: "Display",
    mem: "Memory",
    stor: "Storage",
    chg: "Charging",
    build: "Build quality",
    photo: "Photo quality",
    low: "Low-light photography",
    vid: "Video recording",
    stab: "Stabilization",
    fcam: "Front camera",
    overall: "Overall",
  };
  const RX = {
    proc: "Sample score for everyday speed and heavy-task headroom.",
    gfx: "Sample score for gaming and graphics-heavy work.",
    cam: "Sample score for overall camera capability.",
    batt: "Sample score for endurance and battery size.",
    disp: "Sample score for sharpness, brightness and smoothness.",
    mem: "Sample score for multitasking headroom.",
    stor: "Sample score for capacity and speed.",
    chg: "Sample score for charging speed and features.",
    build: "Sample score for materials and construction.",
    photo: "Sample score for everyday photo quality.",
    low: "Sample score for night and dim-light shots.",
    vid: "Sample score for video capture options.",
    stab: "Sample score for steadiness in handheld video.",
    fcam: "Sample score for selfies and video calls.",
    overall: "Weighted prototype score across rated categories (illustrative).",
  };
  const FK =
    "rel,os,dims,wt,build,cpu,gpu,nm,ram,stor,exp,size,res,panel,hz,nits,prot,rear,front,video,ois,bat,end,wired,wireless,cool,net,wifi,bt,nfc,usb,gps,spk,mic,fp,sens,sw,sec".split(
      ",",
    );
  const FL = {
    rel: "Release date",
    os: "Operating system at launch / sample",
    dims: "Dimensions",
    wt: "Weight",
    build: "Build materials",
    cpu: "Chipset",
    gpu: "GPU",
    nm: "Manufacturing process",
    ram: "RAM",
    stor: "Internal storage",
    exp: "Expandable storage",
    size: "Screen size",
    res: "Resolution",
    panel: "Panel",
    hz: "Refresh rate",
    nits: "Brightness",
    prot: "Protection",
    rear: "Rear cameras",
    front: "Front camera",
    video: "Video",
    ois: "Stabilization",
    bat: "Battery",
    end: "Endurance (estimate)",
    wired: "Wired charging",
    wireless: "Wireless charging",
    cool: "Cooling",
    net: "Cellular",
    wifi: "Wi-Fi",
    bt: "Bluetooth",
    nfc: "NFC",
    usb: "USB",
    gps: "Positioning",
    spk: "Speakers",
    mic: "Microphones",
    fp: "Fingerprint sensor",
    sens: "Other sensors",
    sw: "Software support",
    sec: "Security",
  };
  const DV = [
    {
      id: "a",
      br: "Aster",
      m: "Aurora 5 Pro",
      hx: "#2a3f8f",
      st: "Top-tier performance;Excellent display;Fast wired and wireless charging",
      li: "Heavier than most;Premium-class pricing (sample)",
      r: [
        9, 8.8, 8.7, 8.2, 9, 8.8, 8.9, 8.6, 8.8, 8.9, 8.4, 8.8, 8.6, 8.3, 8.6,
      ],
      f: "2025-09|Demo OS 15|160.2 × 75.1 × 8.1 mm|199 g|Glass back, aluminium frame|Octa-core, 3.3 GHz (1+3+4)|Demo GPU G9|4 nm|12 GB LPDDR5X|256 GB UFS 4.0|No|6.7 in|3120 × 1440|LTPO AMOLED|1–120 Hz|2,400 nits peak|Tempered glass|50 MP main + 48 MP ultrawide + 12 MP 3× tele|32 MP|4K at 60 fps; 8K at 24 fps|Optical + electronic|5,000 mAh Li-ion|~15 h mixed use|80 W|50 W|Vapour chamber|5G, 4G LTE|Wi-Fi 7|Bluetooth 5.4|Yes|USB-C 3.2|GPS, Galileo, BeiDou|Stereo speakers|3 microphones|Under-display ultrasonic|Accelerometer, gyroscope, proximity, ambient light, compass|5 OS updates (sample)|Hardware key store; face unlock".split(
        "|",
      ),
    },
    {
      id: "b",
      br: "Nimbus",
      m: "Zen 3",
      hx: "#3b4b45",
      st: "Best battery endurance of the three;Balanced camera;microSD slot",
      li: "Slower charging than Aster;No wireless charging",
      r: [8.6, 8.2, 8.3, 8.7, 8.4, 8.2, 8, 7.9, 8, 8.4, 7.9, 8.1, 7.8, 8, 8.2],
      f: "2025-03|Demo OS 14|162.0 × 76.5 × 8.4 mm|205 g|Glass back, polymer frame|Octa-core, 3.0 GHz (1+3+4)|Demo GPU G7|4 nm|8 GB LPDDR5|256 GB UFS 3.1|Yes, microSD|6.6 in|2640 × 1200|AMOLED|60–120 Hz|1,800 nits peak|Tempered glass|50 MP main + 12 MP ultrawide|16 MP|4K at 30 fps|Electronic|5,500 mAh Li-ion|~18 h mixed use|45 W|Not supported|Graphite sheet|5G, 4G LTE|Wi-Fi 6E|Bluetooth 5.3|Yes|USB-C 2.0|GPS, Galileo|Stereo speakers|2 microphones|Side-mounted|Accelerometer, gyroscope, proximity, ambient light|3 OS updates (sample)|Face unlock; monthly patches".split(
        "|",
      ),
    },
    {
      id: "c",
      br: "Orbit",
      m: "Lite 2",
      hx: "#c4c8d0",
      st: "Light and compact;Good battery for its class",
      li: "Modest gaming headroom;No wireless charging or NFC",
      r: [6.8, 6.2, 6.9, 8, 7.1, 6.5, 6.6, 6.4, 6.5, 7, 6.1, 6.6, 6, 6.3, 7],
      f: "2024-11|Demo OS 14|152.4 × 71.0 × 7.9 mm|172 g|Plastic back and frame|Octa-core, 2.4 GHz (2+6)|Demo GPU G4|6 nm|6 GB LPDDR4X|128 GB UFS 2.2|Yes, microSD|6.1 in|1560 × 720|LCD|60 Hz|450 nits peak (sample)|Basic protective glass (sample)|13 MP main + 2 MP depth|8 MP|1080p at 30 fps|None|4,500 mAh Li-ion|~14 h mixed use|18 W|Not supported|Passive cooling|4G LTE|Wi-Fi 5|Bluetooth 5.0|No|USB-C 2.0|GPS|Mono speaker|1 microphone|Side-mounted|Accelerometer, proximity, ambient light|2 OS updates (sample)|Security patches".split(
        "|",
      ),
    },
  ];
  const PRICE = { s23: 220000, nx40: 62000, a: 180000, b: 95000, c: 38000 }; // SAMPLE approximate prices in PKR; i18 is an unreleased concept
  const priceRow = (d) =>
    `<dt>Approx. price (${d.catalog?.price ? "dated listing" : "sample"})</dt><dd>${PRICE[d.id] ? "Rs " + PRICE[d.id].toLocaleString("en-PK") : "Not announced"}</dd>`;
  const SG = [
    [
      "Overview",
      ["rel", "os", "dims", "wt", "build"],
      ["overall", "cam", "batt", "disp", "proc", "build"],
      "Release, size and materials at a glance.",
    ],
    [
      "Processor & Graphics",
      ["cpu", "gpu", "nm"],
      ["proc", "gfx"],
      "The chipset runs apps, games and AI features. A higher score means more headroom.",
    ],
    [
      "Memory & Storage",
      ["ram", "stor", "exp"],
      ["mem", "stor"],
      "RAM keeps apps ready; storage holds files. Faster parts mean quicker app switching and loading.",
    ],
    [
      "Display",
      ["size", "res", "panel", "hz", "nits", "prot"],
      ["disp"],
      "Higher refresh rates feel smoother; higher resolution looks sharper.",
    ],
    [
      "Camera",
      ["rear", "front", "video", "ois"],
      ["cam", "photo", "low", "vid", "stab", "fcam"],
      "Sample ratings are illustrative, not laboratory measurements.",
    ],
    [
      "Battery & Charging",
      ["bat", "end", "wired", "wireless", "cool"],
      ["batt", "chg"],
      "Real battery life depends on the display, network, software and use. Endurance is an estimate.",
    ],
    [
      "Connectivity",
      ["net", "wifi", "bt", "nfc", "usb", "gps"],
      [],
      "How the phone connects to networks, accessories and satellites.",
    ],
    [
      "Audio & Sensors",
      ["spk", "mic", "fp", "sens"],
      [],
      "Sound, biometrics and motion or light sensing.",
    ],
    [
      "Software",
      ["os", "sw", "sec"],
      [],
      "Operating system, update promise and security features.",
    ],
    [
      "Ratings",
      [],
      [
        "overall",
        "proc",
        "gfx",
        "cam",
        "batt",
        "disp",
        "build",
        "mem",
        "stor",
        "chg",
      ],
      "A visual summary of every supported rating.",
    ],
  ];
  /* component: [name, what it is, why it matters, position, related, spec fields, rating key, spec tab] */
  const CI = {
    display: [
      "Display Assembly",
      "The screen you see and touch: panel, touch layer and protective glass.",
      "It sets how sharp, bright and smooth everything looks.",
      "Front face",
      ["frontcam", "sensors"],
      ["size", "res", "panel", "hz", "nits", "prot"],
      "disp",
      3,
    ],
    battery: [
      "Battery",
      "Stores electrical energy to power your phone. Battery life also depends on the display, processor, software, network, and how you use your device.",
      "It decides how long you can go between charges.",
      "Centre-lower body, behind the mainboard",
      ["charge", "cooling"],
      ["bat", "end", "wired"],
      "batt",
      5,
    ],
    board: [
      "Mainboard",
      "The circuit board that connects the chip, memory, storage and sensors.",
      "Every part talks to the others through it.",
      "Upper-middle body",
      ["cpu", "ram", "stor"],
      [],
      null,
      1,
    ],
    cpu: [
      "Processor",
      "The chipset: the phone’s brain, with CPU cores, a GPU and AI engines.",
      "It drives app speed, gaming and photo processing.",
      "On the mainboard",
      ["ram", "cooling"],
      ["cpu", "gpu", "nm"],
      "proc",
      1,
    ],
    ram: [
      "Memory",
      "RAM is short-term workspace for running apps.",
      "More RAM keeps more apps ready without reloading.",
      "Beside the processor",
      ["cpu"],
      ["ram"],
      "mem",
      2,
    ],
    stor: [
      "Storage",
      "Long-term space for apps, photos and files.",
      "Faster storage opens apps and saves files sooner.",
      "On the mainboard",
      ["ram"],
      ["stor", "exp"],
      "stor",
      2,
    ],
    rearcam: [
      "Rear Camera System",
      "Lenses, sensors and stabilization on the back of the phone.",
      "It determines photo and video quality.",
      "Upper back corner",
      ["frontcam", "cpu"],
      ["rear", "video", "ois"],
      "cam",
      4,
    ],
    frontcam: [
      "Front Camera",
      "The selfie camera at the top of the screen.",
      "Used for selfies, video calls and face unlock.",
      "Top centre of the screen",
      ["display"],
      ["front"],
      "fcam",
      4,
    ],
    charge: [
      "Charging Board",
      "Manages power from the USB port to the battery.",
      "It controls charging speed and safety.",
      "Bottom of the phone",
      ["battery"],
      ["wired", "wireless", "usb"],
      "chg",
      5,
    ],
    speaker: [
      "Speakers",
      "Small drivers that play sound.",
      "They affect volume and clarity for media and calls.",
      "Bottom edge",
      ["charge"],
      ["spk", "mic"],
      null,
      7,
    ],
    motor: [
      "Vibration Motor",
      "Creates haptic buzzes for alerts and touch feedback.",
      "It gives the phone a tactile feel.",
      "Beside the battery",
      ["battery"],
      [],
      null,
      7,
    ],
    cooling: [
      "Cooling System",
      "A heat spreader that pulls heat away from the chip.",
      "It keeps speeds steady in long games or edits.",
      "Behind the mainboard",
      ["cpu"],
      ["cool"],
      null,
      5,
    ],
    antenna: [
      "Antennas",
      "Metal strips that send and receive mobile, Wi-Fi, Bluetooth and GPS signals.",
      "They help keep calls and data stable.",
      "Along the frame edges",
      ["frame"],
      ["net", "wifi", "bt", "gps"],
      null,
      6,
    ],
    sensors: [
      "Sensors",
      "Small parts that detect light, distance, motion and more.",
      "They rotate the screen, dim it and detect calls.",
      "Top of the screen",
      ["display"],
      ["sens", "fp"],
      null,
      7,
    ],
    frame: [
      "Frame",
      "The structural band around the phone.",
      "It gives strength and holds parts in place.",
      "Outer edge",
      ["antenna", "back"],
      ["build", "dims"],
      "build",
      0,
    ],
    back: [
      "Back Cover",
      "The rear glass or plastic panel.",
      "It protects the internals and sets the grip and feel.",
      "Rear face",
      ["rearcam"],
      ["build", "wt"],
      "build",
      0,
    ],
  };
  const SI = {
    lens: ["Lens Elements", "Stacked lenses that focus incoming light."],
    housing: ["Lens Housing", "The barrel that holds and aligns the lenses."],
    sensor: [
      "Image Sensor",
      "Captures incoming light and converts it into image data.",
    ],
    actuator: [
      "Autofocus Actuator",
      "A tiny motor that moves the lens to keep subjects sharp.",
    ],
    stab: [
      "Stabilization Assembly",
      "Shifts the lens or sensor to cancel hand shake.",
    ],
    flex: [
      "Connector Flex",
      "A thin flexible cable that carries image data to the mainboard.",
    ],
  };
  const S = {
    dev: null,
    cA: null,
    cB: null,
    go: 0,
    cmp: 0,
    pb: "b",
    tab: 0,
    sub: 0,
    s: { main: null, A: null, B: null },
    q: "",
  };
  let VW = {};
  const D = (id) => DV.find((x) => x.id == id),
    tn = (d) => (d.m.startsWith(d.br) ? d.m : d.br + " " + d.m),
    fm = (d, k) => d.f[FK.indexOf(k)] || "Not available",
    rt = (d, k) => d.r[RK.indexOf(k)],
    bc = (d) => parseInt(d.hx.slice(1), 16);
  const lab = (x) =>
      x >= 9 ? "Excellent" : x >= 8 ? "Great" : x >= 7 ? "Good" : "Fair",
    ff = (x) => (x == null ? "Not rated" : x.toFixed(1) + "/10");
  const rrow = (d, k) => {
    const x = rt(d, k);
    return `<div class="rr"><div class="rw"><span>${RL[k]}</span><b>${x == null ? "Not rated" : ff(x) + " · " + lab(x)}</b></div><div class="bar"><i style="width:${(x || 0) * 10}%"></i></div><small>${x == null ? "Not enough data for a score." : RX[k]}</small></div>`;
  };
  const thumb = (d) =>
    `<svg class="th" viewBox="0 0 40 72" aria-hidden="true"><rect x="2" y="2" width="36" height="68" rx="8" fill="${d.hx}" stroke="#7a7c99"/><rect x="5" y="6" width="30" height="60" rx="5" fill="#101015"/><circle cx="20" cy="11" r="1.8" fill="#666"/></svg>`;
  const picker = () =>
    `<select class="in" style="width:auto;margin:0" data-c="dev" aria-label="Change device"><option value="">Choose a device…</option>${DV.map((d) => `<option value="${d.id}" ${d.id == S.dev ? "selected" : ""}>${tn(d)}</option>`).join("")}</select>`;
  const grp = (d, g, nt) => {
    const [t, fs, rs, b] = g;
    return `${nt ? "" : `<h3>${t}</h3>`}<p class="mu">${b}</p>${fs.length ? `<dl>${t == "Overview" ? priceRow(d) : ""}${fs.map((k) => `<dt>${FL[k]}</dt><dd>${esc(fm(d, k))}</dd>`).join("")}</dl>` : ""}${rs.map((k) => rrow(d, k)).join("")}${
      t == "Overview"
        ? `<div class="cols"><div><h4>Key strengths</h4><ul>${d.st
            .split(";")
            .map((x) => `<li>${x}</li>`)
            .join("")}</ul></div><div><h4>Known limitations</h4><ul>${d.li
            .split(";")
            .map((x) => `<li>${x}</li>`)
            .join("")}</ul></div></div>`
        : ""
    }${t == "Ratings" ? `<div class="rr"><div class="rw"><span>Value</span><b>Not available</b></div><div class="bar"><i style="width:0"></i></div><small>Needs pricing data and a suitable evaluation method.</small></div><div class="c nt"><b>How ratings work</b><p>Scores are fixed sample values on a 0–10 scale tied to each demo device. They are illustrative, not laboratory measurements, and can be replaced by verified data later. Overall is a weighted prototype score across rated categories; categories without a basis show “Not rated”.</p></div>` : ""}`;
  };
  const tags =
    '<div class="rw" style="justify-content:flex-start"><span class="tg">Sample specifications</span><span class="tg">Illustrative ratings</span><span class="tg">Unknown = Not available</span></div>';
  const mk = (id, br, m, hx, st, li, r, f) => ({
    id,
    br,
    m,
    hx,
    st,
    li,
    r,
    f: FK.map((k) => f[k] || ""),
  });
  DV.unshift(
    mk(
      "i18",
      "Apple",
      "iPhone 18 (concept)",
      "#7a2342",
      "Concept reference with 18 labelled components;Same device as the teardown above",
      "Specifications are unverified: values marked expected or rumoured are not announced by Apple;Ratings are sample values",
      [9.2, 9, 9, 8.4, 9.1, 8.8, 8.8, 8, 9, 9, 8.8, 9.2, 9, 8.7, 8.8],
      {
        rel: "Expected spring 2027",
        os: "iOS 27 (expected)",
        dims: "Not announced",
        wt: "Not announced",
        build: "Reference concept enclosure (unverified)",
        cpu: "Apple A20 (rumoured)",
        gpu: "Apple-designed integrated GPU",
        nm: "2 nm (rumoured)",
        ram: "12 GB (rumoured)",
        stor: "256 GB starting capacity (expected)",
        exp: "No",
        size: "6.3 in (expected)",
        res: "About 2622 × 1206 (expected)",
        panel: "LTPO OLED (expected)",
        hz: "Up to 120 Hz (expected)",
        nits: "Not announced",
        prot: "Ceramic Shield glass (expected)",
        rear: "48 MP main + 48 MP ultrawide (expected)",
        front: "24 MP (rumoured)",
        video: "Up to 4K (expected)",
        ois: "Sensor-shift stabilization on main camera (expected)",
        bat: "Not announced",
        end: "Not announced",
        wired: "Fast wired charging (speed not announced)",
        wireless: "MagSafe and Qi2 wireless charging (expected)",
        cool: "Not announced",
        net: "5G, 4G LTE (expected)",
        wifi: "Wi-Fi 7 (rumoured)",
        bt: "Bluetooth 6 (rumoured)",
        nfc: "Yes (expected)",
        usb: "USB-C (expected)",
        gps: "GPS, GLONASS, Galileo, BeiDou (expected)",
        spk: "Stereo speakers (expected)",
        mic: "Multiple microphones (expected)",
        fp: "Face ID, no fingerprint sensor (expected)",
        sens: "Accelerometer, gyroscope, proximity, ambient light, barometer (expected)",
        sw: "Long-term iOS updates (policy not announced)",
        sec: "Face ID and Secure Enclave (expected)",
      },
    ),
    mk(
      "s23",
      "Samsung",
      "Galaxy S23 Ultra",
      "#5f7d6b",
      "Large 1440p display at up to 120 Hz;200 MP main camera with long zoom;Fast wired and wireless charging",
      "Heavy at 234 g;No microSD slot",
      [9, 8.8, 9.2, 8.6, 9.4, 8.8, 8.8, 7.8, 9, 9.2, 8.9, 9, 8.8, 8, 8.6],
      {
        rel: "2023-02",
        os: "Android 13, One UI 5.1",
        dims: "163.4 × 78.1 × 8.9 mm",
        wt: "234 g",
        build: "Gorilla Glass Victus 2, Armor Aluminum frame",
        cpu: "Snapdragon 8 Gen 2 for Galaxy",
        gpu: "Adreno 740",
        nm: "4 nm",
        ram: "8 GB or 12 GB",
        stor: "256 GB, 512 GB or 1 TB",
        exp: "No",
        size: "6.8 in",
        res: "3088 × 1440",
        panel: "Dynamic AMOLED 2X",
        hz: "1–120 Hz",
        nits: "1,750 nits peak",
        prot: "Gorilla Glass Victus 2",
        rear: "200 MP main + 12 MP ultrawide + 10 MP 3× tele + 10 MP 10× tele",
        front: "12 MP",
        video: "8K at 30 fps; 4K at 60 fps",
        ois: "Optical + digital",
        bat: "5,000 mAh",
        wired: "45 W",
        wireless: "Yes",
        cool: "Vapour chamber",
        net: "5G, 4G LTE",
        wifi: "Wi-Fi 6E",
        bt: "Bluetooth 5.3",
        nfc: "Yes",
        usb: "USB-C 3.2",
        gps: "GPS, GLONASS, Galileo, BeiDou",
        spk: "Stereo speakers (AKG tuned)",
        fp: "Under-display ultrasonic",
        sens: "Accelerometer, gyroscope, proximity, compass, barometer",
        sw: "4 OS updates, 5 years of security patches",
        sec: "Samsung Knox",
        end: "~16 h mixed use (estimate)",
        mic: "Multiple microphones",
      },
    ),
    mk(
      "nx40",
      "Infinix",
      "Note 40 Pro",
      "#c9a45c",
      "Large curved AMOLED at 120 Hz;70 W wired charging;Strong battery for its class",
      "Mid-range chipset for heavy gaming;Basic secondary cameras",
      [6.4, 5.8, 6.6, 8, 8, 7.8, 7, 8.4, 7, 6.8, 5.9, 6.4, 6, 7.4, 7.1],
      {
        rel: "2024-03",
        os: "Android 14, XOS 14",
        dims: "164.35 × 74.6 × 7.75 mm",
        wt: "190 g",
        cpu: "MediaTek Helio G99 Ultimate, octa-core (2 × 2.2 GHz + 6 × 2.0 GHz)",
        gpu: "Mali-G57 MC2",
        nm: "6 nm",
        ram: "8 GB or 12 GB",
        stor: "256 GB",
        size: "6.78 in",
        res: "2436 × 1080",
        panel: "3D curved AMOLED",
        hz: "120 Hz",
        nits: "1,300 nits peak",
        prot: "Corning Gorilla Glass",
        rear: "108 MP main + 2 MP + 2 MP",
        front: "32 MP",
        video: "1440p at 30 fps; 1080p at 60 fps",
        bat: "5,000 mAh",
        wired: "70 W",
        wireless: "20 W (MagKit)",
        net: "4G LTE",
        fp: "Side-mounted",
        sens: "Accelerometer, gyroscope, compass, proximity",
        build:
          "Corning Gorilla Glass front; IP53/IP54 dust and splash resistance",
        exp: "Yes, microSD up to 1 TB",
        ois: "OIS on main camera (varies by variant)",
        end: "~15 h mixed use (estimate)",
        cool: "Passive cooling (not specified by maker)",
        wifi: "Wi-Fi 5 (dual-band)",
        bt: "Bluetooth 5.4",
        nfc: "Yes (region dependent)",
        usb: "USB-C",
        gps: "GPS (other systems vary by region)",
        spk: "Stereo speakers, sound by JBL",
        mic: "Dual microphones",
        sw: "Android 14 (XOS 14); update policy not stated in listings",
        sec: "Fingerprint unlock with standard Android security (sample)",
      },
    ),
  );
  const CR = [
    ["Processor", ["cpu"], "proc"],
    ["Graphics", ["gpu"], "gfx"],
    ["Memory", ["ram"], "mem"],
    ["Storage", ["stor"], "stor"],
    ["Display", ["size", "res", "panel", "hz"], "disp"],
    ["Rear camera", ["rear"], "cam"],
    ["Front camera", ["front"], "fcam"],
    ["Battery", ["bat"], "batt"],
    ["Charging", ["wired", "wireless"], "chg"],
    ["Cooling", ["cool"], null],
    ["Connectivity", ["net", "wifi", "bt", "nfc"], null],
    ["Audio", ["spk", "mic"], null],
    ["Build materials", ["build"], "build"],
  ];
  const cmpR = (a, b, k) => {
    if (!k)
      return ["Not enough data", "No rating is defined for this category."];
    const x = rt(a, k),
      y = rt(b, k);
    if (x == null || y == null)
      return ["Not enough data", "At least one device has no rating here."];
    const z = x - y;
    return Math.abs(z) < 0.3
      ? ["Similar", "Sample scores are within 0.3 points."]
      : z > 0
        ? [
            "Device A leads",
            "Device A scores " +
              z.toFixed(1) +
              " higher in the sample profile.",
          ]
        : [
            "Device B leads",
            "Device B scores " +
              (-z).toFixed(1) +
              " higher in the sample profile.",
          ];
  };
  const cres = (k, q) => {
    const r = DV.filter((d) => tn(d).toLowerCase().includes(q.toLowerCase()));
    return r.length
      ? r
          .map(
            (d) =>
              `<button class="li" data-a="cs" data-k="${k}" data-p="${d.id}">${thumb(d)}${tn(d)}</button>`,
          )
          .join("")
      : `<p class="mu">No demo device matches “${esc(q)}”.</p>`;
  };
  const cpan = (k) => {
    const id = S["c" + k],
      d = id && D(id);
    return `<div class="c"><h3>Device ${k}</h3>${d ? `<div class="rw">${thumb(d)}<div style="flex:1"><b>${tn(d)}</b><br><span class="tg">Demo device</span></div><button class="bt o s" data-a="cc" data-k="${k}">Change Device</button></div>` : `<input class="in" data-i="cq" data-k="${k}" placeholder="Search smartphones…" aria-label="Search Device ${k}"><div id="cr-${k}">${cres(k, "")}</div><label class="bt o s">Upload photo (optional)<input type="file" hidden data-i="cf" data-k="${k}" accept="image/jpeg,image/png,image/webp"></label><p class="mu" id="cn-${k}"></p>`}</div>`;
  };
  const info = (d, k) =>
    `<div class="c"><h2>Device ${k}: ${tn(d)}</h2>${tags}${SG.map((g, i) => `<details ${i < 2 ? "open" : ""}><summary>${g[0]}</summary>${grp(d, g, 1)}</details>`).join("")}</div>`;
  function dash(a, b) {
    const ks = [
        "proc",
        "gfx",
        "cam",
        "batt",
        "disp",
        "mem",
        "stor",
        "chg",
        "build",
      ],
      L = [],
      Rr = [],
      Sm = [],
      M = [];
    ks.forEach((k) => {
      const r = cmpR(a, b, k)[0];
      r == "Device A leads"
        ? L.push(k)
        : r == "Device B leads"
          ? Rr.push(k)
          : r == "Similar"
            ? Sm.push(k)
            : M.push(k);
    });
    const nm = (x) => x.map((k) => RL[k]).join(", ") || "None",
      gap = (k) => Math.abs(rt(a, k) - rt(b, k)).toFixed(1),
      bg = rt(a, "gfx") - rt(b, "gfx"),
      bb = rt(a, "batt") - rt(b, "batt");
    const concl = [
      Math.abs(bg) >= 0.3
        ? "Stronger for gaming: " + (bg > 0 ? "Device A" : "Device B")
        : "",
      Math.abs(bb) >= 0.3
        ? "Better battery endurance: " + (bb > 0 ? "Device A" : "Device B")
        : "",
    ].filter(Boolean);
    return `<div class="c"><h2>Overall comparison</h2><div class="cols"><div class="big"><small>Device A · ${tn(a)}</small><b>${ff(rt(a, "overall"))}</b></div><div class="big"><small>Device B · ${tn(b)}</small><b style="color:#c4c8d0">${ff(rt(b, "overall"))}</b></div></div>
 <h3>Category ratings</h3><div class="rw" style="justify-content:flex-start"><span class="tg">■ Device A</span><span class="tg" style="border-color:#c4c8d0;color:#c4c8d0">■ Device B</span></div><div class="gc">${ks
   .map(
     (k) =>
       `<div class="gg"><div class="gb">${[a, b]
         .map((d, i) => {
           const x = rt(d, k);
           return `<div class="bv"><small>${x == null ? "—" : x.toFixed(1)}</small><i class="${i ? "k" : ""}" style="height:${(x || 0) * 17}px"></i></div>`;
         })
         .join("")}</div><small>${RL[k]}</small></div>`,
   )
   .join(
     "",
   )}</div><p class="mu">Taller bars mean a higher illustrative score. Gaps under 0.3 points are treated as similar.</p>
 <div class="cols"><div><h4>Key differences</h4><ul>${[...L.map((k) => `<li>${RL[k]}: Device A +${gap(k)}</li>`), ...Rr.map((k) => `<li>${RL[k]}: Device B +${gap(k)}</li>`)].join("") || "<li>No large differences</li>"}</ul>${concl.length ? `<h4>What the sample data suggests</h4><ul>${concl.map((x) => `<li>${x}</li>`).join("")}</ul>` : ""}</div><div><h4>Strengths of Device A</h4><p>${nm(L)}</p><h4>Strengths of Device B</h4><p>${nm(Rr)}</p><h4>Similar</h4><p>${nm(Sm)}</p><h4>Missing data</h4><p>${nm(M)}; Value (no validated scoring method)</p></div></div>
 <p class="nt c"><b>Illustrative demo scores. Results depend on the selected models and scoring criteria.</b></p></div>`;
  }

  // Imported profiles are demo records. Keep the live catalogue's exact variants
  // and dated source prices; retain imported sample prices as a separate field.
  for (const d of DV) {
    d.samplePrice = PRICE[d.id] ?? null;
    d.fictional = ["a", "b", "c"].includes(d.id);
    d.concept = d.id === "i18";
  }
  for (const d of window.PEEKData.devices) {
    const id = d.id === "iphone18" ? "i18" : d.id,
      existing = DV.find((x) => x.id === id);
    if (existing) {
      existing.liveId = d.id;
      existing.catalog = d;
      if (d.price !== null) PRICE[id] = d.price;
      if (!d.concept) {
        existing.f[FK.indexOf("ram")] = d.ram + " GB";
        existing.f[FK.indexOf("stor")] = d.storage + " GB";
      }
      continue;
    }
    const scores = d.scores;
    const r = [
      scores[0] / 10,
      scores[0] / 10,
      scores[1] / 10,
      scores[4] / 10,
      scores[3] / 10,
      d.ram >= 12 ? 8.8 : 7.8,
      d.storage >= 512 ? 8.8 : 7.8,
      d.charging >= 60 ? 9 : 7.5,
      7.8,
      scores[1] / 10,
      null,
      null,
      null,
      null,
      window.PEEKData.overall(d),
    ];
    const record = mk(
      id,
      d.brand,
      d.name,
      d.color,
      d.note,
      "Performance ratings are illustrative;Exact app benchmarks are not included",
      r,
      {
        rel: d.launch || "Not available",
        cpu: d.chip,
        gpu: d.gpu || "Not available",
        ram: d.ram + " GB",
        stor: d.storage + " GB",
        size: d.display.match(/[\d.]+/)?.[0] + " in",
        panel: d.display,
        res: "Not available",
        hz: d.hz + " Hz",
        rear: d.camera,
        front: d.front,
        bat: d.battery + " mAh",
        wired: d.charging + " W",
        net: d.network,
        build: d.build,
      },
    );
    record.liveId = d.id;
    record.catalog = d;
    record.samplePrice = null;
    DV.push(record);
    if (d.price !== null) PRICE[id] = d.price;
  }
  // Extend current comparison/search without replacing any existing profile.
  for (const d of DV) {
    if (
      window.PEEKData.devices.some(
        (x) => x.id === (d.id === "i18" ? "iphone18" : d.id),
      )
    )
      continue;
    const field = (k) => fm(d, k),
      number = (k, re) =>
        Number(field(k).match(re)?.[1]?.replace(/,/g, "")) || null;
    window.PEEKData.devices.push({
      id: d.id,
      brand: d.br,
      name: d.m,
      variant: "User-supplied sample configuration",
      chip: field("cpu"),
      gpu: field("gpu"),
      display: field("size") + " " + field("panel"),
      hz: number("hz", /(\d+)\s*Hz/),
      ram: number("ram", /(\d+)\s*GB/),
      storage: number("stor", /(\d+)\s*GB/),
      camera: field("rear"),
      front: field("front"),
      battery: number("bat", /([\d,]+)\s*mAh/),
      charging: number("wired", /(\d+)\s*W/),
      network: field("net"),
      build: field("build"),
      price: null,
      priceSource: null,
      source: null,
      color: d.hx,
      scores: [d.r[0] * 10, d.r[2] * 10, d.r[1] * 10, d.r[4] * 10, d.r[3] * 10],
      note: d.fictional
        ? "Fictional demonstration profile"
        : "User-supplied specifications · unverified",
      checked: "User-supplied sample",
      fictional: d.fictional,
    });
  }
  const find = (id) => D(id) || D(id === "iphone18" ? "i18" : id);
  S.pd = "s23";
  S.pb = "nx40";
  function perfRow() {
    return `<div><span class="overline">YOUR DEVICE PROFILE</span><strong>Set the stage.</strong></div><label>Device A<select data-v3="device" aria-label="Performance device">${DV.map((d) => `<option value="${d.id}" ${S.pd === d.id ? "selected" : ""}>${tn(d)}${d.fictional ? " · fictional demo" : d.concept ? " · unverified concept" : ""}</option>`).join("")}</select></label><label class="pf-cmp"><input type="checkbox" data-v3="compare" ${S.cmp ? "checked" : ""}> Compare devices</label>${S.cmp ? `<label>Device B<select data-v3="second" aria-label="Second performance device">${DV.map((d) => `<option value="${d.id}" ${S.pb === d.id ? "selected" : ""}>${tn(d)}${d.fictional ? " · fictional demo" : d.concept ? " · unverified concept" : ""}</option>`).join("")}</select></label>` : ""}<span class="simulation-pill">SIMULATED SCENARIOS</span>`;
  }
  function perfSync() {
    const box = document.querySelector(".performance-device");
    if (box) box.innerHTML = perfRow();
    window.refreshSelectedApp();
  }
  document.addEventListener("change", (event) => {
    const t = event.target;
    if (t.dataset.v3 === "device") {
      S.pd = t.value;
      window.PeekPerf?.reset();
      perfSync();
    } else if (t.dataset.v3 === "compare") {
      S.cmp = t.checked;
      perfSync();
    } else if (t.dataset.v3 === "second") {
      S.pb = t.value;
      perfSync();
    }
  });
  window.PeekCtx = {
    DV,
    S,
    D: find,
    tn,
    FK,
    FL,
    RK,
    RL,
    SG,
    CI,
    SI,
    grp,
    fm,
    rt,
    rrow,
    dash,
    cmpR,
    CR,
    PRICE,
    perfRow,
    perfSync,
  };
})();
