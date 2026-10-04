'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import aboutData from '../content/about.json';
import projectsData from '../content/projects.json';
import servicesData from '../content/services.json';
import skillsData from '../content/skills.json';
import contactData from '../content/contact.json';

// ---------------------------------------------------------------------------
// NEO SAN JOSÉ // 2099 — 8-bit HD cyberpunk city portfolio
// All sprites are drawn programmatically. No image assets, no new deps.
// ---------------------------------------------------------------------------

const VIEW_W = 480;
const VIEW_H = 320;
const WORLD_W = 800;
const WORLD_H = 608;
const PLAYER_SPEED = 1.6;

const NEON = {
  magenta: '#ff2ec4',
  cyan: '#00fff7',
  yellow: '#f7e433',
  green: '#39ff6a',
  orange: '#ff7a2e',
  purple: '#a64dff',
};

type BuildingKey =
  | 'home'
  | 'academy'
  | 'agents'
  | 'forge'
  | 'consult'
  | 'web3'
  | 'cafe'
  | 'arcade';

interface Building {
  key: BuildingKey;
  name: string;
  sign: string;
  signColor: string;
  base: string;
  trim: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const BUILDINGS: Building[] = [
  { key: 'home',    name: 'Apartamento de Alfredo', sign: 'HOME',       signColor: NEON.yellow,  base: '#2b2140', trim: '#4a3a6e', x: 60,  y: 110, w: 120, h: 170 },
  { key: 'forge',   name: 'Code Forge',             sign: 'FORGE',      signColor: NEON.orange,  base: '#241b38', trim: '#3d2f5c', x: 222, y: 90,  w: 110, h: 190 },
  { key: 'agents',  name: 'Agent Tower',            sign: 'AGENTS',     signColor: NEON.cyan,    base: '#1d1733', trim: '#352a55', x: 440, y: 50,  w: 130, h: 230 },
  { key: 'academy', name: 'Indie Mind Academy',     sign: 'INDIE MIND', signColor: NEON.magenta, base: '#2e1f3e', trim: '#4d3566', x: 612, y: 110, w: 140, h: 170 },
  { key: 'consult', name: 'Consulting HQ',          sign: 'CONSULT',    signColor: NEON.green,   base: '#27203d', trim: '#413663', x: 80,  y: 360, w: 140, h: 160 },
  { key: 'web3',    name: 'Web3 District',          sign: 'WEB3',       signColor: NEON.purple,  base: '#221a36', trim: '#3a2d58', x: 262, y: 380, w: 110, h: 140 },
  { key: 'cafe',    name: 'Net Café',               sign: 'LINK',       signColor: NEON.cyan,    base: '#2b2244', trim: '#473a6b', x: 450, y: 370, w: 120, h: 150 },
  { key: 'arcade',  name: 'Arcade Player 2',        sign: 'ARCADE',     signColor: NEON.magenta, base: '#301f42', trim: '#4f356b', x: 622, y: 380, w: 130, h: 140 },
];

const doorOf = (b: Building) => ({
  x: b.x + b.w / 2 - 9,
  y: b.y + b.h - 26,
  w: 18,
  h: 26,
});

// Deterministic pseudo-random (stable windows between renders)
const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

interface Drop { x: number; y: number; len: number; spd: number; }
interface Car { x: number; y: number; spd: number; color: string; dir: 1 | -1; }

export default function CyberCity() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<BuildingKey | null>(null);
  const [nearby, setNearby] = useState<string | null>(null);
  const activeRef = useRef<BuildingKey | null>(null);
  activeRef.current = active;
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (active) closeBtnRef.current?.focus();
  }, [active]);

  const keysRef = useRef<Record<string, boolean>>({});
  const interactRef = useRef(false);

  const pressKey = useCallback((k: string, down: boolean) => {
    keysRef.current[k] = down;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const player = { x: 392, y: 318, dir: 'down' as 'down' | 'up' | 'left' | 'right', frame: 0, moving: false };
    let tick = 0;
    let raf = 0;

    if (process.env.NODE_ENV !== 'production') {
      (window as unknown as Record<string, unknown>).__city = { player, keys: keysRef.current, getTick: () => tick };
    }

    const drops: Drop[] = Array.from({ length: 90 }, (_, i) => ({
      x: hash(i) * WORLD_W,
      y: hash(i + 99) * WORLD_H,
      len: 4 + hash(i + 7) * 6,
      spd: 4 + hash(i + 13) * 4,
    }));

    let car: Car | null = null;
    let carTimer = 180;

    const onKey = (e: KeyboardEvent, down: boolean) => {
      const k = e.key.toLowerCase();
      // While the modal is open, only ESC matters; let the browser handle
      // Tab/Space/arrows so the panel stays keyboard-navigable.
      if (activeRef.current !== null) {
        if (k === 'escape') keysRef.current[k] = down;
        return;
      }
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'e', 'enter', 'escape', ' '].includes(k)) {
        if (down && ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(k)) e.preventDefault();
        keysRef.current[k] = down;
        if (down && (k === 'e' || k === 'enter')) interactRef.current = true;
      }
    };
    const kd = (e: KeyboardEvent) => onKey(e, true);
    const ku = (e: KeyboardEvent) => onKey(e, false);
    // Keys never get a keyup if the window loses focus mid-press.
    const onBlur = () => { keysRef.current = {}; };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    window.addEventListener('blur', onBlur);

    // ----- drawing helpers ---------------------------------------------------

    const drawBuilding = (b: Building, camX: number, camY: number) => {
      const x = b.x - camX;
      const y = b.y - camY;

      // body + side shading
      ctx.fillStyle = b.base;
      ctx.fillRect(x, y, b.w, b.h);
      ctx.fillStyle = b.trim;
      ctx.fillRect(x, y, 6, b.h);
      ctx.fillRect(x, y, b.w, 5);

      // roof details
      ctx.fillStyle = '#120d22';
      ctx.fillRect(x - 2, y - 4, b.w + 4, 6);
      ctx.fillStyle = '#3a3160';
      ctx.fillRect(x + 10, y - 12, 4, 9);
      ctx.fillRect(x + b.w - 18, y - 16, 4, 13);
      ctx.fillStyle = tick % 60 < 30 ? '#ff4d4d' : '#5a1020';
      ctx.fillRect(x + b.w - 17, y - 19, 2, 3);

      // windows (stable pattern, slow flicker)
      const cols = Math.floor((b.w - 24) / 14);
      const rows = Math.floor((b.h - 70) / 16);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const seed = hash(b.x * 7 + r * 31 + c * 17);
          const lit = seed > 0.45;
          const flicker = seed > 0.92 && Math.floor(tick / 12 + seed * 40) % 7 === 0;
          const wx = x + 14 + c * 14;
          const wy = y + 14 + r * 16;
          if (lit && !flicker) {
            ctx.fillStyle = seed > 0.8 ? NEON.magenta : seed > 0.62 ? NEON.cyan : NEON.yellow;
            ctx.globalAlpha = 0.75;
            ctx.fillRect(wx, wy, 8, 9);
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillRect(wx + 1, wy + 1, 3, 2);
          } else {
            ctx.fillStyle = '#171130';
            ctx.fillRect(wx, wy, 8, 9);
          }
        }
      }

      // neon sign
      const flick = hash(b.x + Math.floor(tick / 6)) > 0.06;
      const signW = b.sign.length * 7 + 12;
      const sx = x + b.w / 2 - signW / 2;
      const sy = y + 8;
      ctx.fillStyle = '#0c081a';
      ctx.fillRect(sx, sy, signW, 14);
      if (flick) {
        ctx.save();
        ctx.shadowColor = b.signColor;
        ctx.shadowBlur = 8;
        ctx.strokeStyle = b.signColor;
        ctx.strokeRect(sx + 0.5, sy + 0.5, signW - 1, 13);
        ctx.fillStyle = b.signColor;
        ctx.font = 'bold 9px monospace';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.sign, sx + 6, sy + 8);
        ctx.restore();
      }

      // door
      const d = doorOf(b);
      const dx = d.x - camX;
      const dy = d.y - camY;
      ctx.fillStyle = '#0d0918';
      ctx.fillRect(dx - 3, dy - 3, d.w + 6, d.h + 3);
      const near = nearestRef.current === b.key;
      ctx.fillStyle = near ? b.signColor : '#1f1838';
      ctx.globalAlpha = near ? 0.9 : 1;
      ctx.fillRect(dx, dy, d.w, d.h);
      ctx.globalAlpha = 1;
      ctx.fillStyle = near ? '#ffffff' : b.signColor;
      ctx.fillRect(dx + d.w - 5, dy + d.h / 2, 2, 3);
      if (near) {
        // pulsing marker above the door
        const bounce = Math.floor(Math.sin(tick / 8) * 3);
        ctx.fillStyle = b.signColor;
        const mx = dx + d.w / 2;
        const my = dy - 12 + bounce;
        ctx.fillRect(mx - 1, my, 3, 5);
        ctx.fillRect(mx - 4, my + 5, 9, 3);
      }
    };

    const drawPlayer = (camX: number, camY: number) => {
      const x = Math.round(player.x - camX);
      const y = Math.round(player.y - camY);
      const step = player.moving && Math.floor(tick / 8) % 2 === 0;

      // shadow
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(x - 5, y + 6, 10, 3);

      // legs
      ctx.fillStyle = '#1b1430';
      if (step) {
        ctx.fillRect(x - 4, y, 3, 7);
        ctx.fillRect(x + 1, y + 1, 3, 6);
      } else {
        ctx.fillRect(x - 4, y + 1, 3, 6);
        ctx.fillRect(x + 1, y, 3, 7);
      }
      // boots
      ctx.fillStyle = NEON.magenta;
      ctx.fillRect(x - 4, y + 6, 3, 2);
      ctx.fillRect(x + 1, y + 6, 3, 2);

      // jacket
      ctx.fillStyle = '#0b8f8a';
      ctx.fillRect(x - 5, y - 8, 10, 9);
      ctx.fillStyle = NEON.cyan;
      ctx.fillRect(x - 5, y - 8, 10, 2);
      // arms
      ctx.fillStyle = '#0b8f8a';
      ctx.fillRect(x - 7, y - 7, 2, 6);
      ctx.fillRect(x + 5, y - 7, 2, 6);

      // head
      ctx.fillStyle = '#e8b88a';
      ctx.fillRect(x - 4, y - 15, 8, 7);
      // hair
      ctx.fillStyle = '#181226';
      ctx.fillRect(x - 4, y - 17, 8, 3);
      ctx.fillRect(x - 5, y - 15, 1, 3);
      ctx.fillRect(x + 4, y - 15, 1, 3);

      // face by direction
      ctx.fillStyle = '#181226';
      if (player.dir === 'down') {
        ctx.fillRect(x - 3, y - 12, 2, 2);
        ctx.fillRect(x + 1, y - 12, 2, 2);
      } else if (player.dir === 'left') {
        ctx.fillRect(x - 3, y - 12, 2, 2);
      } else if (player.dir === 'right') {
        ctx.fillRect(x + 1, y - 12, 2, 2);
      }
      // visor glint
      if (player.dir !== 'up') {
        ctx.fillStyle = 'rgba(0,255,247,0.35)';
        ctx.fillRect(x - 4, y - 12, 8, 1);
      }
    };

    const drawGround = (camX: number, camY: number) => {
      // base asphalt
      ctx.fillStyle = '#13101f';
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);

      // sidewalk blocks grid
      ctx.strokeStyle = 'rgba(70,60,110,0.18)';
      ctx.lineWidth = 1;
      for (let gx = -(camX % 32); gx < VIEW_W; gx += 32) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, VIEW_H); ctx.stroke();
      }
      for (let gy = -(camY % 32); gy < VIEW_H; gy += 32) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(VIEW_W, gy); ctx.stroke();
      }

      // roads: one horizontal, one vertical
      const roadH = { y: 300, h: 40 };
      const roadV = { x: 376, w: 40 };
      ctx.fillStyle = '#0d0a18';
      ctx.fillRect(0, roadH.y - camY, VIEW_W, roadH.h);
      ctx.fillRect(roadV.x - camX, 0, roadV.w, VIEW_H);

      // lane markings
      ctx.fillStyle = 'rgba(247,228,51,0.5)';
      for (let mx = -(camX % 36); mx < VIEW_W; mx += 36) {
        ctx.fillRect(mx, roadH.y + roadH.h / 2 - 1 - camY, 14, 2);
      }
      for (let my = -(camY % 36); my < VIEW_H; my += 36) {
        ctx.fillRect(roadV.x + roadV.w / 2 - 1 - camX, my, 2, 14);
      }

      // neon puddles
      for (let i = 0; i < 14; i++) {
        const px = hash(i * 3) * WORLD_W - camX;
        const py = hash(i * 5 + 1) * WORLD_H - camY;
        if (px < -30 || px > VIEW_W + 30 || py < -10 || py > VIEW_H + 10) continue;
        const c = i % 2 === 0 ? NEON.cyan : NEON.magenta;
        ctx.fillStyle = c;
        ctx.globalAlpha = 0.12 + 0.05 * Math.sin(tick / 20 + i);
        ctx.beginPath();
        ctx.ellipse(px, py, 14 + hash(i) * 10, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    const drawRain = (camX: number, camY: number) => {
      ctx.strokeStyle = 'rgba(140,180,255,0.35)';
      ctx.lineWidth = 1;
      for (const d of drops) {
        d.y += d.spd;
        d.x -= d.spd * 0.25;
        if (d.y > WORLD_H) { d.y = -10; d.x = Math.random() * WORLD_W; }
        const sx = d.x - camX;
        const sy = d.y - camY;
        if (sx < 0 || sx > VIEW_W || sy < 0 || sy > VIEW_H) continue;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + d.len * 0.25, sy + d.len);
        ctx.stroke();
      }
    };

    const drawCar = (camX: number, camY: number) => {
      carTimer--;
      if (!car && carTimer <= 0) {
        const dir: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
        car = {
          x: dir === 1 ? -60 : WORLD_W + 60,
          y: 20 + Math.random() * 50,
          spd: (2 + Math.random() * 1.5) * dir,
          color: Math.random() > 0.5 ? NEON.magenta : NEON.cyan,
          dir,
        };
      }
      if (car) {
        car.x += car.spd;
        if (car.x < -80 || car.x > WORLD_W + 80) {
          car = null;
          carTimer = 240 + Math.random() * 300;
          return;
        }
        const x = car.x - camX * 0.6; // parallax: sky layer
        const y = car.y - camY * 0.3;
        ctx.save();
        ctx.shadowColor = car.color;
        ctx.shadowBlur = 6;
        // light trail
        ctx.fillStyle = car.color;
        ctx.globalAlpha = 0.25;
        ctx.fillRect(x - 22 * car.dir, y + 2, 22 * car.dir, 2);
        ctx.globalAlpha = 1;
        // body
        ctx.fillRect(x, y, 16, 5);
        ctx.fillStyle = '#0c081a';
        ctx.fillRect(x + 4, y + 1, 6, 3);
        ctx.restore();
      }
    };

    // ----- collisions & interaction -----------------------------------------

    const collides = (nx: number, ny: number) => {
      const box = { x: nx - 5, y: ny - 2, w: 10, h: 8 };
      if (box.x < 4 || box.y < 30 || box.x + box.w > WORLD_W - 4 || box.y + box.h > WORLD_H - 4) return true;
      for (const b of BUILDINGS) {
        if (box.x < b.x + b.w && box.x + box.w > b.x && box.y < b.y + b.h && box.y + box.h > b.y) return true;
      }
      return false;
    };

    const nearestRef = { current: null as BuildingKey | null };
    let lastNearby: string | null = null;

    const findNearDoor = (): Building | null => {
      for (const b of BUILDINGS) {
        const d = doorOf(b);
        const cx = d.x + d.w / 2;
        const cy = d.y + d.h + 6;
        const dist = Math.hypot(player.x - cx, player.y - cy);
        if (dist < 26) return b;
      }
      return null;
    };

    // ----- main loop ----------------------------------------------------------

    const loop = () => {
      tick++;
      const k = keysRef.current;
      const modalOpen = activeRef.current !== null;

      let dx = 0;
      let dy = 0;
      if (!modalOpen) {
        if (k['arrowup'] || k['w']) dy -= 1;
        if (k['arrowdown'] || k['s']) dy += 1;
        if (k['arrowleft'] || k['a']) dx -= 1;
        if (k['arrowright'] || k['d']) dx += 1;
      }

      player.moving = dx !== 0 || dy !== 0;
      if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
      if (dy < 0) player.dir = 'up';
      else if (dy > 0) player.dir = 'down';
      else if (dx < 0) player.dir = 'left';
      else if (dx > 0) player.dir = 'right';

      const nx = player.x + dx * PLAYER_SPEED;
      const ny = player.y + dy * PLAYER_SPEED;
      if (!collides(nx, player.y)) player.x = nx;
      if (!collides(player.x, ny)) player.y = ny;

      const near = findNearDoor();
      nearestRef.current = near ? near.key : null;
      const nearLabel = near ? near.name : null;
      if (nearLabel !== lastNearby) {
        lastNearby = nearLabel;
        setNearby(nearLabel);
      }

      if (interactRef.current) {
        interactRef.current = false;
        if (!modalOpen && near) setActive(near.key);
      }
      if (k['escape'] && modalOpen) setActive(null);

      // camera
      const camX = Math.max(0, Math.min(WORLD_W - VIEW_W, player.x - VIEW_W / 2));
      const camY = Math.max(0, Math.min(WORLD_H - VIEW_H, player.y - VIEW_H / 2));

      drawGround(camX, camY);
      for (const b of BUILDINGS) drawBuilding(b, camX, camY);
      drawPlayer(camX, camY);
      drawCar(camX, camY);
      drawRain(camX, camY);

      // ambient vignette
      const grad = ctx.createRadialGradient(VIEW_W / 2, VIEW_H / 2, 120, VIEW_W / 2, VIEW_H / 2, 320);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(5,2,15,0.55)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);

      schedule();
    };

    // RAF freezes in hidden tabs; fall back to a 30fps timer so the city
    // keeps running in background embeds and headless checks.
    let timer = 0;
    const schedule = () => {
      if (document.hidden) timer = window.setTimeout(loop, 1000 / 30);
      else raf = requestAnimationFrame(loop);
    };

    schedule();
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  const activeBuilding = BUILDINGS.find((b) => b.key === active) || null;

  return (
    <div className="w-full flex flex-col items-center gap-2 select-none">
      {/* HUD title */}
      <div className="w-full max-w-[960px] flex items-center justify-between px-1">
        <span style={{ fontFamily: 'var(--font-vt323)', color: NEON.cyan, textShadow: `0 0 8px ${NEON.cyan}` }} className="text-xl tracking-widest">
          NEO SAN JOSÉ // 2099
        </span>
        <span style={{ fontFamily: 'var(--font-vt323)', color: NEON.magenta }} className="text-sm hidden md:inline">
          WASD/Flechas mover · E entrar · ESC salir
        </span>
      </div>

      {/* Game viewport */}
      <div className="relative w-full max-w-[960px]" style={{ aspectRatio: '3 / 2' }}>
        <canvas
          ref={canvasRef}
          width={VIEW_W}
          height={VIEW_H}
          role="img"
          aria-label="Ciudad cyberpunk 8-bit Neo San José 2099. Mueve un personaje con WASD o flechas y entra a los edificios con E para ver información sobre Alfredo Bonilla."
          className="w-full h-full"
          style={{ imageRendering: 'pixelated', background: '#0a0716', border: `2px solid ${NEON.magenta}`, boxShadow: `0 0 20px rgba(255,46,196,0.35), inset 0 0 40px rgba(0,0,0,0.6)` }}
        />
        {/* CRT scanlines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 2px, transparent 4px)' }}
        />

        {/* proximity tooltip */}
        {nearby && !active && (
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 text-lg"
            style={{ fontFamily: 'var(--font-vt323)', background: 'rgba(10,7,22,0.9)', border: `1px solid ${NEON.cyan}`, color: NEON.cyan, textShadow: `0 0 6px ${NEON.cyan}` }}
          >
            {nearby} — presiona <span style={{ color: NEON.yellow }}>E</span>
          </div>
        )}

        {/* info modal */}
        {activeBuilding && (
          <div className="absolute inset-0 flex items-center justify-center p-3" style={{ background: 'rgba(5,2,15,0.82)' }}>
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="city-modal-title"
              className="w-full max-w-[560px] max-h-full overflow-y-auto p-4"
              style={{
                fontFamily: 'var(--font-vt323)',
                background: '#0d0a1d',
                border: `2px solid ${activeBuilding.signColor}`,
                boxShadow: `0 0 24px ${activeBuilding.signColor}55, inset 0 0 18px rgba(0,0,0,0.8)`,
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 id="city-modal-title" className="text-2xl leading-none" style={{ color: activeBuilding.signColor, textShadow: `0 0 10px ${activeBuilding.signColor}` }}>
                  ▮ {activeBuilding.name}
                </h2>
                <button
                  ref={closeBtnRef}
                  onClick={() => setActive(null)}
                  aria-label="Cerrar panel"
                  className="text-xl px-2 leading-none"
                  style={{ color: NEON.yellow, border: `1px solid ${NEON.yellow}` }}
                >
                  ✕
                </button>
              </div>
              <BuildingContent buildingKey={activeBuilding.key} />
            </div>
          </div>
        )}

        {/* mobile controls */}
        <div className="absolute bottom-2 left-2 md:hidden grid grid-cols-3 gap-1 opacity-80" style={{ width: 110 }}>
          <div />
          <PadButton label="▲" onPress={(d) => pressKey('arrowup', d)} />
          <div />
          <PadButton label="◀" onPress={(d) => pressKey('arrowleft', d)} />
          <div />
          <PadButton label="▶" onPress={(d) => pressKey('arrowright', d)} />
          <div />
          <PadButton label="▼" onPress={(d) => pressKey('arrowdown', d)} />
          <div />
        </div>
        <div className="absolute bottom-4 right-3 md:hidden opacity-80">
          <button
            className="w-12 h-12 rounded-full text-xl"
            style={{ fontFamily: 'var(--font-vt323)', background: 'rgba(255,46,196,0.25)', border: `2px solid ${NEON.magenta}`, color: NEON.magenta }}
            onPointerDown={(e) => { e.preventDefault(); interactRef.current = true; }}
            aria-label="Interactuar"
          >
            E
          </button>
        </div>
      </div>

      <p className="text-sm md:hidden" style={{ fontFamily: 'var(--font-vt323)', color: NEON.cyan, opacity: 0.8 }}>
        D-pad para moverte · E para entrar a los edificios
      </p>
    </div>
  );
}

function PadButton({ label, onPress }: { label: string; onPress: (down: boolean) => void }) {
  return (
    <button
      className="w-9 h-9 text-lg"
      style={{ fontFamily: 'var(--font-vt323)', background: 'rgba(0,255,247,0.15)', border: `1px solid ${NEON.cyan}`, color: NEON.cyan, touchAction: 'none' }}
      onPointerDown={(e) => { e.preventDefault(); onPress(true); }}
      onPointerUp={() => onPress(false)}
      onPointerLeave={() => onPress(false)}
      onPointerCancel={() => onPress(false)}
      aria-label={`Mover ${label}`}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Building content — sourced from app/content/*.json (single source of truth)
// ---------------------------------------------------------------------------

const AI_PROJECT_NAMES = ['Neural Claude Code', 'Neural Open Code', 'Neural Codex'];

function Line({ children }: { children: React.ReactNode }) {
  return <p className="text-lg leading-snug mb-2" style={{ color: '#cfd2ff' }}>{children}</p>;
}

function NeonLink({ href, children, color = NEON.cyan }: { href: string; children: React.ReactNode; color?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline"
      style={{ color, textShadow: `0 0 6px ${color}` }}
    >
      {children}
    </a>
  );
}

function BuildingContent({ buildingKey }: { buildingKey: BuildingKey }) {
  switch (buildingKey) {
    case 'home':
      return (
        <div>
          {aboutData.content.map((p, i) => (
            <Line key={i}>{p}</Line>
          ))}
        </div>
      );

    case 'academy': {
      const edu = servicesData.services.find((s) => s.name.includes('Indie Mind'));
      return (
        <div>
          <Line>
            Indie Mind es la escuela de Alfredo: educación AI-first para developers de LATAM.
            Bootcamps, cursos y focus groups sintéticos sobre agentic coding.
          </Line>
          {edu && (
            <Line>
              {edu.description}
            </Line>
          )}
          <Line>
            <NeonLink href="https://indie-mind.com" color={NEON.magenta}>→ indie-mind.com</NeonLink>
          </Line>
        </div>
      );
    }

    case 'agents': {
      const ai = projectsData.projects.filter((p) => AI_PROJECT_NAMES.some((n) => p.name.includes(n)));
      return (
        <div>
          <Line>Proyectos de IA agéntica construidos por Alfredo:</Line>
          {ai.map((p) => (
            <div key={p.name} className="mb-2">
              <Line>
                <span style={{ color: NEON.cyan }}>{p.name.replace('• ', '▸ ')}</span> — {p.description}{' '}
                <NeonLink href={p.url}>[ver]</NeonLink>
              </Line>
            </div>
          ))}
        </div>
      );
    }

    case 'forge':
      return (
        <div>
          {skillsData.categories.map((cat) => (
            <div key={cat.name} className="mb-3">
              <p className="text-xl mb-1" style={{ color: NEON.orange, textShadow: `0 0 6px ${NEON.orange}` }}>
                ▸ {cat.name}
              </p>
              <p className="text-base leading-snug" style={{ color: '#cfd2ff' }}>{cat.skills.join(' · ')}</p>
            </div>
          ))}
        </div>
      );

    case 'consult':
      return (
        <div>
          {servicesData.services.map((s) => (
            <div key={s.name} className="mb-3">
              <p className="text-xl" style={{ color: NEON.green, textShadow: `0 0 6px ${NEON.green}` }}>{s.name}</p>
              <Line>
                {s.description}{' '}
                <NeonLink href={s.url} color={NEON.green}>[{s.cta}]</NeonLink>
              </Line>
            </div>
          ))}
        </div>
      );

    case 'web3': {
      return (
        <div>
          <Line>Contribuciones de Alfredo al ecosistema Web3:</Line>
          <Line>
            <span style={{ color: NEON.purple }}>▸ Lago Finance</span> y{' '}
            <span style={{ color: NEON.purple }}>▸ Apy-Vision</span> — contribuciones open-source en DeFi y analytics.
          </Line>
        </div>
      );
    }

    case 'cafe':
      return (
        <div>
          <Line>Conectá con Alfredo en la red:</Line>
          {/* email + booking link live in contact.json, so no hardcoded line here */}
          {contactData.details.map((c) => (
            <Line key={c.type}>
              {c.emoji} <NeonLink href={c.url}>{c.url.replace('https://', '').replace('www.', '').replace('mailto:', '')}</NeonLink>
            </Line>
          ))}
        </div>
      );

    case 'arcade':
      return (
        <div>
          <Line>Fuera del teclado:</Line>
          <Line>🎲 Juegos de mesa con amigos — estrategia sobre suerte.</Line>
          <Line>🌿 Explorar la naturaleza de Costa Rica.</Line>
          <Line>🎵 Crear música.</Line>
          <Line>
            <span style={{ color: NEON.magenta }}>Filosofía:</span> &quot;Systems over willpower&quot; — frameworks
            automatizados y AI como copiloto para decisiones técnicas, creativas y estratégicas.
          </Line>
        </div>
      );

    default:
      return null;
  }
}
