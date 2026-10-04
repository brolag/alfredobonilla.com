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
  { id: "projects", name: "Proyectos", shortName: "Taller", eyebrow: "02 / colaboraciones", description: "Cuatro equipos con los que he compartido ideas y trabajo.", color: "#e8a76e", x: 0, z: -9.2 },
  { id: "agents", name: "Agentes", shortName: "Observatorio", eyebrow: "03 / sistemas inteligentes", description: "Arquitecturas donde la IA colabora con personas y equipos.", color: "#7ebbc0", x: 11, z: -6.4 },
  { id: "academy", name: "Indie Mind", shortName: "Academia", eyebrow: "04 / aprender creando", description: "Educación para quienes quieren construir con nuevas herramientas.", color: "#cba9c4", x: -11, z: 5.8 },
  { id: "services", name: "Servicios", shortName: "Invernadero", eyebrow: "05 / trabajar juntos", description: "Consultoría, liderazgo técnico y formación aplicada.", color: "#93c7a7", x: 11, z: 5.8 },
  { id: "contact", name: "Contacto", shortName: "Café", eyebrow: "06 / conversemos", description: "Un buen proyecto suele empezar con una conversación.", color: "#e7c37b", x: 0, z: 10.3 },
];

export const placeById = Object.fromEntries(places.map((place) => [place.id, place])) as Record<PlaceId, WorldPlace>;
