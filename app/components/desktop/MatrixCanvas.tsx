"use client";
import { useEffect, useRef } from "react";

const CHARS = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ0123456789BROLAG<>/{}=;";
const SIZE = 16;
const DURATION_MS = 7000;

/**
 * `matrix` easter egg: digital rain on a canvas covering the terminal.
 * Stops after a few seconds or on any key / pointer, then calls onDone.
 */
export function MatrixCanvas({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const green = getComputedStyle(document.documentElement).getPropertyValue("--green").trim() || "#50fa7b";

    let W = 0;
    let H = 0;
    let cols = 0;
    let drops: number[] = [];
    let raf = 0;
    let done = false;

    const fit = () => {
      W = parent.clientWidth;
      H = parent.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / SIZE);
      drops = Array.from({ length: cols }, () => (Math.random() * -H) / SIZE);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);
    };

    const stop = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", stop);
      canvas.removeEventListener("pointerdown", stop);
      window.removeEventListener("resize", fit);
      onDone();
    };

    const start = performance.now();
    const frame = (t: number) => {
      ctx.fillStyle = "rgba(0,0,0,.08)";
      ctx.fillRect(0, 0, W, H);
      ctx.font = `${SIZE}px ui-monospace, Menlo, monospace`;
      for (let i = 0; i < cols; i++) {
        const y = drops[i] * SIZE;
        ctx.fillStyle = "#eafff0";
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * SIZE, y);
        ctx.fillStyle = green;
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * SIZE, y - SIZE);
        if (y > H && Math.random() > 0.975) drops[i] = 0;
        else drops[i] += reduce ? 0.6 : 1;
      }
      if (t - start > DURATION_MS) return stop();
      raf = requestAnimationFrame(frame);
    };

    fit();
    window.addEventListener("keydown", stop);
    canvas.addEventListener("pointerdown", stop);
    window.addEventListener("resize", fit);
    raf = requestAnimationFrame(frame);

    return () => {
      done = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", stop);
      canvas.removeEventListener("pointerdown", stop);
      window.removeEventListener("resize", fit);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={ref} className="matrix" aria-hidden="true" />;
}
