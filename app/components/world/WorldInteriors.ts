import * as THREE from "three";
import { places, type PlaceId } from "./places";
import { roomActivities } from "./roomActivities";
import featuredProjects from "../../content/featuredProjects.json";

export interface InteriorObject {
  id: string;
  position: THREE.Vector3;
}

export interface WorldInteriors {
  scene: THREE.Scene;
  enter: (id: PlaceId) => void;
  activate: (id: PlaceId, itemId: string) => void;
  objects: (id: PlaceId) => readonly InteriorObject[];
  dispose: () => void;
}

export function createInteriors(): WorldInteriors {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#dce7d8");
  scene.fog = new THREE.Fog("#dce7d8", 13, 27);
  scene.add(new THREE.HemisphereLight("#fff8dd", "#809888", 2.8));
  const key = new THREE.DirectionalLight("#fff1ce", 2.9);
  key.position.set(-3, 9, 8);
  scene.add(key);

  const cube = new THREE.BoxGeometry(1, 1, 1);
  const globe = new THREE.IcosahedronGeometry(1, 1);
  const tube = new THREE.CylinderGeometry(1, 1, 1, 10);
  const ring = new THREE.TorusGeometry(0.65, 0.065, 6, 28);
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const imageLoader = new THREE.TextureLoader();
  const brandSquare = new THREE.PlaneGeometry(0.36, 0.36);
  const brandWide = new THREE.PlaneGeometry(1.05, 0.34);
  const mat = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) => {
    const result = new THREE.MeshStandardMaterial({ color, roughness: 0.73, ...extra });
    materials.add(result);
    return result;
  };
  const wood = mat("#9f7855"), pale = mat("#efead4"), dark = mat("#31584a"), gold = mat("#ecc481", { metalness: 0.24 });
  const glass = mat("#a6dad2", { transparent: true, opacity: 0.62, roughness: 0.18 });
  const leaf = mat("#6aab80"), leafLight = mat("#9fc78b");
  const memoryColors = [mat("#c58b50"), mat("#5d9d7b"), mat("#6f95ad")];
  const rooms = {} as Record<PlaceId, THREE.Group>;
  const objects = {} as Record<PlaceId, InteriorObject[]>;
  const activated = {} as Record<PlaceId, Record<string, THREE.Mesh>>;
  const reactions = {} as Record<PlaceId, Record<string, () => void>>;
  let current: PlaceId | null = null;

  function shape(parent: THREE.Object3D, geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz);
    mesh.castShadow = false; mesh.receiveShadow = false;
    parent.add(mesh);
    return mesh;
  }
  const box = (p: THREE.Object3D, m: THREE.Material, x: number, y: number, z: number, w: number, h: number, d: number) => shape(p, cube, m, x, y, z, w, h, d);
  const ball = (p: THREE.Object3D, m: THREE.Material, x: number, y: number, z: number, r: number) => shape(p, globe, m, x, y, z, r, r, r);
  const column = (p: THREE.Object3D, m: THREE.Material, x: number, y: number, z: number, r: number, h: number) => shape(p, tube, m, x, y, z, r, h, r);

  for (const place of places) {
    const group = new THREE.Group();
    rooms[place.id] = group;
    objects[place.id] = [];
    activated[place.id] = {};
    reactions[place.id] = {};
    const accent = mat(place.color);
    const wall = mat(place.id === "projects" ? "#e8d6bb" : place.id === "agents" ? "#c8dddd" : place.id === "academy" ? "#e2d6df" : place.id === "contact" ? "#e9dbbf" : "#dce7d3");
    box(group, pale, 0, -0.18, 0, 11, 0.36, 11);
    box(group, wall, 0, 3.1, -4.7, 11, 6.2, 0.35);
    box(group, wall, -5.42, 3.1, 0, 0.3, 6.2, 9.7);
    box(group, wall, 5.42, 3.1, 0, 0.3, 6.2, 9.7);
    for (const x of [-4.2, 4.2]) {
      box(group, wood, x, 2.8, -4.48, 0.16, 4.8, 0.1);
      box(group, glass, x, 3, -4.39, 1.1, 2.2, 0.07);
    }
    box(group, wood, 0, 5.57, -4.3, 10.2, 0.2, 0.3);
    box(group, accent, 0, 5.26, -4.48, 4.7, 0.12, 0.1);
    for (const z of [-3, 0.2, 3.4]) box(group, wood, 0, 5.9, z, 10.5, 0.18, 0.28);
    for (const x of [-4.3, 4.3]) {
      column(group, wood, x, 0.54, 2.1, 0.42, 1.1);
      ball(group, leaf, x, 1.35, 2.1, 0.7);
      ball(group, leafLight, x + 0.28, 1.65, 2.15, 0.38);
    }
    if (place.id === "about") {
      for (const [index, x] of [-2.9, 0, 2.9].entries()) {
        box(group, wood, x, 3.62, -4.36, 1.4, 1.26, 0.1);
        box(group, pale, x, 3.62, -4.25, 1.17, 1.02, 0.06);
        if (index === 0) {
          shape(group, ring, memoryColors[index], x - 0.12, 3.73, -4.16, 0.43, 0.43, 1);
          const handle = box(group, memoryColors[index], x + 0.2, 3.42, -4.14, 0.09, 0.43, 0.08);
          handle.rotation.z = 0.74;
        } else if (index === 1) {
          box(group, memoryColors[index], x, 3.52, -4.16, 0.75, 0.07, 0.08);
          for (const dx of [-0.34, 0, 0.34]) {
            ball(group, gold, x + dx, dx === 0 ? 3.86 : 3.52, -4.12, 0.13);
          }
          for (const dx of [-0.18, 0.18]) {
            const link = box(group, memoryColors[index], x + dx, 3.7, -4.16, 0.07, 0.43, 0.08);
            link.rotation.z = dx < 0 ? -0.72 : 0.72;
          }
        } else {
          for (let step = 0; step < 3; step++) {
            box(group, memoryColors[index], x - 0.31 + step * 0.31, 3.37 + step * 0.16, -4.16, 0.25, 0.2 + step * 0.32, 0.08);
          }
          ball(group, gold, x + 0.31, 4.04, -4.12, 0.1);
        }
      }
    } else if (place.id === "projects") {
      for (const x of [-3.5, 3.5]) {
        box(group, wood, x, 3.72, -4.27, 1.2, 0.12, 0.25);
        box(group, gold, x, 3.84, -4.27, 0.24, 0.24, 0.23);
      }
    } else if (place.id === "agents") {
      // A shared signal above three distinct social stations.
      ball(group, accent, 0, 3.72, -4.19, 0.28);
      for (const x of [-1.5, 1.5]) {
        ball(group, gold, x, 3.72, -4.19, 0.22);
        box(group, wood, x / 2, 3.72, -4.2, 1.25, 0.07, 0.07);
      }
    } else if (place.id === "academy") {
      for (const x of [-2.6, 2.6]) {
        box(group, wood, x, 2.97, -4.27, 1.8, 3.2, 0.25);
        for (let shelf = 0; shelf < 3; shelf++) {
          box(group, gold, x, 2.1 + shelf * 0.88, -4.05, 1.62, 0.1, 0.34);
          for (let book = 0; book < 5; book++) box(group, book % 2 ? accent : pale, x - 0.57 + book * 0.28, 2.42 + shelf * 0.88, -4.03, 0.2, 0.52, 0.21);
        }
      }
      box(group, accent, 0, 3.72, -4.22, 2.05, 1.12, 0.14);
      box(group, pale, -0.42, 3.72, -4.12, 0.78, 0.7, 0.05);
      box(group, pale, 0.42, 3.72, -4.12, 0.78, 0.7, 0.05);
      box(group, gold, 0, 3.72, -4.08, 0.06, 0.8, 0.05);
    } else if (place.id === "services") {
      for (const x of [-3.1, -1.55, 0, 1.55, 3.1]) {
        column(group, wood, x, 0.25, -4.13, 0.32, 0.54);
        ball(group, leafLight, x, 0.77, -4.13, 0.43);
      }
      shape(group, ring, glass, 0, 4.27, -4.23, 3, 1.25, 1);
    } else {
      // The contact room is a café: a shared counter, menu, machine and seats.
      box(group, dark, 0, 3.65, -4.22, 3.2, 1.45, 0.16);
      for (let row = 0; row < 4; row++) {
        box(group, pale, -0.45, 4.05 - row * 0.3, -4.12, 1.55 - row * 0.12, 0.055, 0.02);
        box(group, gold, 0.96, 4.05 - row * 0.3, -4.12, 0.3, 0.055, 0.02);
      }
      for (const x of [-2.9, 2.9]) {
        box(group, wood, x, 3.25, -4.16, 1.4, 0.13, 0.3);
        column(group, gold, x, 3.53, -4.09, 0.19, 0.42);
        box(group, wood, x, 2.25, -4.1, 1.4, 0.12, 0.34);
        for (const dx of [-0.38, 0, 0.38]) column(group, pale, x + dx, 2.48, -4.02, 0.11, 0.25);
      }
      box(group, wood, 0, 0.76, -1.8, 5.25, 1.52, 1.5);
      box(group, gold, 0, 1.56, -1.8, 5.45, 0.14, 1.7);
      box(group, dark, 0, 0.82, -1.03, 4.75, 0.44, 0.07);
      box(group, dark, -1.65, 2.05, -3.12, 1.15, 0.82, 0.65);
      box(group, glass, -1.65, 2.18, -2.78, 0.82, 0.36, 0.06);
      for (const x of [-1.93, -1.37]) column(group, pale, x, 1.68, -2.76, 0.12, 0.16);
      for (const x of [-3.35, 3.35]) {
        column(group, wood, x, 0.48, 1.25, 0.08, 0.96);
        column(group, gold, x, 0.98, 1.25, 0.7, 0.1);
        for (const side of [-1, 1]) {
          column(group, dark, x + side * 0.93, 0.42, 1.25, 0.08, 0.84);
          column(group, wood, x + side * 0.93, 0.88, 1.25, 0.32, 0.1);
        }
      }
    }

    const items = roomActivities[place.id].items;
    const xs = items.length === 4 ? [-3.45, -1.15, 1.15, 3.45] : items.length === 3 ? [-2.9, 0, 2.9] : items.length === 2 ? [-1.9, 1.9] : [0];
    items.forEach((item, index) => {
      const x = xs[index];
      const stand = new THREE.Group(); stand.position.set(x, 0, -1.8); group.add(stand);
      objects[place.id].push({ id: item.id, position: new THREE.Vector3(x, place.id === "about" ? 1.35 : 2.2, -1.8) });
      if (place.id !== "contact") {
        box(stand, wood, 0, 0.75, 0, 1.54, 1.4, 1.15);
        box(stand, gold, 0, 1.49, 0, 1.7, 0.09, 1.28);
        box(stand, dark, 0, 0.85, 0.58, 1.18, 0.39, 0.06);
      }
      const beacon = shape(stand, ring, gold, 0, 1.59, 0, 1, 1, 1);
      beacon.rotation.x = -Math.PI / 2;
      beacon.visible = false;
      activated[place.id][item.id] = beacon;
      reactions[place.id][item.id] = () => {};
      if (place.id === "projects") {
        const featured = featuredProjects.projects[index];
        const texture = imageLoader.load(featured.logo);
        texture.colorSpace = THREE.SRGBColorSpace;
        textures.add(texture);
        const logoMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false });
        materials.add(logoMaterial);
        shape(stand, index === 1 ? brandWide : brandSquare, logoMaterial, 0, 0.85, 0.625);
        if (index === 0) { // Indie Mind: ideas growing together
          box(stand, accent, 0, 1.99, 0, 0.95, 0.62, 0.14);
          for (const dx of [-0.25, 0, 0.25]) ball(stand, leafLight, dx, 2.38 + Math.abs(dx), 0, 0.2);
        } else if (index === 1) { // Lyfter: rising steps
          for (let n = 0; n < 3; n++) box(stand, n === 2 ? gold : accent, -0.36 + n * 0.36, 1.87 + n * 0.19, 0, 0.3, 0.4 + n * 0.38, 0.58);
        } else if (index === 2) { // Imagine Paradise: island and sun
          column(stand, glass, 0, 1.82, 0, 0.54, 0.13);
          ball(stand, leaf, 0, 2.03, 0, 0.38);
          column(stand, wood, -0.16, 2.31, 0, 0.07, 0.49);
          ball(stand, leafLight, -0.16, 2.59, 0, 0.27);
          ball(stand, gold, 0.36, 2.53, -0.08, 0.22);
        } else { // Stone Sphere: a connected core
          ball(stand, accent, 0, 2.24, 0, 0.48);
          const orbit = shape(stand, ring, gold, 0, 2.24, 0, 0.9, 0.9, 0.9);
          orbit.rotation.x = 0.42;
          orbit.rotation.y = 0.25;
        }
      } else if (place.id === "about") {
        const ink = memoryColors[index];
        if (index === 0) { // Curiosity: an open notebook and a lens.
          const left = box(stand, ink, -0.25, 2.12, 0, 0.45, 0.69, 0.1);
          const right = box(stand, ink, 0.25, 2.12, 0, 0.45, 0.69, 0.1);
          box(stand, pale, -0.25, 2.12, 0.07, 0.37, 0.58, 0.04);
          box(stand, pale, 0.25, 2.12, 0.07, 0.37, 0.58, 0.04);
          box(stand, gold, 0, 2.12, 0.12, 0.06, 0.66, 0.05);
          const lens = shape(stand, ring, gold, 0.15, 2.55, 0.22, 0.37, 0.37, 1);
          const handle = box(stand, gold, 0.42, 2.28, 0.23, 0.08, 0.36, 0.08);
          handle.rotation.z = 0.72;
          const spark = ball(stand, gold, -0.36, 2.73, 0.12, 0.13); spark.visible = false;
          reactions[place.id][item.id] = () => { left.rotation.y = -0.3; right.rotation.y = 0.3; lens.rotation.z = -0.25; spark.visible = true; };
        } else if (index === 1) { // Community: three people connected by a shared line.
          box(stand, ink, 0, 1.84, 0, 1.18, 0.13, 0.53);
          for (const dx of [-0.36, 0, 0.36]) {
            box(stand, ink, dx, dx === 0 ? 2.2 : 2.13, 0.04, 0.22, 0.47, 0.22);
            ball(stand, gold, dx, dx === 0 ? 2.59 : 2.5, 0.04, 0.17);
          }
          const bridge = box(stand, gold, 0, 2.02, 0.22, 0.84, 0.07, 0.08); bridge.visible = false;
          const shared = ball(stand, pale, 0, 2.02, 0.3, 0.12); shared.visible = false;
          reactions[place.id][item.id] = () => { bridge.visible = true; shared.visible = true; };
        } else { // Today: small modules become a working system.
          const heights = [0.42, 0.62, 0.82];
          heights.forEach((height, step) => {
            box(stand, ink, -0.38 + step * 0.38, 1.84 + height / 2, 0, 0.3, height, 0.44);
            box(stand, pale, -0.38 + step * 0.38, 1.84 + height, 0, 0.31, 0.06, 0.45);
          });
          const outcome = ball(stand, gold, 0.38, 2.87, 0, 0.19); outcome.visible = false;
          const orbit = shape(stand, ring, glass, 0, 2.32, -0.06, 0.72, 0.72, 1);
          orbit.rotation.y = 0.4;
          reactions[place.id][item.id] = () => { outcome.visible = true; orbit.rotation.y = 0.85; };
        }
      } else if (place.id === "agents") {
        box(stand, accent, 0, 2.23, 0, 1.12, 1.12, 0.17);
        if (index === 0) { // GitHub: source branches
          box(stand, pale, -0.1, 2.25, 0.13, 0.08, 0.51, 0.05);
          box(stand, pale, 0.15, 2.42, 0.13, 0.42, 0.08, 0.05);
          for (const [x, y] of [[-0.1, 1.98], [-0.1, 2.49], [0.34, 2.42]]) ball(stand, gold, x, y, 0.17, 0.11);
        } else if (index === 1) { // LinkedIn: people and work
          ball(stand, gold, -0.28, 2.49, 0.17, 0.11);
          box(stand, pale, -0.28, 2.18, 0.13, 0.12, 0.43, 0.05);
          box(stand, pale, 0.04, 2.18, 0.13, 0.12, 0.43, 0.05);
          box(stand, pale, 0.34, 2.18, 0.13, 0.12, 0.43, 0.05);
          box(stand, pale, 0.19, 2.39, 0.13, 0.3, 0.08, 0.05);
        } else { // Instagram: camera and lens
          box(stand, pale, 0, 2.23, 0.13, 0.73, 0.73, 0.06);
          shape(stand, ring, accent, 0, 2.23, 0.19, 0.36, 0.36, 1);
          ball(stand, gold, 0.25, 2.47, 0.21, 0.07);
        }
        const lit = mat("#ffe4a7", { emissive: "#dca350", emissiveIntensity: 0.85 });
        const light = ball(stand, glass, 0, 1.51, 0.15, 0.13);
        reactions[place.id][item.id] = () => { light.material = lit; light.scale.setScalar(0.21); };
      } else if (place.id === "academy") {
        const cover = box(stand, accent, 0, 2.04, 0, 0.82, 0.86, 0.16);
        box(stand, pale, 0, 2.06, 0.1, 0.6, 0.6, 0.05);
        box(stand, dark, 0, 1.99, 0.15, 0.42, 0.04, 0.02);
        reactions[place.id][item.id] = () => { cover.rotation.y = index === 0 ? -0.55 : 0.55; };
      } else if (place.id === "services") {
        column(stand, accent, 0, 1.82, 0, 0.49, 0.42);
        column(stand, wood, 0, 2.2, 0, 0.08, 0.64);
        const foliage = ball(stand, leaf, 0, 2.66, 0, 0.39);
        const leafTip = ball(stand, leafLight, 0.3, 2.48, 0, 0.25);
        const bloom = ball(stand, gold, 0, 3.18, 0, 0.2); bloom.visible = false;
        reactions[place.id][item.id] = () => { foliage.scale.setScalar(0.55); leafTip.scale.setScalar(0.34); bloom.visible = true; };
      } else {
        column(stand, pale, 0, 1.96, 0, 0.45, 0.69);
        shape(stand, ring, accent, 0.48, 2.02, 0, 0.43, 0.43, 0.43).rotation.y = Math.PI / 2;
        const coffee = column(stand, dark, 0, 2.35, 0, 0.4, 0.08); coffee.visible = false;
        const steam: THREE.Mesh[] = [];
        for (let n = 0; n < 3; n++) { const puff = ball(stand, glass, -0.22 + n * 0.22, 2.72 + n * 0.12, 0, 0.12); puff.visible = false; steam.push(puff); }
        reactions[place.id][item.id] = () => { coffee.visible = true; steam.forEach((puff) => { puff.visible = true; }); };
      }
    });
    if (place.id === "agents") {
      const links = [-1.45, 1.45].map((x) => {
        const link = box(group, gold, x, 2.52, -1.8, 2.15, 0.065, 0.065);
        link.visible = false;
        return link;
      });
      roomActivities.agents.items.forEach((item, index) => {
        const original = reactions.agents[item.id];
        reactions.agents[item.id] = () => {
          original();
          if (index > 0 && activated.agents[roomActivities.agents.items[index - 1].id].visible) links[index - 1].visible = true;
          if (index < 2 && activated.agents[roomActivities.agents.items[index + 1].id].visible) links[index].visible = true;
        };
      });
    }
  }

  return {
    scene,
    enter(id) {
      if (current) scene.remove(rooms[current]);
      current = id;
      scene.add(rooms[id]);
    },
    activate(id, itemId) {
      const beacon = activated[id]?.[itemId];
      if (beacon) { beacon.visible = true; reactions[id][itemId](); }
    },
    objects(id) { return objects[id]; },
    dispose() {
      cube.dispose(); globe.dispose(); tube.dispose(); ring.dispose(); brandSquare.dispose(); brandWide.dispose();
      textures.forEach((texture) => texture.dispose());
      materials.forEach((material) => material.dispose());
    },
  };
}
