import * as THREE from "three";
import { places, type PlaceId } from "./places";
import { roomActivities } from "./roomActivities";

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
  const mat = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) => {
    const result = new THREE.MeshStandardMaterial({ color, roughness: 0.73, ...extra });
    materials.add(result);
    return result;
  };
  const wood = mat("#9f7855"), pale = mat("#efead4"), dark = mat("#31584a"), gold = mat("#ecc481", { metalness: 0.24 });
  const glass = mat("#a6dad2", { transparent: true, opacity: 0.62, roughness: 0.18 });
  const leaf = mat("#6aab80"), leafLight = mat("#9fc78b");
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
      for (const x of [-2.9, 0, 2.9]) {
        box(group, wood, x, 3.62, -4.36, 1.4, 1.26, 0.1);
        box(group, pale, x, 3.62, -4.25, 1.17, 1.02, 0.06);
        ball(group, accent, x, 3.67, -4.18, 0.27);
      }
    } else if (place.id === "projects") {
      for (const x of [-3.5, 3.5]) {
        box(group, wood, x, 3.72, -4.27, 1.2, 0.12, 0.25);
        box(group, gold, x, 3.84, -4.27, 0.24, 0.24, 0.23);
      }
    } else if (place.id === "agents") {
      shape(group, ring, accent, 0, 3.72, -4.25, 2.1, 2.1, 1);
      shape(group, ring, gold, 0, 3.72, -4.21, 1.35, 1.35, 1);
      ball(group, glass, 0, 3.72, -4.17, 0.39);
    } else if (place.id === "academy") {
      box(group, wood, 0, 3.62, -4.25, 3.8, 1.82, 0.18);
      box(group, accent, 0, 3.62, -4.14, 3.53, 1.58, 0.06);
      for (const x of [-1.1, 0, 1.1]) ball(group, pale, x, 3.62, -4.05, 0.27);
    } else if (place.id === "services") {
      for (const x of [-3.1, -1.55, 0, 1.55, 3.1]) {
        column(group, wood, x, 0.25, -4.13, 0.32, 0.54);
        ball(group, leafLight, x, 0.77, -4.13, 0.43);
      }
      shape(group, ring, glass, 0, 4.27, -4.23, 3, 1.25, 1);
    } else {
      for (const x of [-2.8, 2.8]) {
        box(group, wood, x, 2.03, -4.08, 1.25, 0.12, 0.42);
        column(group, dark, x, 1.31, -4.08, 0.08, 1.36);
        ball(group, gold, x, 4.17, -4.18, 0.28);
      }
    }

    const items = roomActivities[place.id].items;
    const xs = items.length === 4 ? [-3.45, -1.15, 1.15, 3.45] : items.length === 3 ? [-2.9, 0, 2.9] : items.length === 2 ? [-1.9, 1.9] : [0];
    items.forEach((item, index) => {
      const x = xs[index];
      const stand = new THREE.Group(); stand.position.set(x, 0, -1.8); group.add(stand);
      objects[place.id].push({ id: item.id, position: new THREE.Vector3(x, 2.2, -1.8) });
      box(stand, wood, 0, 0.75, 0, 1.54, 1.4, 1.15);
      box(stand, gold, 0, 1.49, 0, 1.7, 0.09, 1.28);
      box(stand, dark, 0, 0.85, 0.58, 1.18, 0.39, 0.06);
      const beacon = shape(stand, ring, gold, 0, 1.59, 0, 1, 1, 1);
      beacon.rotation.x = -Math.PI / 2;
      beacon.visible = false;
      activated[place.id][item.id] = beacon;
      reactions[place.id][item.id] = () => {};
      if (place.id === "projects") {
        if (index === 0) { // learning garden
          box(stand, accent, 0, 1.99, 0, 0.95, 0.62, 0.14);
          for (const dx of [-0.25, 0, 0.25]) ball(stand, leafLight, dx, 2.38 + Math.abs(dx), 0, 0.2);
        } else if (index === 1) { // agent constellation
          for (const [dx, dy] of [[0, 0], [-0.42, 0.4], [0.42, 0.4]] ) ball(stand, accent, dx, 2.12 + dy, 0, 0.25);
          box(stand, dark, 0, 2.24, 0, 0.9, 0.06, 0.06);
        } else if (index === 2) { // coffee block
          box(stand, accent, 0, 2.04, 0, 0.9, 0.8, 0.8);
          ball(stand, gold, 0, 2.62, 0, 0.22);
        } else { // second brain shelves
          for (let n = 0; n < 3; n++) box(stand, n === 1 ? accent : dark, -0.28 + n * 0.27, 2.03, 0, 0.2, 0.9, 0.52);
        }
      } else if (place.id === "about") {
        const cover = box(stand, accent, 0, 2.14, 0, 0.85, 1.04, 0.17);
        box(stand, pale, 0, 2.14, 0.1, 0.53, 0.72, 0.03);
        const seal = ball(stand, gold, 0, 2.15, 0.19, 0.17 + index * 0.03);
        reactions[place.id][item.id] = () => { cover.rotation.y = -0.42; seal.scale.setScalar(0.29); };
      } else if (place.id === "agents") {
        column(stand, accent, 0, 1.95, 0, 0.33, 0.74);
        ball(stand, glass, 0, 2.52, 0, 0.52);
        const core = ball(stand, gold, 0, 2.52, 0, 0.18);
        const lit = mat("#ffe4a7", { emissive: "#dca350", emissiveIntensity: 0.85 });
        reactions[place.id][item.id] = () => { core.material = lit; core.scale.setScalar(0.28); };
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
      cube.dispose(); globe.dispose(); tube.dispose(); ring.dispose();
      materials.forEach((material) => material.dispose());
    },
  };
}
