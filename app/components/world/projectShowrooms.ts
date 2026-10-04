import featuredProjects from "../../content/featuredProjects.json";

export type ProjectId = (typeof featuredProjects.projects)[number]["id"];

export interface ShowroomStation {
  id: string;
  label: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  source: string;
  sourceUrl: string;
  people?: readonly { name: string; role: string; image?: string }[];
}

export interface ProjectShowroom {
  color: string;
  wall: string;
  intro: string;
  stations: readonly ShowroomStation[];
}

export const projectShowrooms: Record<ProjectId, ProjectShowroom> = {
  "indie-mind": {
    color: "#83c9d2", wall: "#dcecef",
    intro: "Herramientas abiertas, formación e IA aplicada para quienes construyen por cuenta propia.",
    stations: [
      { id: "idea", label: "La idea", title: "Construir con criterio", body: "Indie Mind reúne herramientas, mentoría y formación en IA aplicada. Su enfoque es que los creadores independientes puedan probar ideas y convertirlas en sistemas útiles.", image: "/showrooms/indie-mind-cover.png", imageAlt: "Identidad visual oficial de Indie Mind", source: "Indie Mind", sourceUrl: "https://www.indiemind.ai/" },
      { id: "tools", label: "Herramientas", title: "Código para compartir", body: "Entre sus proyectos abiertos están Neural Claude Code, Neural Open Code y Neural Codex: flujos para planear, construir y verificar trabajo con agentes de desarrollo.", image: "/brands/indie-mind.png", imageAlt: "Símbolo oficial de Indie Mind", source: "Indie Mind", sourceUrl: "https://www.indiemind.ai/" },
      { id: "person", label: "Persona", title: "Alfredo Bonilla", body: "Soy el fundador de Indie Mind. Aquí conecto mi trabajo como ingeniero de software, educador y creador de herramientas de IA.", image: "/showrooms/lyfter-alfredo.png", imageAlt: "Retrato de Alfredo Bonilla publicado por Lyfter", source: "Lyfter · equipo", sourceUrl: "https://www.lyfter.academy/", people: [{ name: "Alfredo Bonilla", role: "Fundador de Indie Mind", image: "/showrooms/lyfter-alfredo.png" }] },
    ],
  },
  lyfter: {
    color: "#eeaa70", wall: "#f1e5d9",
    intro: "Una comunidad y una ruta práctica para aprender a desarrollar software.",
    stations: [
      { id: "learning", label: "La experiencia", title: "Aprender construyendo", body: "Lyfter combina una ruta estructurada de desarrollo de software con proyectos, comunidad y revisión personalizada de código.", image: "/brands/lyfter.svg", imageAlt: "Logotipo oficial de Lyfter", source: "Lyfter", sourceUrl: "https://www.lyfter.academy/" },
      { id: "community", label: "Comunidad", title: "Aprender con otras personas", body: "La comunidad también se encuentra fuera del aula. Esta foto de un encuentro publicada por Lyfter muestra a participantes y equipo reunidos.", image: "/showrooms/lyfter-community.jpg", imageAlt: "Foto grupal de la comunidad Lyfter en un encuentro", source: "Lyfter · comunidad", sourceUrl: "https://www.lyfter.academy/" },
      { id: "people", label: "Equipo", title: "Personas detrás de Lyfter", body: "El sitio de Lyfter presenta a estas personas y sus funciones dentro del equipo.", image: "/showrooms/lyfter-alek.webp", imageAlt: "Retrato de Alek Castillo publicado por Lyfter", source: "Lyfter · equipo", sourceUrl: "https://www.lyfter.academy/", people: [{ name: "Alek Castillo", role: "CEO y fundador", image: "/showrooms/lyfter-alek.webp" }, { name: "André Solís", role: "Director de Educación", image: "/showrooms/lyfter-andre.webp" }, { name: "Alfredo Bonilla", role: "Director de Tecnología", image: "/showrooms/lyfter-alfredo.png" }] },
    ],
  },
  "imagine-paradise": {
    color: "#75bca3", wall: "#e0ebdf",
    intro: "Mercadeo e inteligencia de negocios conectados con las historias de Costa Rica.",
    stations: [
      { id: "place", label: "Costa Rica", title: "Historias del lugar", body: "Imagine Paradise trabaja con mercadeo e inteligencia de negocios desde Costa Rica. Su sitio presenta naturaleza, destinos y cultura local como parte de su identidad visual.", image: "/showrooms/imagine-rainforest.jpg", imageAlt: "Catarata de Costa Rica usada en el sitio de Imagine Paradise", source: "Imagine Paradise · imagen de Unsplash", sourceUrl: "https://imagineparadise.xyz/" },
      { id: "products", label: "Productos", title: "Ideas que conectan", body: "En su sitio aparecen proyectos como Tangoi, People of Costa Rica, Costa Rica Species y Receticas: distintas formas de conectar contenido, comunidades y oportunidades.", image: "/brands/imagine-paradise.svg", imageAlt: "Identidad visual de Imagine Paradise", source: "Imagine Paradise", sourceUrl: "https://imagineparadise.xyz/" },
      { id: "person", label: "Dirección", title: "Gerardo Venegas", body: "Imagine Paradise identifica públicamente a Gerardo Venegas como fundador y director general. La imagen muestra San José y no es un retrato de él.", image: "/showrooms/imagine-san-jose.jpg", imageAlt: "Vista aérea de San José usada en el sitio de Imagine Paradise", source: "Imagine Paradise · imagen de Unsplash", sourceUrl: "https://imagineparadise.xyz/", people: [{ name: "Gerardo Venegas", role: "Fundador y director general" }] },
    ],
  },
  "stone-sphere": {
    color: "#7ca7c5", wall: "#dce5ec",
    intro: "IA aplicada a operaciones concretas, con resultados que se pueden medir.",
    stations: [
      { id: "mission", label: "Propósito", title: "IA útil para operar", body: "Stone Sphere ayuda a identificar oportunidades reales para la IA dentro de una operación. Su punto de partida son los procesos y el trabajo del equipo.", image: "/showrooms/stone-hero.png", imageAlt: "Esfera visual oficial de Stone Sphere", source: "Stone Sphere", sourceUrl: "https://www.stonesphere.tech/" },
      { id: "method", label: "Método", title: "Del mapa a la implementación", body: "El proceso presentado en su sitio pasa por mapear oportunidades, preparar al equipo, implementar automatizaciones y medir lo que cambia.", image: "/showrooms/stone-system.webp", imageAlt: "Visual de la esfera ensamblada publicado por Stone Sphere", source: "Stone Sphere", sourceUrl: "https://www.stonesphere.tech/" },
      { id: "team", label: "El equipo", title: "Trabajo con personas", body: "La implementación se hace junto a quienes conocen cada proceso. Preparar al equipo para usar y revisar las automatizaciones forma parte del trabajo de Stone Sphere.", image: "/brands/stone-sphere.png", imageAlt: "Marca oficial de Stone Sphere", source: "Stone Sphere", sourceUrl: "https://www.stonesphere.tech/" },
    ],
  },
};
