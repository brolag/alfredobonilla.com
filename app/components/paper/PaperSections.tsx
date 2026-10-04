"use client";
import { useEffect, useRef, type ReactNode } from "react";
import contactData from "../../content/contact.json";
import { Projects, Services } from "../desktop/output/Cards";
import { Skills } from "../desktop/output/Skills";
import { paperCopy, type PaperLocale } from "./paperCopy";

/** A sheet of paper that settles into place when scrolled into view. */
export function Sheet({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <section ref={ref} className="ps-sheet tape">
      {children}
    </section>
  );
}

export function AboutSheet({ locale }: { locale: PaperLocale }) {
  const copy = paperCopy[locale].about;
  const [first, ...rest] = copy.paragraphs;
  return (
    <Sheet>
      <span className="eyebrow">{copy.eyebrow}</span>
      <h2>{copy.title}</h2>
      <p className="lede">{first}</p>
      {rest.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      <div className="ps-facts">
        {(["based", "now", "believes", "off-duty"] as const).map((k) => (
          <div key={k}>
            <b>{copy.factLabels[k]}</b>
            <span>{copy.facts[k]}</span>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

export function ServicesSheet({ locale }: { locale: PaperLocale }) {
  const copy = paperCopy[locale].services;
  return (
    <Sheet>
      <span className="eyebrow">{copy.eyebrow}</span>
      <h2>{copy.title}</h2>
      <p className="lede">{copy.lede}</p>
      <Services locale={locale} />
    </Sheet>
  );
}

export function WorkSheet({ locale }: { locale: PaperLocale }) {
  const copy = paperCopy[locale].work;
  return (
    <Sheet>
      <span className="eyebrow">{copy.eyebrow}</span>
      <h2>{copy.title}</h2>
      <p className="lede">{copy.lede}</p>
      <Projects locale={locale} />
    </Sheet>
  );
}

export function SkillsSheet({ locale }: { locale: PaperLocale }) {
  const copy = paperCopy[locale].skills;
  return (
    <Sheet>
      <span className="eyebrow">{copy.eyebrow}</span>
      <h2>{copy.title}</h2>
      <Skills locale={locale} />
    </Sheet>
  );
}

export function ContactSheet({ locale }: { locale: PaperLocale }) {
  const copy = paperCopy[locale].contact;
  const email = contactData.details.find((d) => d.type === "email");
  const cal = contactData.details.find((d) => d.type === "calendar");
  const socials = contactData.details.filter((d) => !["email", "calendar"].includes(d.type));
  return (
    <Sheet>
      <span className="eyebrow">{copy.eyebrow}</span>
      <h2>{copy.title}</h2>
      <p className="lede">{copy.lede}</p>
      <div className="ps-actions">
        {cal && (
          <a className="ps-btn" href={cal.url} target="_blank" rel="noopener noreferrer">
            📅 {copy.book}
          </a>
        )}
        {email && (
          <a className="ps-btn alt" href={email.url}>
            ✉️ {email.label}
          </a>
        )}
      </div>
      <p style={{ marginTop: 18, opacity: 0.8 }}>
        {copy.also}{" "}
        {socials.map((s, i) => (
          <span key={s.type}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="c-cy">
              {s.type}
            </a>
            {i < socials.length - 1 ? " · " : ""}
          </span>
        ))}
        . {copy.note}
      </p>
    </Sheet>
  );
}
