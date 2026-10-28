const parts = [
  [
    "Rear cover",
    "shell",
    3,
    9,
    13,
    58,
    "Protects the internal assemblies and gives the device its outer finish.",
    "Glass or composite shell • illustrative burgundy finish",
    ["Outer shell", "Camera aperture", "Adhesive seal"],
  ],
  [
    "Camera lens cover",
    "lenscover",
    19,
    10,
    10,
    21,
    "Protective windows shield each camera lens from scratches and dust.",
    "Optical windows • surrounding protective bezel",
    ["Lens windows", "Metal bezel", "Gasket"],
  ],
  [
    "Rear camera module",
    "camera",
    32,
    10,
    10,
    22,
    "Converts focused light into image data. Multiple lenses offer different fields of view.",
    "Illustrative multi-camera assembly",
    ["Optical lens", "Image sensor", "Stabilizer"],
  ],
  [
    "Flash module",
    "flash",
    45,
    13,
    5,
    14,
    "A small LED light source illuminates nearby subjects for photography.",
    "LED package • driver electronics",
    ["LED emitter", "Diffuser", "Driver chip"],
  ],
  [
    "Midframe",
    "frame",
    53,
    10,
    12,
    58,
    "The structural chassis supports the display, circuit boards and battery.",
    "Machined support structure • mounting points",
    ["Frame rails", "Mounting bosses", "Thermal plate"],
  ],
  [
    "Mainboard",
    "board",
    69,
    12,
    10,
    54,
    "Connects the processor, memory, power management and wireless systems.",
    "Illustrative circuit layout • shielded electronics",
    ["Processor", "Memory package", "Radio circuitry"],
  ],
  [
    "Display panel",
    "display",
    82,
    10,
    7,
    57,
    "An emissive display layer produces the image you see on the screen.",
    "OLED-style assembly • display driver",
    ["Pixel matrix", "Driver circuit", "Backing layer"],
  ],
  [
    "Display glass",
    "glass",
    92,
    10,
    6,
    57,
    "The outer transparent surface protects the touch and display layers.",
    "Protective glass • sensor openings",
    ["Cover glass", "Touch layer", "Surface coating"],
  ],
  [
    "Battery",
    "battery",
    20,
    39,
    12,
    28,
    "Stores the energy used by the device. A protection circuit monitors operation.",
    "Rechargeable cell • capacity varies by device",
    ["Cell stack", "Protection board", "Power connector"],
  ],
  [
    "Wireless charging coil",
    "coil",
    37,
    42,
    11,
    23,
    "Receives energy through a magnetic field from a compatible charging pad.",
    "Copper winding • magnetic shielding",
    ["Copper winding", "Ferrite shield", "Flex connector"],
  ],
  [
    "Side buttons",
    "buttons",
    5,
    82,
    8,
    9,
    "Mechanical controls transfer presses to small switches inside the frame.",
    "Power and volume controls",
    ["Button cap", "Switch", "Bracket"],
  ],
  [
    "Flex cables",
    "flex",
    19,
    80,
    14,
    12,
    "Flexible printed circuits connect assemblies in a compact space.",
    "Copper traces • flexible insulation",
    ["Copper traces", "Insulation film", "Connectors"],
  ],
  [
    "Charging port",
    "port",
    37,
    82,
    11,
    9,
    "Connects external power and data through a physical connector.",
    "USB-C-style port • daughterboard",
    ["Connector shell", "Contact pins", "Port board"],
  ],
  [
    "Loudspeaker",
    "speaker",
    52,
    81,
    10,
    10,
    "Converts electrical signals into audible sound through a moving diaphragm.",
    "Speaker enclosure • electrical contacts",
    ["Diaphragm", "Voice coil", "Magnet"],
  ],
  [
    "Haptic motor",
    "motor",
    65,
    83,
    7,
    8,
    "Creates controlled vibrations for tactile feedback.",
    "Linear actuator concept",
    ["Moving mass", "Coil", "Suspension"],
  ],
  [
    "Earpiece speaker",
    "earpiece",
    76,
    83,
    7,
    7,
    "A compact speaker delivers call audio near the top of the device.",
    "Compact acoustic assembly",
    ["Mesh grille", "Diaphragm", "Contacts"],
  ],
  [
    "Front camera",
    "front",
    86,
    81,
    5,
    9,
    "Captures images from the front of the device.",
    "Lens and sensor assembly",
    ["Lens", "Sensor", "Flex connector"],
  ],
  [
    "Mounting screws",
    "screws",
    94,
    83,
    4,
    8,
    "Fasten brackets and assemblies to the structural frame.",
    "Illustrative fastener set",
    ["Screw head", "Threaded shaft"],
  ],
];
let activePart = -1,
  uploadUrl = "",
  partTimer;
