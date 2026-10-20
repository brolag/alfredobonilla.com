"use client";

import { useEffect } from "react";
import { applyTheme, loadTheme } from "../../lib/theme";
import { clearTimeOfDay } from "../../lib/timeOfDay";
import { PaperScene } from "./PaperScene";

const paths = [
  {
    mark: "1:1",
    title: "Mentoría Aplicada",
    description: "Cuatro sesiones privadas para aplicar IA a una tarea real de tu trabajo.",
    href: "https://www.indiemind.ai/#mentoria",
  },
  {
    mark: "EQ",
    title: "Capacitación para equipos",
    description: "Aprendan con un proceso concreto y criterios compartidos de revisión.",
    href: "https://www.indiemind.ai/empresas#capacitacion",
  },
];

const more = [
  { mark: "IM", title: "Blog de Indie Mind", description: "Ideas y guías sobre IA aplicada.", href: "https://www.indiemind.ai/blog" },
  { mark: "in", title: "LinkedIn", description: "Producto, tecnología y colaboración.", href: "https://www.linkedin.com/in/brolag/" },
  { mark: "GH", title: "GitHub", description: "Herramientas abiertas para construir con agentes.", href: "https://github.com/brolag" },
];

export default function LinksPaper() {
  useEffect(() => {
    applyTheme("paper");
    return () => {
      clearTimeOfDay(document.documentElement);
      applyTheme(loadTheme());
    };
  }, []);

  return <>
    <PaperScene time={0.12}/>
    <div className="paper-site social-paper">
      <header className="social-paper__header">
        <div className="ps-label tape">
          <h1>Alfredo Bonilla</h1>
          <p>Fundador de Indie Mind · Costa Rica</p>
        </div>
        <a className="ps-term" href="/paper"><span className="p-sym">←</span> Ver mi perfil</a>
      </header>

      <main className="social-paper__main">
        <section className="ps-sheet tape is-in" aria-labelledby="links-paper-title">
          <span className="eyebrow">Indie Mind · IA aplicada</span>
          <h2 id="links-paper-title">Lleva la IA a tu trabajo.</h2>
          <p className="lede">Soy Alfredo. Te acompaño a trabajar con IA sobre tareas reales, con tus herramientas y tu criterio. Elige por dónde empezar.</p>

          <div className="ps-actions social-paper__actions">
            <a className="ps-btn" href="https://www.indiemind.ai/empresas#diagnostico">↗ Hacer el diagnóstico gratuito</a>
            <a className="ps-btn alt" href="mailto:hello@indiemind.ai?subject=Quiero%20conversar%20sobre%20IA%20en%20mi%20trabajo">✉️ Cuéntame tu caso</a>
          </div>

          <h3>Para trabajar juntos</h3>
          <nav className="social-paper__links" aria-label="Mentoría y capacitación de Indie Mind">
            {paths.map((path) => <a key={path.title} href={path.href}>
              <span className="social-paper__mark" aria-hidden="true">{path.mark}</span>
              <span className="social-paper__link-copy"><strong>{path.title}</strong><small>{path.description}</small></span>
              <span className="social-paper__arrow" aria-hidden="true">↗</span>
            </a>)}
          </nav>

          <div className="social-paper__more">
            <h3>Ideas y herramientas</h3>
            <nav className="social-paper__links" aria-label="Contenido y redes de Alfredo Bonilla">
              {more.map((link) => <a key={link.title} href={link.href}>
                <span className="social-paper__mark" aria-hidden="true">{link.mark}</span>
                <span className="social-paper__link-copy"><strong>{link.title}</strong><small>{link.description}</small></span>
                <span className="social-paper__arrow" aria-hidden="true">↗</span>
              </a>)}
            </nav>
          </div>

          <a className="social-paper__project" href="https://www.indiemind.ai/">
            <span><small>Proyecto destacado</small><strong>Explora Indie Mind</strong><span>Mentoría y capacitación para aplicar IA a tu trabajo con criterio.</span></span>
            <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>

      <footer className="ps-foot">© {new Date().getFullYear()} Alfredo Bonilla · hecho con papel y código · <a href="/">Volver al mundo</a></footer>
    </div>
  </>;
}
