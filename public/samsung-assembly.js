// Compact internal placements and a complete exterior for the assembled reference.
export const phoneDimensions = {
  width: 2.22,
  height: 4.65,
  depth: 0.253,
  radius: 0.035,
};
const slots = {
  display: [0, 0.15, 0.105, 1],
  thermal: [0, 0.15, -0.025, 0.96],
  battery: [0.14, -0.35, 0, 0.75],
  board: [0, 1.15, 0.025, 0.43],
  frame: [0, 0.15, 0, 1],
  coil: [0.08, -0.1, -0.065, 0.72],
  cameras: [-0.65, 1.25, -0.08, 0.48],
  back: [0, 0.15, -0.105, 1],
  pen: [-0.91, -0.25, 0, 0.89],
  buttons: [1.02, 0.55, 0, 0.44],
  "speaker-top": [0, 2.22, 0.02, 0.65],
  "speaker-bottom": [0.36, -1.94, 0.01, 0.62],
  usb: [0, -1.97, 0, 0.65],
  motor: [-0.64, -1.75, 0, 0.6],
  sim: [-0.65, -2.05, 0, 0.45],
  antenna: [0.2, 1.9, 0, 0.48],
  microphone: [0.65, -2.05, 0.01, 0.3],
  sensors: [0.1, 2.12, 0.05, 0.35],
  fasteners: [0.25, 0.3, 0, 0.4],
};
export function assemblyPlacement(id) {
  const [x, y, z, scale] = slots[id] || [0, 0.15, 0, 0.3];
  return { x, y, z, scale };
}
// Exterior details follow the supplied cream Galaxy S23 Ultra front/rear reference.
export const exteriorCameras = [
  { x: 112, y: 92, r: 46, kind: "camera" },
  { x: 112, y: 240, r: 46, kind: "camera" },
  { x: 112, y: 388, r: 46, kind: "camera" },
  { x: 247, y: 92, r: 24, kind: "sensor" },
  { x: 247, y: 240, r: 32, kind: "camera" },
];
export function createPhoneExterior(THREE, CSS3DObject, cssMode) {
  const { width: w, height: h, depth: d, radius: r } = phoneDimensions,
    group = new THREE.Group(),
    textures = [];
  group.name = "Galaxy S23 Ultra cream exterior";
  group.position.y = 0.15;
  const metal = new THREE.MeshPhysicalMaterial({
    color: 0xbcb9aa,
    metalness: 0.94,
    roughness: 0.19,
    clearcoat: 1,
    clearcoatRoughness: 0.2,
    transparent: true,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: 0x080b10,
    metalness: 0.45,
    roughness: 0.22,
    transparent: true,
  });
  const rounded = (width, height, radius) => {
    const s = new THREE.Shape(),
      x = -width / 2,
      y = -height / 2;
    s.moveTo(x + radius, y);
    s.lineTo(x + width - radius, y);
    s.quadraticCurveTo(x + width, y, x + width, y + radius);
    s.lineTo(x + width, y + height - radius);
    s.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    s.lineTo(x + radius, y + height);
    s.quadraticCurveTo(x, y + height, x, y + height - radius);
    s.lineTo(x, y + radius);
    s.quadraticCurveTo(x, y, x + radius, y);
    return s;
  };
  const frameGeometry = new THREE.ExtrudeGeometry(rounded(w, h, r), {
    depth: d,
    bevelEnabled: true,
    bevelSize: 0.012,
    bevelThickness: 0.012,
    bevelSegments: 4,
    steps: 1,
    curveSegments: 12,
  });
  frameGeometry.translate(0, 0, -d / 2);
  group.add(new THREE.Mesh(frameGeometry, metal));
  function artwork(side) {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 1885;
    const c = canvas.getContext("2d"),
      W = 900,
      H = 1885;
    if (side === "front") {
      c.fillStyle = "#020202";
      c.fillRect(0, 0, W, H);
      // The original reference has a golden planetary wallpaper, without a clock or added branding.
      c.save();
      c.beginPath();
      c.roundRect(15, 17, W - 30, H - 34, 8);
      c.clip();
      const background = c.createLinearGradient(0, 0, W, H);
      background.addColorStop(0, "#120d08");
      background.addColorStop(0.55, "#090705");
      background.addColorStop(1, "#020202");
      c.fillStyle = background;
      c.fillRect(0, 0, W, H);
      c.save();
      c.translate(W * 0.33, H * 0.52);
      c.scale(1, 1.17);
      const radius = W * 0.86,
        globe = c.createRadialGradient(
          -radius * 0.25,
          radius * 0.12,
          radius * 0.04,
          0,
          0,
          radius,
        );
      globe.addColorStop(0, "#e6d49b");
      globe.addColorStop(0.34, "#ceb173");
      globe.addColorStop(0.62, "#a07c3b");
      globe.addColorStop(0.86, "#513515");
      globe.addColorStop(0.97, "#1b1007");
      globe.addColorStop(1, "#070604");
      c.fillStyle = globe;
      c.beginPath();
      c.arc(0, 0, radius, 0, Math.PI * 2);
      c.fill();
      for (const [scale, color, line] of [
        [1, "#bd9a4a", 4],
        [0.982, "#5b3c13", 10],
        [1.018, "#c19b4b66", 2],
      ]) {
        c.beginPath();
        c.ellipse(0, 0, radius * scale, radius * scale, 0, -1.42, 1.22);
        c.strokeStyle = color;
        c.lineWidth = line;
        c.stroke();
      }
      const shade = c.createLinearGradient(0, -radius, 0, radius);
      shade.addColorStop(0, "#000b");
      shade.addColorStop(0.36, "#0000");
      shade.addColorStop(0.72, "#0000");
      shade.addColorStop(1, "#000d");
      c.fillStyle = shade;
      c.fillRect(-radius, -radius, radius * 2, radius * 2);
      c.restore();
      const vignette = c.createRadialGradient(
        W * 0.42,
        H * 0.51,
        W * 0.25,
        W * 0.46,
        H * 0.51,
        H * 0.58,
      );
      vignette.addColorStop(0, "#0000");
      vignette.addColorStop(0.7, "#0003");
      vignette.addColorStop(1, "#000e");
      c.fillStyle = vignette;
      c.fillRect(0, 0, W, H);
      c.restore();
      // Centered punch-hole camera and narrow glass bezels.
      c.fillStyle = "#020304";
      c.beginPath();
      c.arc(W / 2, 51, 12, 0, Math.PI * 2);
      c.fill();
      c.strokeStyle = "#333126";
      c.lineWidth = 2;
      c.stroke();
      c.fillStyle = "#111b25";
      c.beginPath();
      c.arc(W / 2 - 2, 48, 4, 0, Math.PI * 2);
      c.fill();
      const glass = c.createLinearGradient(0, 0, W, 0);
      glass.addColorStop(0, "#b4ab8a44");
      glass.addColorStop(0.015, "#fff0");
      glass.addColorStop(0.98, "#fff0");
      glass.addColorStop(1, "#e8dfc555");
      c.fillStyle = glass;
      c.fillRect(0, 0, W, H);
    } else {
      const finish = c.createLinearGradient(0, 0, W, H);
      finish.addColorStop(0, "#f0eddf");
      finish.addColorStop(0.36, "#e8e5d7");
      finish.addColorStop(0.74, "#dddacc");
      finish.addColorStop(1, "#eeebdf");
      c.fillStyle = finish;
      c.fillRect(0, 0, W, H);
      const glass = c.createLinearGradient(0, 0, W, 0);
      glass.addColorStop(0, "#a8a89d66");
      glass.addColorStop(0.013, "#fff6");
      glass.addColorStop(0.04, "#fff0");
      glass.addColorStop(0.98, "#fff0");
      glass.addColorStop(1, "#96988a77");
      c.fillStyle = glass;
      c.fillRect(0, 0, W, H);
      c.textAlign = "center";
      c.font = "500 28px sans-serif";
      c.fillStyle = "#c2beb1";
      c.fillText("SAMSUNG", W / 2, H * 0.815);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.push(texture);
    return { texture, url: canvas.toDataURL() };
  }
  const front = artwork("front"),
    back = artwork("back"),
    faceWidth = w - 0.026,
    faceHeight = h - 0.026;
  for (const [side, art, z] of [
    ["front", front, d / 2 + 0.015],
    ["back", back, -d / 2 - 0.015],
  ]) {
    const face = new THREE.Mesh(
      new THREE.ShapeGeometry(rounded(faceWidth, faceHeight, 0.025)),
      new THREE.MeshBasicMaterial({ map: art.texture, transparent: true }),
    );
    const pos = face.geometry.attributes.position,
      uv = face.geometry.attributes.uv;
    for (let i = 0; i < pos.count; i++)
      uv.setXY(
        i,
        (pos.getX(i) + faceWidth / 2) / faceWidth,
        (pos.getY(i) + faceHeight / 2) / faceHeight,
      );
    face.position.z = z;
    if (side === "back") face.rotation.y = Math.PI;
    group.add(face);
  }
  // Raised, individual camera barrels: three large lenses and two smaller modules.
  const rear = new THREE.Group();
  rear.rotation.y = Math.PI;
  rear.position.z = -d / 2 - 0.017;
  group.add(rear);
  for (const camera of exteriorCameras) {
    const x = (camera.x / 600 - 0.5) * faceWidth,
      y = (0.5 - camera.y / 1260) * faceHeight,
      rad = (camera.r / 600) * faceWidth,
      depth = camera.kind === "sensor" ? 0.025 : 0.067;
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(rad, rad, depth, 64),
      metal.clone(),
    );
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(x, y, depth / 2);
    rear.add(barrel);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(rad * 0.89, rad * 0.095, 12, 64),
      dark.clone(),
    );
    ring.position.set(x, y, depth + 0.002);
    rear.add(ring);
    const lens = new THREE.Mesh(
      new THREE.CircleGeometry(rad * 0.81, 64),
      new THREE.MeshPhysicalMaterial({
        color: camera.kind === "sensor" ? 0x101316 : 0x07111c,
        roughness: 0.06,
        metalness: 0.55,
        clearcoat: 1,
        transparent: true,
      }),
    );
    lens.position.set(x, y, depth + 0.003);
    rear.add(lens);
    if (camera.kind === "camera") {
      const optic = new THREE.Mesh(
        new THREE.CircleGeometry(rad * 0.45, 48),
        new THREE.MeshPhysicalMaterial({
          color: 0x122d3d,
          metalness: 0.8,
          roughness: 0.1,
          clearcoat: 1,
          transparent: true,
        }),
      );
      optic.position.set(x, y, depth + 0.004);
      rear.add(optic);
      const glint = new THREE.Mesh(
        new THREE.CircleGeometry(rad * 0.1, 24),
        new THREE.MeshBasicMaterial({ color: 0x6289a5, transparent: true }),
      );
      glint.position.set(x - rad * 0.2, y + rad * 0.24, depth + 0.005);
      rear.add(glint);
    }
  }
  const flash = new THREE.Mesh(
    new THREE.CircleGeometry(0.037, 32),
    new THREE.MeshBasicMaterial({ color: 0xf7f0c9, transparent: true }),
  );
  flash.position.set(
    (247 / 600 - 0.5) * faceWidth,
    (0.5 - 166 / 1260) * faceHeight,
    0.007,
  );
  rear.add(flash);
  // Flush side keys, antenna breaks and the bottom-edge port details.
  for (const [y, kh] of [
    [0.42, 0.43],
    [1.17, 0.66],
  ]) {
    const key = new THREE.Mesh(
      new THREE.BoxGeometry(0.028, kh, 0.082),
      metal.clone(),
    );
    key.position.set(w / 2 + 0.013, y, 0);
    group.add(key);
  }
  for (const side of [-1, 1])
    for (const y of [-1.82, 1.84]) {
      const band = new THREE.Mesh(
        new THREE.BoxGeometry(0.026, 0.027, d * 0.9),
        new THREE.MeshStandardMaterial({
          color: 0x9c9b90,
          roughness: 0.65,
          transparent: true,
        }),
      );
      band.position.set(side * (w / 2 + 0.004), y, 0);
      group.add(band);
    }
  const port = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.008, 0.09),
    dark.clone(),
  );
  port.position.set(0, -h / 2 - 0.014, 0);
  group.add(port);
  for (let i = 0; i < 6; i++) {
    const slit = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 0.01, 0.075),
      dark.clone(),
    );
    slit.position.set(0.42 + i * 0.07, -h / 2 - 0.014, 0);
    group.add(slit);
  }
  const penEnd = new THREE.Mesh(
    new THREE.BoxGeometry(0.17, 0.009, 0.13),
    metal.clone(),
  );
  penEnd.position.set(-0.84, -h / 2 - 0.015, 0);
  group.add(penEnd);
  let shell;
  if (cssMode) {
    shell = document.createElement("div");
    shell.className = "assembled-phone-shell";
    shell.style.cssText = `width:${w * 100}px;height:${h * 100}px;position:relative;transform-style:preserve-3d;pointer-events:none`;
    const surface = (
      name,
      url,
      transform,
      width,
      height,
      left = 0,
      top = 0,
    ) => {
      const f = document.createElement("div");
      f.className = "assembled-phone-face " + name;
      f.style.cssText = `position:absolute;width:${width}px;height:${height}px;left:${left}px;top:${top}px;backface-visibility:hidden;transform-style:preserve-3d;border-radius:${name === "edge" ? 1 : 2.5}px;background:${url ? `url(${url}) center/100% 100%` : "linear-gradient(90deg,#777b77 0%,#c6c5b6 18%,#eeecdf 45%,#aaa99b 85%,#6f7470 100%)"};transform:${transform};`;
      shell.append(f);
      return f;
    };
    surface("front", front.url, `translateZ(${d * 50}px)`, w * 100, h * 100);
    const rearFace = surface(
      "back",
      back.url,
      `rotateY(180deg) translateZ(${d * 50}px)`,
      w * 100,
      h * 100,
    );
    for (const camera of exteriorCameras) {
      const lens = document.createElement("i"),
        rad = (camera.r / 600) * w * 100;
      lens.className = "assembled-camera " + camera.kind;
      lens.style.cssText = `position:absolute;left:${(camera.x / 600) * w * 100 - rad}px;top:${(camera.y / 1260) * h * 100 - rad}px;width:${rad * 2}px;height:${rad * 2}px;border-radius:50%;border:${camera.kind === "sensor" ? 1 : 1.2}px solid #a8aa9d;background:${camera.kind === "sensor" ? "#111313" : "radial-gradient(circle at 40% 34%,#4b6576 0%,#0e2638 12%,#070d16 37%,#010308 60%,#1d2020 68%,#080a0b 82%)"};box-shadow:0 1px 0 1px #4d514b,1px 2px 3px #0007;transform:translateZ(${camera.kind === "sensor" ? 2.5 : 6.7}px);backface-visibility:hidden;`;
      rearFace.append(lens);
    }
    const led = document.createElement("i");
    led.style.cssText = `position:absolute;left:${(247 / 600) * w * 100 - 3.7}px;top:${(166 / 1260) * h * 100 - 3.7}px;width:7.4px;height:7.4px;border-radius:50%;background:radial-gradient(#fffce7,#d9d8bf);box-shadow:0 0 0 1px #c4c3b2;transform:translateZ(.8px)`;
    rearFace.append(led);
    for (const sign of [-1, 1]) {
      const edge = surface(
        "edge",
        null,
        `rotateY(${sign * 90}deg) translateZ(${w * 50}px)`,
        d * 100,
        h * 100,
        (w - d) * 50,
      );
      for (const top of [42, 410]) {
        const band = document.createElement("i");
        band.style.cssText = `position:absolute;left:0;top:${top}px;width:100%;height:2px;background:#8e928a`;
        edge.append(band);
      }
      if (sign === 1)
        for (const [top, height] of [
          [105, 66],
          [180, 43],
        ]) {
          const key = document.createElement("i");
          key.style.cssText = `position:absolute;left:7px;top:${top}px;width:9px;height:${height}px;background:linear-gradient(90deg,#777d75,#e6e6d8,#8a8e82);border-radius:2px;transform:translateZ(2px);box-shadow:0 0 0 1px #6a7069`;
          edge.append(key);
        }
      const end = surface(
        "edge",
        null,
        `rotateX(${sign * 90}deg) translateZ(${h * 50}px)`,
        w * 100,
        d * 100,
        0,
        (h - d) * 50,
      );
      if (sign === -1) {
        end.innerHTML =
          '<i style="position:absolute;left:calc(50% - 17px);top:8px;width:34px;height:9px;border-radius:4px;background:#11161a;box-shadow:inset 0 0 0 1px #5a615e"></i><i style="position:absolute;left:19px;top:6px;width:17px;height:13px;border:1px solid #7d8377;border-radius:3px"></i>' +
          Array.from(
            { length: 6 },
            (_, i) =>
              `<i style="position:absolute;left:${151 + i * 7}px;top:8px;width:3px;height:9px;background:#242b29;border-radius:2px"></i>`,
          ).join("");
      }
    }
    const obj = new CSS3DObject(shell);
    obj.scale.setScalar(0.01);
    group.add(obj);
  }
  group.visible = false;
  return { group, textures, shell };
}
