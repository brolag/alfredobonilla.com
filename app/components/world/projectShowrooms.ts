import featuredProjects from "../../content/featuredProjects.json";

export type ProjectId = (typeof featuredProjects.projects)[number]["id"];

export interface ShowroomStation {
  id: string;
  label: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  darkLogo?: boolean;
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
    intro: "Producto, ingeniería y formación trabajando con agentes para apoyar a quienes construyen por cuenta propia.",
    stations: [
      { id: "idea", label: "La idea", title: "Construir con criterio", body: "Indie Mind reúne herramientas, mentoría y formación en IA aplicada. Su enfoque es que los creadores independientes puedan probar ideas y convertirlas en sistemas útiles.", image: "/showrooms/indie-mind-cover.png", imageAlt: "Identidad visual oficial de Indie Mind", source: "Indie Mind", sourceUrl: "https://www.indiemind.ai/" },
      { id: "tools", label: "Herramientas", title: "Código para compartir", body: "Entre sus proyectos abiertos están Neural Claude Code, Neural Open Code y Neural Codex: flujos para planear, construir y verificar trabajo con agentes de desarrollo.", image: "/brands/indie-mind.png", imageAlt: "Símbolo oficial de Indie Mind", source: "Indie Mind", sourceUrl: "https://www.indiemind.ai/" },
      { id: "team", label: "Equipo", title: "Cómo trabaja Indie Mind", body: "El trabajo reúne decisiones de producto, ingeniería y educación. Los agentes ayudan a ejecutar flujos de desarrollo; las herramientas abiertas permiten que otras personas las prueben y adapten a su propio trabajo.", image: "/showrooms/lyfter-alfredo.png", imageAlt: "Retrato de Alfredo Bonilla publicado por Lyfter", source: "Lyfter · equipo", sourceUrl: "https://www.lyfter.academy/", people: [{ name: "Alfredo Bonilla", role: "Producto, ingeniería y formación", image: "/showrooms/lyfter-alfredo.png" }, { name: "Comunidad de builders", role: "Puede probar y adaptar los proyectos abiertos" }] },
    ],
  },
  lyfter: {
    color: "#eeaa70", wall: "#f1e5d9",
    intro: "Un equipo de ingeniería y educación acompaña una ruta práctica para aprender a desarrollar software.",
    stations: [
      { id: "learning", label: "La experiencia", title: "Aprender construyendo", body: "Lyfter combina una ruta estructurada de desarrollo de software con proyectos, comunidad y revisión personalizada de código.", image: "/brands/lyfter.svg", imageAlt: "Logotipo de Lyfter en negro", darkLogo: true, source: "Lyfter", sourceUrl: "https://www.lyfter.academy/" },
      { id: "community", label: "Comunidad", title: "Aprender con otras personas", body: "La comunidad también se encuentra fuera del aula. Esta foto de un encuentro publicada por Lyfter muestra a participantes y equipo reunidos.", image: "/showrooms/lyfter-community.jpg", imageAlt: "Foto grupal de la comunidad Lyfter en un encuentro", source: "Lyfter · comunidad", sourceUrl: "https://www.lyfter.academy/" },
      { id: "people", label: "Equipo", title: "Un equipo que enseña y construye", body: "Lyfter presenta a instructores que siguen trabajando en software. Educación, ingeniería y mentoría se combinan para revisar código, resolver dudas y acompañar proyectos reales. La foto muestra un encuentro de la comunidad; los retratos de abajo identifican a los integrantes publicados por Lyfter.", image: "/showrooms/lyfter-community-2.jpg", imageAlt: "Encuentro de la comunidad Lyfter publicado por Lyfter", source: "Lyfter · comunidad y equipo", sourceUrl: "https://www.lyfter.academy/", people: [{ name: "Alek Castillo", role: "Ingeniería full stack y DevOps", image: "/showrooms/lyfter-alek.webp" }, { name: "André Solís", role: "Dirección de Educación", image: "/showrooms/lyfter-andre.webp" }, { name: "Alfredo Bonilla", role: "Dirección de Tecnología", image: "/showrooms/lyfter-alfredo.png" }, { name: "Andrés Bonilla", role: "Ingeniería y docencia", image: "/showrooms/lyfter-andres.png" }] },
    ],
  },
  "imagine-paradise": {
    color: "#75bca3", wall: "#e0ebdf",
    intro: "Un equipo editorial y una red de especialistas conectan mercadeo, datos e historias de Costa Rica.",
    stations: [
      { id: "place", label: "Costa Rica", title: "Historias del lugar", body: "Imagine Paradise trabaja con mercadeo e inteligencia de negocios desde Costa Rica. Su sitio presenta naturaleza, destinos y cultura local como parte de su identidad visual.", image: "/showrooms/imagine-rainforest.jpg", imageAlt: "Catarata de Costa Rica usada en el sitio de Imagine Paradise", source: "Imagine Paradise · imagen de Unsplash", sourceUrl: "https://imagineparadise.xyz/" },
      { id: "products", label: "Productos", title: "Ideas que conectan", body: "En su sitio aparecen proyectos como Tangoi, People of Costa Rica, Costa Rica Species y Receticas: distintas formas de conectar contenido, comunidades y oportunidades.", image: "/brands/imagine-paradise.svg", imageAlt: "Identidad visual de Imagine Paradise", source: "Imagine Paradise", sourceUrl: "https://imagineparadise.xyz/" },
      { id: "team", label: "Equipo", title: "Publicar con especialistas", body: "Imagine Paradise describe un equipo de seis personas de planta y una red de traductores, biólogos y fotógrafos por región. Esa combinación permite investigar, producir y adaptar historias para distintas audiencias. La imagen muestra San José; no es una foto del equipo.", image: "/showrooms/imagine-san-jose.jpg", imageAlt: "Vista aérea de San José usada en el sitio de Imagine Paradise", source: "Imagine Paradise · imagen de Unsplash", sourceUrl: "https://imagineparadise.xyz/", people: [{ name: "Equipo de planta", role: "Seis personas sostienen la publicación y los proyectos" }, { name: "Red de especialistas", role: "Traducción, biología y fotografía por región" }] },
    ],
  },
  "stone-sphere": {
    color: "#7ca7c5", wall: "#dce5ec",
    intro: "Stone Sphere trabaja con los equipos que conocen cada operación para implementar IA útil y medible.",
    stations: [
      { id: "mission", label: "Propósito", title: "IA útil para operar", body: "Stone Sphere ayuda a identificar oportunidades reales para la IA dentro de una operación. Su punto de partida son los procesos y el trabajo del equipo.", image: "/showrooms/stone-hero.png", imageAlt: "Esfera visual oficial de Stone Sphere", source: "Stone Sphere", sourceUrl: "https://www.stonesphere.tech/" },
      { id: "method", label: "Método", title: "Del mapa a la implementación", body: "El proceso presentado en su sitio pasa por mapear oportunidades, preparar al equipo, implementar automatizaciones y medir lo que cambia.", image: "/showrooms/stone-system.webp", imageAlt: "Visual de la esfera ensamblada publicado por Stone Sphere", source: "Stone Sphere", sourceUrl: "https://www.stonesphere.tech/" },
      { id: "team", label: "Equipo", title: "Construir con el equipo de operación", body: "El trabajo empieza con quienes conocen los procesos. Stone Sphere mapea oportunidades con ellos, prepara al equipo con casos reales y documenta las automatizaciones para que puedan usarlas y mantenerlas.", image: "/brands/stone-sphere.png", imageAlt: "Marca oficial de Stone Sphere", source: "Stone Sphere", sourceUrl: "https://www.stonesphere.tech/", people: [{ name: "Equipo de operación", role: "Aporta el contexto y los casos reales" }, { name: "Stone Sphere", role: "Facilita el diagnóstico, la formación y la implementación" }] },
    ],
  },
};
