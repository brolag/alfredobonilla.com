import * as THREE from "three";
import { placeById, places, type AvatarId, type PlaceId, type WorldPlace } from "./places";

interface WorldEvents {
  onNear: (id: PlaceId | null) => void;
  onPick: (id: PlaceId) => void;
}

export interface WorldController {
  setAvatar: (id: AvatarId) => void;
  setExploring: (exploring: boolean) => void;
  setInput: (key: string, down: boolean) => void;
  clearInput: () => void;
  interact: () => PlaceId | null;
  travelTo: (id: PlaceId) => void;
  focus: (id: PlaceId | null) => void;
  dispose: () => void;
}

type Material = THREE.MeshStandardMaterial;
const ink = "#204a3a";
const palette = {
  grass: "#9bbc83", grassLight: "#b7cc94", grassDark: "#71986e", earth: "#ab8d6e",
  earthDark: "#6b7865", stone: "#e5dac0", stoneDark: "#bdc0a3", plaster: "#e9d9b8",
  wood: "#9c7354", woodLight: "#c69b69", roof: "#638d71", roofLight: "#85a98a",
  glass: "#acd8c9", solar: "#396c77", water: "#74b9ad", leaf: "#589274",
  leafLight: "#90b980", leafDark: "#3f7868", flower: "#edb28f", gold: "#e8bd74",
};

function createRandom(seed: number) { return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }; }

