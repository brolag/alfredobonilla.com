"use client";
import { useEffect, useRef, type ReactNode } from "react";
import aboutData from "../../content/about.json";
import contactData from "../../content/contact.json";
import { Projects, Services } from "../desktop/output/Cards";
import { Skills } from "../desktop/output/Skills";

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

export function AboutSheet() {
  const facts = aboutData.facts as Record<string, string>;
  const [first, ...rest] = aboutData.content;
  return (
    <Sheet>
      <span className="eyebrow">01 · about</span>
      <h2>Hi, I&apos;m Alfredo.</h2>
      <p className="lede">{first}</p>
      {rest.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      <div className="ps-facts">
        {(["based", "now", "believes", "off-duty"] as const).map((k) => (
          <div key={k}>
            <b>{k}</b>
            <span>{facts[k]}</span>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

export function ServicesSheet() {
  return (
    <Sheet>
      <span className="eyebrow">02 · how we can work together</span>
      <h2>What I do</h2>
      <p className="lede">AI systems that ship, education for developers, and technical leadership for teams that need a steady hand.</p>
      <Services />
    </Sheet>
  );
}

export function WorkSheet() {
  return (
    <Sheet>
      <span className="eyebrow">03 · selected work</span>
      <h2>Things I&apos;ve built</h2>
      <p className="lede">Open-source tools, AI platforms and a bit of Web3 for Costa Rican coffee.</p>
      <Projects />
    </Sheet>
  );
}

export function SkillsSheet() {
  return (
    <Sheet>
      <span className="eyebrow">04 · toolbox</span>
      <h2>What I use daily</h2>
      <Skills />
    </Sheet>
  );
}

export function ContactSheet() {
  const email = contactData.details.find((d) => d.type === "email");
  const cal = contactData.details.find((d) => d.type === "calendar");
  const socials = contactData.details.filter((d) => !["email", "calendar"].includes(d.type));
  return (
    <Sheet>
      <span className="eyebrow">05 · say hi</span>
      <h2>Let&apos;s build something.</h2>
      <p className="lede">I&apos;m available for specific, high-impact engagements. A short call is the fastest way to find out if we&apos;re a fit.</p>
      <div className="ps-actions">
        {cal && (
          <a className="ps-btn" href={cal.url} target="_blank" rel="noopener noreferrer">
            📅 Book a call
          </a>
        )}
        {email && (
          <a className="ps-btn alt" href={email.url}>
            ✉️ {email.label}
          </a>
        )}
      </div>
      <p style={{ marginTop: 18, opacity: 0.8 }}>
        Also on{" "}
        {socials.map((s, i) => (
          <span key={s.type}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="c-cy">
              {s.type}
            </a>
            {i < socials.length - 1 ? " · " : ""}
          </span>
        ))}
        . {contactData.note}
      </p>
    </Sheet>
  );
}
