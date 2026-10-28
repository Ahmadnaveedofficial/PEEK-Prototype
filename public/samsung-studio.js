import * as THREE from "./vendor/three.module.js";
import { OrbitControls } from "./vendor/OrbitControls.js";
import { CSS3DRenderer, CSS3DObject } from "./vendor/CSS3DRenderer.js";
import { samsungParts } from "./samsung-data.js";
import { assemblyPlacement, createPhoneExterior } from "./samsung-assembly.js";

let currentStudio;
const el = (q) => document.querySelector(q);
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
home = function () {
  currentStudio?.dispose();
  currentStudio = null;
  el("#main").innerHTML =
    `<section class="samsung-studio" aria-label="Samsung Galaxy S23 Ultra component explorer">
 <div class="studio-nebula" aria-hidden="true"></div><div class="studio-planet" aria-hidden="true"></div>
 <section class="studio-landing" aria-label="Upload a device to explore">
 <div class="landing-space" aria-hidden="true"><div class="landing-orbit"></div><div class="landing-planet"><i></i><i></i><i></i><i></i></div><div class="landing-moon"></div>${Array.from({ length: 16 }, (_, i) => `<i class="landing-rock" style="--x:${(i * 41 + 3) % 100}%;--y:${(i * 23 + 9) % 100}%;--s:${7 + (i % 5) * 5}px;--delay:-${i * 3}s"></i>`).join("")}</div>
 <span class="landing-side left">PEEK / DEVICE LAB<br>01 — DISCOVERY</span><span class="landing-side right">LOOK CLOSER<br>GO DEEPER ↗</span>
 <div class="landing-center"><span class="landing-kicker"><i></i> EXPLORE / UNDERSTAND / COMPARE</span><h1>Upload to explore<br><em>the technology inside out.</em></h1><p>One image. A closer look at every component.</p>
 <label class="landing-upload" for="samsung-upload" tabindex="0" role="button" aria-label="Upload your device image"><span class="landing-upload-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21V3m-7 7 7-7 7 7"/></svg></span><strong>Upload your device image</strong><span>Choose an image or drop it here</span><small>JPG, PNG or WebP · up to 10 MB</small></label>
 <div class="landing-demo"><span>CHOOSE YOUR DEMO DEVICE</span><button id="landing-demo">Samsung Galaxy S23 Ultra <span>Explore demo ↗</span></button><small>Interactive reference model · Front & back views</small></div></div></section>
 <div class="studio-intro"><span class="studio-kicker"><i></i> THE PEEK EXPLORATION STUDIO <span>01 / SAMSUNG</span></span>
 <h1>Extraordinary.<br><em>Inside every layer.</em></h1><p>Upload to explore technology inside out.</p>
 <div class="studio-start"><label class="studio-upload" for="samsung-upload" tabindex="0" role="button" aria-label="Upload device image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 16V3m-5 5 5-5 5 5M4 15v5h16v-5"/></svg> Upload device image <span>↗</span></label><input id="samsung-upload" type="file" accept="image/png,image/jpeg,image/webp" hidden><button id="studio-demo" class="studio-text-button">Try the S23 Ultra demo <span>↗</span></button></div>
 <small class="studio-upload-note">S23 Ultra reference experience · JPG, PNG or WebP</small></div>
 <div class="studio-identity"><span>DEVICE / 001</span><h2>Galaxy S23 Ultra<span>Samsung · Cream</span></h2><div class="studio-ready"><i></i><span id="studio-status">Preparing the studio</span></div><div id="upload-thumb"></div></div>
 <div class="studio-webgl" id="studio-webgl" role="region" aria-label="Interactive 3D scene"></div><div class="studio-labels" id="studio-labels"></div>
 <div class="studio-loading" id="studio-loading"><span></span>Preparing every layer…</div>
 <div class="studio-trail" id="studio-trail" hidden><button id="studio-back">← Full device</button><span>/</span><span id="studio-trail-name"></span></div>
 <div class="studio-tip" id="studio-tip" role="tooltip" hidden></div>
 <div class="studio-selection" id="studio-selection" hidden><div><span id="selection-category"></span><h3 id="selection-name"></h3></div><button id="studio-subparts">Explore subcomponents <span>↗</span></button><button id="studio-deselect" aria-label="Return to all components">×</button></div>
 <div class="studio-bottom"><div class="studio-coordinate"><span class="coordinate-mark">+</span><div><b>ENGINEERED TO BE EXPLORED</b><span id="studio-hint">Upload a photo or start the reference demo</span></div></div>
 <div class="studio-tools" aria-label="Scene controls"><button id="studio-assemble" title="Toggle assembled and exploded views">Explode <span>↗</span></button><span class="studio-tool-divider"></span><button id="studio-rotate" class="is-active" title="Drag a selected component to rotate" aria-pressed="true">Rotate</button><button id="studio-move" title="Drag a selected component to move" aria-pressed="false">Move</button><button id="studio-flip" title="Show the opposite side">Flip</button><button id="studio-reset" title="Reset scene orientation">↺ <span>Reset</span></button></div>
 </div><div class="studio-footnote"><span>REFERENCE-BASED 3D STUDY · APPROXIMATE SHAPES</span><button id="studio-help">Controls & source notes ↗</button><span id="studio-counter">19 ASSEMBLIES / 2 SURFACES</span></div>
 <dialog class="studio-help" id="studio-help-dialog"><button class="close" aria-label="Close" onclick="this.closest('dialog').close()">×</button><span class="studio-kicker">A CLOSER LOOK</span><h2>Your guide to the studio.</h2><p>Hover or focus a floating label to read about a part. Click the part or its label to bring it forward.</p><p><b>Rotate:</b> drag the selected component in any direction. <b>Move:</b> drag it across the scene; use the Depth slider to move it toward or away from you. Scroll to zoom. Drag empty space to orbit the view.</p><p>Open “Explore subcomponents” for a second exploded view. Each child supports the same hover, rotation and movement controls. Escape returns one level. Arrow keys rotate a focused part; Shift + arrows move it.</p><p class="studio-source-note">This is a curated Samsung S23 Ultra experience built from your two supplied diagrams. Uploading a photo starts this reference model; it does not identify arbitrary hardware. Front and back textures use those references, while thickness, hidden geometry and some subcomponents are schematic. The diagrams are illustrative and may contain hardware inaccuracies.</p></dialog>
 </section>`;
  document.body.classList.add("studio-page");
  const mount = el("#studio-webgl");
  document.querySelectorAll(".studio-upload,.landing-upload").forEach(
    (label) =>
      (label.onkeydown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          el("#samsung-upload").click();
        }
      }),
  );
  el("#studio-demo").onclick = openStudio;
  el("#landing-demo").onclick = openStudio;
  const drop = el(".landing-upload");
  for (const type of ["dragenter", "dragover"])
    drop.addEventListener(type, (e) => {
      e.preventDefault();
      drop.classList.add("is-dragging");
    });
  for (const type of ["dragleave", "drop"])
    drop.addEventListener(type, (e) => {
      e.preventDefault();
      drop.classList.remove("is-dragging");
    });
  drop.addEventListener("drop", (e) => {
    const f = e.dataTransfer.files[0];
    if (f) handleUpload(f);
  });
  el("#samsung-upload").onchange = (e) => handleUpload(e.target.files[0]);
  const handleUpload = async (f) => {
    if (!f) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(f.type) ||
      f.size > 10e6
    ) {
      toast("Please choose a JPG, PNG or WebP under 10 MB.");
      el("#samsung-upload").value = "";
      return;
    }
    const url = URL.createObjectURL(f),
      img = new Image();
    img.src = url;
    try {
      await img.decode();
    } catch {
      URL.revokeObjectURL(url);
      toast("This image could not be read. Please choose another.");
      return;
    }
    if (!mount.isConnected) {
      URL.revokeObjectURL(url);
      return;
    }
    const thumb = el("#upload-thumb");
    if (thumb.dataset.url) URL.revokeObjectURL(thumb.dataset.url);
    thumb.dataset.url = url;
    thumb.innerHTML = `<img src="${url}" alt="Your uploaded device"><div><b>Your image is ready</b><span>Exploring the S23 Ultra reference model</span></div>`;
    openStudio();
  };
  el("#studio-help").onclick = () => el("#studio-help-dialog").showModal();
};
window.addEventListener("hashchange", () => {
  if (location.hash && location.hash !== "#home") {
    currentStudio?.dispose();
    currentStudio = null;
    document.body.classList.remove("studio-page");
  }
});
startDemo = async function () {
  if (location.hash && location.hash !== "#home") {
    location.hash = "home";
    await new Promise((r) => setTimeout(r, 100));
  }
  openStudio();
};

