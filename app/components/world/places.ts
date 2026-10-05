export type PlaceId = "about" | "projects" | "agents" | "academy" | "services" | "contact";

export interface WorldPlace {
  id: PlaceId;
  name: string;
  shortName: string;
  eyebrow: string;
  description: string;
  color: string;
  x: number;
  z: number;
}

export const places: WorldPlace[] = [
  { id: "about", name: "Sobre mí", shortName: "Casa", eyebrow: "01 / el origen", description: "Una historia de software, educación y curiosidad.", color: "#77ad76", x: -11, z: -6.4 },
  { id: "projects", name: "Proyectos", shortName: "Taller", eyebrow: "02 / lo que construyo", description: "Cuatro proyectos que reúnen educación, producto e IA aplicada.", color: "#e8a76e", x: 0, z: -9.2 },
  { id: "agents", name: "Redes", shortName: "Plaza social", eyebrow: "03 / sigamos en contacto", description: "Tres maneras de seguir lo que construyo y conversar.", color: "#7ebbc0", x: 11, z: -6.4 },
  { id: "academy", name: "Biblioteca", shortName: "Biblioteca", eyebrow: "04 / recursos y aprendizaje", description: "Rutas y herramientas para aprender creando.", color: "#cba9c4", x: -11, z: 5.8 },
  { id: "services", name: "Servicios", shortName: "Invernadero", eyebrow: "05 / trabajar juntos", description: "Consultoría, liderazgo técnico y formación aplicada.", color: "#93c7a7", x: 11, z: 5.8 },
  { id: "contact", name: "Cafetería", shortName: "Café de especialidad", eyebrow: "06 / conversemos", description: "Pasa por un café y cuéntame qué te gustaría crear.", color: "#e7c37b", x: 0, z: 10.3 },
];

export const placeById = Object.fromEntries(places.map((place) => [place.id, place])) as Record<PlaceId, WorldPlace>;
