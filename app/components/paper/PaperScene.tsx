"use client";
import { useEffect, useMemo, useRef } from "react";
import { applyTimeOfDay } from "../../lib/timeOfDay";
import { useParallax } from "./useParallax";
import { PaperDefs } from "./PaperDefs";

/**
 * Layered paper-cut valley: Costa Rica at dusk. Each <g class="layer"> is a
 * sheet with its own parallax factor (--p) and entrance stagger (--i).
 * Back to front: stars, sun, moon, clouds, volcano range, mid range, hills,
 * near hills, ridge with a casita, foreground with a toucan.
 */
export function PaperScene({ time }: { time: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useParallax(ref);

  useEffect(() => {
    if (ref.current) applyTimeOfDay(time, ref.current, document.documentElement);
  }, [time]);

  // Deterministic star field so the sky is identical on every visit.
  const stars = useMemo(() => {
    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    return Array.from({ length: 140 }, (_, i) => ({
      id: i,
      cx: (-60 + rnd() * 1720).toFixed(1),
      cy: (rnd() * 560).toFixed(1),
      r: (0.6 + rnd() * 1.8).toFixed(2),
      d: `${(-rnd() * 4).toFixed(2)}s`,
    }));
  }, []);

  return (
    <div className="paper-scene" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" role="img">
        <title>Paper-cut valley in Costa Rica at dusk</title>
        <PaperDefs />

        <g className="layer stars" style={vars(0.1, 0)}>
          {stars.map((s) => (
            <circle key={s.id} cx={s.cx} cy={s.cy} r={s.r} style={{ "--d": s.d } as React.CSSProperties} />
          ))}
        </g>

        <g className="sun-group">
          <g className="layer" style={vars(0.15, 1)}>
            <circle cx="260" cy="170" r="190" fill="url(#sunGlow)" />
            <circle className="sun-disc" cx="260" cy="170" r="70" style={{ filter: "drop-shadow(0 6px 6px rgba(120,60,40,0.35))" }} />
          </g>
        </g>

        <g className="moon-group">
          <g className="layer" style={vars(0.12, 1)}>
            <circle cx="1340" cy="140" r="150" fill="url(#moonGlow)" />
            <circle className="moon-disc" cx="1340" cy="140" r="58" mask="url(#crescent)" />
          </g>
        </g>

        <g className="layer sheet" style={vars(0.22, 2)}>
          <g className="cloud-drift" style={{ "--dur": "140s", "--delay": "-30s" } as React.CSSProperties}>
            <path className="l-cloud" d="M120 250 c0 -30 30 -50 58 -42 c10 -34 62 -40 82 -10 c30 -14 66 6 62 36 c26 4 36 34 12 46 H140 c-24 0 -30 -26 -20 -30 Z" />
          </g>
          <g className="cloud-drift" style={{ "--dur": "190s", "--delay": "-120s" } as React.CSSProperties}>
            <path className="l-cloud" transform="translate(640 140) scale(1.3)" d="M0 60 c-6 -34 30 -56 58 -40 c14 -36 70 -40 86 -6 c34 -10 62 18 50 46 H0 Z" />
          </g>
          <g className="cloud-drift" style={{ "--dur": "165s", "--delay": "-80s" } as React.CSSProperties}>
            <path className="l-cloud" transform="translate(300 380) scale(0.8)" d="M0 60 c-6 -34 30 -56 58 -40 c14 -36 70 -40 86 -6 c34 -10 62 18 50 46 H0 Z" />
          </g>
        </g>

        {/* far range with the volcano (Arenal-style cone) and slow smoke puffs */}
        <g className="layer sheet" style={vars(0.3, 3)}>
          <g className="l-cloud" opacity="0.5">
            <circle className="smoke" cx="1410" cy="332" r="16" style={{ "--d": "0s" } as React.CSSProperties} />
            <circle className="smoke" cx="1422" cy="336" r="12" style={{ "--d": "-3s" } as React.CSSProperties} />
            <circle className="smoke" cx="1400" cy="338" r="10" style={{ "--d": "-6s" } as React.CSSProperties} />
          </g>
          {/* volcano cone sits on the right so it peeks out beside the window */}
          <path className="l-far" d="M-100 640 L60 540 L180 590 L300 470 L420 560 L540 500 L680 600 L800 520 L920 580 L1040 500 L1160 570 L1300 540 L1410 340 L1520 560 L1620 520 L1750 560 L1750 900 L-100 900 Z" />
        </g>

        <g className="layer sheet" style={vars(0.42, 4)}>
          <path className="l-mid" d="M-100 690 L40 620 L160 660 L280 570 L400 650 L520 600 L660 680 L780 590 L900 660 L1040 610 L1180 680 L1300 600 L1420 670 L1540 630 L1750 700 L1750 900 L-100 900 Z" />
        </g>

        <g className="layer sheet" style={vars(0.55, 5)}>
          <path className="l-hills" d="M-100 750 C120 670 320 710 500 700 C700 690 820 650 1000 670 C1200 690 1360 730 1750 710 L1750 900 L-100 900 Z" />
          <g className="l-hills">
            <use href="#pine" transform="translate(150 710) scale(0.42)" />
            <use href="#pine" transform="translate(200 715) scale(0.36)" />
            <use href="#palm" transform="translate(900 676) scale(0.46)" />
            <use href="#pine" transform="translate(985 680) scale(0.38)" />
            <use href="#palm" transform="translate(1420 724) scale(0.4)" />
          </g>
        </g>

        <g className="layer sheet" style={vars(0.7, 6)}>
          <path className="l-trees" d="M-100 800 C100 750 260 780 420 770 C620 758 760 730 940 750 C1120 770 1300 800 1750 780 L1750 900 L-100 900 Z" />
          <g className="l-trees">
            <g transform="translate(70 778) scale(0.66)"><use className="breeze" href="#palm" style={{ "--d": "-1s" } as React.CSSProperties} /></g>
            <g transform="translate(200 776) scale(0.55)"><use className="breeze" href="#pine" style={{ "--d": "-2s" } as React.CSSProperties} /></g>
            <g transform="translate(1180 772) scale(0.7)"><use className="breeze" href="#palm" style={{ "--d": "-4s" } as React.CSSProperties} /></g>
            <g transform="translate(1330 786) scale(0.6)"><use className="breeze" href="#pine" style={{ "--d": "-2.5s" } as React.CSSProperties} /></g>
            <g transform="translate(1460 782) scale(0.62)"><use className="breeze" href="#palm" style={{ "--d": "-0.5s" } as React.CSSProperties} /></g>
          </g>
        </g>

        <g className="layer sheet-deep" style={vars(0.9, 7)}>
          <path className="l-near" d="M-100 856 C140 806 340 836 540 826 C740 816 900 786 1100 806 C1300 826 1500 856 1750 836 L1750 900 L-100 900 Z" />
          <g className="l-near">
            <use href="#casita" transform="translate(1060 746)" />
            <g transform="translate(1230 818) scale(0.8)"><use className="breeze" href="#palm" style={{ "--d": "-2s" } as React.CSSProperties} /></g>
            <g transform="translate(990 820) scale(0.6)"><use className="breeze" href="#pine" style={{ "--d": "-3.5s" } as React.CSSProperties} /></g>
          </g>
        </g>

        <g className="layer sheet-deep" style={vars(1.15, 8)}>
          <path className="l-front" d="M-100 900 L-100 884 C200 854 420 874 620 866 C800 859 940 839 1100 854 C1300 872 1500 894 1750 884 L1750 900 Z" />
          <g className="l-ground" style={{ color: "var(--l-ground)" }}>
            <use href="#toucan" transform="translate(60 690) scale(1.1)" />
            <use href="#palm" transform="translate(1560 880) scale(1.05)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/** Parallax factor + stagger index as CSS variables. */
function vars(p: number, i: number): React.CSSProperties {
  return { "--p": p, "--i": i } as React.CSSProperties;
}
