import * as THREE from "three";
import { places, type PlaceId } from "./places";
import { roomActivities } from "./roomActivities";
import featuredProjects from "../../content/featuredProjects.json";
import { projectShowrooms, type ProjectId } from "./projectShowrooms";

export interface InteriorObject {
  id: string;
  position: THREE.Vector3;
}

export interface WorldInteriors {
  scene: THREE.Scene;
  enter: (id: PlaceId) => void;
  enterProject: (id: ProjectId) => void;
  activate: (id: PlaceId, itemId: string) => void;
  objects: (id: PlaceId) => readonly InteriorObject[];
  projectObjects: (id: ProjectId) => readonly InteriorObject[];
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
  const galleryGeometries = new Set<THREE.BufferGeometry>();
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
  const rooms = {} as Record<PlaceId, THREE.Group>;
  const objects = {} as Record<PlaceId, InteriorObject[]>;
  const activated = {} as Record<PlaceId, Record<string, THREE.Mesh>>;
  const reactions = {} as Record<PlaceId, Record<string, () => void>>;
  let current: PlaceId | null = null;
  let currentProject: ProjectId | null = null;
  const projectRooms: Record<string, THREE.Group> = {};
  const projectObjects: Record<string, InteriorObject[]> = {};

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

  function buildProjectRoom(id: ProjectId) {
    const config = projectShowrooms[id];
    const group = new THREE.Group();
    const accent = mat(config.color), wall = mat(config.wall);
    const trim = mat("#f9f2df"), frame = mat("#49635e");
    const xs = [-3.1, 0, 3.1];
    projectObjects[id] = [];
    box(group, trim, 0, -0.18, 0, 11, 0.36, 11);
    box(group, wall, 0, 3.1, -4.7, 11, 6.2, 0.35);
    box(group, wall, -5.42, 3.1, 0, 0.3, 6.2, 9.7);
    box(group, wall, 5.42, 3.1, 0, 0.3, 6.2, 9.7);
    box(group, accent, 0, 5.34, -4.44, 8.5, 0.13, 0.12);
    box(group, frame, 0, 0.015, -1.3, 8.9, 0.04, 4.6);
    box(group, wall, 0, 0.05, -1.3, 8.55, 0.04, 4.3);
    for (const x of [-4.7, 4.7]) {
      column(group, frame, x, 0.62, 1.7, 0.45, 1.25);
      ball(group, accent, x, 1.42, 1.7, 0.64);
    }
    config.stations.forEach((station, index) => {
      const x = xs[index];
      projectObjects[id].push({ id: station.id, position: new THREE.Vector3(x, 2.6, -3.2) });
      box(group, frame, x, 2.87, -4.32, 2.64, 2.14, 0.2);
      box(group, trim, x, 2.87, -4.18, 2.43, 1.93, 0.07);
      const geometry = new THREE.PlaneGeometry(2.26, 1.64);
      galleryGeometries.add(geometry);
      const texture = imageLoader.load(station.image, (loaded) => {
        const image = loaded.image as { width?: number; height?: number };
        const aspect = (image.width ?? 1) / (image.height ?? 1);
        const width = Math.min(2.26, 1.64 * aspect);
        const height = Math.min(1.64, 2.26 / aspect);
        imagePlane.scale.set(width / 2.26, height / 1.64, 1);
      });
      texture.colorSpace = THREE.SRGBColorSpace;
      textures.add(texture);
      const photo = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide, toneMapped: false, color: station.darkLogo ? "#111111" : "#ffffff" });
      materials.add(photo);
      const imagePlane = shape(group, geometry, photo, x, 2.87, -4.12);
      box(group, accent, x, 1.68, -4.11, 2.35, 0.12, 0.08);
      box(group, frame, x, 0.74, -2.52, 1.9, 1.43, 1.2);
      box(group, accent, x, 1.5, -2.52, 2.1, 0.1, 1.37);
      box(group, trim, x, 0.82, -1.9, 1.55, 0.27, 0.05);
      ball(group, accent, x, 1.83, -2.52, 0.16);
    });
    if (id === "indie-mind") {
      for (const x of [-0.8, 0, 0.8]) shape(group, ring, accent, x, 4.4 + Math.abs(x) * 0.2, -4.28, 0.5, 0.5, 0.5);
    } else if (id === "lyfter") {
      for (let i = 0; i < 4; i++) box(group, accent, -1.2 + i * 0.8, 4.04 + i * 0.16, -4.28, 0.58, 0.28 + i * 0.32, 0.14);
    } else if (id === "imagine-paradise") {
      ball(group, gold, 0, 4.4, -4.2, 0.53);
      for (const x of [-2.2, 2.2]) ball(group, leaf, x, 4.1, -4.2, 0.43);
    } else {
      ball(group, accent, 0, 4.4, -4.2, 0.52);
      shape(group, ring, gold, 0, 4.4, -4.2, 1.1, 1.1, 1.1).rotation.x = 0.5;
    }
    projectRooms[id] = group;
  }

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
      // A warm specialty coffee bar; the order is a metaphor for starting a conversation.
      const walnut = mat("#765039"), walnutDark = mat("#513b31"), terracotta = mat("#b98268");
      const tile = mat("#f3e6ce"), tileLine = mat("#d6bea1"), brass = mat("#d5a75d", { metalness: 0.45 });
      const ceramic = mat("#f8f0db"), steel = mat("#7e8c86", { metalness: 0.65, roughness: 0.3 });
      const coffeeBean = mat("#563426"), coffeeSurface = mat("#70432c");
      const lamp = mat("#ffe7ae", { emissive: "#f0bd68", emissiveIntensity: 1.4 });
      box(group, tile, 0, 0.035, 0, 10.6, 0.06, 10.6);
      for (const x of [-3.6, -1.8, 0, 1.8, 3.6]) box(group, tileLine, x, 0.07, 0, 0.025, 0.014, 10.3);
      for (const z of [-3.6, -1.8, 0, 1.8, 3.6]) box(group, tileLine, 0, 0.07, z, 10.3, 0.014, 0.025);
      box(group, terracotta, 0, 3.16, -4.31, 9.8, 4.7, 0.21);
      box(group, tile, 0, 1.3, -4.13, 9.8, 1.55, 0.08);
      for (const x of [-4.2, -3.15, -2.1, -1.05, 0, 1.05, 2.1, 3.15, 4.2]) box(group, tileLine, x, 1.3, -4.08, 0.026, 1.48, 0.02);
      for (const y of [0.8, 1.8]) box(group, tileLine, 0, y, -4.08, 9.7, 0.028, 0.02);
      box(group, walnutDark, 0, 5.4, -4.16, 9.6, 0.22, 0.12);

      const menu = document.createElement("canvas");
      menu.width = 1024; menu.height = 512;
      const paint = menu.getContext("2d");
      if (paint) {
        paint.fillStyle = "#274438"; paint.fillRect(0, 0, menu.width, menu.height);
        paint.strokeStyle = "#cda968"; paint.lineWidth = 8; paint.strokeRect(20, 20, 984, 472);
        paint.textAlign = "center"; paint.fillStyle = "#f6e8ca";
        paint.font = "bold 54px Georgia, serif"; paint.fillText("CAFÉ DE ESPECIALIDAD", 512, 113);
        paint.fillStyle = "#d8b678"; paint.font = "bold 27px Arial, sans-serif";
        paint.fillText("ESPRESSO   ·   V60   ·   CORTADO", 512, 222);
        paint.fillStyle = "#efe3ca"; paint.font = "28px Georgia, serif";
        paint.fillText("Una buena conversación empieza aquí", 512, 310);
        paint.strokeStyle = "#b9955f"; paint.lineWidth = 3;
        paint.beginPath(); paint.moveTo(320, 363); paint.lineTo(704, 363); paint.stroke();
        paint.font = "bold 22px Arial, sans-serif"; paint.fillText("ORIGEN  ·  MÉTODO  ·  TIEMPO", 512, 421);
      }
      const menuTexture = new THREE.CanvasTexture(menu);
      menuTexture.colorSpace = THREE.SRGBColorSpace; textures.add(menuTexture);
      const menuMaterial = new THREE.MeshBasicMaterial({ map: menuTexture, toneMapped: false });
      materials.add(menuMaterial);
      const menuGeometry = new THREE.PlaneGeometry(4.1, 2.05); galleryGeometries.add(menuGeometry);
      box(group, walnutDark, 0, 3.77, -4.11, 4.35, 2.25, 0.17);
      shape(group, menuGeometry, menuMaterial, 0, 3.77, -3.99);

      // Shelves with jars of beans, cups and bags frame the menu.
      for (const side of [-1, 1]) {
        const x = side * 3.55;
        for (const y of [2.6, 3.65]) {
          box(group, walnut, x, y, -3.95, 2.2, 0.12, 0.48);
          for (const offset of [-0.62, 0, 0.62]) {
            const jar = column(group, glass, x + offset, y + 0.26, -3.9, 0.18, 0.4);
            jar.material = side < 0 ? coffeeBean : glass;
            column(group, brass, x + offset, y + 0.48, -3.9, 0.2, 0.06);
          }
        }
      }

      // Wood-front counter with a pale stone top and brass foot rail.
      box(group, walnutDark, 0, 0.83, -1.8, 5.9, 1.5, 1.5);
      for (const x of [-2.55, -2.05, -1.55, -1.05, -0.55, 0, 0.55, 1.05, 1.55, 2.05, 2.55]) box(group, walnut, x, 0.84, -1.025, 0.32, 1.31, 0.07);
      box(group, brass, 0, 0.29, -0.96, 5.55, 0.06, 0.09);
      box(group, ceramic, 0, 1.61, -1.8, 6.12, 0.16, 1.7);
      box(group, walnut, 0, 1.72, -1.8, 6.2, 0.045, 1.75);

      // Two-group espresso machine and portafilters.
      box(group, steel, -1.73, 2.16, -3.05, 1.64, 0.83, 0.7);
      box(group, walnutDark, -1.73, 2.48, -2.68, 1.4, 0.12, 0.07);
      box(group, dark, -1.73, 2.31, -2.67, 1.42, 0.18, 0.065);
      for (const x of [-2.13, -1.33]) {
        column(group, brass, x, 1.89, -2.68, 0.16, 0.13);
        box(group, walnutDark, x, 1.82, -2.4, 0.09, 0.09, 0.46);
        column(group, ceramic, x, 1.68, -2.44, 0.15, 0.22);
      }
      box(group, steel, -0.6, 1.94, -2.86, 0.07, 0.6, 0.08);
      column(group, brass, -0.6, 1.66, -2.86, 0.06, 0.09);

      // Grinder, gooseneck kettle, dripper and carafe distinguish the brew bar.
      column(group, walnutDark, 2.19, 1.97, -3.05, 0.26, 0.53);
      column(group, glass, 2.19, 2.36, -3.05, 0.31, 0.31);
      ball(group, coffeeBean, 2.19, 2.4, -3.05, 0.2);
      column(group, brass, 2.19, 2.55, -3.05, 0.32, 0.06);
      column(group, steel, 0.62, 1.85, -2.95, 0.36, 0.37);
      shape(group, ring, walnutDark, 1.04, 1.89, -2.95, 0.39, 0.39, 0.39).rotation.y = Math.PI / 2;
      box(group, steel, 0.33, 2.08, -2.82, 0.09, 0.06, 0.45);
      column(group, glass, 1.41, 1.87, -2.9, 0.25, 0.34);
      const dripperGeometry = new THREE.CylinderGeometry(0.32, 0.11, 0.32, 12);
      galleryGeometries.add(dripperGeometry);
      shape(group, dripperGeometry, ceramic, 1.41, 2.24, -2.9);
      ball(group, coffeeSurface, 1.41, 2.39, -2.9, 0.12);

      // Pendant lights, plants and intimate tables finish the room.
      for (const x of [-2.45, 0, 2.45]) {
        box(group, walnutDark, x, 5.2, -1.8, 0.04, 0.9, 0.04);
        const shadeGeometry = new THREE.CylinderGeometry(0.12, 0.49, 0.36, 12);
        galleryGeometries.add(shadeGeometry);
        shape(group, shadeGeometry, walnut, x, 4.57, -1.8);
        ball(group, lamp, x, 4.31, -1.8, 0.17);
      }
      for (const x of [-3.52, 3.52]) {
        column(group, walnutDark, x, 0.63, 1.34, 0.1, 1.13);
        column(group, walnut, x, 1.22, 1.34, 0.77, 0.1);
        column(group, ceramic, x - 0.14, 1.35, 1.32, 0.16, 0.19);
        shape(group, ring, brass, x + 0.07, 1.36, 1.32, 0.2, 0.2, 0.2).rotation.y = Math.PI / 2;
        for (const side of [-1, 1]) {
          const seatX = x + side * 0.92;
          column(group, walnutDark, seatX, 0.48, 1.34, 0.09, 0.88);
          column(group, walnut, seatX, 0.95, 1.34, 0.32, 0.11);
        }
      }
    }

    const items = roomActivities[place.id].items;
    const xs = items.length === 4 ? [-3.45, -1.15, 1.15, 3.45] : items.length === 3 ? [-2.9, 0, 2.9] : items.length === 2 ? [-1.9, 1.9] : [0];
    items.forEach((item, index) => {
      const x = xs[index];
      const stand = new THREE.Group(); stand.position.set(x, 0, -1.8); group.add(stand);
      objects[place.id].push({ id: item.id, position: new THREE.Vector3(x, 2.2, -1.8) });
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
        const cover = box(stand, accent, 0, 2.14, 0, 0.85, 1.04, 0.17);
        box(stand, pale, 0, 2.14, 0.1, 0.53, 0.72, 0.03);
        const seal = ball(stand, gold, 0, 2.15, 0.19, 0.17 + index * 0.03);
        reactions[place.id][item.id] = () => { cover.rotation.y = -0.42; seal.scale.setScalar(0.29); };
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
      if (currentProject) scene.remove(projectRooms[currentProject]);
      currentProject = null;
      current = id;
      scene.add(rooms[id]);
    },
    enterProject(id) {
      if (current) scene.remove(rooms[current]);
      if (currentProject) scene.remove(projectRooms[currentProject]);
      if (!projectRooms[id]) buildProjectRoom(id);
      current = null;
      currentProject = id;
      scene.add(projectRooms[id]);
    },
    activate(id, itemId) {
      const beacon = activated[id]?.[itemId];
      if (beacon) { beacon.visible = true; reactions[id][itemId](); }
    },
    objects(id) { return objects[id]; },
    projectObjects(id) { return projectObjects[id] ?? []; },
    dispose() {
      cube.dispose(); globe.dispose(); tube.dispose(); ring.dispose(); brandSquare.dispose(); brandWide.dispose();
      galleryGeometries.forEach((geometry) => geometry.dispose());
      textures.forEach((texture) => texture.dispose());
      materials.forEach((material) => material.dispose());
    },
  };
}