function partArt(type) {
  let lenses =
    '<i class="lens l1"></i><i class="lens l2"></i><i class="lens l3"></i>';
  let chips = Array.from(
    { length: 12 },
    (_, i) =>
      `<i class="chip chip${i}" style="left:${8 + (i % 3) * 30}%;top:${8 + Math.floor(i / 3) * 22}%;width:${i % 3 === 0 ? 24 : 18}%;height:16%"></i>`,
  ).join("");
  return `<div class="solid ${type}"><div class="face front-face">${["camera", "lenscover", "shell"].includes(type) ? lenses : ""}${["board", "port", "flash"].includes(type) ? chips : ""}${type === "frame" ? '<i class="frame-inner"></i>' + Array.from({ length: 12 }, (_, i) => `<i class="screw-dot" style="top:${5 + (i % 6) * 17}%;left:${i < 6 ? 5 : 89}%"></i>`).join("") : ""}${type === "battery" ? '<span class="battery-print">PEEK<br><small>Li-ion<br>RECHARGEABLE<br>+ &nbsp; −<br>▥ ▥ ▥</small></span>' : ""}${type === "coil" ? '<i class="coil-rings"></i>' : ""}${type === "port" ? '<i class="usb"></i>' : ""}${type === "flash" ? '<i class="led"></i>' : ""}${["speaker", "earpiece"].includes(type) ? '<i class="grille"></i>' : ""}${["front"].includes(type) ? '<i class="lens l1"></i>' : ""}${type === "flex" ? '<i class="flex-path"></i>' : ""}${type === "buttons" ? "<i></i><i></i><i></i>" : ""}${type === "screws" ? Array.from({ length: 6 }, () => '<i class="fastener"></i>').join("") : ""}${type === "glass" ? '<i class="notch"></i>' : ""}</div><div class="face back-face"></div><div class="edge edge-left"></div><div class="edge edge-right"></div></div>`;
}
home = function () {
  cancelAnimationFrame(frame);
  $("#main").innerHTML =
    `<section class="upload-hero"><span class="eyebrow">A new perspective on your device</span><h1>Upload to explore<br><em>the technology inside out.</em></h1><p>One image. A closer look at every component.</p><label class="upload-large" id="dropzone"><span class="upload-symbol">↑</span><strong>Upload your device image</strong><span>Choose an image or drop it here</span><small>JPG, PNG or WebP · up to 10 MB</small><input id="device-upload" type="file" accept="image/*"></label><div class="demo-selector"><label for="home-device">Choose your demo device</label><select id="home-device" onchange="switchDemo(+this.value)">${options(model)}</select><span id="demo-description">${model === 0 ? "iPhone 18 · your supplied component concept" : "Samsung S23 Ultra · illustrative internal layout"}</span></div><div class="upload-alternative"><span>Just looking around?</span> <button onclick="revealParts()">Explore a sample device ↗</button></div><p class="note">Interactive prototype · Images stay in your browser. The teardown is an illustrative sample, not image-derived hardware.</p></section><section class="teardown-section" id="teardown" hidden><div class="teardown-heading"><div><span class="eyebrow">Beyond the surface</span><h2 id="teardown-title">${model === 0 ? "iPhone 18" : "Samsung S23 Ultra"}. Inside out.</h2><p>Click any component to enlarge it. Drag the enlarged part to rotate in 3D.</p></div><div class="device-upload-preview" id="device-preview"></div><button onclick="assembleToggle(this)">Assemble device</button></div><div class="board-scroll"><div class="parts-board ${model === 1 ? "samsung" : "iphone"}" id="parts-board">${parts.map((p, i) => `<button class="physical-part" aria-label="Explore ${p[0]}" style="--x:${p[2]}%;--y:${p[3]}%;--w:${p[4]}%;--h:${p[5]}%;--delay:${i * 45}ms" onclick="focusPart(${i})"><span class="part-label">${p[0]}</span><div class="part-model">${partArt(p[1])}</div><span class="part-shadow"></span></button>`).join("")}</div></div><div class="teardown-caption"><span>18 individually selectable assemblies</span><span>Illustrative device layout · Not a repair guide</span></div></section><section class="blue-banner"><div><h2>Curiosity goes deeper.</h2><p>Discover the small parts behind the big picture.</p></div><button onclick="location.hash='comparison'">Compare devices ↗</button></section><dialog id="part-dialog" class="part-dialog"><button class="close" onclick="closePart()" aria-label="Close component">×</button><div class="part-dialog-grid"><div class="focus-stage"><span class="badge">DRAG TO ROTATE · 3D COMPONENT</span><div id="focus-model"></div><div class="focus-controls"><button onclick="resetPartRotation()">Reset view</button><button id="part-spin" onclick="togglePartSpin()">Auto rotate</button></div></div><article class="part-information" id="part-info"></article></div></dialog>`;
  $("#device-upload").onchange = (e) => useDeviceImage(e.target.files[0]);
  let drop = $("#dropzone");
  drop.ondragover = (e) => {
    e.preventDefault();
    drop.classList.add("dragover");
  };
  drop.ondragleave = () => drop.classList.remove("dragover");
  drop.ondrop = (e) => {
    e.preventDefault();
    drop.classList.remove("dragover");
    useDeviceImage(e.dataTransfer.files[0]);
  };
  $("#part-dialog").addEventListener("close", () => clearInterval(partTimer));
};
function useDeviceImage(f) {
  if (!f) return;
  if (!f.type.startsWith("image/"))
    return toast("Please choose an image file.");
  if (f.size > 10e6) return toast("Please choose an image under 10 MB.");
  if (uploadUrl) URL.revokeObjectURL(uploadUrl);
  uploadUrl = URL.createObjectURL(f);
  $("#device-preview").innerHTML =
    '<img alt="Your uploaded device"><span>Your image<br><small>Selected demo teardown below</small></span>';
  $("#device-preview img").src = uploadUrl;
  $("#dropzone strong").textContent = "Image ready — explore below";
  revealParts();
}
function revealParts() {
  let section = $("#teardown");
  section.hidden = false;
  $("#parts-board").classList.remove("reveal");
  void section.offsetWidth;
  $("#parts-board").classList.add("reveal");
  section.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
    block: "start",
  });
}
function assembleToggle(b) {
  let assembled = $("#parts-board").classList.toggle("assembled");
  b.textContent = assembled ? "Separate all components" : "Assemble device";
}
let rx = -8,
  ry = -20,
  spinOn = false;
