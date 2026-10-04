import type { PlaceId } from "./places";
import featuredProjects from "../../content/featuredProjects.json";
import contactData from "../../content/contact.json";

export interface RoomItem {
  id: string;
  label: string;
  detail: string;
}

export interface RoomActivity {
  prompt: string;
  completed: string;
  verb: string;
  items: readonly RoomItem[];
}

export const roomActivities: Record<PlaceId, RoomActivity> = {
  about: {
    prompt: "Abre los tres recuerdos para conocer el recorrido.",
    completed: "Ya conoces la historia detrás del poblado.",
    verb: "Abrir recuerdo",
    items: [
      { id: "curiosity", label: "Curiosidad", detail: "Todo empezó con la curiosidad por entender cómo funcionan las cosas y construirlas con código." },
      { id: "community", label: "Comunidad", detail: "Enseñar, compartir y aprender con otras personas convirtió esa curiosidad en proyectos colectivos." },
      { id: "today", label: "Hoy", detail: "Hoy combino producto, IA y educación para crear herramientas que ayuden a otros a construir." },
    ],
  },
  projects: {
    prompt: "Conoce los cuatro proyectos del taller.",
    completed: "Ya conoces los cuatro proyectos del taller.",
    verb: "Explorar proyecto",
    items: featuredProjects.projects.map(({ id, name, description }) => ({ id, label: name, detail: description })),
  },
  agents: {
    prompt: "Explora GitHub, LinkedIn e Instagram para encontrarme en la red.",
    completed: "Ya conoces mis tres espacios para compartir y conectar.",
    verb: "Explorar red",
    items: contactData.details.filter((detail) => ["github", "linkedin", "instagram"].includes(detail.type)).map((detail) => ({
      id: detail.type,
      label: detail.type === "github" ? "GitHub" : detail.type === "linkedin" ? "LinkedIn" : "Instagram",
      detail: detail.type === "github" ? "Código abierto, experimentos y herramientas que comparto con la comunidad." : detail.type === "linkedin" ? "Ideas sobre productos, tecnología, equipos y proyectos en marcha." : "Momentos del trabajo creativo y de la vida fuera de la pantalla.",
    })),
  },
  academy: {
    prompt: "Elige un libro para comenzar una ruta de aprendizaje.",
    completed: "Has elegido una ruta. Abre sus recursos y construye algo propio.",
    verb: "Abrir libro",
    items: [
      { id: "build", label: "Crear un producto", detail: "Define un problema pequeño, crea un prototipo y compártelo con personas reales. Usa la plantilla Second Brain para ordenar ideas y aprendizajes." },
      { id: "learn-ai", label: "Construir con IA", detail: "Aprende los fundamentos de los agentes, pruébalos en un flujo pequeño y revisa sus resultados. Neural Claude Code es un ejemplo abierto para explorar." },
    ],
  },
  services: {
    prompt: "Cultiva una de las tres ideas del invernadero.",
    completed: "Una idea ya tiene su primer brote. Hablemos de cómo hacerla crecer.",
    verb: "Cultivar idea",
    items: [
      { id: "ai", label: "Soluciones con IA", detail: "Agentes, automatización y productos adaptados a problemas concretos." },
      { id: "leadership", label: "Liderazgo técnico", detail: "Estrategia, arquitectura y dirección para equipos que necesitan avanzar." },
      { id: "mentoring", label: "Mentoría", detail: "Acompañamiento práctico para desarrolladores y equipos." },
    ],
  },
  contact: {
    prompt: "Pide un café en la barra para abrir la conversación.",
    completed: "Tu café está listo. Siéntate y conversemos.",
    verb: "Pedir café",
    items: [{ id: "coffee", label: "Café para conversar", detail: "Cuéntame qué estás intentando crear. Podemos empezar con un correo o agendar una conversación." }],
  },
};

export function roomIsComplete(id: PlaceId, used: readonly string[]) {
  const activity = roomActivities[id];
  return id === "academy" || id === "services" || id === "contact"
    ? used.length > 0
    : activity.items.every((item) => used.includes(item.id));
}
