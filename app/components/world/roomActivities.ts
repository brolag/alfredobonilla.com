import type { PlaceId } from "./places";

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
    prompt: "Inspecciona las cuatro piezas del taller.",
    completed: "Has recorrido las cuatro piezas del taller.",
    verb: "Inspeccionar pieza",
    items: [
      { id: "indie-mind", label: "Indie Mind", detail: "Una plataforma educativa para aprender a crear productos con inteligencia artificial." },
      { id: "neural-claude-code", label: "Neural Claude Code", detail: "Un framework abierto de agentes para desarrollar software con varios modelos de IA." },
      { id: "cofiblocks", label: "Cofiblocks", detail: "Una exploración de Web3 aplicada a la industria cafetalera." },
      { id: "second-brain-template", label: "Second Brain Template", detail: "Una plantilla abierta para organizar conocimiento y proyectos en Obsidian." },
    ],
  },
  agents: {
    prompt: "Conecta contexto, herramientas y revisión para encender el observatorio.",
    completed: "El sistema está conectado: contexto, herramientas y revisión trabajan juntos.",
    verb: "Conectar nodo",
    items: [
      { id: "context", label: "Contexto", detail: "Un agente necesita entender el problema y tener información confiable antes de actuar." },
      { id: "tools", label: "Herramientas", detail: "Las herramientas le permiten investigar, construir y comprobar resultados." },
      { id: "review", label: "Revisión", detail: "Las personas y las puertas de calidad mantienen el sistema útil y responsable." },
    ],
  },
  academy: {
    prompt: "Elige una ruta de aprendizaje y abre una lección.",
    completed: "Has elegido una ruta para aprender construyendo.",
    verb: "Abrir lección",
    items: [
      { id: "build", label: "Crear un producto", detail: "Parte de una idea pequeña, prototípala y compártela con personas reales." },
      { id: "learn-ai", label: "Explorar IA", detail: "Aprende fundamentos, prueba herramientas y conviértelas en un flujo útil." },
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
    prompt: "Sirve una taza para abrir la conversación.",
    completed: "El café está listo. La conversación puede comenzar.",
    verb: "Servir café",
    items: [{ id: "coffee", label: "Una taza de café", detail: "Cuéntame qué estás intentando crear. Podemos empezar con un correo o agendar una conversación." }],
  },
};

export function roomIsComplete(id: PlaceId, used: readonly string[]) {
  const activity = roomActivities[id];
  return id === "academy" || id === "services" || id === "contact"
    ? used.length > 0
    : activity.items.every((item) => used.includes(item.id));
}
