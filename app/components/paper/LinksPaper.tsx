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

const socials = [
  { name: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/brolag/" },
  { name: "github", label: "GitHub", href: "https://github.com/brolag" },
  { name: "instagram", label: "Instagram", href: "https://www.instagram.com/brolag/" },
  { name: "twitter", label: "Twitter", href: "https://twitter.com/brolag" },
] as const;

function SocialIcon({ name }: { name: typeof socials[number]["name"] }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {name === "linkedin" && <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="3" />
      <circle cx="7.5" cy="8" r="1" fill="currentColor" stroke="none" />
      <path d="M7.5 11v7M12 18v-7h3.2v1.1a3 3 0 0 1 5.3 2V18M12 14a3 3 0 0 1 3-3" />
    </>}
    {name === "github" && <>
      <path d="M9 19c-4.5 1.5-4.5-2.5-6.5-3M15 22v-3.8a3.3 3.3 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6S17.6 1.4 15 3.1a12 12 0 0 0-6 0C6.4 1.4 5.2 1.7 5.2 1.7a4.8 4.8 0 0 0-.1 3.6 5.2 5.2 0 0 0-1.4 3.6c0 5.2 3.2 6.4 6.2 6.7a3.3 3.3 0 0 0-.9 2.6V22" />
    </>}
    {name === "instagram" && <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>}
    {name === "twitter" && <>
      <path d="M3 3h4.2L21 21h-4.2L3 3ZM21 3 12.8 12M11.2 13.8 3 21" />
    </>}
  </svg>;
}

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
            <nav className="social-paper__links" aria-label="Contenido de Indie Mind">
              <a href="https://www.indiemind.ai/blog">
                <span className="social-paper__mark" aria-hidden="true">IM</span>
                <span className="social-paper__link-copy"><strong>Blog de Indie Mind</strong><small>Ideas y guías sobre IA aplicada.</small></span>
                <span className="social-paper__arrow" aria-hidden="true">↗</span>
              </a>
            </nav>
          </div>

          <div className="links-paper__social-section">
            <h3>Sígueme en redes</h3>
            <nav className="links-paper__socials" aria-label="Redes sociales de Alfredo Bonilla">
              {socials.map((social) => <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer">
                <span className="links-paper__social-icon"><SocialIcon name={social.name} /></span>
                <span>{social.label}</span>
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
