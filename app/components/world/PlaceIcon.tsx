import type { PlaceId } from "./places";

export function PlaceIcon({ id, size = 20 }: { id: PlaceId; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  switch (id) {
    case "about": return <svg {...common}><path d="m3 11 9-7 9 7v9H3z"/><path d="M9 20v-7h6v7"/></svg>;
    case "projects": return <svg {...common}><path d="M4 19h16M6 19V8l6-4 6 4v11M9 11h6M9 15h6"/><path d="M10 4V2h4v2"/></svg>;
    case "agents": return <svg {...common}><circle cx="12" cy="10" r="6"/><path d="M12 4V2M5 10H3m18 0h-2M8 16l-2 5h12l-2-5M9 10h.01M15 10h.01M9 13c2 1 4 1 6 0"/></svg>;
    case "academy": return <svg {...common}><path d="M3 7 12 3l9 4-9 4-9-4ZM6 9v8c4 3 8 3 12 0V9M21 7v9"/></svg>;
    case "services": return <svg {...common}><path d="M3 20V9a9 9 0 0 1 18 0v11H3ZM3 12h18M8 20V9m8 11V9"/><path d="M10 15c1.5-1.5 2.5-1.5 4 0"/></svg>;
    case "contact": return <svg {...common}><path d="M4 8h14v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8ZM18 10h2a2 2 0 0 1 0 4h-2M7 4c0-1 1-1 1-2m4 2c0-1 1-1 1-2m4 2c0-1 1-1 1-2"/></svg>;
  }
}
