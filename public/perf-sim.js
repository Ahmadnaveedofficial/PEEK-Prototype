/* PEEK performance simulation engine.
   Turns device specs + an app category into time-series estimates (FPS, clocks, temperature, power, battery).
   Everything here is a MODEL, not a benchmark: the numbers are illustrative and deterministic. */
(function (g) {
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x)),
    avg = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);
  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- Device hardware model ---------- */
  // Clock ranges (MHz) are estimates by chipset class. Everything else is parsed from the device spec sheet.
  const CLK = {
    i18: {
      cm: 4200,
      cn: 600,
      lm: 2800,
      ln: 400,
      gm: 1450,
      gn: 250,
      w: [4.6, 5.2],
    },
    s23: {
      cm: 3360,
      cn: 500,
      lm: 2000,
      ln: 300,
      gm: 719,
      gn: 220,
      w: [4.2, 4.8],
    },
    nx40: {
      cm: 2200,
      cn: 500,
      lm: 2000,
      ln: 500,
      gm: 950,
      gn: 250,
      w: [2.8, 2.5],
    },
    a: {
      cm: 3300,
      cn: 500,
      lm: 2400,
      ln: 400,
      gm: 900,
      gn: 250,
      w: [4.2, 4.6],
    },
    b: {
      cm: 3000,
      cn: 500,
      lm: 2200,
      ln: 400,
      gm: 800,
      gn: 250,
      w: [3.6, 3.8],
    },
    c: {
      cm: 2400,
      cn: 500,
      lm: 1800,
      ln: 400,
      gm: 650,
      gn: 200,
      w: [2.4, 2.0],
    },
  };
  const num = (s, re, d) => {
    const m = String(s || "").match(re);
    return m ? +m[1].replace(/,/g, "") : d;
  };
  function hardware(d, FK) {
    const f = (k) => d.f[FK.indexOf(k)] || "",
      r = (i) => d.r[i],
      id = d.id,
      k = CLK[id] || {
        cm: 1800 + r(0) * 160,
        cn: 500,
        lm: 1600,
        ln: 400,
        gm: 500 + r(1) * 40,
        gn: 200,
        w: [1.5 + r(0) * 0.3, 1.2 + r(1) * 0.3],
      };
    const proc = r(0),
      gfx = r(1),
      mAh = num(f("bat"), /([\d,]+)\s*mAh/, id == "i18" ? 4400 : 4500),
      cool = f("cool"),
      coolQ = /vapou?r/i.test(cool)
        ? 0.9
        : /graphite/i.test(cool)
          ? 0.62
          : /passive/i.test(cool)
            ? 0.45
            : id == "i18"
              ? 0.8
              : 0.6,
      nm = num(f("nm"), /(\d+)\s*nm/, 6),
      ram = num(f("ram"), /(\d+)\s*GB/, 6),
      hz = num(f("hz"), /(\d+)\s*Hz/, 60),
      size = num(f("size"), /([\d.]+)\s*in/, 6.5),
      resM = (() => {
        const m = String(f("res")).match(/(\d{3,4})\s*[×x]\s*(\d{3,4})/);
        return m ? Math.min(+m[1], +m[2]) : 1080;
      })(),
      eff = Math.pow(nm / 4, 0.35);
    return {
      id,
      name: d.m.startsWith(d.br) ? d.m : d.br + " " + d.m,
      chip: f("cpu"),
      gpuName: f("gpu"),
      proc,
      gfx,
      cpuCap: Math.pow(proc / 10, 2) * 100,
      gpuCap: Math.pow(gfx / 10, 2) * 100,
      ram,
      wh: (mAh * 3.87) / 1000,
      mAh,
      coolTxt: cool || "Not specified",
      hz,
      size,
      resM,
      nm,
      coolQ,
      rth: 3.3 - 1.4 * coolQ,
      cpuMax: k.cm,
      cpuMin: k.cn,
      litMax: k.lm,
      litMin: k.ln,
      gpuMax: k.gm,
      gpuMin: k.gn,
      cpuW: k.w[0] * eff,
      gpuW: k.w[1] * eff,
      scrW: 0.75 + 0.5 * (size / 6.7) + hz / 240,
      memScore: r(5),
      storScore: r(6),
      gps: f("gps"),
      maxRes: proc >= 9.2 ? 4320 : proc >= 8.5 ? 2160 : proc >= 7 ? 1440 : 1080,
    };
  }

  /* ---------- App classification ---------- */
  const RX = {
    extreme:
      /genshin|honkai|star rail|wuthering|zenless|infinity nikki|diablo|fortnite|apex legends|warzone|ark:|pubg.*new state|resident evil|tower of fantasy|ace racer|nba 2k|eFootball|fifa|ea sports fc/i,
    heavy:
      /pubg|call of duty|free fire|mobile legends|honor of kings|wild rift|asphalt|brawl stars|battlegrounds|valorant mobile|league of legends|real racing|need for speed|shadowgun|critical ops|standoff|modern combat|gta|racing|rally|drift|shooter|battle royale|fps|3d rpg|open world|warfare|strike/i,
    light:
      /puzzle|solitaire|match|word|chess|ludo|bingo|casino|slots|trivia|crossword|sudoku|candy|jewel|bubble|mahjong|domino|card|cooking|idle|merge|tile|quiz|bakery|farm|paint|coloring|tycoon|kids|jigsaw|checkers|poker/i,
  };
  const VID =
    /capcut|inshot|kinemaster|vn video|premiere|davinci|filmora|splice|videoleap|powerdirector|alight motion|video editor|movie maker|\bvita\b|\bedits\b/i;
  const PHO =
    /lightroom|snapseed|photoshop|picsart|vsco|facetune|photo editor|photo|camera|pixlr|canva|remini|lensa|picture/i;
  const SOC =
    /instagram|tiktok|snapchat|facebook|twitter|\bx\b|threads|whatsapp|telegram|messenger|reddit|pinterest|discord|linkedin|bereal|wechat|viber|signal|bluesky|likee|kwai|social/i;
  const STR =
    /youtube|netflix|prime video|disney|hulu|twitch|hbo|\bmax\b|vimeo|crunchyroll|plex|tubi|peacock|paramount|apple tv|jiocinema|hotstar|dailymotion|stream|video player|vlc/i;
  const NAV =
    /maps|waze|navigation|gps|uber|lyft|careem|bolt|indrive|transit|strava|komoot|\btrail\b|citymapper/i;
  const AUD =
    /spotify|music|podcast|audible|soundcloud|shazam|deezer|tidal|pandora|radio|audio|audiobook|quran|bible/i;
  function classify(app) {
    const n = (app.name || "") + " " + (app.genre || ""),
      g = app.genre || "",
      name = app.name || "";
    let cls,
      tier = null;
    if (RX.extreme.test(name)) {
      cls = "game";
      tier = "extreme";
    } else if (
      g == "Games" ||
      /^Games/.test(g) ||
      (/Game|Action|Racing|Role|Strategy|Simulation|Adventure|Arcade|Puzzle|Card|Casino|Board|Sports|Family|Trivia|Word|Music Games/.test(
        g,
      ) &&
        !/^(Music|Sports)$/.test(g)) ||
      /\bgames?\b/i.test(g)
    ) {
      cls = "game";
      tier = RX.heavy.test(name)
        ? "heavy"
        : RX.light.test(name) || /Puzzle|Card|Casino|Board|Trivia|Word/.test(g)
          ? "light"
          : "medium";
    } else if (
      RX.heavy.test(name) &&
      /pubg|call of duty|free fire|mobile legends|asphalt|brawl/i.test(name)
    ) {
      cls = "game";
      tier = "heavy";
    } else if (VID.test(name)) {
      cls = "videoedit";
    } else if (PHO.test(name) && !SOC.test(name)) {
      cls = "photoedit";
    } else if (NAV.test(name)) {
      cls = "nav";
    } else if (AUD.test(name)) {
      cls = "audio";
    } else if (SOC.test(name)) {
      cls = "social";
    } else if (STR.test(name)) {
      cls = "stream";
    } else if (/Navigation|Travel/.test(g)) {
      cls = "nav";
    } else if (/^Music$/.test(g)) {
      cls = "audio";
    } else if (/Social/.test(g)) {
      cls = "social";
    } else if (/Entertainment/.test(g)) {
      cls = "stream";
    } else if (/Photo & Video/.test(g)) {
      cls = /edit|studio|creator|maker/i.test(name) ? "videoedit" : "stream";
    } else cls = "light";
    return { cls, tier };
  }

  /* ---------- Workload presets ---------- */
  const TIERS = {
    extreme: {
      gpu: 72,
      cpu: 48,
      ram: 3.8,
      net: 60,
      label: "Very demanding 3D game",
    },
    heavy: { gpu: 38, cpu: 32, ram: 3.0, net: 55, label: "Demanding 3D game" },
    medium: { gpu: 20, cpu: 20, ram: 2.0, net: 30, label: "Mid-weight game" },
    light: { gpu: 6, cpu: 8, ram: 1.1, net: 15, label: "Casual game" },
  };
  const GQ = [
    ["Low", 0.6, 30],
    ["Medium", 0.8, 40],
    ["High", 1, 60],
    ["Very high", 1.25, 90],
    ["Ultra", 1.5, 120],
  ];
  const P = (name, o) =>
    Object.assign(
      {
        name,
        fps: "hz",
        cpu: 10,
        gpu: 6,
        ram: 1.2,
        x: 0.4,
        scr: 1,
        burst: 0.4,
        net: 40,
        hzcap: true,
      },
      o,
    );
  const CLS = {
    social: {
      label: "Social & short video app",
      metric: "UI smoothness",
      unit: "FPS",
      typical: 0,
      presets: [
        P("Feed scrolling", {
          cpu: 14,
          gpu: 9,
          ram: 1.3,
          x: 0.5,
          scr: 0.9,
          burst: 0.5,
          net: 60,
        }),
        P("Reels / short video", {
          cpu: 22,
          gpu: 14,
          ram: 1.8,
          x: 0.7,
          scr: 1,
          burst: 0.35,
          net: 250,
        }),
        P("Live video & calls", {
          fps: 30,
          cpu: 30,
          gpu: 16,
          ram: 2,
          x: 1.3,
          scr: 1,
          burst: 0.15,
          net: 700,
        }),
      ],
    },
    stream: {
      label: "Video streaming app",
      metric: "Playback frame rate",
      unit: "FPS",
      typical: 2,
      presets: [
        P("480p", {
          fps: 30,
          cpu: 3,
          gpu: 3,
          ram: 0.9,
          x: 0.45,
          burst: 0.1,
          net: 300,
          res: 480,
          hzcap: 0,
        }),
        P("720p", {
          fps: 30,
          cpu: 4,
          gpu: 4,
          ram: 1,
          x: 0.5,
          burst: 0.1,
          net: 700,
          res: 720,
          hzcap: 0,
        }),
        P("1080p", {
          fps: 30,
          cpu: 7,
          gpu: 6,
          ram: 1.2,
          x: 0.55,
          burst: 0.1,
          net: 1500,
          res: 1080,
          hzcap: 0,
        }),
        P("1440p", {
          fps: 60,
          cpu: 14,
          gpu: 12,
          ram: 1.5,
          x: 0.6,
          burst: 0.1,
          net: 3000,
          res: 1440,
          hzcap: 0,
        }),
        P("4K HDR", {
          fps: 60,
          cpu: 22,
          gpu: 18,
          ram: 1.9,
          x: 0.7,
          burst: 0.1,
          net: 7000,
          res: 2160,
          hzcap: 0,
        }),
        P("8K", {
          fps: 60,
          cpu: 44,
          gpu: 34,
          ram: 2.6,
          x: 0.9,
          burst: 0.05,
          net: 18000,
          res: 4320,
          hzcap: 0,
        }),
      ],
    },
    nav: {
      label: "Maps & navigation app",
      metric: "Map rendering",
      unit: "FPS",
      typical: 1,
      presets: [
        P("Map browsing", {
          fps: 60,
          cpu: 10,
          gpu: 8,
          ram: 1.3,
          x: 1,
          scr: 1.15,
          burst: 0.5,
          net: 40,
        }),
        P("Turn-by-turn navigation", {
          fps: 60,
          cpu: 14,
          gpu: 10,
          ram: 1.4,
          x: 1.15,
          scr: 1.1,
          burst: 0.3,
          net: 25,
        }),
        P("3D & satellite view", {
          fps: 60,
          cpu: 20,
          gpu: 26,
          ram: 1.9,
          x: 1.2,
          scr: 1.2,
          burst: 0.3,
          net: 150,
        }),
      ],
    },
    videoedit: {
      label: "Video editing app",
      metric: "Timeline preview",
      unit: "FPS",
      typical: 1,
      presets: [
        P("1080p timeline", {
          fps: 30,
          cpu: 28,
          gpu: 22,
          ram: 3,
          x: 0.3,
          burst: 0.25,
          net: 5,
          xw: 22,
          hzcap: 0,
        }),
        P("4K timeline", {
          fps: 30,
          cpu: 46,
          gpu: 38,
          ram: 4.2,
          x: 0.3,
          burst: 0.2,
          net: 5,
          xw: 55,
          hzcap: 0,
        }),
        P("4K + effects & AI", {
          fps: 30,
          cpu: 62,
          gpu: 55,
          ram: 5.5,
          x: 0.3,
          burst: 0.2,
          net: 5,
          xw: 80,
          hzcap: 0,
        }),
        P("4K export (sustained)", {
          fps: 30,
          cpu: 70,
          gpu: 48,
          ram: 5,
          x: 0.2,
          scr: 0.35,
          burst: 0,
          net: 5,
          xw: 70,
          hzcap: 0,
        }),
      ],
    },
    photoedit: {
      label: "Photo editing app",
      metric: "Editing smoothness",
      unit: "FPS",
      typical: 1,
      presets: [
        P("JPEG editing", {
          cpu: 12,
          gpu: 9,
          ram: 1.6,
          burst: 0.6,
          net: 10,
          xw: 12,
        }),
        P("RAW editing", {
          cpu: 26,
          gpu: 16,
          ram: 2.6,
          burst: 0.5,
          net: 10,
          xw: 30,
        }),
        P("AI masks & denoise", {
          cpu: 44,
          gpu: 40,
          ram: 3.6,
          burst: 0.4,
          x: 0.5,
          net: 10,
          xw: 55,
        }),
        P("Batch export", {
          cpu: 60,
          gpu: 12,
          ram: 3,
          burst: 0,
          scr: 0.4,
          net: 10,
          xw: 45,
        }),
      ],
    },
    light: {
      label: "Everyday app",
      metric: "UI smoothness",
      unit: "FPS",
      typical: 0,
      presets: [
        P("Casual use", {
          cpu: 6,
          gpu: 4,
          ram: 0.9,
          x: 0.2,
          scr: 0.8,
          burst: 0.7,
          net: 20,
        }),
        P("Heavy use & multitasking", {
          cpu: 18,
          gpu: 8,
          ram: 2.4,
          x: 0.4,
          scr: 0.9,
          burst: 0.4,
          net: 60,
        }),
      ],
    },
    audio: {
      label: "Music & audio app",
      metric: "UI smoothness",
      unit: "FPS",
      typical: 0,
      presets: [
        P("Screen-off playback", {
          cpu: 3,
          gpu: 0.5,
          ram: 0.8,
          x: 0.1,
          scr: 0.03,
          burst: 0.8,
          net: 60,
        }),
        P("Browsing & lyrics", {
          cpu: 9,
          gpu: 6,
          ram: 1.2,
          x: 0.35,
          scr: 0.8,
          burst: 0.5,
          net: 80,
        }),
      ],
    },
  };
  function presetsFor(c, hw) {
    if (c.cls == "game") {
      const t = TIERS[c.tier];
      return GQ.map(([n, q, fps], i) => ({
        k: i,
        name: n + " · " + fps + " FPS",
        fps,
        gpu: t.gpu * q * Math.pow(fps / 60, 0.85),
        cpu: t.cpu * (0.55 + (0.45 * fps) / 60),
        ram: t.ram * (0.85 + 0.1 * i),
        x: 0.35,
        scr: 1,
        burst: 0.12,
        net: t.net,
        hzcap: true,
        unsupported:
          fps > hw.hz
            ? "Needs a " + fps + " Hz display; this one is " + hw.hz + " Hz"
            : null,
      }));
    }
    return CLS[c.cls].presets.map((p, i) =>
      Object.assign({}, p, {
        k: i,
        unsupported:
          p.res && p.res > hw.maxRes
            ? "Beyond what this chipset decodes smoothly"
            : null,
      }),
    );
  }
  const meta = (c) =>
    c.cls == "game"
      ? {
          label: TIERS[c.tier].label,
          metric: "Frame rate",
          unit: "FPS",
          typical: -1,
        }
      : CLS[c.cls];

  /* ---------- Simulation ---------- */
  function simulate(hw, pr, mins, seedStr) {
    const dt = 15,
      n = Math.round((mins * 60) / dt) + 1,
      R = rng(hash(seedStr)),
      amb = 27,
      tau = 270;
    const hzTarget = pr.fps == "hz" ? hw.hz : pr.fps,
      target = pr.hzcap ? Math.min(hzTarget, hw.hz) : hzTarget,
      ph = R() * 6.28,
      per = 70 + R() * 60;
    let T = 31,
      f = 1,
      batt = 100;
    const o = {
      t: [],
      fps: [],
      low: [],
      cpuBig: [],
      cpuLit: [],
      gpuMHz: [],
      temp: [],
      pwr: [],
      batt: [],
      uC: [],
      uG: [],
      ram: [],
      f: [],
      target,
    };
    for (let i = 0; i < n; i++) {
      const t = i * dt;
      let act = 1 - pr.burst * (0.5 + 0.5 * Math.sin((6.283 * t) / per + ph));
      if (R() < 0.08 * pr.burst) act *= 0.55;
      act = clamp(act, 0.15, 1);
      const gw = Math.max(pr.gpu * act, 0.05),
        cw = Math.max(pr.cpu * act, 0.05),
        capG = hw.gpuCap * f,
        capC = hw.cpuCap * f,
        rG = capG / gw,
        rC = capC / cw,
        rMin = Math.min(rG, rC),
        ratio = clamp(rMin, 0, 1);
      const tight = clamp(1 / rMin, 0, 1.4),
        j = 0.012 + 0.07 * Math.pow(tight, 3);
      const fps = clamp(
          target * ratio * (1 + (R() - 0.5) * j * 1.2),
          0,
          target,
        ),
        low = clamp(
          fps * (1 - (0.04 + j * 1.8 * (0.5 + R() * 0.5))),
          target * 0.1,
          fps,
        );
      const uC = clamp((cw * ratio) / capC, 0.02, 1),
        uG = clamp((gw * ratio) / capG, 0.02, 1);
      const big =
          Math.min(
            hw.cpuMin + (hw.cpuMax - hw.cpuMin) * clamp(0.25 + uC * 1.2, 0, 1),
            hw.cpuMax * f,
          ) *
          (1 + (R() - 0.5) * 0.03),
        lit =
          Math.min(
            hw.litMin + (hw.litMax - hw.litMin) * clamp(0.3 + uC * 0.9, 0, 1),
            hw.litMax * (0.5 + 0.5 * f),
          ) *
          (1 + (R() - 0.5) * 0.03),
        gpu =
          Math.min(
            hw.gpuMin + (hw.gpuMax - hw.gpuMin) * clamp(0.2 + uG * 1.1, 0, 1),
            hw.gpuMax * f,
          ) *
          (1 + (R() - 0.5) * 0.03);
      const pC = hw.cpuW * (0.15 + 0.85 * uC) * Math.pow(big / hw.cpuMax, 2.2),
        pG = hw.gpuW * (0.15 + 0.85 * uG) * Math.pow(gpu / hw.gpuMax, 2.2),
        P = 0.5 + hw.scrW * pr.scr + pC + pG + pr.x;
      T += (amb + hw.rth * P - T) * (1 - Math.exp(-dt / tau));
      const Tn = T + (R() - 0.5) * 0.25;
      f += (clamp(1 - 0.075 * Math.max(0, T - 41.5), 0.5, 1) - f) * 0.5;
      batt -= (((P / hw.wh) * dt) / 3600) * 100 * 1.1;
      const ram =
        pr.ram * (0.92 + (0.08 * i) / Math.max(1, n - 1)) + R() * 0.05;
      o.t.push(t / 60);
      o.fps.push(fps);
      o.low.push(low);
      o.cpuBig.push(big);
      o.cpuLit.push(lit);
      o.gpuMHz.push(gpu);
      o.temp.push(Tn);
      o.pwr.push(P);
      o.batt.push(Math.max(0, batt));
      o.uC.push(uC * 100);
      o.uG.push(uG * 100);
      o.ram.push(ram);
      o.f.push(f);
    }
    return stats(o, hw, pr, mins);
  }
  function stats(o, hw, pr, mins) {
    const n = o.t.length,
      k = Math.max(1, Math.round(n * 0.05)),
      lows = [...o.low].sort((a, b) => a - b),
      tg = o.target,
      af = avg(o.fps),
      l1 = avg(lows.slice(0, k));
    const early = o.fps.slice(0, Math.max(2, Math.round(n * 0.1))),
      late = o.fps.slice(-Math.max(2, Math.round(n * 0.1)));
    const ti = o.f.findIndex((v) => v < 0.96),
      aP = avg(o.pwr),
      drain = (aP / hw.wh) * 100 * 1.1,
      rs = o.fps.map((v) => v / tg);
    const b = [
      rs.filter((v) => v >= 0.95).length,
      rs.filter((v) => v >= 0.8 && v < 0.95).length,
      rs.filter((v) => v >= 0.6 && v < 0.8).length,
      rs.filter((v) => v < 0.6).length,
    ].map((v) => (v / n) * 100);
    const peakT = Math.max(...o.temp),
      avgR = af / tg,
      lowR = l1 / tg;
    const verdict =
      avgR >= 0.94 && lowR >= 0.8
        ? 0
        : avgR >= 0.88 && lowR >= 0.68
          ? 1
          : avgR >= 0.72
            ? 2
            : avgR >= 0.5
              ? 3
              : 4;
    const score = Math.round(
      clamp(
        100 *
          (0.5 * avgR +
            0.25 * lowR +
            0.25 * clamp(1 - (peakT - 38) / 12, 0, 1)),
        0,
        100,
      ),
    );
    return Object.assign(o, {
      avgFps: af,
      low1: l1,
      fpsStart: avg(early),
      fpsEnd: avg(late),
      throttleMin: ti < 0 ? null : o.t[ti],
      peakT,
      endT: avg(o.temp.slice(-4)),
      avgP: aP,
      drain,
      hours: 100 / drain,
      used: 100 - o.batt[n - 1],
      avgC: avg(o.uC),
      avgG: avg(o.uG),
      ramAvg: avg(o.ram),
      ramPeak: Math.max(...o.ram),
      stab: (l1 / af) * 100,
      ft: 1000 / Math.max(af, 0.1),
      buckets: b,
      verdict,
      score,
      mins,
      pr,
    });
  }
  function evaluate(hw, c, mins, seed) {
    const prs = presetsFor(c, hw),
      rows = prs.map((p) =>
        p.unsupported
          ? { pr: p, unsupported: true }
          : Object.assign(simulate(hw, p, mins, seed + "|" + p.name), {
              unsupported: false,
            }),
      );
    let auto;
    if (c.cls == "game") {
      auto = -1;
      rows.forEach((r, i) => {
        if (!r.unsupported && r.verdict <= 1 && r.peakT <= 46) auto = i;
      });
      if (auto < 0) {
        auto = rows.findIndex((r) => !r.unsupported);
      }
    } else {
      auto = meta(c).typical;
      if (rows[auto].unsupported) auto = rows.findIndex((r) => !r.unsupported);
    }
    return { rows, auto, prs };
  }
  g.PeekSim = {
    hardware,
    classify,
    evaluate,
    simulate,
    presetsFor,
    meta,
    CLS,
    TIERS,
    clamp,
    avg,
    hash,
  };
})(typeof window !== "undefined" ? window : globalThis);
