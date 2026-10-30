/* PEEK language switch: English <-> Urdu (RTL)
   ------------------------------------------------------------------
   How it works
   - The page is written in English. When Urdu is on, every visible text
     node (and placeholder / aria-label / title / alt) is replaced by its
     Urdu translation from i18n-ur.js. A MutationObserver translates text
     that the app renders later (3D studio, charts, Finder, dialogs...).
   - The original English text is remembered per node, so switching back
     to English restores everything exactly.
   - Sentences that contain changing numbers/names (charts, Finder
     reasons, comparison results) are handled by the RULES list below.
   - The choice is saved in localStorage ("peek-lang") and survives reloads.

   To translate a new string: add  "English text": "اردو متن"  to
   i18n-ur.js (or call PeekLang.add({...})). Names, numbers, units and
   brands intentionally stay in English.
*/
(() => {
  "use strict";

  const KEY = "peek-lang";
  const ATTRS = ["placeholder", "aria-label", "title", "alt"];
  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE", "PRE"]);
  const FONT_HREF =
    "https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap";

  const D = Object.create(null); // exact
  const DL = Object.create(null); // lower-case
  const FLIP = { "↗": "↖", "←": "→", "→": "←", "↺": "↻" };

  const norm = (s) => s.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
  const hasLatin = (s) => /[A-Za-z]/.test(s);

  function add(map) {
    for (const k in map) {
      const nk = norm(k);
      const v = map[k];
      D[nk] = v;
      DL[nk.toLowerCase()] = v;
      // "Something ↗" also teaches "Something" (so aria-labels etc. work)
      if (/\s*↗$/.test(nk)) {
        const base = nk.replace(/\s*↗$/, "");
        if (!(base in D)) {
          const bv = v.replace(/\s*↗$/, "");
          D[base] = bv;
          DL[base.toLowerCase()] = bv;
        }
      }
    }
  }

  const lookup = (k) => (k in D ? D[k] : DL[k.toLowerCase()]);

  /* ---------- rules for sentences with changing numbers / names ---------- */
  // t(x): translate a fragment, or keep it (names, numbers) when unknown
  const t = (x) => {
    const r = tr(x, 2);
    return r == null ? x : r;
  };
  const dev = (x) => "ڈیوائس " + x;

  const RULES = [
    // ratings "8.6/10 · Great" and "Not rated/10"
    [/^(\d+(?:\.\d+)?\/10) · (.+)$/, (m) => `${m[1]} · ${t(m[2])}`],

    // Comparison
    [/^Device ([AB]) scores ([\d.]+) higher in the sample profile\.$/, (m) => `نمونہ پروفائل میں ${dev(m[1])} کا اسکور ${m[2]} زیادہ ہے۔`],
    [/^Device ([AB]) leads$/, (m) => `${dev(m[1])} آگے ہے`],
    [/^(?:DEVICE|Device) ([AB])$/, (m) => dev(m[1])],
    [/^■ Device ([AB])$/, (m) => `■ ${dev(m[1])}`],
    [/^Device ([AB]) · (.+)$/, (m) => `${dev(m[1])} · ${t(m[2])}`],
    [/^(.+): Device ([AB]) \+([\d.]+)$/, (m) => `${t(m[1])}: ${dev(m[2])} +${m[3]}`],
    [/^Stronger for (.+): Device ([AB])$/, (m) => `${t(m[1])} کے لیے بہتر: ${dev(m[2])}`],
    [/^Better (.+): Device ([AB])$/, (m) => `بہتر ${t(m[1])}: ${dev(m[2])}`],
    [/^Strengths of Device ([AB])$/, (m) => `${dev(m[1])} کی خوبیاں`],
    [/^Search Device ([AB])$/, (m) => `${dev(m[1])} تلاش کریں`],

    // Performance lab
    [/^(\d+) FPS avg · (\d+) FPS 1% low · ([\d.]+) °C peak$/, (m) => `اوسط ${m[1]} FPS · 1% لو ${m[2]} FPS · زیادہ سے زیادہ ${m[3]} °C`],
    [/^In this simulation, (.+) runs (.+) at$/, (m) => `اس سمیولیشن میں ${m[1]} پر ${m[2]}`],
    [
      /^\(1% low (\d+)\)\. (?:(It stays cool and steady)|Heat builds up and throttling begins after about (\d+) minutes), peaking at ([\d.]+) °C, while using roughly (\d+)% battery per hour\.$/,
      (m) =>
        `(1% لو ${m[1]}) حاصل کرتا ہے۔ ${
          m[2] ? "یہ ٹھنڈا اور مستحکم رہتا ہے" : `حرارت بڑھتی ہے اور تقریباً ${m[3]} منٹ بعد تھروٹلنگ شروع ہو جاتی ہے`
        }، زیادہ سے زیادہ ${m[4]} °C تک پہنچتا ہے، جبکہ فی گھنٹہ تقریباً ${m[5]}% بیٹری استعمال ہوتی ہے۔`,
    ],
    [/^Target (\d+) FPS$/, (m) => `ہدف ${m[1]} FPS`],
    [/^~(\d+) min$/, (m) => `~${m[1]} منٹ`],
    [/^(\d+) minutes$/, (m) => `${m[1]} منٹ`],
    [/^(\d+) hours?$/, (m) => `${m[1]} گھنٹے`],
    [/^(.+) \(not on every device\)$/, (m) => `${t(m[1])} (ہر ڈیوائس پر نہیں)`],
    [/^How smoothly (.+) runs, sampled every 15 seconds\. Hover the chart for exact values\.$/, (m) => `${m[1]} کتنی روانی سے چلتی ہے، ہر 15 سیکنڈ میں نمونہ لیا گیا۔ درست قدروں کے لیے چارٹ پر ہوور کریں۔`],
    [/^Every setting on (.+)$/, (m) => `${m[1]} پر ہر سیٹنگ`],
    [/^CPU averages (\d+)% and GPU (\d+)%, so (.+) at this setting is not pushing (.+) to its limit\.$/, (m) => `CPU اوسطاً ${m[1]}% اور GPU ${m[2]}% پر رہتا ہے، اس لیے اس سیٹنگ پر ${m[3]} ${m[4]} کو اس کی حد تک نہیں دھکیلتی۔`],
    [/^CPU load averages (\d+)% while the GPU is at (\d+)%\. Heavy scenes, physics or background work will cost frames first\.$/, (m) => `CPU لوڈ اوسطاً ${m[1]}% ہے جبکہ GPU ${m[2]}% پر ہے۔ بھاری مناظر، فزکس یا بیک گراؤنڈ کام سب سے پہلے فریمز کم کریں گے۔`],
    [/^The (.+) runs at about (\d+)% load while the CPU sits near (\d+)%\. Lowering graphics quality helps more than lowering the frame-rate target\.$/, (m) => `${m[1]} تقریباً ${m[2]}% لوڈ پر چل رہا ہے جبکہ CPU تقریباً ${m[3]}% کے قریب ہے۔ فریم ریٹ کا ہدف کم کرنے سے زیادہ گرافکس کا معیار کم کرنا مددگار ہے۔`],
    [/^Heat slows the chip after ~(\d+) minutes$/, (m) => `~${m[1]} منٹ بعد حرارت چپ کو سست کر دیتی ہے`],
    [/^The back panel reaches ([\d.]+) °C\. The main CPU cores fall from (\d+) to about (\d+) MHz and FPS moves from (\d+) to (\d+)\. (.+) cooling is what sets how long this lasts\.$/, (m) => `پچھلا پینل ${m[1]} °C تک پہنچتا ہے۔ مین CPU کورز ${m[2]} سے گر کر تقریباً ${m[3]} MHz پر آ جاتے ہیں اور FPS ${m[4]} سے ${m[5]} ہو جاتا ہے۔ یہ کتنی دیر رہتا ہے، اس کا تعین ${t(m[6])} کولنگ کرتی ہے۔`],
    [/^No thermal throttling in (\d+) minutes$/, (m) => `${m[1]} منٹ میں کوئی تھرمل تھروٹلنگ نہیں`],
    [/^Temperature peaks at ([\d.]+) °C, below the point where clocks start to drop, so performance stays steady for the whole session\.$/, (m) => `درجۂ حرارت زیادہ سے زیادہ ${m[1]} °C تک جاتا ہے، جو اس حد سے نیچے ہے جہاں کلاکس گرنا شروع ہوتے ہیں، اس لیے پورے سیشن میں کارکردگی مستحکم رہتی ہے۔`],
    [/^gives about (\d+) FPS average with a peak of ([\d.]+) °C on this device\.$/, (m) => `پر آنے سے اس ڈیوائس پر اوسطاً تقریباً ${m[1]} FPS ملتا ہے اور زیادہ سے زیادہ درجۂ حرارت ${m[2]} °C رہتا ہے۔`],
    [/^would average only (\d+) of (\d+) FPS here and peak at ([\d.]+) °C, so (.+) is the better balance\.$/, (m) => `پر یہاں ${m[2]} میں سے اوسطاً صرف ${m[1]} FPS ملے گا اور زیادہ سے زیادہ درجۂ حرارت ${m[3]} °C ہو گا، اس لیے ${t(m[4])} بہتر توازن ہے۔`],
    [/^About (\d+)% per hour means roughly ([\d.]+) hours from a full charge\. Battery saver, a lower refresh rate or a lower setting will stretch that\.$/, (m) => `تقریباً ${m[1]}% فی گھنٹہ کا مطلب ہے مکمل چارج پر تقریباً ${m[2]} گھنٹے۔ بیٹری سیور، کم ریفریش ریٹ یا کم سیٹنگ اسے بڑھا دے گی۔`],
    [/^About (\d+)% per hour, or ~([\d.]+) hours from 100% at this workload\.$/, (m) => `تقریباً ${m[1]}% فی گھنٹہ، یعنی اس ورک لوڈ پر 100% سے ~${m[2]} گھنٹے۔`],
    [/^The app can use up to ([\d.]+) GB of the (\d+) GB, so other apps in the background may be reloaded when you switch back\.$/, (m) => `ایپ ${m[2]} GB میں سے ${m[1]} GB تک استعمال کر سکتی ہے، اس لیے واپس آنے پر بیک گراؤنڈ کی دوسری ایپس دوبارہ لوڈ ہو سکتی ہیں۔`],
    [/^Streaming at (.+) uses roughly (.+) per hour\.$/, (m) => `${m[1]} پر اسٹریمنگ تقریباً ${m[2]} فی گھنٹہ استعمال کرتی ہے۔`],

    [/^of (\d+) GB · peak ([\d.]+)$/, (m) => `${m[1]} GB میں سے · زیادہ سے زیادہ ${m[2]}`],

    // Finder
    [/^(\d+) devices? within your budget$/, (m) => `آپ کے بجٹ میں ${m[1]} ${m[1] === "1" ? "ڈیوائس" : "ڈیوائسز"}`],
    [/^Up to PKR ([\d,]+)$/, (m) => `PKR ${m[1]} تک`],
    [/^(.+) and a (\d+) Hz display contribute to this gaming scenario\. PKR ([\d,]+) below your budget\.$/, (m) => `${t(m[1])} اور ${m[2]} Hz ڈسپلے اس گیمنگ منظرنامے میں حصہ ڈالتے ہیں۔ آپ کے بجٹ سے PKR ${m[3]} کم۔`],
    [/^(.+) GB RAM and (.+) GB storage provide context for your editing workflow\. PKR ([\d,]+) below your budget\.$/, (m) => `${m[1]} GB RAM اور ${m[2]} GB اسٹوریج آپ کے ایڈیٹنگ ورک فلو کا سیاق فراہم کرتے ہیں۔ آپ کے بجٹ سے PKR ${m[3]} کم۔`],
    [/^A (.+) display and ([\d,]+) mAh battery contribute to this streaming scenario\. PKR ([\d,]+) below your budget\.$/, (m) => `${m[1]} ڈسپلے اور ${m[2]} mAh بیٹری اس اسٹریمنگ منظرنامے میں حصہ ڈالتے ہیں۔ آپ کے بجٹ سے PKR ${m[3]} کم۔`],

    // counts
    [/^(\d+) subcomponents?( · Click to inspect in 3D)?$/i, (m) => `${m[1]} ذیلی پرزے${m[2] ? " · تھری ڈی میں معائنے کے لیے کلک کریں" : ""}`],
    [/^(\d+) SUBCOMPONENTS? \/ (\d+) SURFACES?$/, (m) => `${m[1]} ذیلی پرزے / ${m[2]} سطحیں`],
    [/^(\d+) ASSEMBLIES \/ (\d+) SURFACES?$/, (m) => `${m[1]} اسمبلیاں / ${m[2]} سطحیں`],
    [/^(\d+) assemblies\. One extraordinary device\.$/, (m) => `${m[1]} اسمبلیاں۔ ایک غیر معمولی ڈیوائس۔`],
    [/^(\d+) categories$/, (m) => `${m[1]} زمرے`],

    // aria-labels / alt text
    [/^Explore (.+)$/, (m) => (lookup(norm(m[1])) != null ? `${t(m[1])} دریافت کریں` : null)],
    [/^Inspect (.+)$/, (m) => `${t(m[1])} کا معائنہ کریں`],
    [/^Score (\d+) out of 100$/, (m) => `100 میں سے ${m[1]} اسکور`],
    [/^(.+) illustrative rating$/, (m) => `${t(m[1])} کی تصویری ریٹنگ`],
    [/^(.+) chart\. Use the left and right arrow keys to read values\.$/, (m) => `${t(m[1].replace(/&amp;/g, "&"))} چارٹ۔ قدریں پڑھنے کے لیے بائیں اور دائیں ایروکیز استعمال کریں۔`],
    [/^(.+) icon$/, (m) => `${m[1]} کا آئیکن`],
  ];

  /* ---------- core translation of one string ---------- */
  function tr(raw, depth = 0) {
    if (depth > 3 || typeof raw !== "string") return null;
    const key = norm(raw.replace(/&amp;/g, "&"));
    if (!key || !hasLatin(key)) return null;

    let r = lookup(key);
    if (r != null) return r;

    for (const [re, fn] of RULES) {
      const m = key.match(re);
      if (m) {
        const out = fn(m);
        if (out != null) return out;
      }
    }

    // "Part one · Part two"
    if (key.includes(" · ")) {
      const parts = key.split(" · ");
      const res = parts.map((p) => tr(p, depth + 1));
      if (res.some((x) => x != null)) return parts.map((p, i) => (res[i] != null ? res[i] : p)).join(" · ");
    }
    // "A, B, C" lists (only when every item is known)
    if (key.includes(", ") && depth < 2) {
      const parts = key.split(", ");
      const res = parts.map((p) => tr(p, depth + 1));
      if (res.every((x) => x != null)) return res.join("، ");
    }
    // decorative symbols around a known phrase: "↑ Upload", "Open Finder ↗"
    const sm = key.match(/^([^\p{L}\p{N}]*)(.*\p{L}.*?)([^\p{L}\p{N})%.]*)$/u);
    if (sm && (sm[1] || sm[3]) && sm[2] !== key) {
      const core = tr(sm[2], depth + 1);
      if (core != null) return sm[1] + core + sm[3];
    }
    return null;
  }

  // Urdu reads right-to-left, so arrows must point the other way.
  // Keep Latin/number runs ("12 GB / 512 GB", "Galaxy S23 Ultra") in their own
  // left-to-right isolate so the bidi algorithm doesn't scramble them.
  const LATIN_RUN = /[(\[]?[A-Za-z0-9][A-Za-z0-9 .,\/+\-×·%°:()'’&@#_~≈|]*[A-Za-z0-9%°)]|[A-Za-z0-9]/g;
  const isolate = (s) => s.replace(LATIN_RUN, (m) => "\u2066" + m + "\u2069");
  const fix = (s) =>
    isolate(
      s
        .replace(/[↗←→↺]/g, (c) => FLIP[c] || c)
        .replace(/\bDevice ([AB])\b/g, "ڈیوائس $1"),
    );
  const ARABIC = /[\u0600-\u06FF]/;

  /* ---------- DOM walking ---------- */
  const textRecs = new WeakMap(); // Text -> {o, t}
  const attrRecs = new WeakMap(); // Element -> {attr: {o, t}}
  let observer = null;
  let lang = "en";

  const skipEl = (el) =>
    !el ||
    SKIP_TAGS.has(el.tagName) ||
    (el.closest && el.closest('[translate="no"], [data-no-i18n]'));

  function doText(node) {
    const cur = node.data;
    const rec = textRecs.get(node);
    if (rec && cur === rec.t) return;
    if (!cur || !cur.trim() || skipEl(node.parentElement)) return;
    const out = tr(cur);
    if (out == null) {
      if (rec) textRecs.delete(node);
      // English-only spec text such as "163.4 × 78.1 × 8.9 mm": show it left-to-right
      const par = node.parentElement;
      if (par && par.childNodes.length === 1 && !ARABIC.test(cur) && /[A-Za-z]/.test(cur) && /[\d×\/·+]/.test(cur)) {
        par.setAttribute("data-ltr", "");
      }
      return;
    }
    const lead = cur.match(/^\s*/)[0];
    const trail = cur.match(/\s*$/)[0];
    const val = lead + fix(out) + trail;
    textRecs.set(node, { o: cur, t: val });
    node.data = val;
  }

  function doAttrs(el) {
    if (skipEl(el)) return;
    for (const a of ATTRS) {
      const v = el.getAttribute(a);
      if (!v) continue;
      let recs = attrRecs.get(el);
      const rec = recs && recs[a];
      if (rec && v === rec.t) continue;
      const out = tr(v);
      if (out == null) {
        if (rec) delete recs[a];
        continue;
      }
      if (!recs) attrRecs.set(el, (recs = {}));
      const val = fix(out);
      recs[a] = { o: v, t: val };
      el.setAttribute(a, val);
    }
  }

  function walk(root) {
    if (root.nodeType === 3) return doText(root);
    if (root.nodeType !== 1) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let n = root;
    do {
      if (n.nodeType === 3) doText(n);
      else doAttrs(n);
    } while ((n = w.nextNode()));
  }

  function restore(root) {
    document.querySelectorAll("[data-ltr]").forEach((e) => e.removeAttribute("data-ltr"));
    const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let n = root;
    do {
      if (n.nodeType === 3) {
        const rec = textRecs.get(n);
        if (rec && n.data === rec.t) n.data = rec.o;
        textRecs.delete(n);
      } else {
        const recs = attrRecs.get(n);
        if (recs) {
          for (const a in recs) if (n.getAttribute(a) === recs[a].t) n.setAttribute(a, recs[a].o);
          attrRecs.delete(n);
        }
      }
    } while ((n = w.nextNode()));
  }

  function startObserver() {
    if (observer) return;
    observer = new MutationObserver((list) => {
      for (const m of list) {
        if (m.type === "childList") m.addedNodes.forEach(walk);
        else if (m.type === "characterData") doText(m.target);
        else if (m.type === "attributes") doAttrs(m.target);
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS,
    });
  }
  function stopObserver() {
    if (observer) observer.disconnect();
    observer = null;
  }

  /* ---------- language switch ---------- */
  let fontLoaded = false;
  function loadFont() {
    if (fontLoaded) return;
    fontLoaded = true;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = FONT_HREF;
    l.setAttribute("data-no-i18n", "");
    document.head.appendChild(l);
  }

  function paintButton() {
    const b = document.getElementById("lang-toggle");
    if (!b) return;
    const ur = lang === "ur";
    const label = b.querySelector(".lang-label");
    if (label) label.textContent = ur ? "English" : "اردو";
    b.setAttribute("aria-label", ur ? "Switch to English" : "اردو میں تبدیل کریں");
    b.setAttribute("title", ur ? "Switch to English" : "اردو میں تبدیل کریں");
    b.setAttribute("aria-pressed", ur ? "true" : "false");
    b.setAttribute("lang", ur ? "en" : "ur");
  }

  function apply(next, persist) {
    lang = next === "ur" ? "ur" : "en";
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ur" ? "rtl" : "ltr";
    html.classList.toggle("lang-ur", lang === "ur");
    if (persist) {
      try {
        localStorage.setItem(KEY, lang);
      } catch (e) {}
    }
    if (lang === "ur") {
      loadFont();
      walk(document.documentElement);
      startObserver();
    } else {
      stopObserver();
      restore(document.documentElement);
    }
    paintButton();
    // 3D studio / charts can listen for this to relayout
    window.dispatchEvent(new CustomEvent("peek-lang-change", { detail: { lang } }));
    window.dispatchEvent(new Event("resize"));
  }

  const api = {
    add,
    translate: (s) => tr(s),
    get lang() {
      return lang;
    },
    set: (l) => apply(l, true),
    toggle: () => apply(lang === "ur" ? "en" : "ur", true),
    init() {
      let saved = "en";
      try {
        saved = localStorage.getItem(KEY) || "en";
      } catch (e) {}
      apply(saved, false);
    },
  };
  window.PeekLang = api;
})();
