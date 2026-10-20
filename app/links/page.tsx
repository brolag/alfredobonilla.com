import type { Metadata } from "next";
import Image from "next/image";
import styles from "./links.module.css";

export const metadata: Metadata = {
  title: "Alfredo Bonilla | IA aplicada con Indie Mind",
  description:
    "Descubre por dónde empezar con IA, conoce la Mentoría Aplicada y la capacitación para equipos de Indie Mind.",
  alternates: { canonical: "https://alfredobonilla.com/links" },
};

const paths = [
  {
    eyebrow: "Para ti",
    title: "Mentoría Aplicada",
    description:
      "Cuatro sesiones privadas para convertir una tarea de tu trabajo en un flujo con IA que puedas repetir.",
    href: "https://www.indiemind.ai/#mentoria",
    action: "Conoce la mentoría",
    number: "01",
  },
  {
    eyebrow: "Para tu equipo",
    title: "Capacitación en IA",
    description:
      "Aprendan sobre un proceso real, con práctica y criterios compartidos para revisar los resultados.",
    href: "https://www.indiemind.ai/empresas#capacitacion",
    action: "Conoce la capacitación",
    number: "02",
  },
];

export default function LinksPage() {
  return (
    <main className={styles.page}>
      <div className={styles.orbOne} aria-hidden="true" />
      <div className={styles.orbTwo} aria-hidden="true" />

      <div className={styles.content}>
        <header className={styles.header}>
          <a className={styles.identity} href="/paper" aria-label="Ver el perfil de Alfredo Bonilla">
            <span className={styles.avatar}>AB</span>
            <span>
              <strong>Alfredo Bonilla</strong>
              <small>Fundador de Indie Mind</small>
            </span>
          </a>
          <a className={styles.profileLink} href="/paper">Mi perfil <span aria-hidden="true">↗</span></a>
        </header>

        <section className={styles.intro} aria-labelledby="links-title">
          <div className={styles.brand}>
            <Image src="/brands/indie-mind.png" alt="" width={34} height={34} />
            <span>INDIE MIND · IA APLICADA</span>
          </div>
          <h1 id="links-title">Lleva la IA a<br /><em>tu trabajo.</em></h1>
          <p>Te acompaño a trabajar con IA sobre tareas reales, con tus herramientas y tu criterio. Elige por dónde empezar.</p>
        </section>

        <section className={styles.routes} aria-label="Formas de empezar con Indie Mind">
          <a className={styles.featured} href="https://www.indiemind.ai/empresas#diagnostico">
            <span className={styles.featuredTop}>
              <span className={styles.tag}>Empieza aquí · gratis</span>
              <span className={styles.featuredArrow} aria-hidden="true">↗</span>
            </span>
            <strong>Descubre tu punto de partida.</strong>
            <span className={styles.featuredDescription}>Responde ocho preguntas sobre tu uso de IA o el de tu equipo. Recibe un puntaje y tres pasos para avanzar, sin dejar tu correo.</span>
            <span className={styles.featuredAction}>Hacer el diagnóstico <span aria-hidden="true">→</span></span>
          </a>

          <div className={styles.sectionTitle}>
            <span>Si ya sabes qué quieres trabajar</span>
            <span aria-hidden="true">02 / 03</span>
          </div>

          <div className={styles.pathGrid}>
            {paths.map((path) => (
              <a className={styles.path} href={path.href} key={path.title}>
                <span className={styles.pathTop}><span>{path.eyebrow}</span><span>{path.number}</span></span>
                <strong>{path.title}</strong>
                <span className={styles.pathDescription}>{path.description}</span>
                <span className={styles.pathAction}>{path.action} <span aria-hidden="true">↗</span></span>
              </a>
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.contact}>
            <span>¿Tienes un caso en mente?</span>
            <a href="mailto:hello@indiemind.ai?subject=Quiero%20conversar%20sobre%20IA%20en%20mi%20trabajo">Cuéntame tu caso <span aria-hidden="true">↗</span></a>
          </div>
          <nav className={styles.more} aria-label="Más sobre Alfredo e Indie Mind">
            <a href="https://www.indiemind.ai/blog">Blog</a>
            <a href="https://www.linkedin.com/in/brolag/">LinkedIn</a>
            <a href="https://github.com/brolag">GitHub</a>
            <a href="/paper">Sobre mí</a>
          </nav>
          <p>Alfredo Bonilla · Costa Rica</p>
        </footer>
      </div>
    </main>
  );
}