function openStudio() {
  const mount = el("#studio-webgl");
  if (!mount) return;
  const root = mount.closest(".samsung-studio");
  if (!el(".device-information")) mountDeviceInformation();
  root.classList.add("has-started");
  el(".studio-landing").hidden = true;
  try {
    if (!currentStudio) currentStudio = new SamsungStudio(mount);
    currentStudio.start();
  } catch (error) {
    el("#studio-loading").innerHTML =
      "The 3D studio could not start. Please refresh and try again.";
    console.error(error);
  }
}

class SamsungStudio {
  constructor(mount) {
    this.mount = mount;
    this.root = mount.closest(".samsung-studio");
    this.disposed = false;
    this.parts = [];
    this.assets = {};
    this.started = false;
    this.exploded = false;
    this.parent = null;
    this.selected = null;
    this.mode = "rotate";
    this.drag = null;
    this.hovered = null;
    this.idleTurn = true;
    this.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 150);
    this.camera.position.set(0, 0.3, 17);
    try {
      const gpuCanvas = document.createElement("canvas"),
        context = gpuCanvas.getContext("webgl2", {
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        });
      if (!context) throw new Error("WebGL is unavailable");
      this.renderer = new THREE.WebGLRenderer({
        canvas: gpuCanvas,
        context,
        antialias: true,
        alpha: true,
      });
    } catch {
      this.cssMode = true;
      this.renderer = new CSS3DRenderer();
      this.renderer.domElement.classList.add("css-3d-renderer");
      this.renderer.setPixelRatio = () => {};
      this.renderer.setClearColor = () => {};
      this.renderer.capabilities = { getMaxAnisotropy: () => 1 };
      this.renderer.dispose = () => {};
    }
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setClearColor(0x080a10, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    mount.append(this.renderer.domElement);
    this.scene.add(new THREE.HemisphereLight(0xe3ecff, 0x15131e, 2.5));
    const key = new THREE.DirectionalLight(0xffffff, 3.2);
    key.position.set(-5, 7, 10);
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x6863ff, 3);
    rim.position.set(8, 4, -6);
    this.scene.add(rim);
    const fill = new THREE.DirectionalLight(0xc3d6ed, 1.8);
    fill.position.set(-8, -2, -5);
    this.scene.add(fill);
    this.world = new THREE.Group();
    this.scene.add(this.world);
    this.exterior = createPhoneExterior(THREE, CSS3DObject, this.cssMode);
    this.world.add(this.exterior.group);
    this.closedAmount = 1;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.enablePan = true;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 55;
    this.controls.target.set(0, 0.25, 0);
    this.controls.addEventListener("start", () => {
      this.idleTurn = false;
      this.cameraTween = null;
    });
    this.ray = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.clock = new THREE.Clock();
    this.textures = [];
    this.canvas = this.renderer.domElement;
    this.handlers = {
      move: (e) => this.pointerMove(e),
      down: (e) => this.pointerDown(e),
      up: (e) => this.pointerUp(e),
      leave: () => {
        if (!this.drag) this.hover(null);
      },
      key: (e) => this.key(e),
    };
    this.canvas.addEventListener("pointerdown", this.handlers.down, true);
    this.canvas.addEventListener("pointermove", this.handlers.move);
    this.canvas.addEventListener("pointerup", this.handlers.up);
    this.canvas.addEventListener("pointercancel", this.handlers.up);
    this.canvas.addEventListener("pointerleave", this.handlers.leave);
    document.addEventListener("keydown", this.handlers.key);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(mount);
    this.resize();
    el("#studio-assemble").onclick = () => this.toggleAssembly();
    el("#studio-rotate").onclick = () => this.setMode("rotate");
    el("#studio-move").onclick = () => this.setMode("move");
    el("#studio-flip").onclick = () => this.flip();
    el("#studio-reset").onclick = () => this.reset();
    el("#studio-subparts").onclick = () => this.enterChildren();
    el("#studio-deselect").onclick = () => this.select(null);
    el("#studio-back").onclick = () => {
      if (this.selected) this.select(null);
      this.back();
    };
    this.render();
    this.load();
    window.peekStudio = this;
  }
  async load() {
    try {
      await Promise.all(
        ["front", "back"].map(async (name) => {
          const image = await new Promise((resolve, reject) => {
            const i = new Image();
            i.onload = () => resolve(i);
            i.onerror = reject;
            i.src = `samsung/${name}-reference.png`;
          });
          this.assets[name] = image;
        }),
      );
      if (this.disposed) return;
      this.build(samsungParts);
      el("#studio-loading").hidden = true;
      el("#studio-status").textContent = "Reference model ready";
      this.root.classList.add("studio-ready-state");
      if (this.requestedStart) {
        this.requestedStart = false;
        this.start();
      }
    } catch (error) {
      if (this.disposed) return;
      el("#studio-loading").innerHTML =
        'The reference images could not load. <button onclick="location.reload()">Try again</button>';
      console.error(error);
    }
  }
  texture(rect, side, id) {
    if (!rect) return null;
    const img = this.assets[side],
      canvas = document.createElement("canvas");
    canvas.width = Math.min(768, Math.round(rect[2] * 2));
    canvas.height = Math.min(1024, Math.round(rect[3] * 2));
    const ctx = canvas.getContext("2d");
    // A contour mask isolates each photo region on its own mesh; the original references remain intact.
    let poly = [
      [0.03, 0.02],
      [0.96, 0.02],
      [0.99, 0.97],
      [0.04, 0.99],
    ];
    if (id === "display" || id === "oled")
      poly =
        side === "front"
          ? [
              [0, 0.08],
              [0.94, 0],
              [1, 0.99],
              [0, 0.95],
            ]
          : [
              [0.01, 0.07],
              [0.97, 0],
              [1, 0.99],
              [0.02, 0.94],
            ];
    if (id === "back" || id === "rear-panel")
      poly = [
        [0.01, 0],
        [0.98, 0.08],
        [0.98, 0.96],
        [0.03, 1],
      ];
    if (id === "frame" || id === "frame-body")
      poly = [
        [0.02, 0.01],
        [0.98, 0.04],
        [0.99, 0.97],
        [0.01, 1],
      ];
    if (id === "board" || id === "pcb")
      poly = [
        [0.07, 0.01],
        [0.3, 0.03],
        [0.34, 0],
        [0.65, 0.03],
        [0.7, 0.08],
        [0.94, 0.06],
        [0.99, 0.97],
        [0.1, 1],
        [0.01, 0.94],
        [0.04, 0.7],
        [0, 0.65],
        [0.03, 0.3],
      ];
    if (id === "battery" || id === "cell")
      poly = [
        [0.03, 0.01],
        [0.94, 0.04],
        [1, 0.97],
        [0.05, 1],
      ];
    if (id === "pen" || id === "pen-body")
      poly = [
        [0.3, 0],
        [0.7, 0],
        [0.94, 0.1],
        [0.82, 0.88],
        [0.5, 1],
        [0.18, 0.88],
        [0.12, 0.1],
      ];
    ctx.beginPath();
    poly.forEach(([x, y], i) =>
      i
        ? ctx.lineTo(x * canvas.width, y * canvas.height)
        : ctx.moveTo(x * canvas.width, y * canvas.height),
    );
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, ...rect, 0, 0, canvas.width, canvas.height);
    // Flood only neutral grey connected to the contour edge; preserve enclosed metal and circuitry.
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = pixels.data,
      w = canvas.width,
      h = canvas.height;
    const visited = new Uint8Array(w * h),
      queue = new Int32Array(w * h);
    let tail = 0,
      head = 0;
    const candidate = (n) => {
      const k = n * 4,
        r = d[k],
        gg = d[k + 1],
        b = d[k + 2];
      return (
        d[k + 3] === 0 ||
        (Math.max(r, gg, b) - Math.min(r, gg, b) < 22 && r > 62 && r < 155)
      );
    };
    const add = (n) => {
      if (n < 0 || n >= w * h || visited[n] || !candidate(n)) return;
      visited[n] = 1;
      queue[tail++] = n;
    };
    for (let x = 0; x < w; x++) {
      add(x);
      add((h - 1) * w + x);
    }
    for (let y = 0; y < h; y++) {
      add(y * w);
      add(y * w + w - 1);
    }
    while (head < tail) {
      const n = queue[head++],
        x = n % w;
      d[n * 4 + 3] = 0;
      if (x > 0) add(n - 1);
      if (x < w - 1) add(n + 1);
      add(n - w);
      add(n + w);
    }
    ctx.putImageData(pixels, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
    this.textures.push(tex);
    return tex;
  }
  mesh(data) {
    const [w, h, d] = data.size,
      g = new THREE.Group();
    g.userData.data = data;
    const sideColor = data.id.includes("glass")
      ? 0xa8b3cc
      : data.category === "CONNECTIVITY"
        ? 0x6a5142
        : 0x606773;
    const bodyMat = new THREE.MeshStandardMaterial({
      color: sideColor,
      metalness: 0.8,
      roughness: 0.3,
      transparent: true,
    });
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(w * 0.975, h * 0.975, d),
      bodyMat,
    );
    g.add(body);
    const front = this.texture(data.front, "front", data.id),
      back = this.texture(data.back, "back", data.id);
    if (front || back) {
      const frontMat = new THREE.MeshBasicMaterial({
        map: front || back,
        transparent: true,
        alphaTest: 0.12,
        side: THREE.FrontSide,
      });
      const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), frontMat);
      face.position.z = d / 2 + 0.002;
      g.add(face);
      const backMat = new THREE.MeshBasicMaterial({
        map: back || front,
        transparent: true,
        alphaTest: 0.12,
        side: THREE.FrontSide,
      });
      const reverse = new THREE.Mesh(new THREE.PlaneGeometry(w, h), backMat);
      reverse.position.z = -d / 2 - 0.002;
      reverse.rotation.y = Math.PI;
      g.add(reverse);
      body.material = [
        bodyMat,
        bodyMat,
        bodyMat,
        bodyMat,
        new THREE.MeshBasicMaterial({ visible: false }),
        new THREE.MeshBasicMaterial({ visible: false }),
      ];
      body.scale.set(0.96, 0.975, 1);
    } else {
      body.material.color.set(data.id.includes("glass") ? 0x8199af : 0x323743);
      body.material.roughness = 0.27;
      if (data.id.includes("glass")) {
        body.material.opacity = 0.45;
        body.material.metalness = 0.1;
      }
      if (data.id.includes("screw")) {
        body.visible = false;
        const screw = new THREE.Mesh(
          new THREE.CylinderGeometry(w * 0.4, w * 0.4, h, 16),
          bodyMat.clone(),
        );
        g.add(screw);
        const head = new THREE.Mesh(
          new THREE.CylinderGeometry(w * 0.8, w * 0.8, 0.08, 20),
          bodyMat.clone(),
        );
        head.position.y = h / 2;
        g.add(head);
      }
      if (data.id.includes("rings"))
        for (let i = 0; i < 3; i++) {
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.27, 0.045, 12, 36),
            bodyMat.clone(),
          );
          ring.position.set(
            i === 2 ? 0.4 : -0.35,
            i === 2 ? 0 : i === 0 ? 0.5 : -0.5,
            0.1,
          );
          g.add(ring);
        }
      if (
        data.id.includes("nfc") ||
        data.id.includes("connector") ||
        data.id.includes("protection")
      )
        for (let i = 0; i < 6; i++) {
          const contact = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 0.15, 0.018),
            new THREE.MeshStandardMaterial({
              color: 0xc6a65b,
              metalness: 0.8,
              roughness: 0.3,
              transparent: true,
            }),
          );
          contact.position.set(
            -w * 0.4 + i * w * 0.15,
            -h * 0.4,
            d / 2 + 0.015,
          );
          g.add(contact);
        }
    }
    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(
        new THREE.BoxGeometry(w * 1.025, h * 1.025, d * 1.08),
      ),
      new THREE.LineBasicMaterial({
        color: 0x9793ff,
        transparent: true,
        opacity: 0,
      }),
    );
    g.add(edge);
    g.userData.outline = edge;
    if (this.cssMode) this.cssPart(g, data, front, back);
    g.traverse((o) => {
      if (o.isMesh) o.userData.owner = g;
    });
    g.userData.target = new THREE.Vector3();
    g.userData.scaleTarget = 1;
    g.userData.index = this.parts.length;
    return g;
  }
  cssPart(g, data, front, back) {
    const [w, h, d] = data.size.map((v) => v * 100),
      shell = document.createElement("div");
    shell.className = "css-part";
    shell.style.cssText = `width:${w}px;height:${h}px;transform-style:preserve-3d;position:relative;pointer-events:none;`;
    const surface = (cls, tex, transform, style = "") => {
      const f = document.createElement("div");
      f.className = "css-part-face " + cls;
      f.style.cssText = `position:absolute;backface-visibility:hidden;border-radius:2px;${style}transform:${transform};`;
      if (tex) f.style.backgroundImage = `url(${tex.image.toDataURL()})`;
      else
        f.style.background =
          "linear-gradient(135deg,#768290,#222a35 65%,#606b7a)";
      f.style.backgroundSize = "100% 100%";
      shell.append(f);
      return f;
    };
    surface(
      "css-part-front",
      front || back,
      `translateZ(${d / 2}px)`,
      `width:${w}px;height:${h}px;left:0;top:0;`,
    );
    surface(
      "css-part-back",
      back || front,
      `rotateY(180deg) translateZ(${d / 2}px)`,
      `width:${w}px;height:${h}px;left:0;top:0;`,
    );
    for (const side of [-1, 1]) {
      surface(
        "css-part-edge",
        null,
        `rotateY(${side * 90}deg) translateZ(${w / 2}px)`,
        `width:${d}px;height:${h}px;left:${(w - d) / 2}px;top:0;`,
      );
      surface(
        "css-part-edge",
        null,
        `rotateX(${side * 90}deg) translateZ(${h / 2}px)`,
        `width:${w}px;height:${d}px;left:0;top:${(h - d) / 2}px;`,
      );
    }
    const obj = new CSS3DObject(shell);
    obj.scale.setScalar(0.01);
    g.add(obj);
    g.userData.cssShell = shell;
  }
  build(data) {
    for (const g of this.parts) {
      this.world.remove(g);
      g.userData.cssShell?.remove();
      g.traverse((o) => {
        o.geometry?.dispose();
        if (o.material)
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
            m.dispose(),
          );
      });
    }
    this.textures.forEach((t) => t.dispose());
    this.textures = [];
    this.parts = [];
    el("#studio-labels").innerHTML = "";
    data.forEach((d, i) => {
      const g = this.mesh(d);
      g.userData.index = i;
      this.parts.push(g);
      this.world.add(g);
      g.position.copy(this.assembledPosition(g, i));
      const label = document.createElement("button");
      label.className = "part-pin";
      label.innerHTML = `<span class="pin-dot"></span><span><small>${String(i + 1).padStart(2, "0")}</small>${esc(d.name)}</span>`;
      label.setAttribute("aria-label", `Inspect ${d.name}`);
      label.onclick = () => this.select(g);
      label.onpointerenter = (e) => this.hover(g, e.clientX, e.clientY);
      label.onpointerleave = () => this.hover(null);
      label.onfocus = () => {
        const r = label.getBoundingClientRect();
        this.hover(g, r.x, r.y);
      };
      label.onblur = () => this.hover(null);
      g.userData.label = label;
      el("#studio-labels").append(label);
    });
    this.layout();
    el("#studio-counter").textContent =
      `${data.length} ${this.parent ? "SUBCOMPONENTS" : "ASSEMBLIES"} / 2 SURFACES`;
    this.resetCamera();
  }
  assembledPosition(g, i) {
    if (this.parent)
      return new THREE.Vector3(0, 0.2, (i - this.parts.length / 2) * 0.06);
    const p = assemblyPlacement(g.userData.data.id);
    return new THREE.Vector3(p.x, p.y, p.z);
  }

  layout() {
    this.mobile = this.mount.clientWidth < 700;
    this.parts.forEach((g, i) => {
      let p;
      if (this.parent) {
        const n = this.parts.length,
          columns = this.mobile ? 2 : Math.min(n, 4),
          rows = Math.ceil(n / columns),
          col = i % columns,
          row = Math.floor(i / columns);
        p = new THREE.Vector3(
          (col - (Math.min(n, columns) - 1) / 2) * 3,
          ((rows - 1) / 2) * 3 - row * 3,
          0.1,
        );
      } else if (this.mobile) {
        if (i < 8)
          p = new THREE.Vector3(
            ((i % 3) - 1) * 2.65,
            4.3 - Math.floor(i / 3) * 4.85,
            0,
          );
        else {
          const j = i - 8;
          p = new THREE.Vector3(
            ((j % 4) - 1.5) * 1.95,
            -7.8 - Math.floor(j / 4) * 1.7,
            0,
          );
        }
      } else if (i < 8)
        p = new THREE.Vector3(
          (i - 3.5) * 2.25 + 0.7,
          0.85,
          Math.sin(i * 0.9) * 0.24,
        );
      else if (i === 8 || i === 9)
        p = new THREE.Vector3(i === 8 ? -9.3 : -8.6, 0.85, 0.1);
      else {
        const j = i - 10;
        p = new THREE.Vector3((j - 4) * 1.975, -3.1, 0.35);
      }
      g.userData.exploded = p;
      g.userData.assembled = this.assembledPosition(g, i);
      g.userData.target.copy(this.exploded ? p : g.userData.assembled);
      g.userData.scaleTarget =
        this.exploded || this.parent
          ? 1
          : assemblyPlacement(g.userData.data.id).scale;
    });
  }
  resize() {
    if (this.disposed) return;
    const w = this.mount.clientWidth,
      h = this.mount.clientHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    if (this.parts.length) {
      this.layout();
      if (!this.selected) this.resetCamera();
    }
  }
  fullDistance() {
    if (!this.exploded) return this.mobile ? 12 : 10;
    if (this.parent)
      return this.mobile
        ? 20
        : Math.max(15, (this.parts.length * 3.1) / this.camera.aspect);
    return this.mobile
      ? 38
      : Math.max(
          14,
          21 /
            (2 * Math.tan(THREE.MathUtils.degToRad(17.5)) * this.camera.aspect),
        );
  }
  resetCamera() {
    this.cameraTween = {
      position: new THREE.Vector3(
        !this.exploded && !this.parent ? 2.8 : 0,
        this.exploded && this.mobile && !this.parent ? -2.2 : 0.3,
        this.fullDistance(),
      ),
      target: new THREE.Vector3(
        0,
        this.exploded && this.mobile && !this.parent ? -2.2 : 0.2,
        0,
      ),
    };
  }
  async start() {
    if (!this.parts.length) {
      this.requestedStart = true;
      return;
    }
    this.started = true;
    this.parent = null;
    this.selected = null;
    this.hover(null);
    this.build(samsungParts);
    this.root.classList.add("has-started");
    this.exploded = false;
    this.layout();
    this.resetCamera();
    this.parts.forEach((g) => g.position.copy(g.userData.assembled));
    clearTimeout(this.startTimer);
    this.startTimer = setTimeout(
      () => {
        if (!this.disposed) {
          this.exploded = true;
          this.layout();
          this.resetCamera();
          this.updateControls();
        }
      },
      this.reduced ? 0 : 700,
    );
    el("#studio-trail").hidden = true;
    el("#studio-selection").hidden = true;
    this.updateControls();
  }
  toggleAssembly() {
    clearTimeout(this.startTimer);
    if (!this.started) {
      this.start();
      return;
    }
    if (this.parent) {
      this.back();
      return;
    }
    this.select(null);
    this.exploded = !this.exploded;
    this.world.rotation.set(0, 0, 0);
    this.parts.forEach((g) => {
      g.quaternion.identity();
      g.userData.rotationGoal = null;
    });
    this.layout();
    this.resetCamera();
    this.updateControls();
  }
  updateControls() {
    this.root.dataset.view = this.parent
      ? "subcomponents"
      : this.exploded
        ? "exploded"
        : "assembled";
    el("#studio-assemble").setAttribute(
      "aria-pressed",
      String(!this.exploded && !this.parent),
    );
    el("#studio-assemble").innerHTML = this.parent
      ? "Full device <span>↖</span>"
      : this.exploded
        ? "Assemble <span>↙</span>"
        : "Explode <span>↗</span>";
    el("#studio-hint").textContent = this.selected
      ? "Drag part to " + this.mode + " · Scroll to zoom · Esc to return"
      : this.exploded
        ? "Hover to discover · Click to inspect · Drag to orbit"
        : "19 assemblies. One extraordinary device.";
    el("#studio-status").textContent = this.parent
      ? "Exploring subcomponents"
      : this.exploded
        ? "Every layer, uncovered"
        : "Reference model ready";
  }
  setMode(mode) {
    this.mode = mode;
    for (const m of ["rotate", "move"]) {
      el("#studio-" + m).classList.toggle("is-active", mode === m);
      el("#studio-" + m).setAttribute("aria-pressed", String(mode === m));
    }
    this.updateControls();
    if (mode === "move" && !this.selected)
      toast("Select a component, then drag it to move.");
  }
  select(g) {
    if (g && !this.started) {
      this.start();
      return;
    }
    this.hover(null);
    this.selected = g;
    this.idleTurn = false;
    this.world.rotation.set(0, 0, 0);
    this.parts.forEach((p) => {
      p.userData.target.copy(
        this.exploded ? p.userData.exploded : p.userData.assembled,
      );
      p.userData.scaleTarget =
        this.exploded || this.parent
          ? 1
          : assemblyPlacement(p.userData.data.id).scale;
      p.userData.label.classList.toggle("is-selected", p === g);
    });
    el("#studio-selection").hidden = !g;
    this.root.classList.toggle("has-selection", !!g);
    if (g) {
      const d = g.userData.data;
      g.userData.target.set(0, 0.5, 1);
      const h = d.size[1],
        w = d.size[0];
      g.userData.scaleTarget = Math.min(1.7, 4.5 / Math.max(h, w));
      this.cameraTween = {
        position: new THREE.Vector3(
          0,
          0.5,
          Math.max(9, 7 / this.camera.aspect),
        ),
        target: new THREE.Vector3(0, 0.5, 0),
      };
      el("#selection-category").textContent = d.category;
      el("#selection-name").textContent = d.name;
      el("#studio-subparts").hidden = !d.children.length;
      let depth = el("#studio-depth");
      if (depth) depth.remove();
      const wrap = document.createElement("label");
      wrap.id = "studio-depth";
      wrap.innerHTML =
        'Depth <input type="range" min="-3" max="4" step="0.05" value="1" aria-label="Component depth">';
      el("#studio-selection").append(wrap);
      wrap.querySelector("input").oninput = (e) => {
        g.userData.target.z = +e.target.value;
      };
    } else {
      el("#studio-depth")?.remove();
      this.resetCamera();
    }
    this.updateControls();
  }
  enterChildren() {
    if (!this.selected?.userData.data.children.length) return;
    this.parent = this.selected.userData.data;
    this.selected = null;
    this.hover(null);
    this.exploded = true;
    this.build(this.parent.children);
    el("#studio-selection").hidden = true;
    this.root.classList.remove("has-selection");
    el("#studio-trail").hidden = false;
    el("#studio-trail-name").textContent = this.parent.name;
    this.updateControls();
  }
  back() {
    if (this.selected) {
      this.select(null);
      return;
    }
    if (!this.parent) return;
    this.parent = null;
    this.exploded = true;
    this.build(samsungParts);
    el("#studio-trail").hidden = true;
    this.updateControls();
  }
  reset() {
    this.world.rotation.set(0, 0, 0);
    this.parts.forEach((g) => {
      g.quaternion.identity();
      g.userData.rotationGoal = null;
    });
    this.select(null);
  }
  flip() {
    if (this.selected) {
      const g = this.selected;
      g.userData.rotationGoal = g.quaternion
        .clone()
        .premultiply(
          new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            Math.PI,
          ),
        );
    } else {
      this.world.rotation.y += Math.PI;
      this.idleTurn = false;
    }
  }
  hit(e) {
    if (!this.exploded && !this.parent) return null;
    const r = this.canvas.getBoundingClientRect();
    this.pointer.set(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      (-(e.clientY - r.top) / r.height) * 2 + 1,
    );
    this.ray.setFromCamera(this.pointer, this.camera);
    return this.ray
      .intersectObjects(this.parts, true)
      .find((h) => h.object.isMesh && h.object.visible)?.object.userData.owner;
  }
  pointerDown(e) {
    if (e.button !== 0) return;
    const g = this.hit(e);
    this.down = { x: e.clientX, y: e.clientY, g };
    if (g && g === this.selected) {
      this.controls.enabled = false;
      this.cameraTween = null;
      this.drag = { x: e.clientX, y: e.clientY, g };
      this.canvas.setPointerCapture(e.pointerId);
      this.hover(null);
    }
  }
  pointerMove(e) {
    if (this.drag) {
      const { g } = this.drag,
        dx = e.clientX - this.drag.x,
        dy = e.clientY - this.drag.y;
      this.drag.x = e.clientX;
      this.drag.y = e.clientY;
      g.userData.rotationGoal = null;
      if (this.mode === "rotate") {
        const q = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(dy * 0.009, dx * 0.009, 0),
        );
        g.quaternion.premultiply(q);
      } else {
        const scale =
          this.camera.position.distanceTo(this.controls.target) * 0.001;
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(
          this.camera.quaternion,
        );
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(
          this.camera.quaternion,
        );
        g.userData.target
          .addScaledVector(right, dx * scale)
          .addScaledVector(up, -dy * scale);
        g.position.copy(g.userData.target);
      }
      return;
    }
    const g = this.hit(e);
    this.hover(g, e.clientX, e.clientY);
  }
  pointerUp(e) {
    const moved = this.down
      ? Math.hypot(e.clientX - this.down.x, e.clientY - this.down.y)
      : 100;
    const wasDragging = !!this.drag;
    this.drag = null;
    this.controls.enabled = true;
    if (this.canvas.hasPointerCapture(e.pointerId))
      this.canvas.releasePointerCapture(e.pointerId);
    if (moved < 5 && this.down?.g && !wasDragging) this.select(this.down.g);
    this.down = null;
  }
  hover(g, x = 0, y = 0) {
    this.hovered = g;
    const tip = el("#studio-tip");
    if (!tip) return;
    tip.hidden = !g;
    this.canvas.style.cursor = g
      ? g === this.selected
        ? this.mode === "move"
          ? "move"
          : "grab"
        : "pointer"
      : "grab";
    if (!g) return;
    const d = g.userData.data;
    tip.innerHTML = `<span>${esc(d.category)}</span><h3>${esc(d.name)}</h3><p>${esc(d.description)}</p><small>${d.children.length ? `${d.children.length} subcomponents · ` : ""}Click to inspect in 3D</small>`;
    const r = this.root.getBoundingClientRect(),
      tw = 270,
      th = tip.offsetHeight;
    tip.style.left =
      Math.max(10, Math.min(x - r.left + 20, r.width - tw - 15)) + "px";
    tip.style.top =
      Math.max(10, Math.min(y - r.top + 18, r.height - th - 80)) + "px";
  }
  key(e) {
    if (
      !this.mount.isConnected ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)
    )
      return;
    if (e.key === "Escape") {
      if (el("#studio-help-dialog").open) return;
      this.back();
    }
    if (!this.selected) return;
    const g = this.selected;
    const arrows = {
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
    };
    if (arrows[e.key]) {
      e.preventDefault();
      const [y, x] = arrows[e.key];
      if (e.shiftKey)
        g.userData.target.add(new THREE.Vector3(x * 0.15, -y * 0.15, 0));
      else
        g.quaternion.premultiply(
          new THREE.Quaternion().setFromEuler(
            new THREE.Euler(y * 0.12, x * 0.12, 0),
          ),
        );
    }
  }
  render = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.render);
    const dt = Math.min(this.clock.getDelta(), 0.05),
      t = this.clock.elapsedTime,
      k = this.reduced ? 1 : 1 - Math.exp(-dt * 5);
    this.closedAmount = THREE.MathUtils.lerp(
      this.closedAmount,
      !this.exploded && !this.parent ? 1 : 0,
      k,
    );
    if (this.closedAmount > 0.995) this.closedAmount = 1;
    else if (this.closedAmount < 0.005) this.closedAmount = 0;
    const assemblyReady = String(
      this.closedAmount === 1 && !this.exploded && !this.parent,
    );
    if (this.root.dataset.assemblyReady !== assemblyReady)
      this.root.dataset.assemblyReady = assemblyReady;
    const showExterior = this.closedAmount > 0.01 && !this.parent;
    this.exterior.group.visible = showExterior;
    this.exterior.group.traverse((o) => {
      if (o.isMesh)
        (Array.isArray(o.material) ? o.material : [o.material]).forEach(
          (m) => (m.opacity = this.closedAmount),
        );
    });
    if (this.exterior.shell) {
      this.exterior.shell.style.display =
        showExterior && this.closedAmount > 0.8 ? "" : "none";
      this.exterior.shell.style.opacity = "1";
    }
    if (this.cameraTween) {
      this.camera.position.lerp(this.cameraTween.position, k);
      this.controls.target.lerp(this.cameraTween.target, k);
      if (this.camera.position.distanceTo(this.cameraTween.position) < 0.01)
        this.cameraTween = null;
    }
    if (this.idleTurn && !this.started && !this.reduced)
      this.world.rotation.y = Math.sin(t * 0.18) * 0.13 - 0.2;
    for (const g of this.parts) {
      g.visible = this.closedAmount < 0.99 || !!this.parent;
      g.position.lerp(g.userData.target, k);
      g.scale.lerp(new THREE.Vector3().setScalar(g.userData.scaleTarget), k);
      if (g.userData.rotationGoal)
        g.quaternion.slerp(g.userData.rotationGoal, k);
      const active = g === this.selected || g === this.hovered;
      g.userData.outline.material.opacity = THREE.MathUtils.lerp(
        g.userData.outline.material.opacity,
        active ? 0.7 : 0,
        k,
      );
      g.traverse((o) => {
        if (o.isMesh && o.material) {
          const target =
            (this.selected && g !== this.selected ? 0.13 : 1) *
            (1 - this.closedAmount);
          (Array.isArray(o.material) ? o.material : [o.material]).forEach(
            (m) => {
              if (m.visible !== false)
                m.opacity = THREE.MathUtils.lerp(m.opacity, target, k);
            },
          );
        }
      });
      const p = g.localToWorld(
        new THREE.Vector3(
          0,
          g.userData.data.size[1] / 2 +
            0.24 +
            (!this.mobile && g.userData.index % 2 === 1 ? 0.34 : 0),
          0,
        ),
      );
      p.project(this.camera);
      const visible =
        this.exploded && (!this.selected || g === this.selected) && p.z < 1;
      const label = g.userData.label;
      label.hidden = !visible;
      label.style.transform = `translate(${(p.x * 0.5 + 0.5) * this.mount.clientWidth}px,${(-p.y * 0.5 + 0.5) * this.mount.clientHeight}px) translate(-50%,-100%)`;
    }
    this.controls.update();
    for (const g of this.parts) {
      const shell = g.userData.cssShell;
      if (shell) {
        shell.style.display = g.visible ? "" : "none";
        shell.querySelectorAll(".css-part-face").forEach((f) => {
          f.style.opacity = String(
            (this.selected && g !== this.selected ? 0.13 : 1) *
              (1 - this.closedAmount),
          );
        });
        shell.classList.toggle(
          "is-highlighted",
          g === this.selected || g === this.hovered,
        );
      }
    }
    this.renderer.render(this.scene, this.camera);
  };
  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    clearTimeout(this.startTimer);
    this.resizeObserver.disconnect();
    this.controls.dispose();
    for (const [event, fn] of [
      ["pointerdown", this.handlers.down],
      ["pointermove", this.handlers.move],
      ["pointerup", this.handlers.up],
      ["pointercancel", this.handlers.up],
      ["pointerleave", this.handlers.leave],
    ])
      this.canvas.removeEventListener(event, fn, event === "pointerdown");
    document.removeEventListener("keydown", this.handlers.key);
    this.scene.traverse((o) => {
      o.geometry?.dispose();
      if (o.material)
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
          m.dispose(),
        );
    });
    this.textures.forEach((t) => t.dispose());
    this.exterior.textures.forEach((t) => t.dispose());
    this.exterior.shell?.remove();
    this.renderer.dispose();
    const thumb = this.root.querySelector("#upload-thumb");
    if (thumb?.dataset.url) URL.revokeObjectURL(thumb.dataset.url);
  }
}
route();
