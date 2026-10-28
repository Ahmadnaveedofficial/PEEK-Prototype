// Source image is preserved unchanged; transparent hotspots follow its component bounds.
const referenceBounds = [
  [2.7, 9.6, 13.5, 62],
  [17.3, 12.4, 10, 20.7],
  [29.2, 10.8, 10.5, 21.8],
  [42, 15.5, 5, 12],
  [49.4, 12, 13.5, 62],
  [64, 15, 12, 59],
  [77.4, 11.4, 9.5, 63],
  [88.7, 11, 9.5, 62],
  [20.3, 38.6, 13, 31.3],
  [34.9, 43, 12, 21.3],
  [4.7, 80, 7.8, 11],
  [14.8, 76.5, 17, 17],
  [33.4, 82, 12, 11],
  [47.5, 81.8, 11, 11.3],
  [60.3, 84, 7.7, 8.9],
  [70.2, 84, 7.2, 8],
  [79.4, 83.4, 5.9, 9.9],
  [88.9, 84.5, 7.4, 8],
];
const baseHome = home,
  baseSwitch = switchDemo,
  baseFocus = focusPart,
  baseSub = focusSubpart;
home = function () {
  baseHome();
  let title = $(".upload-hero .eyebrow");
  title.innerHTML =
    '<span class="signal-dot"></span> EXPLORE / UNDERSTAND / COMPARE';
  let hero = $(".upload-hero");
  hero.insertAdjacentHTML(
    "afterbegin",
    '<div class="tech-orbit orbit-one" aria-hidden="true"></div><div class="tech-orbit orbit-two" aria-hidden="true"></div><div class="hero-coordinate left-coord" aria-hidden="true">PEEK / DEVICE LAB<br>01 — DISCOVERY</div><div class="hero-coordinate right-coord" aria-hidden="true">LOOK CLOSER<br>GO DEEPER ↗</div>',
  );
  $(".upload-large").insertAdjacentHTML(
    "beforeend",
    '<span class="upload-corners" aria-hidden="true"></span>',
  );
  $(".teardown-heading").insertAdjacentHTML(
    "beforeend",
    '<span class="studio-status"><i></i> EXPLORER READY</span>',
  );
  syncReference();
};
function syncReference() {
  const board = $("#parts-board");
  if (!board) return;
  board.classList.toggle("reference-mode", model === 0);
  let old = $("#reference-map");
  if (old) old.remove();
  if (model === 0) {
    board.insertAdjacentHTML(
      "afterbegin",
      `<div class="reference-map" id="reference-map"><img src="iphone18-reference.png" alt="Supplied iPhone 18 concept reference with 18 labeled, separated component groups">${referenceBounds.map((b, i) => `<button class="reference-hotspot" style="left:${b[0]}%;top:${b[1]}%;width:${b[2]}%;height:${b[3]}%" onclick="focusPart(${i})" aria-label="Inspect ${parts[i][0]}"><span>${parts[i][0]} ↗</span></button>`).join("")}<div class="scan-line" aria-hidden="true"></div></div>`,
    );
  }
  const assembly = $(".teardown-heading>button");
  if (assembly) assembly.hidden = model === 0;
  $(".teardown-heading p").textContent =
    model === 0
      ? "Your exact reference. Click a component for a close-up, details and an illustrative 3D view."
      : "Click any component to enlarge it. Drag the enlarged part to rotate in 3D.";
  $(".teardown-caption").innerHTML =
    model === 0
      ? '<span><i class="cyan-dot"></i> YOUR IPHONE 18 CONCEPT REFERENCE</span><span>18 clickable regions · Original artwork preserved</span>'
      : '<span><i class="cyan-dot"></i> SAMSUNG S23 ULTRA DEMO</span><span>Illustrative component geometry</span>';
}
switchDemo = function (v) {
  baseSwitch(v);
  syncReference();
};
focusPart = function (i) {
  baseFocus(i);
  if (model !== 0) return;
  let stage = $(".focus-stage");
  stage.classList.add("reference-focus");
  stage.querySelector(".badge").textContent =
    "YOUR REFERENCE / COMPONENT CLOSE-UP";
  let b = referenceBounds[i];
  $("#focus-model").className = "reference-closeup";
  $("#focus-model").innerHTML =
    `<div class="photo-component" style="width:${Math.min(300, (300 * (b[2] * 1536)) / (b[3] * 1024))}px;height:${Math.min(300, (300 * (b[3] * 1024)) / (b[2] * 1536))}px;aspect-ratio:${b[2] * 1536}/${b[3] * 1024};background-image:url('iphone18-reference.png');background-size:${10000 / b[2]}% ${10000 / b[3]}%;background-position:${(b[0] / (100 - b[2])) * 100}% ${(b[1] / (100 - b[3])) * 100}%" role="img" aria-label="${parts[i][0]} from your supplied image"></div>`;
  $(".focus-controls").innerHTML =
    `<button class="primary" onclick="showIllustrative(${i})">Rotate illustrative 3D ↗</button>`;
  $("#part-info .note:last-child").textContent =
    "This close-up is taken directly from your supplied iPhone 18 concept image. The optional 3D view is a separate simplified illustration.";
};
function showIllustrative(i) {
  baseFocus(i);
  let stage = $(".focus-stage");
  stage.classList.remove("reference-focus");
  stage.querySelector(".badge").textContent =
    "ILLUSTRATIVE 3D / DRAG TO ROTATE";
  $(".focus-controls").innerHTML =
    `<button onclick="focusPart(${i})">← Exact image</button><button onclick="resetPartRotation()">Reset</button><button id="part-spin" onclick="togglePartSpin()">Auto rotate</button>`;
}
// Restore controls before the original selection handler accesses them.
const referenceFocus = focusPart;
focusPart = function (i) {
  $(".focus-controls").innerHTML =
    '<button onclick="resetPartRotation()">Reset view</button><button id="part-spin" onclick="togglePartSpin()">Auto rotate</button>';
  $(".focus-stage").classList.remove("reference-focus");
  referenceFocus(i);
};
const originalShowIllustrative = showIllustrative;
showIllustrative = function (i) {
  $(".focus-controls").innerHTML =
    '<button id="part-spin">Auto rotate</button>';
  originalShowIllustrative(i);
};
focusSubpart = function (j) {
  let stage = $(".focus-stage");
  stage.classList.remove("reference-focus");
  stage.querySelector(".badge").textContent =
    "ILLUSTRATIVE SUBCOMPONENT / DRAG TO ROTATE";
  $(".focus-controls").innerHTML =
    '<button onclick="resetPartRotation()">Reset view</button><button id="part-spin" onclick="togglePartSpin()">Auto rotate</button>';
  baseSub(j);
};
// Device selection is explicit: no automatic visual recognition is claimed.
const priorUseImage = useDeviceImage;
useDeviceImage = function (f) {
  priorUseImage(f);
  if (f && f.type.startsWith("image/") && f.size <= 10e6) {
    syncReference();
    toast(
      model === 0
        ? "Showing your exact iPhone 18 component reference."
        : "Showing the selected Samsung S23 Ultra demo.",
    );
  }
};
route();
