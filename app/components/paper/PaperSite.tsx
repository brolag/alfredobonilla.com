"use client";
import { useEffect, useState } from "react";
import { applyTheme, loadTheme } from "../../lib/theme";
import { formatClock } from "../../lib/timeOfDay";
import { PaperScene } from "./PaperScene";
import { AboutSheet, ServicesSheet, WorkSheet, SkillsSheet, ContactSheet } from "./PaperSections";

/**
 * /paper — the visual version for people who don't want a terminal.
 * The paper-cut valley is the backdrop; scroll progress drives the time of
 * day, so reading the page is watching the sun set over Costa Rica.
 */
export default function PaperSite() {
  const [time, setTime] = useState(0);

  // Wear the paper theme while mounted; restore the visitor's theme on leave.
  useEffect(() => {
    applyTheme("paper");
    return () => applyTheme(loadTheme());
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
      <div className="paper-site">
        <div className={`ps-hud${scrolled ? " show" : ""}`} aria-hidden="true">
          {formatClock(time)} · Alfredo Bonilla
        </div>
        <header className="ps-top">
          <div className={`ps-label tape${scrolled ? " hide" : ""}`}>
            <h1>Alfredo Bonilla</h1>
            <p>
              founder @ indie mind · costa rica
              <span className="clock" aria-label="time of day">
                {formatClock(time)}
              </span>
            </p>
          </div>
          <a className="ps-term" href="/">
            <span className="p-sym">❯</span> <span className="long">open the</span> terminal
          </a>
        </header>

        <div className="ps-hero" aria-hidden="true">
          <div className="ps-hint">scroll to watch the sun set</div>
        </div>

        <main className="ps-flow">
          <AboutSheet />
          <ServicesSheet />
          <WorkSheet />
          <SkillsSheet />
          <ContactSheet />
        </main>

        <footer className="ps-foot">
          © {new Date().getFullYear()} Alfredo Bonilla · cut from paper, glued with code ·{" "}
          <a href="/">terminal version</a>
        </footer>
      </div>
    </>
  );
}
