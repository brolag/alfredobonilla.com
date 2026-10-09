"use client";

import { useEffect } from "react";
import contactData from "../../content/contact.json";
import featuredProjects from "../../content/featuredProjects.json";
import { applyTheme, loadTheme } from "../../lib/theme";
import { clearTimeOfDay } from "../../lib/timeOfDay";
import { PaperScene } from "./PaperScene";

const email = contactData.details.find((detail) => detail.type === "email");
const calendar = contactData.details.find((detail) => detail.type === "calendar");
const socials = contactData.details.filter((detail) => ["github", "linkedin", "instagram"].includes(detail.type));
const indieMind = featuredProjects.projects.find((project) => project.id === "indie-mind");

const socialMeta: Record<string, { mark: string; title: string; description: string }> = {
  github: { mark: "GH", title: "GitHub", description: "Código abierto y herramientas para construir con agentes." },
  linkedin: { mark: "in", title: "LinkedIn", description: "Ideas sobre producto, tecnología y colaboración." },
  instagram: { mark: "IG", title: "Instagram", description: "El lado creativo y cotidiano de lo que hago." },
};

export default function SocialPaper() {
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
        <section className="ps-sheet tape is-in" aria-labelledby="social-paper-title">
          <span className="eyebrow">Redes · contacto</span>
          <h2 id="social-paper-title">Sigamos en contacto.</h2>
          <p className="lede">Elige dónde continuar la conversación o seguir lo que estoy construyendo.</p>

          <div className="ps-actions social-paper__actions">
            {calendar && <a className="ps-btn" href={calendar.url} target="_blank" rel="noopener noreferrer">📅 Agendar una llamada</a>}
            {email && <a className="ps-btn alt" href={email.url}>✉️ Escribirme</a>}
          </div>

          <h3>Donde comparto</h3>
          <nav className="social-paper__links" aria-label="Redes sociales de Alfredo Bonilla">
            {socials.map((social) => {
              const meta = socialMeta[social.type];
              return <a key={social.type} href={social.url} target="_blank" rel="noopener noreferrer">
                <span className="social-paper__mark" aria-hidden="true">{meta.mark}</span>
                <span className="social-paper__link-copy"><strong>{meta.title}</strong><small>{meta.description}</small></span>
                <span className="social-paper__arrow" aria-hidden="true">↗</span>
              </a>;
            })}
          </nav>

          {indieMind && <a className="social-paper__project" href={indieMind.url} target="_blank" rel="noopener noreferrer">
            <span><small>Proyecto destacado</small><strong>Explora Indie Mind</strong><span>Herramientas abiertas y sistemas de IA para creadores independientes.</span></span>
            <span aria-hidden="true">↗</span>
          </a>}
        </section>
      </main>

      <footer className="ps-foot">© {new Date().getFullYear()} Alfredo Bonilla · hecho con papel y código · <a href="/">Volver al mundo</a></footer>
    </div>
  </>;
}
