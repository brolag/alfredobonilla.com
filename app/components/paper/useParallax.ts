"use client";
import { useEffect, type RefObject } from "react";

const RANGE = 40; // px of travel for a layer with --p: 1
const EASE = 0.06; // exponential smoothing per frame

/**
 * Drives --mx / --my on the scene element from pointer position (desktop),
 * touch drag or device tilt (mobile). Layers multiply these by their own --p.
 */
export function useParallax(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let tilting = false;

    const setTarget = (nx: number, ny: number) => {
      tx = Math.max(-1, Math.min(1, nx)) * RANGE;
      ty = Math.max(-1, Math.min(1, ny)) * RANGE;
    };

    const fromPoint = (x: number, y: number) =>
      setTarget(-((x / window.innerWidth) * 2 - 1), -((y / window.innerHeight) * 2 - 1));

    const onPointer = (e: PointerEvent) => fromPoint(e.clientX, e.clientY);
    const onLeave = () => setTarget(0, 0);
    const onTouch = (e: TouchEvent) => {
      if (tilting) return;
      fromPoint(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      tilting = true;
      setTarget(-(e.gamma / 30), -((e.beta - 45) / 30));
    };

    const tick = () => {
      cx += (tx - cx) * EASE;
      cy += (ty - cy) * EASE;
      el.style.setProperty("--mx", `${cx.toFixed(2)}px`);
      el.style.setProperty("--my", `${cy.toFixed(2)}px`);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointer);
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("touchmove", onTouch, { passive: true });
    // iOS needs a permission prompt; only auto-enable where it's silent.
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const canTilt = coarse && typeof DeviceOrientationEvent !== "undefined" &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission !== "function";
    if (canTilt) window.addEventListener("deviceorientation", onTilt);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("touchmove", onTouch);
      if (canTilt) window.removeEventListener("deviceorientation", onTilt);
    };
  }, [ref]);
}