function rotation() {
  let el = $("#focus-model .solid");
  if (el) el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
}
function resetPartRotation() {
  rx = -8;
  ry = -20;
  rotation();
}
function togglePartSpin() {
  spinOn = !spinOn;
  clearInterval(partTimer);
  $("#part-spin").textContent = spinOn ? "Pause rotation" : "Auto rotate";
  if (spinOn)
    partTimer = setInterval(() => {
      ry += 0.7;
      rotation();
    }, 30);
}
function focusPart(i) {
  clearInterval(partTimer);
  spinOn = false;
  activePart = i;
  let p = parts[i];
  $("#part-dialog").classList.toggle("samsung", model === 1);
  $("#focus-model").innerHTML = partArt(p[1]);
  $("#focus-model").className = "focus-" + p[1];
  $("#part-info").innerHTML =
    `<span class="eyebrow">Component ${String(i + 1).padStart(2, "0")} / 18</span><h2>${p[0]}</h2><p>${p[6]}</p><dl><dt>Construction</dt><dd>${p[7]}</dd><dt>Role in the device</dt><dd>${p[6]}</dd></dl><h3>Inside this component</h3><p class="note">Select a subcomponent to inspect its conceptual structure.</p><div class="subparts">${p[8].map((n, j) => `<button onclick="focusSubpart(${j})">${n}<span>↗</span></button>`).join("")}</div><p class="note">Illustrative 3D geometry. Exact specifications depend on the device model.</p>`;
  $("#part-spin").textContent = "Auto rotate";
  resetPartRotation();
  let el = $("#focus-model"),
    down = false,
    last,
    moved;
  el.onpointerdown = (e) => {
    down = true;
    last = [e.clientX, e.clientY];
    el.setPointerCapture(e.pointerId);
    clearInterval(partTimer);
    spinOn = false;
    $("#part-spin").textContent = "Auto rotate";
  };
  el.onpointermove = (e) => {
    if (!down) return;
    ry += (e.clientX - last[0]) * 0.7;
    rx -= (e.clientY - last[1]) * 0.7;
    last = [e.clientX, e.clientY];
    rotation();
  };
  el.onpointerup = el.onpointercancel = () => (down = false);
  if (!$("#part-dialog").open) $("#part-dialog").showModal();
}
function focusSubpart(j) {
  let p = parts[activePart],
    n = p[8][j];
  let type = /lens|optical/i.test(n)
    ? "front"
    : /coil|winding/i.test(n)
      ? "coil"
      : /glass|layer|film|window/i.test(n)
        ? "glass"
        : /sensor|chip|circuit|processor|memory|board|radio/i.test(n)
          ? "board"
          : /connector|pins/i.test(n)
            ? "port"
            : /cell/i.test(n)
              ? "battery"
              : "motor";
  $("#focus-model").innerHTML = partArt(type);
  $("#focus-model").className = "focus-" + type;
  resetPartRotation();
  $("#part-info").innerHTML =
    `<span class="eyebrow">${p[0]} / Subcomponent</span><h2>${n}</h2><p>This ${n.toLowerCase()} is part of the ${p[0].toLowerCase()} assembly. Drag the model to inspect its conceptual form from different angles.</p><p class="note">Simplified structural illustration; materials and dimensions vary by manufacturer.</p><button class="primary" onclick="focusPart(${activePart})">← Back to ${p[0]}</button>`;
}
function closePart() {
  clearInterval(partTimer);
  $("#part-dialog").close();
}
startDemo = async function () {
  if ((location.hash || "#home") !== "#home") {
    location.hash = "home";
    await new Promise((r) => setTimeout(r, 150));
  }
  revealParts();
  toast("Click any part to discover what is inside.");
};
// Initial route is rendered once by samsung-studio.js after all prototype layers load.
window.addEventListener("hashchange", () => clearInterval(partTimer));

function switchDemo(value) {
  model = value;
  let board = $("#parts-board");
  board.classList.toggle("samsung", model === 1);
  board.classList.toggle("iphone", model === 0);
  $("#teardown-title").textContent =
    (model === 0 ? "iPhone 18" : "Samsung S23 Ultra") + ". Inside out.";
  $("#demo-description").textContent =
    model === 0
      ? "iPhone 18 · your supplied component concept"
      : "Samsung S23 Ultra · illustrative internal layout";
  if (!$("#teardown").hidden) {
    board.classList.remove("reveal");
    void board.offsetWidth;
    board.classList.add("reveal");
  }
}