export function createWorld(mount: HTMLDivElement, events: WorldEvents): WorldController {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog("#deebe1", 36, 80);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mount.clientWidth < 700 ? 1.25 : 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.65;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  mount.appendChild(renderer.domElement);
  renderer.domElement.setAttribute("aria-hidden", "true");

  const camera = new THREE.OrthographicCamera(-20, 20, 12, -12, 0.1, 120);
  const cameraOffset = new THREE.Vector3(25, 28, 34);
  const cameraTarget = new THREE.Vector3(0, 0, 0);
  const desiredTarget = new THREE.Vector3();
  let lastFrameTime = performance.now();
  let sceneTime = 0;
  const random = createRandom(71413);
  const animated: Array<(time: number, delta: number) => void> = [];
  const labels: HTMLButtonElement[] = [];
  const material = (color: string, options: Partial<THREE.MeshStandardMaterialParameters> = {}): Material => new THREE.MeshStandardMaterial({ color, roughness: 0.86, metalness: 0, ...options });
  const m = {
    grass: material(palette.grass), grassLight: material(palette.grassLight), grassDark: material(palette.grassDark),
    earth: material(palette.earth), earthDark: material(palette.earthDark), stone: material(palette.stone), stoneDark: material(palette.stoneDark),
    plaster: material(palette.plaster), wood: material(palette.wood), woodLight: material(palette.woodLight), roof: material(palette.roof),
    roofLight: material(palette.roofLight), glass: material(palette.glass, { transparent: true, opacity: 0.5, roughness: 0.22, metalness: 0.1 }),
    solar: material(palette.solar, { roughness: 0.25, metalness: 0.34 }), water: material(palette.water, { roughness: 0.2, metalness: 0.18, transparent: true, opacity: 0.78 }),
    leaf: material(palette.leaf), leafLight: material(palette.leafLight), leafDark: material(palette.leafDark), flower: material(palette.flower),
    gold: material(palette.gold, { metalness: 0.18 }), dark: material(ink), light: material("#fff2d4"), pink: material("#c796aa"), blue: material("#7eabb0"), orange: material("#d99d6d"),
  };

  function mesh(parent: THREE.Object3D, geometry: THREE.BufferGeometry, mat: THREE.Material | THREE.Material[], x = 0, y = 0, z = 0, shadows = true) {
    const object = new THREE.Mesh(geometry, mat);
    object.position.set(x, y, z); object.castShadow = shadows; object.receiveShadow = shadows; parent.add(object); return object;
  }
  const box = (parent: THREE.Object3D, w: number, h: number, d: number, x: number, y: number, z: number, mat: THREE.Material, shadows = true) => mesh(parent, new THREE.BoxGeometry(w, h, d), mat, x, y, z, shadows);
  const cylinder = (parent: THREE.Object3D, top: number, bottom: number, h: number, x: number, y: number, z: number, mat: THREE.Material, sides = 10) => mesh(parent, new THREE.CylinderGeometry(top, bottom, h, sides), mat, x, y, z);
  const sphere = (parent: THREE.Object3D, r: number, x: number, y: number, z: number, mat: THREE.Material, detail = 0) => mesh(parent, new THREE.IcosahedronGeometry(r, detail), mat, x, y, z);
  const disc = (parent: THREE.Object3D, radius: number, x: number, y: number, z: number, mat: THREE.Material, segments = 24) => cylinder(parent, radius, radius, 0.08, x, y, z, mat, segments);
  function beam(parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, radius: number, mat: THREE.Material) {
    const direction = b.clone().sub(a), length = direction.length();
    const object = mesh(parent, new THREE.CylinderGeometry(radius, radius, length, 6), mat, 0, 0, 0);
    object.position.copy(a).add(b).multiplyScalar(0.5);
    object.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    return object;
  }

  scene.add(new THREE.HemisphereLight("#fff9e8", "#819984", 2.35));
  const sunlight = new THREE.DirectionalLight("#fff0c9", 3.15);
  sunlight.position.set(-11, 24, 13); sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(mount.clientWidth < 700 ? 1024 : 2048, mount.clientWidth < 700 ? 1024 : 2048); sunlight.shadow.camera.left = -35; sunlight.shadow.camera.right = 35;
  sunlight.shadow.camera.top = 35; sunlight.shadow.camera.bottom = -35;
  sunlight.shadow.bias = -0.0002; sunlight.shadow.normalBias = 0.025;
  scene.add(sunlight);

  // An irregular floating landscape makes the town read as one authored place.
  const outline = [
    [-17, -13], [-12, -14.2], [-5, -13.5], [3, -14.6], [12, -13.8], [17, -11.6],
    [18, -5], [17.1, 2], [18, 9], [14, 13.5], [7, 14.6], [0, 14], [-8, 14.6],
    [-15, 12.5], [-18, 7], [-17.4, -1],
  ];
  const islandShape = new THREE.Shape();
  outline.forEach(([x, z], index) => index ? islandShape.lineTo(x, z) : islandShape.moveTo(x, z)); islandShape.closePath();
  const islandGeometry = new THREE.ExtrudeGeometry(islandShape, { depth: 1.3, bevelEnabled: true, bevelThickness: 0.18, bevelSize: 0.23, bevelSegments: 1, steps: 1 });
  islandGeometry.rotateX(-Math.PI / 2);
  const island = mesh(scene, islandGeometry, [m.grass, m.earth], 0, -1.4, 0);
  island.receiveShadow = true;
  const islandUnder = mesh(scene, islandGeometry.clone(), m.earthDark, 0, -2.18, 0);
  islandUnder.scale.set(0.98, 0.72, 0.98);
  islandUnder.castShadow = false;

  // Slightly raised terraces give buildings a foundation without blocking routes.
  for (const place of places) {
    const base = disc(scene, place.id === "agents" ? 3.1 : 3.35, place.x, 0.1, place.z, m.stoneDark, 12);
    base.scale.z = 0.82;
    const inner = disc(scene, place.id === "agents" ? 2.86 : 3.1, place.x, 0.18, place.z, m.stone, 12);
    inner.scale.z = 0.78;
  }

  function path(points: Array<[number, number]>, width: number) {
    const curve = new THREE.CatmullRomCurve3(points.map(([x, z]) => new THREE.Vector3(x, 0.075, z)));
    const steps = Math.max(18, Math.ceil(curve.getLength() * 2.5));
    const positions: number[] = [], indices: number[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, p = curve.getPoint(t), tangent = curve.getTangent(t);
      const length = Math.hypot(tangent.x, tangent.z) || 1;
      const nx = -tangent.z / length, nz = tangent.x / length;
      positions.push(p.x + nx * width / 2, p.y, p.z + nz * width / 2, p.x - nx * width / 2, p.y, p.z - nz * width / 2);
      if (i < steps) { const a = i * 2; indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const geometry = new THREE.BufferGeometry(); geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3)); geometry.setIndex(indices); geometry.computeVertexNormals();
    const road = mesh(scene, geometry, m.stone, 0, 0, 0, false); road.receiveShadow = true;
    // Each route gets sparse stone joints, adding texture without a bitmap.
    for (let i = 2; i < steps - 1; i += 5) {
      const p = curve.getPoint(i / steps), t = curve.getTangent(i / steps);
      const joint = box(scene, width * 0.87, 0.012, 0.035, p.x, 0.086, p.z, m.stoneDark, false);
      joint.rotation.y = Math.atan2(t.x, t.z);
    }
  }
  path([[-13, -10], [-9, -6], [-5, -2], [0, 0]], 2.1);
  path([[0, -7], [0, -4], [0, 0]], 2.3);
  path([[13, -10], [9, -6], [5, -2], [0, 0]], 2.1);
  path([[-13, 8], [-9, 6], [-5, 2], [0, 0]], 2.1);
  path([[13, 8], [9, 6], [5, 2], [0, 0]], 2.1);
  path([[0, 8], [0, 5], [0, 0]], 2.2);
  disc(scene, 3.75, 0, 0.105, 0, m.stone, 24);
  const plazaRing = mesh(scene, new THREE.TorusGeometry(3.28, 0.045, 6, 48), m.stoneDark, 0, 0.18, 0, false); plazaRing.rotation.x = Math.PI / 2;

  // The center is a small solar tree: a landmark that remains visible from every path.
  disc(scene, 1.25, 0, 0.2, 0, m.wood, 18);
  cylinder(scene, 0.25, 0.38, 3.3, 0, 1.78, 0, m.wood, 9);
  for (let i = 0; i < 5; i++) {
    const angle = i * Math.PI * 2 / 5, x = Math.cos(angle) * 1.48, z = Math.sin(angle) * 1.48;
    beam(scene, new THREE.Vector3(0, 2.6, 0), new THREE.Vector3(x, 3.9 + (i % 2) * 0.3, z), 0.1, m.wood);
    const leaf = sphere(scene, 0.73, x, 4.1 + (i % 2) * 0.3, z, i % 2 ? m.leafLight : m.leaf, 1);
    leaf.scale.set(1.25, 0.54, 0.72); leaf.rotation.y = angle;
    const panel = box(scene, 0.7, 0.06, 0.45, x * 0.86, 4.45 + (i % 2) * 0.3, z * 0.86, m.solar);
    panel.rotation.y = angle;
  }
  const halo = mesh(scene, new THREE.TorusGeometry(1.1, 0.055, 6, 40), m.gold, 0, 3.48, 0); halo.rotation.x = Math.PI / 2;

  function solarPanel(parent: THREE.Object3D, x: number, y: number, z: number, angle = -0.18) {
    const frame = box(parent, 1.28, 0.085, 0.82, x, y, z, m.wood);
    frame.rotation.x = angle;
    const glass = box(parent, 1.15, 0.012, 0.68, x, y + 0.055, z, m.solar);
    glass.rotation.x = angle;
    for (const dx of [-0.37, 0, 0.37]) { const line = box(parent, 0.018, 0.017, 0.67, x + dx, y + 0.066, z, m.glass, false); line.rotation.x = angle; }
    const cross = box(parent, 1.14, 0.017, 0.017, x, y + 0.068, z, m.glass, false); cross.rotation.x = angle;
  }
  function planter(parent: THREE.Object3D, x: number, z: number, color: Material = m.leaf) {
    box(parent, 0.72, 0.42, 0.72, x, 0.36, z, m.stoneDark);
    const shrub = sphere(parent, 0.48, x, 0.88, z, color, 0);
    shrub.scale.set(1.05, 0.75, 1.05);
    if (random() > 0.58) sphere(parent, 0.11, x + 0.16, 1.15, z, m.flower, 0);
  }
  function buildingWindow(parent: THREE.Object3D, x: number, y: number, z: number, width = 0.65) {
    box(parent, width + 0.13, 0.83, 0.11, x, y, z, m.wood);
    box(parent, width, 0.68, 0.13, x, y, z + 0.025, m.glass);
    box(parent, 0.045, 0.68, 0.14, x, y, z + 0.08, m.woodLight);
  }
  function frontDoor(parent: THREE.Object3D, z: number, y = 0.96) {
    box(parent, 1.08, 1.68, 0.16, 0, y, z, m.wood);
    box(parent, 0.82, 1.46, 0.17, 0, y - 0.06, z + 0.025, m.dark);
    sphere(parent, 0.065, 0.27, 0.91, z + 0.14, m.gold, 1);
    box(parent, 1.45, 0.12, 0.75, 0, 1.92, z + 0.42, m.woodLight);
  }
  function terrace(parent: THREE.Object3D) {
    box(parent, 4.9, 0.21, 4.6, 0, 0.17, 0.32, m.stone);
    for (const x of [-1.82, 1.82]) planter(parent, x, 2.18, x < 0 ? m.leafLight : m.leaf);
    box(parent, 2.2, 0.14, 0.65, 0, 0.12, 2.63, m.stoneDark);
  }
  function roof(parent: THREE.Object3D, y: number, width: number, depth: number, mat: Material, slope = 0.31) {
    for (const side of [-1, 1]) {
      const part = box(parent, width / 2 + 0.38, 0.16, depth + 0.35, side * width / 4, y, 0, mat);
      part.rotation.z = side * -slope;
    }
  }

  function makeBuilding(place: WorldPlace) {
    const g = new THREE.Group(); g.position.set(place.x, 0.12, place.z); g.rotation.y = place.z > 0 ? Math.PI : 0; scene.add(g);
    terrace(g);
    if (place.id === "about") {
      box(g, 4.25, 2.55, 3.6, 0, 1.5, -0.12, m.plaster); roof(g, 3.01, 4.45, 3.9, m.roof);
      frontDoor(g, 1.75); buildingWindow(g, -1.3, 1.56, 1.74); buildingWindow(g, 1.3, 1.56, 1.74);
      box(g, 4.55, 0.18, 1.1, 0, 2.36, 2.18, m.woodLight);
      for (const x of [-2.05, 2.05]) cylinder(g, 0.08, 0.09, 2.2, x, 1.24, 2.45, m.wood, 6);
      solarPanel(g, -0.85, 3.34, -0.38); solarPanel(g, 0.85, 3.34, -0.38);
      box(g, 0.7, 0.05, 0.37, 1.45, 0.76, 2.13, m.wood);
      for (const x of [-1.55, 1.55]) planter(g, x, 1.62, m.leafLight);
    } else if (place.id === "projects") {
      box(g, 4.55, 2.7, 3.75, 0, 1.5, -0.2, m.orange);
      roof(g, 3.18, 4.85, 4, m.wood, 0.22);
      frontDoor(g, 1.71); buildingWindow(g, -1.5, 1.57, 1.73, 0.82); buildingWindow(g, 1.5, 1.57, 1.73, 0.82);
      box(g, 0.25, 0.7, 0.25, -1.66, 3.6, -0.9, m.wood);
      cylinder(g, 0.35, 0.3, 0.12, 0, 2.4, 1.85, m.gold, 12);
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; const spoke = box(g, 0.09, 0.28, 0.1, Math.cos(a) * 0.42, 2.4 + Math.sin(a) * 0.42, 1.91, m.gold); spoke.rotation.z = a; }
      solarPanel(g, -0.8, 3.49, -0.35); solarPanel(g, 0.8, 3.49, -0.35);
      box(g, 1.2, 0.8, 0.85, 2.4, 0.55, 1.55, m.wood); box(g, 1.1, 0.06, 0.91, 2.4, 0.97, 1.55, m.gold);
    } else if (place.id === "agents") {
      cylinder(g, 1.8, 2.03, 2.8, 0, 1.63, -0.1, m.blue, 10);
      cylinder(g, 1.9, 1.85, 0.23, 0, 3.18, -0.1, m.wood, 12);
      cylinder(g, 1.42, 1.55, 1.5, 0, 4.02, -0.1, m.glass, 12);
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; cylinder(g, 0.055, 0.055, 1.65, Math.sin(a) * 1.5, 4.04, Math.cos(a) * 1.5 - 0.1, m.wood, 6); }
      cylinder(g, 1.8, 1.58, 0.28, 0, 4.83, -0.1, m.roof, 12);
      cylinder(g, 0.08, 0.1, 1.1, 0, 5.43, -0.1, m.wood, 8);
      sphere(g, 0.3, 0, 5.98, -0.1, m.gold, 1);
      frontDoor(g, 1.73); buildingWindow(g, -1.14, 1.9, 1.68, 0.5); buildingWindow(g, 1.14, 1.9, 1.68, 0.5);
      const ring = mesh(g, new THREE.TorusGeometry(2.08, 0.055, 6, 32), m.gold, 0, 3.23, -0.1); ring.rotation.x = Math.PI / 2;
      solarPanel(g, -1.55, 0.55, -2.32, -0.16); solarPanel(g, 1.55, 0.55, -2.32, -0.16);
    } else if (place.id === "academy") {
      disc(g, 2.15, 0, 0.36, -0.1, m.woodLight, 12);
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; cylinder(g, 0.09, 0.09, 2.4, Math.sin(a) * 1.7, 1.56, Math.cos(a) * 1.7 - 0.1, m.wood, 7); }
      const canopy = mesh(g, new THREE.ConeGeometry(2.8, 1.15, 10), m.pink, 0, 3.17, -0.1); canopy.castShadow = true;
      cylinder(g, 0.28, 0.34, 0.38, 0, 3.91, -0.1, m.gold, 8);
      for (const side of [-1, 1]) { box(g, 0.92, 0.78, 1.1, side * 1.25, 0.8, -0.2, m.plaster); box(g, 0.95, 0.07, 1.14, side * 1.25, 1.22, -0.2, m.wood); }
      const banner = box(g, 0.9, 1.35, 0.05, 0, 1.68, 1.78, m.pink, false); banner.rotation.x = -0.1;
      box(g, 0.11, 0.68, 0.07, 0, 1.72, 1.83, m.gold, false);
      solarPanel(g, -2.5, 0.85, -1.9); solarPanel(g, 2.5, 0.85, -1.9);
    } else if (place.id === "services") {
      box(g, 4.3, 0.45, 3.5, 0, 0.55, -0.1, m.earth);
      const dome = mesh(g, new THREE.SphereGeometry(2.42, 14, 7, 0, Math.PI * 2, 0, Math.PI / 2), m.glass, 0, 0.72, -0.1);
      dome.scale.set(1, 1.15, 0.8); dome.castShadow = false;
      for (let i = 0; i < 7; i++) {
        const a = i * Math.PI / 7;
        const arc = mesh(g, new THREE.TorusGeometry(2.39, 0.048, 5, 18, Math.PI), m.wood, 0, 0.73, -0.1, false);
        arc.rotation.y = a; arc.scale.set(1, 1.15, 0.8);
      }
      for (const x of [-1.45, -0.75, 0.75, 1.45]) planter(g, x, -0.45, m.leafLight);
      box(g, 1.12, 1.65, 0.13, 0, 1.1, 1.69, m.wood);
      box(g, 0.92, 1.48, 0.15, 0, 1.07, 1.73, m.glass);
      solarPanel(g, -2.25, 0.65, -2.05); solarPanel(g, 2.25, 0.65, -2.05);
    } else {
      box(g, 4.15, 2.25, 3.15, 0, 1.3, -0.25, m.woodLight);
      roof(g, 2.76, 4.45, 3.45, m.roofLight, 0.28);
      frontDoor(g, 1.35); buildingWindow(g, -1.3, 1.42, 1.36); buildingWindow(g, 1.3, 1.42, 1.36);
      box(g, 4.9, 0.14, 1.55, 0, 2.14, 2.15, m.wood);
      for (const x of [-2.23, 2.23]) cylinder(g, 0.08, 0.08, 2, x, 1.16, 2.45, m.wood, 7);
      for (let i = 0; i < 5; i++) sphere(g, 0.09, -2 + i, 2.2, 2.78, m.gold, 1);
      for (const x of [-2.6, 2.6]) { cylinder(g, 0.45, 0.45, 0.12, x, 0.85, 3.25, m.wood, 10); cylinder(g, 0.08, 0.08, 0.7, x, 0.47, 3.25, m.wood, 7); }
      solarPanel(g, -0.9, 3.11, -0.55); solarPanel(g, 0.9, 3.11, -0.55);
    }
    // Small painted wayfinding stone next to every entrance.
    const marker = cylinder(g, 0.31, 0.38, 0.92, 2.6, 0.6, 2.12, material(place.color), 7);
    marker.rotation.z = -0.06;
    sphere(g, 0.12, 2.6, 1.18, 2.12, m.light, 1);
  }
  places.forEach(makeBuilding);

  function tree(x: number, z: number, scale = 1) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(scale); scene.add(g);
    cylinder(g, 0.13, 0.21, 1.9, 0, 1, 0, m.wood, 7);
    beam(g, new THREE.Vector3(0, 1.4, 0), new THREE.Vector3(0.58, 2.35, 0.22), 0.08, m.wood);
    sphere(g, 0.98, 0, 2.35, 0, random() > 0.5 ? m.leaf : m.leafLight, 1);
    sphere(g, 0.7, 0.64, 2.44, 0.23, m.leafLight, 1);
    sphere(g, 0.6, -0.55, 2.24, -0.19, m.leafDark, 0);
    for (let i = 0; i < 2; i++) sphere(g, 0.12, (random() - 0.5) * 1.4, 2.2 + random() * 0.5, (random() - 0.5) * 1.1, m.flower, 0);
  }
  const trees: Array<[number, number, number]> = [
    [-15, -10, 1.1], [-15, -4, 0.95], [-16, 2, 1.08], [-14, 10, 0.9], [-8, 12, 1],
    [-4, -12, 0.86], [5, -12, 1.1], [14, -11, 0.9], [16, -5, 1.05], [16, 1, 0.92],
    [15, 10, 1.08], [9, 12, 0.92], [4, 13, 0.85], [-5, 1, 0.73], [5, 1, 0.72],
    [-5, 7, 0.68], [5, 7, 0.74], [-5, -7, 0.8], [5, -7, 0.72],
  ];
  trees.forEach(([x, z, scale]) => tree(x, z, scale));

  function onPath(x: number, z: number) { return Math.abs(x) < 1.5 || Math.abs(z) < 1.6 || Math.abs(x + z * 1.1) < 1.3 || Math.abs(x - z * 1.1) < 1.3; }
  function nearStructure(x: number, z: number) { return places.some((p) => Math.abs(x - p.x) < 3.45 && Math.abs(z - p.z) < 3.1) || Math.hypot(x, z) < 4.1; }
  const shrubGeometry = new THREE.IcosahedronGeometry(0.25, 0), grassGeometry = new THREE.ConeGeometry(0.1, 0.42, 3);
  const shrubs = new THREE.InstancedMesh(shrubGeometry, m.leafDark, 180);
  const grasses = new THREE.InstancedMesh(grassGeometry, m.grassDark, 330);
  const dummy = new THREE.Object3D(); let shrubCount = 0, grassCount = 0;
  for (let i = 0; i < 850 && (shrubCount < 180 || grassCount < 330); i++) {
    const x = (random() - 0.5) * 32.3, z = (random() - 0.5) * 24.2;
    if (onPath(x, z) || nearStructure(x, z)) continue;
    if (random() < 0.24 && shrubCount < 180) {
      dummy.position.set(x, 0.2, z); dummy.scale.setScalar(0.65 + random() * 1.05); dummy.rotation.y = random() * 6.28; dummy.updateMatrix(); shrubs.setMatrixAt(shrubCount++, dummy.matrix);
    } else if (grassCount < 330) {
      dummy.position.set(x, 0.19, z); dummy.scale.setScalar(0.65 + random() * 0.8); dummy.rotation.y = random() * 6.28; dummy.updateMatrix(); grasses.setMatrixAt(grassCount++, dummy.matrix);
    }
  }
  shrubs.count = shrubCount; grasses.count = grassCount; shrubs.instanceMatrix.needsUpdate = true; grasses.instanceMatrix.needsUpdate = true;
  shrubs.castShadow = true; grasses.castShadow = false; scene.add(shrubs, grasses);

  // Benches, lamps, a pond and two quiet windmills carry the solarpunk atmosphere.
  for (const [x, z, rotation] of [[-4.3, 4.5, 0.45], [4.4, -4.6, -0.7]] as Array<[number, number, number]>) {
    const bench = new THREE.Group(); bench.position.set(x, 0, z); bench.rotation.y = rotation; scene.add(bench);
    box(bench, 1.5, 0.13, 0.5, 0, 0.56, 0, m.wood);
    box(bench, 1.5, 0.48, 0.12, 0, 0.88, -0.24, m.woodLight);
    for (const side of [-1, 1]) box(bench, 0.12, 0.53, 0.48, side * 0.59, 0.27, 0, m.dark);
  }
  for (const [x, z] of [[-6.1, -2.1], [6.1, -2.1], [-6.2, 3.1], [6.2, 3.1], [-2.5, 7], [2.5, 7]]) {
    cylinder(scene, 0.075, 0.1, 2.1, x, 1.12, z, m.wood, 8);
    cylinder(scene, 0.26, 0.19, 0.55, x, 2.43, z, m.gold, 8);
    sphere(scene, 0.16, x, 2.76, z, m.light, 1);
    const light = new THREE.PointLight("#ffcf87", 0.8, 3.5); light.position.set(x, 2.55, z); scene.add(light);
  }
  const pond = disc(scene, 1.38, -13.9, 0.14, 1.75, m.stoneDark, 14); pond.scale.z = 0.65;
  const pondWater = disc(scene, 1.17, -13.9, 0.2, 1.75, m.water, 14); pondWater.scale.z = 0.58;
  for (let i = 0; i < 4; i++) sphere(scene, 0.23, -14.9 + i * 0.7, 0.45, 1.6 + (i % 2) * 0.45, m.leafLight, 0);
  const turbines: THREE.Group[] = [];
  for (const [x, z] of [[-14.9, -7.5], [14.7, 8.7]]) {
    cylinder(scene, 0.09, 0.13, 4.2, x, 2.1, z, m.light, 8);
    const rotor = new THREE.Group(); rotor.position.set(x, 4.2, z); scene.add(rotor); turbines.push(rotor);
    sphere(rotor, 0.17, 0, 0, 0, m.wood, 1);
    for (let i = 0; i < 3; i++) {
      const a = i * Math.PI * 2 / 3, blade = box(rotor, 0.2, 1.35, 0.06, Math.sin(a) * 0.66, Math.cos(a) * 0.66, 0, m.light, false);
      blade.rotation.z = -a;
    }
  }
  animated.push((time) => { if (!reducedMotion) turbines.forEach((rotor, i) => { rotor.rotation.z = time * (i ? -0.26 : 0.22); }); });

  const avatarRoot = new THREE.Group(); avatarRoot.position.set(0, 0.1, 5.2); scene.add(avatarRoot);
  const avatarModels: Record<AvatarId, { group: THREE.Group; arms: THREE.Group[]; legs: THREE.Group[] }> = {
    sol: makeAvatar("sol"), luna: makeAvatar("luna"),
  };
  let currentAvatar: AvatarId = "sol";
  function makeAvatar(id: AvatarId) {
    const g = new THREE.Group(); avatarRoot.add(g);
    const skin = material(id === "sol" ? "#bb8568" : "#bb7964");
    const hair = material(id === "sol" ? "#3f3c31" : "#392d31");
    const jacket = material(id === "sol" ? "#346c61" : "#b97961");
    const pants = material("#3f5b54"), boots = material("#50463a");
    cylinder(g, 0.37, 0.43, 0.86, 0, 1.35, 0, jacket, 9);
    box(g, 0.74, 0.64, 0.28, 0, 1.32, -0.36, m.wood);
    box(g, 0.63, 0.09, 0.5, 0, 1.87, 0, m.gold);
    sphere(g, 0.34, 0, 2.13, 0.03, skin, 1);
    if (id === "sol") {
      const cap = sphere(g, 0.35, 0, 2.37, -0.08, hair, 1); cap.scale.set(1.02, 0.48, 1.05);
      sphere(g, 0.07, 0.1, 2.16, 0.34, skin, 1);
    } else {
      const cap = sphere(g, 0.36, 0, 2.41, -0.08, hair, 1); cap.scale.set(1.1, 0.62, 1.02);
      sphere(g, 0.22, 0.12, 2.45, -0.37, hair, 1);
      for (const side of [-1, 1]) { const lock = sphere(g, 0.11, side * 0.3, 2.05, -0.02, hair, 0); lock.scale.y = 2.1; }
    }
    const arms: THREE.Group[] = [], legs: THREE.Group[] = [];
    for (const side of [-1, 1]) {
      const arm = new THREE.Group(); arm.position.set(side * 0.44, 1.66, 0); g.add(arm); arms.push(arm);
      cylinder(arm, 0.13, 0.11, 0.63, 0, -0.31, 0, jacket, 7); sphere(arm, 0.12, 0, -0.66, 0, skin, 1);
      const leg = new THREE.Group(); leg.position.set(side * 0.2, 0.95, 0); g.add(leg); legs.push(leg);
      cylinder(leg, 0.17, 0.15, 0.64, 0, -0.32, 0, pants, 7); box(leg, 0.27, 0.2, 0.45, 0, -0.69, 0.11, boots);
    }
    const scarf = box(g, 0.62, 0.1, 0.37, 0, 1.82, 0.12, id === "sol" ? m.orange : m.blue); scarf.rotation.z = id === "sol" ? -0.08 : 0.08;
    return { group: g, arms, legs };
  }
  avatarModels.luna.group.visible = false;
  const playerShadow = mesh(scene, new THREE.CircleGeometry(0.49, 20), material("#42674f", { transparent: true, opacity: 0.22, depthWrite: false }), avatarRoot.position.x, 0.11, avatarRoot.position.z, false);
  playerShadow.rotation.x = -Math.PI / 2;

  for (const [index, place] of places.entries()) {
    const label = document.createElement("button");
    label.type = "button"; label.className = "world-scene-label";
    label.style.setProperty("--label-color", place.color);
    label.innerHTML = `<span class="world-scene-label__dot"></span><span class="world-scene-label__index">0${index + 1}</span><span class="world-scene-label__name">${place.name}</span>`;
    label.setAttribute("aria-label", `Abrir ${place.name}`);
    label.addEventListener("click", () => events.onPick(place.id));
    mount.appendChild(label); labels.push(label);
  }

  let exploring = false, focused: PlaceId | null = null, near: PlaceId | null = null, disposed = false;
  let currentView = mount.clientWidth < 700 ? 28 : 16.5;
  const pressed = new Set<string>();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let frame = 0;
  const projector = new THREE.Vector3();

  function nearest(): PlaceId | null {
    let best: PlaceId | null = null, distance = 2.8;
    for (const p of places) {
      const front = p.z < 0 ? 1 : -1;
      const d = Math.hypot(avatarRoot.position.x - p.x, avatarRoot.position.z - (p.z + front * 2.75));
      if (d < distance) { best = p.id; distance = d; }
    }
    return best;
  }
  function allowed(x: number, z: number) {
    if (Math.abs(x) > 16.4 || Math.abs(z) > 12.6) return false;
    return !places.some((p) => Math.abs(x - p.x) < (p.id === "agents" ? 1.82 : 2.18) && Math.abs(z - p.z) < (p.id === "academy" ? 1.65 : 1.82));
  }
  function resize() {
    const width = mount.clientWidth || window.innerWidth, height = mount.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    const aspect = width / height;
    camera.left = -currentView * aspect; camera.right = currentView * aspect;
    camera.top = currentView; camera.bottom = -currentView; camera.updateProjectionMatrix();
  }
  function widthForLayout() { return mount.clientWidth || window.innerWidth; }
  const observer = new ResizeObserver(resize); observer.observe(mount); resize();

  function update() {
    if (disposed) return;
    const now = performance.now();
    const delta = Math.min((now - lastFrameTime) / 1000, 0.05);
    lastFrameTime = now;
    sceneTime += delta;
    const time = sceneTime;
    let dx = 0, dz = 0;
    if (exploring && !focused) {
      if (pressed.has("w") || pressed.has("arrowup")) dz -= 1;
      if (pressed.has("s") || pressed.has("arrowdown")) dz += 1;
      if (pressed.has("a") || pressed.has("arrowleft")) dx -= 1;
      if (pressed.has("d") || pressed.has("arrowright")) dx += 1;
    }
    const moving = dx !== 0 || dz !== 0;
    if (moving) {
      const length = Math.hypot(dx, dz), speed = 5.3;
      const nextX = avatarRoot.position.x + dx / length * speed * delta;
      const nextZ = avatarRoot.position.z + dz / length * speed * delta;
      if (allowed(nextX, avatarRoot.position.z)) avatarRoot.position.x = nextX;
      if (allowed(avatarRoot.position.x, nextZ)) avatarRoot.position.z = nextZ;
      const angle = Math.atan2(dx, -dz);
      avatarRoot.rotation.y += Math.atan2(Math.sin(angle - avatarRoot.rotation.y), Math.cos(angle - avatarRoot.rotation.y)) * Math.min(1, delta * 12);
    }
    const rig = avatarModels[currentAvatar];
    const stride = moving && !reducedMotion ? Math.sin(time * 11) * 0.37 : 0;
    rig.arms[0].rotation.x = -stride; rig.arms[1].rotation.x = stride;
    rig.legs[0].rotation.x = stride; rig.legs[1].rotation.x = -stride;
    rig.group.position.y = moving && !reducedMotion ? Math.abs(Math.sin(time * 11)) * 0.045 : (reducedMotion ? 0 : Math.sin(time * 1.8) * 0.018);
    playerShadow.position.set(avatarRoot.position.x, 0.11, avatarRoot.position.z);
    const nextNear = exploring && !focused ? nearest() : null;
    if (near !== nextNear) { near = nextNear; events.onNear(nextNear); }
    if (focused) {
      const p = placeById[focused]; desiredTarget.set(p.x * 0.65, 0.5, p.z * 0.65);
    } else if (exploring) desiredTarget.set(avatarRoot.position.x * 0.55, 0.1, avatarRoot.position.z * 0.52);
    else desiredTarget.set(widthForLayout() < 700 ? 0 : -5.5, 0.3, 0);
    cameraTarget.lerp(desiredTarget, 1 - Math.exp(-delta * 2.8));
    camera.position.copy(cameraTarget).add(cameraOffset); camera.lookAt(cameraTarget);
    const mobile = widthForLayout() < 700;
    const targetView = focused ? (mobile ? 14 : 8.8) : exploring ? (mobile ? 13.5 : 10.5) : (mobile ? 28 : 16.5);
    const nextView = THREE.MathUtils.lerp(currentView, targetView, 1 - Math.exp(-delta * 2.6));
    if (Math.abs(nextView - currentView) > 0.002) { currentView = nextView; const width = mount.clientWidth || window.innerWidth, height = mount.clientHeight || window.innerHeight; const aspect = width / height; camera.left = -currentView * aspect; camera.right = currentView * aspect; camera.top = currentView; camera.bottom = -currentView; camera.updateProjectionMatrix(); }
    const width = mount.clientWidth || window.innerWidth, height = mount.clientHeight || window.innerHeight;
    places.forEach((p, index) => {
      projector.set(p.x, p.id === "agents" ? 6.5 : p.id === "academy" ? 4.4 : 4, p.z).project(camera);
      const label = labels[index]; label.style.left = `${(projector.x * 0.5 + 0.5) * width}px`; label.style.top = `${(-projector.y * 0.5 + 0.5) * height}px`;
      label.hidden = projector.z > 1 || (mobile && (!exploring || (!focused && Math.hypot(avatarRoot.position.x - p.x, avatarRoot.position.z - p.z) > 8)));
    });
    animated.forEach((fn) => fn(time, delta));
    renderer.render(scene, camera);
    frame = window.requestAnimationFrame(update);
  }
  update();

  return {
    setAvatar(id) { currentAvatar = id; avatarModels.sol.group.visible = id === "sol"; avatarModels.luna.group.visible = id === "luna"; },
    setExploring(value) { exploring = value; if (!value) { pressed.clear(); focused = null; avatarRoot.position.set(0, 0.1, 5.2); near = null; events.onNear(null); } },
    setInput(key, down) { if (down) pressed.add(key); else pressed.delete(key); },
    clearInput() { pressed.clear(); },
    interact() { return exploring && !focused ? nearest() : null; },
    travelTo(id) { const p = placeById[id], front = p.z < 0 ? 1 : -1; avatarRoot.position.set(p.x, 0.1, p.z + front * 3.2); near = id; events.onNear(id); },
    focus(id) { focused = id; pressed.clear(); if (id) { near = null; events.onNear(null); } },
    dispose() {
      disposed = true; window.cancelAnimationFrame(frame); observer.disconnect();
      labels.forEach((label) => label.remove());
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) { object.geometry.dispose(); const mats = Array.isArray(object.material) ? object.material : [object.material]; mats.forEach((mat) => mat.dispose()); }
      });
      renderer.dispose(); renderer.domElement.remove();
    },
  };
}
