"use client";
import { useEffect, useState } from "react";
import { applyTheme, loadTheme } from "../../lib/theme";
import { clearTimeOfDay, formatClock } from "../../lib/timeOfDay";
import { PaperScene } from "./PaperScene";
import { AboutSheet, ServicesSheet, WorkSheet, SkillsSheet, ContactSheet } from "./PaperSections";
import { paperCopy, type PaperLocale } from "./paperCopy";

const LOCALE_KEY = "alfredo.paper.locale";

/**
 * /paper — the visual version for people who don't want a terminal.
 * The paper-cut valley is the backdrop; scroll progress drives the time of
 * day, so reading the page is watching the sun set over Costa Rica.
 */
export default function PaperSite() {
  const [time, setTime] = useState(0);
  const [locale, setLocale] = useState<PaperLocale>("es");
  const copy = paperCopy[locale];

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LOCALE_KEY);
      if (saved === "es" || saved === "en") setLocale(saved);
    } catch { /* storage may be unavailable */ }
  }, []);

  useEffect(() => {
    const previousLang = document.documentElement.lang;
    document.documentElement.lang = locale;
    document.title = locale === "es" ? "Alfredo Bonilla — Sobre mí y mi trabajo" : "Alfredo Bonilla — About me and my work";
    return () => { document.documentElement.lang = previousLang; };
  }, [locale]);

  const toggleLocale = () => {
    const next = locale === "es" ? "en" : "es";
    setLocale(next);
    try { window.localStorage.setItem(LOCALE_KEY, next); } catch { /* storage may be unavailable */ }
  };

  // Wear the paper theme while mounted; restore the visitor's theme on leave.
  useEffect(() => {
    applyTheme("paper");
    return () => {
      clearTimeOfDay(document.documentElement);
      applyTheme(loadTheme());
    };
  }, []);

  // Scroll progress (0..1) → time of day. rAF-throttled.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setTime(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Once the visitor scrolls past the hero, swap the big label for a small clock HUD
  // so it doesn't sit on top of the paper sheets.
  const scrolled = time > 0.04;

  return (
    <>
      <PaperScene time={time} />
      <div className="paper-site" lang={locale}>
        <div className={`ps-hud${scrolled ? " show" : ""}`} aria-hidden="true">
          {formatClock(time)} · Alfredo Bonilla
        </div>
        <header className="ps-top">
          <div className={`ps-label tape${scrolled ? " hide" : ""}`}>
            <h1>Alfredo Bonilla</h1>
            <p>
              {copy.subtitle}
              <span className="clock" aria-label={locale === "es" ? "hora del día" : "time of day"}>
                {formatClock(time)}
              </span>
            </p>
          </div>
          <div className="ps-top__actions">
            <button type="button" className="ps-language" onClick={toggleLocale} aria-label={locale === "es" ? "Switch to English" : "Cambiar a español"}>
              <span className={locale === "es" ? "active" : ""}>ES</span><span aria-hidden="true">/</span><span className={locale === "en" ? "active" : ""}>EN</span>
            </button>
            <a className="ps-term" href="/">
              <span className="p-sym">←</span><span className="ps-term__long">{copy.back}</span><span className="ps-term__short">{copy.backShort}</span>
            </a>
          </div>
        </header>

        <div className="ps-hero">
          <div className="ps-hint">{copy.hint}</div>
        </div>

        <main className="ps-flow">
          <AboutSheet locale={locale} />
          <ServicesSheet locale={locale} />
          <WorkSheet locale={locale} />
          <SkillsSheet locale={locale} />
          <ContactSheet locale={locale} />
        </main>

        <footer className="ps-foot">
          © {new Date().getFullYear()} Alfredo Bonilla · {copy.footer} ·{" "}
          <a href="/">{copy.back}</a>
        </footer>
      </div>
    </>
  );
}
