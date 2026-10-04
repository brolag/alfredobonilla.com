import aboutData from "../../content/about.json";
import contactData from "../../content/contact.json";

export type PaperLocale = "es" | "en";

export const paperCopy = {
  es: {
    subtitle: "Fundador de Indie Mind · Costa Rica",
    back: "Volver al mundo",
    backShort: "Mundo",
    hint: "Desplázate para ver el atardecer",
    footer: "hecho con papel y código",
    about: {
      eyebrow: "01 · sobre mí",
      title: "Hola, soy Alfredo.",
      paragraphs: [
        "Soy Alfredo Bonilla, fundador de Indie Mind. Llevo más de 14 años creando software y hoy me especializo en soluciones con IA y desarrollo con agentes desde Costa Rica.",
        "En Indie Mind construyo productos y servicios que usan IA: sistemas con varios agentes, automatización de contenidos y plataformas educativas para desarrolladores.",
        "Trabajo con Next.js, TypeScript, TailwindCSS, Claude Code, OpenAI, orquestación de múltiples modelos y n8n.",
        "He creado herramientas de código abierto como Neural Claude Code, Mission Control y Cortex. También participo en Indie Mind, Lyfter, Imagine Paradise y Stone Sphere, proyectos de educación, productos digitales e IA aplicada.",
        "Creo en diseñar sistemas que nos ayuden a avanzar sin perder el criterio humano. Fuera del teclado, disfruto los juegos de mesa, la naturaleza y la música.",
      ],
      factLabels: { based: "Base", now: "Ahora", believes: "Creo en", "off-duty": "Fuera del teclado" },
      facts: {
        based: "Costa Rica: buen café y mejor conexión de lo que imaginas.",
        now: "Productos con IA en Indie Mind, automatización y educación para desarrolladores.",
        believes: "Sistemas antes que fuerza de voluntad. Automatizar lo repetitivo y conservar el criterio.",
        "off-duty": "Juegos de mesa, naturaleza y música.",
      },
    },
    services: {
      eyebrow: "02 · trabajemos juntos",
      title: "Lo que hago",
      lede: "Sistemas de IA que llegan a producción, educación para desarrolladores y liderazgo técnico para equipos que necesitan avanzar con claridad.",
    },
    work: {
      eyebrow: "03 · proyectos y herramientas",
      title: "Proyectos y herramientas.",
      lede: "Cuatro proyectos en los que trabajo y herramientas abiertas que he creado y compartido.",
    },
    skills: { eyebrow: "04 · herramientas", title: "Lo que uso a diario" },
    contact: {
      eyebrow: "05 · conversemos",
      title: "Construyamos algo.",
      lede: "Estoy disponible para colaboraciones concretas. Una conversación breve nos ayudará a saber si podemos trabajar juntos.",
      book: "Agendar una llamada",
      also: "También estoy en",
      note: "Respondo en un día, salvo que esté frente a un volcán sin señal.",
    },
  },
  en: {
    subtitle: "Founder at Indie Mind · Costa Rica",
    back: "Back to the world",
    backShort: "World",
    hint: "Scroll to watch the sun set",
    footer: "cut from paper, glued with code",
    about: {
      eyebrow: "01 · about",
      title: "Hi, I'm Alfredo.",
      paragraphs: aboutData.content,
      factLabels: { based: "Based", now: "Now", believes: "Believes", "off-duty": "Off-duty" },
      facts: aboutData.facts,
    },
    services: {
      eyebrow: "02 · how we can work together",
      title: "What I do",
      lede: "AI systems that ship, education for developers, and technical leadership for teams that need a steady hand.",
    },
    work: {
      eyebrow: "03 · projects & open tools",
      title: "Projects and tools.",
      lede: "Four projects I work on, followed by open tools I've built and shared.",
    },
    skills: { eyebrow: "04 · toolbox", title: "What I use daily" },
    contact: {
      eyebrow: "05 · say hi",
      title: "Let's build something.",
      lede: "I'm available for specific, high-impact engagements. A short call is the fastest way to find out if we're a fit.",
      book: "Book a call",
      also: "Also on",
      note: contactData.note,
    },
  },
} as const;
