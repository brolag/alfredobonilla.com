"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import featuredProjects from "../../content/featuredProjects.json";
import projectsData from "../../content/projects.json";
import contactData from "../../content/contact.json";
import { PlaceIcon } from "./PlaceIcon";
import { placeById, places, type PlaceId } from "./places";
import { roomActivities, roomIsComplete } from "./roomActivities";
import { projectShowrooms, type ProjectId } from "./projectShowrooms";
import type { WorldController } from "./WorldScene";

const featured = featuredProjects.projects;
const socialLinks = contactData.details.filter((detail) => ["github", "linkedin", "instagram"].includes(detail.type));
const libraryResources = {
  build: projectsData.projects.find((project) => project.name === "Neural Open Code"),
  "learn-ai": projectsData.projects.find((project) => project.name === "Neural Claude Code"),
};

const projectDescriptions: Record<string, string> = {
  "Neural Claude Code": "Un kit para Claude Code con controles de seguridad y un flujo práctico de desarrollo.",
  "Neural Open Code": "Un flujo para OpenCode que guía el trabajo desde el descubrimiento hasta la verificación.",
  "Neural Codex": "Un plugin para Codex con cinco etapas de trabajo y hooks de continuidad.",
};

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{diagonal ? <><path d="M5 19 19 5M8 5h11v11"/></> : <><path d="M4 12h16m-7-7 7 7-7 7"/></>}</svg>;
}

function ProjectCard({ project }: { project: { name: string; description: string; url: string; tags: string[]; logo?: string; id?: string } }) {
  const hasProjectLink = project.url !== "https://github.com/brolag";
  const content = <>
    {project.logo && <span className={`world-project__brand world-project__brand--${project.id}`}><Image src={project.logo} alt={`Logo de ${project.name}`} width={project.id === "lyfter" ? 108 : 40} height={40}/></span>}
    <span className="world-project__top"><span>{project.tags.slice(0, 2).join(" · ")}</span>{hasProjectLink && <ArrowIcon diagonal/>}</span>
    <strong>{project.name}</strong>
    <span>{projectDescriptions[project.name] ?? project.description}</span>
  </>;
  return hasProjectLink ? <a className="world-project" href={project.url} target="_blank" rel="noopener noreferrer">{content}</a> : <article className="world-project">{content}</article>;
}

function ShowroomContent({ station, projectUrl }: { station: (typeof projectShowrooms)[ProjectId]["stations"][number]; projectUrl: string }) {
  return <div className="world-showroom-content">
    <div className="world-showroom-content__image"><Image className={station.darkLogo ? "world-showroom-content__logo-dark" : undefined} src={station.image} alt={station.imageAlt} width={900} height={550} sizes="(max-width: 600px) 100vw, 450px"/></div>
    <p>{station.body}</p>
    {station.people && <div className="world-showroom-people">{station.people.map((person) => <div key={person.name} className="world-showroom-person">{person.image && <Image src={person.image} alt={`Retrato de ${person.name}`} width={56} height={56}/>}<span><strong>{person.name}</strong><small>{person.role}</small></span></div>)}</div>}
    <div className="world-showroom-content__links"><a href={station.sourceUrl} target="_blank" rel="noopener noreferrer">Fuente: {station.source} <ArrowIcon diagonal/></a><a href={projectUrl} target="_blank" rel="noopener noreferrer">Sitio del proyecto <ArrowIcon diagonal/></a></div>
  </div>;
}

function PlaceContent({ id, onNavigate, selection }: { id: PlaceId; onNavigate: (id: PlaceId) => void; selection?: string }) {
  const libraryResource = selection === "build" ? libraryResources.build : libraryResources["learn-ai"];
  switch (id) {
    case "about": return <>
      <p className="world-panel__lead">Soy Alfredo Bonilla: ingeniero de software, educador y fundador de Indie Mind.</p>
      <p>Desde Costa Rica llevo más de 14 años construyendo productos digitales. Hoy concentro mi trabajo en sistemas de IA, automatización y herramientas que ayudan a otros desarrolladores a crear mejor.</p>
      <blockquote>“Systems over willpower.” <span>Diseñar sistemas que amplían lo que podemos hacer sin perder el criterio humano.</span></blockquote>
      <div className="world-facts"><div><span>Base</span><strong>Costa Rica</strong></div><div><span>Ahora</span><strong>Indie Mind + IA agéntica</strong></div><div><span>Fuera del teclado</span><strong>Naturaleza, juegos y música</strong></div></div>
      <button className="world-text-link" onClick={() => onNavigate("contact")}>Conversemos <ArrowIcon/></button>
    </>;
    case "projects": return <>
      <p className="world-panel__lead">Cuatro proyectos que reúnen educación, producto, mercadeo e IA aplicada.</p>
      <div className="world-projects">{featured.map((project) => <ProjectCard key={project.id} project={project}/>)}</div>
      <a className="world-text-link" href="https://github.com/brolag" target="_blank" rel="noopener noreferrer">Más trabajo en GitHub <ArrowIcon diagonal/></a>
    </>;
    case "agents": return <>
      <p className="world-panel__lead">Cada red muestra una parte distinta de lo que hago.</p>
      <p>En GitHub comparto código, en LinkedIn converso sobre tecnología y trabajo, y en Instagram aparecen ideas y momentos fuera del teclado.</p>
      <div className="world-contact-list">{socialLinks.map((detail) => <a key={detail.type} href={detail.url} target="_blank" rel="noopener noreferrer"><span>{detail.type === "github" ? "Código" : detail.type === "linkedin" ? "Trayectoria" : "Detrás de escena"}</span><strong>{detail.type === "github" ? "GitHub" : detail.type === "linkedin" ? "LinkedIn" : "Instagram"}</strong><ArrowIcon diagonal/></a>)}</div>
    </>;
    case "academy": return <>
      <p className="world-panel__lead">Una biblioteca para aprender mientras construyes.</p>
      <p>Abre una ruta, elige un recurso y llévalo a un proyecto propio. Estas herramientas abiertas son un buen punto de partida.</p>
      {libraryResource && <div className="world-projects"><ProjectCard project={libraryResource}/></div>}
    </>;
    case "services": return <>
      <p className="world-panel__lead">Colaboremos para convertir una idea compleja en un sistema útil.</p>
      <div className="world-services">
        <div><span>01</span><strong>Soluciones con IA</strong><p>Agentes, automatización y productos adaptados a problemas concretos.</p></div>
        <div><span>02</span><strong>Liderazgo técnico</strong><p>Estrategia, arquitectura y dirección para equipos que necesitan avanzar con claridad.</p></div>
        <div><span>03</span><strong>Mentoría y formación</strong><p>Acompañamiento práctico para desarrolladores y equipos.</p></div>
      </div>
      <button className="world-primary-link" onClick={() => onNavigate("contact")}>Hablemos de tu proyecto <ArrowIcon/></button>
    </>;
    case "contact": return <>
      <p className="world-panel__lead">Bienvenido a la barra de café de especialidad. ¿Construimos algo interesante?</p>
      <p>Entre un espresso y un filtrado siempre cabe una buena idea. Puedes escribirme o reservar un momento para conversar.</p>
      <div className="world-contact-list">{contactData.details.filter((detail) => ["email", "calendar", "github", "linkedin"].includes(detail.type)).map((detail) => <a key={detail.type} href={detail.url} target={detail.type === "email" ? undefined : "_blank"} rel={detail.type === "email" ? undefined : "noopener noreferrer"}><span>{detail.type === "email" ? "Correo" : detail.type === "calendar" ? "Agendar" : detail.type === "github" ? "GitHub" : "LinkedIn"}</span><strong>{detail.label}</strong><ArrowIcon diagonal/></a>)}</div>
    </>;
  }
}

export default function WorldExperience() {
  const sceneMount = useRef<HTMLDivElement>(null);
  const world = useRef<WorldController | null>(null);
  const onPick = useRef<(id: PlaceId) => void>(() => {});
  const onInspect = useRef<(id: PlaceId, itemId: string) => void>(() => {});
  const onProjectInspect = useRef<(id: ProjectId, itemId: string) => void>(() => {});
  const finaleSeen = useRef(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  const finaleButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [started, setStarted] = useState(false);
  const [activePlace, setActivePlace] = useState<PlaceId | null>(null);
  const [roomPlace, setRoomPlace] = useState<PlaceId | null>(null);
  const [projectRoom, setProjectRoom] = useState<ProjectId | null>(null);
  const [selectedItem, setSelectedItem] = useState<{ place: PlaceId; id: string } | null>(null);
  const [selectedStation, setSelectedStation] = useState<{ project: ProjectId; id: string } | null>(null);
  const [usedByPlace, setUsedByPlace] = useState<Record<PlaceId, string[]>>({ about: [], projects: [], agents: [], academy: [], services: [], contact: [] });
  const [showFinale, setShowFinale] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [nearPlace, setNearPlace] = useState<PlaceId | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [visited, setVisited] = useState<PlaceId[]>([]);
  const [webglFailed, setWebglFailed] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [lookLocked, setLookLocked] = useState(false);

  const openPlace = useCallback((id: PlaceId) => {
    if (document.pointerLockElement) document.exitPointerLock();
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setStarted(true);
    setMapOpen(false);
    setShowFinale(false);
    setSelectedItem(null);
    setSelectedStation(null);
    setActivePlace(null);
    setProjectRoom(null);
    setRoomPlace(id);
    setShowHelp(false);
  }, []);
  onPick.current = openPlace;

  const enterProject = useCallback((id: ProjectId) => {
    if (!featured.some((project) => project.id === id)) return;
    if (document.pointerLockElement) document.exitPointerLock();
    setUsedByPlace((previous) => previous.projects.includes(id) ? previous : { ...previous, projects: [...previous.projects, id] });
    setSelectedItem(null); setSelectedStation(null); setActivePlace(null);
    setProjectRoom(id);
    world.current?.activateRoomObject("projects", id);
    world.current?.enterProjectRoom(id);
  }, []);

  const inspectProjectStation = useCallback((id: ProjectId, itemId: string) => {
    if (!projectShowrooms[id]?.stations.some((station) => station.id === itemId)) return;
    if (document.pointerLockElement) document.exitPointerLock();
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSelectedStation({ project: id, id: itemId });
    setActivePlace("projects");
    world.current?.focus("projects");
  }, []);
  onProjectInspect.current = inspectProjectStation;

  const inspectItem = useCallback((id: PlaceId, itemId: string) => {
    if (!roomActivities[id].items.some((item) => item.id === itemId)) return;
    if (id === "projects") { enterProject(itemId); return; }
    if (document.pointerLockElement) document.exitPointerLock();
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setUsedByPlace((previous) => previous[id].includes(itemId) ? previous : { ...previous, [id]: [...previous[id], itemId] });
    setSelectedItem({ place: id, id: itemId });
    setActivePlace(id);
    world.current?.activateRoomObject(id, itemId);
    world.current?.focus(id);
  }, [enterProject]);
  onInspect.current = inspectItem;

  useEffect(() => {
    setVisited(places.filter((place) => roomIsComplete(place.id, usedByPlace[place.id])).map((place) => place.id));
  }, [usedByPlace]);
  useEffect(() => { if (visited.length === places.length && !activePlace && !roomPlace && started && !finaleSeen.current) { finaleSeen.current = true; setShowFinale(true); } }, [visited, activePlace, roomPlace, started]);

  const closePlace = useCallback(() => {
    setActivePlace(null);
    setSelectedItem(null);
    setSelectedStation(null);
    world.current?.focus(null);
    window.requestAnimationFrame(() => {
      const fallback = document.querySelector<HTMLButtonElement>(".world-map-toggle");
      (returnFocus.current?.isConnected ? returnFocus.current : fallback)?.focus();
    });
  }, []);

  const leaveProject = useCallback(() => {
    setActivePlace(null); setSelectedStation(null); setProjectRoom(null);
    world.current?.enterRoom("projects");
    window.requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(".world-room-guide__items button")?.focus());
  }, []);

  const leaveRoom = useCallback(() => {
    setActivePlace(null); setSelectedItem(null); setSelectedStation(null); setProjectRoom(null); setRoomPlace(null); setMapOpen(false);
    world.current?.exitRoom();
    window.requestAnimationFrame(() => (document.querySelector<HTMLButtonElement>(".world-map-toggle"))?.focus());
  }, []);

  useEffect(() => {
    let cancelled = false;
    import("./WorldScene").then(({ createWorld }) => {
      if (cancelled || !sceneMount.current) return;
      try {
        world.current = createWorld(sceneMount.current, {
          onNear: setNearPlace,
          onPick: (id) => onPick.current(id),
          onRoomObject: (id, itemId) => onInspect.current(id, itemId),
          onProjectObject: (id, itemId) => onProjectInspect.current(id, itemId),
        });
        setSceneReady(true);
      } catch (error) {
        console.error("No se pudo iniciar el mundo 3D", error);
        setWebglFailed(true);
      }
    }).catch((error) => { console.error("No se pudo cargar el mundo 3D", error); setWebglFailed(true); });
    return () => { cancelled = true; world.current?.dispose(); world.current = null; };
  }, []);

  useEffect(() => { world.current?.setExploring(started); }, [started, sceneReady]);
  useEffect(() => { if (sceneReady && roomPlace) { world.current?.travelTo(roomPlace); world.current?.enterRoom(roomPlace); } }, [sceneReady, roomPlace]);
  useEffect(() => { world.current?.setPaused(mapOpen || activePlace !== null || showFinale); }, [mapOpen, activePlace, showFinale, sceneReady]);
  useEffect(() => { if (activePlace) closeButton.current?.focus(); }, [activePlace]);
  useEffect(() => { if (showFinale) finaleButton.current?.focus(); }, [showFinale]);

  const enterWorld = () => { setStarted(true); setActivePlace(null); setRoomPlace(null); setProjectRoom(null); setShowHelp(true); world.current?.exitRoom(); world.current?.focus(null); };

  useEffect(() => {
    const canvas = sceneMount.current?.querySelector("canvas");
    if (!canvas || !sceneReady) return;
    let dragging = false;
    let lastX = 0, lastY = 0;
    const onPointerDown = (event: PointerEvent) => {
      if (!started || activePlace || mapOpen) return;
      dragging = true;
      lastX = event.clientX; lastY = event.clientY;
      if (event.pointerType === "mouse") canvas.requestPointerLock?.().catch(() => {});
      else canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (document.pointerLockElement === canvas) world.current?.setLookDelta(event.movementX, event.movementY);
      else if (dragging) {
        world.current?.setLookDelta(event.clientX - lastX, event.clientY - lastY);
        lastX = event.clientX; lastY = event.clientY;
      }
    };
    const onPointerUp = () => { dragging = false; };
    const onLockChange = () => setLookLocked(document.pointerLockElement === canvas);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    document.addEventListener("pointerlockchange", onLockChange);
    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      document.removeEventListener("pointerlockchange", onLockChange);
    };
  }, [sceneReady, started, activePlace, mapOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (activePlace && key === "tab") {
        const focusable = Array.from(document.querySelectorAll<HTMLElement>(".world-panel button, .world-panel a[href]"));
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (first && last && (event.shiftKey && document.activeElement === first || !event.shiftKey && document.activeElement === last || !focusable.includes(document.activeElement as HTMLElement))) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        }
        return;
      }
      if (showFinale && key === "tab") {
        const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>(".world-finale button"));
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (first && last && (event.shiftKey && document.activeElement === first || !event.shiftKey && document.activeElement === last || !buttons.includes(document.activeElement as HTMLButtonElement))) {
          event.preventDefault(); (event.shiftKey ? last : first).focus();
        }
        return;
      }
      if (event.target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
      if (key === "escape") { if (activePlace) closePlace(); else if (showFinale) setShowFinale(false); else if (showHelp) setShowHelp(false); else if (mapOpen) setMapOpen(false); else if (projectRoom) leaveProject(); else if (roomPlace) leaveRoom(); else if (document.pointerLockElement) document.exitPointerLock(); return; }
      if (activePlace || mapOpen || showFinale) return;
      if (!started) { if (key === "enter" && event.target === document.body) enterWorld(); return; }
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "e"].includes(key)) event.preventDefault();
      if (key === "e" && !event.repeat) { if (projectRoom) { const item = world.current?.interactRoom(); if (item) inspectProjectStation(projectRoom, item); } else if (roomPlace) { const item = world.current?.interactRoom(); if (item) inspectItem(roomPlace, item); } else { const id = world.current?.interact(); if (id) openPlace(id); } return; }
      world.current?.setInput(key, true);
    };
    const onKeyUp = (event: KeyboardEvent) => world.current?.setInput(event.key.toLowerCase(), false);
    const onBlur = () => world.current?.clearInput();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => { window.removeEventListener("keydown", onKeyDown); window.removeEventListener("keyup", onKeyUp); window.removeEventListener("blur", onBlur); };
  }, [activePlace, mapOpen, started, closePlace, openPlace, roomPlace, projectRoom, inspectItem, inspectProjectStation, leaveProject, leaveRoom, showFinale, showHelp]);

  const active = activePlace ? placeById[activePlace] : null;
  const selected = selectedItem ? roomActivities[selectedItem.place].items.find((item) => item.id === selectedItem.id) : null;
  const showroom = projectRoom ? featured.find((project) => project.id === projectRoom) : null;
  const station = selectedStation ? projectShowrooms[selectedStation.project].stations.find((item) => item.id === selectedStation.id) : null;
  const selectedSocial = selectedItem?.place === "agents" ? socialLinks.find((detail) => detail.type === selectedItem.id) : null;
  const room = roomPlace ? placeById[roomPlace] : null;
  return <main id="world-main-content" tabIndex={-1} className={`world-root ${started ? "world-root--exploring" : ""}`} lang="es">
    <div className="world-sky" aria-hidden="true"/>
    <a className="world-skip" href="#world-main-content">Saltar al contenido</a>
    <div ref={sceneMount} className="world-canvas"/>
    <noscript><div className="world-fallback"><p>Activa JavaScript para explorar el poblado o usa la versión simple.</p><Link href="/paper">Abrir vista simple <ArrowIcon/></Link></div></noscript>
    <header className="world-header">
      <button className="world-brand" onClick={() => { leaveRoom(); setShowFinale(false); setStarted(false); }} aria-label="Alfredo Bonilla: volver al inicio"><span className="world-brand__name"><strong>ALFREDO</strong><strong>BONILLA</strong></span></button>
      <nav className="world-nav" aria-label="Secciones principales"><button onClick={() => openPlace("about")}>Sobre mí</button><button onClick={() => openPlace("projects")}>Proyectos</button><button onClick={() => openPlace("services")}>Servicios</button><button onClick={() => openPlace("contact")}>Contacto</button></nav>
      <div className="world-header__actions"><Link href="/paper" className="world-simple-link">Vista simple <ArrowIcon diagonal/></Link><button className="world-map-toggle" onClick={() => { setShowHelp(false); setMapOpen((value) => !value); }} aria-expanded={mapOpen} aria-controls="world-map"><span className="world-map-toggle__icon">⌗</span><span>Mapa</span></button></div>
    </header>

    {!started && <section className="world-intro" aria-label="Bienvenida">
      <h1>Un mundo por <em>explorar.</em></h1>
      <p className="world-intro__copy">Soy Alfredo. Construyo productos, sistemas de IA y espacios para aprender. Recorre este poblado desde tus propios ojos y descubre cada lugar.</p>
      <div className="world-intro__actions"><button className="world-enter" onClick={enterWorld}>Entrar al mundo <ArrowIcon/></button><button className="world-intro__secondary" onClick={() => openPlace("projects")}>Ver proyectos</button></div>
    </section>}

    {started && !active && !room && !showFinale && <><div className="world-crosshair" aria-hidden="true"/><div className="world-hud" aria-live="polite"><div className="world-hud__location"><span className="world-hud__dot"/> EXPLORANDO <strong>{nearPlace ? `Cerca de ${placeById[nearPlace].name}` : "El poblado"}</strong></div><div className="world-hud__controls"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd><span>caminar</span><kbd>←</kbd><kbd>→</kbd><span>girar</span><kbd>E</kbd><span>entrar</span></div><span className="world-hud__progress" aria-label={`${visited.length} de 6 lugares descubiertos`}>{visited.length}<small>/ 6</small> lugares</span></div><p className="world-look-hint"><span className="world-look-hint__desktop">{lookLocked ? "Mueve el ratón para mirar · Esc libera el cursor" : "Haz clic y arrastra para mirar · WASD para caminar · E para entrar"}</span><span className="world-look-hint__touch">Desliza para mirar · Usa los botones para caminar o el mapa</span></p></>}
    {started && showHelp && !room && !active && !mapOpen && <aside className="world-onboarding" aria-label="Cómo explorar"><strong>Tu recorrido empieza aquí.</strong><p>Camina hacia una puerta, toca su nombre o usa el mapa. Dentro de cada lugar, activa los objetos para descubrir su historia.</p><div><button onClick={() => setShowHelp(false)}>Entendido</button><button onClick={() => { setShowHelp(false); setMapOpen(true); }}>Abrir mapa <ArrowIcon/></button></div></aside>}
    {started && nearPlace && !active && !room && <button className="world-near" onClick={() => openPlace(nearPlace)}><span>{visited.includes(nearPlace) ? "VOLVER" : "ENTRAR"}</span><strong>{placeById[nearPlace].name}</strong><kbd>E</kbd></button>}

    {room && !active && !showFinale && <section className={`world-room-guide ${room.id === "projects" && !projectRoom ? "world-room-guide--projects" : ""}`} aria-label={showroom ? `Sala de ${showroom.name}` : `Actividad en ${room.name}`}>
      {showroom && projectRoom ? <>
        <div className="world-room-guide__head"><span>PROYECTOS · SALA 0{featured.findIndex((project) => project.id === projectRoom) + 1}</span><button onClick={leaveProject}>← Volver al taller</button></div>
        <div className={`world-room-guide__brand ${projectRoom === "lyfter" ? "world-room-guide__brand--dark-logo" : ""}`}>{showroom.logo && <Image src={showroom.logo} alt="" width={38} height={38}/>}<h1>{showroom.name}</h1></div>
        <p>{projectShowrooms[projectRoom].intro}</p>
        <div className="world-room-guide__items world-room-guide__items--stations">{projectShowrooms[projectRoom].stations.map((item) => <button key={item.id} onClick={() => inspectProjectStation(projectRoom, item.id)} aria-label={`Explorar ${item.label}`}><span>✳</span>{item.label}</button>)}</div>
        <p className="world-room-guide__hint">Abre una estación para ver imágenes, historias y fuentes · <kbd>Esc</kbd> vuelve al taller.</p>
      </> : <>
        <div className="world-room-guide__head"><span>{room.eyebrow}</span><button onClick={leaveRoom}>← Volver al poblado</button></div>
        <h1>{room.id === "projects" ? "Elige una puerta" : room.shortName}</h1>{room.id !== "projects" && <p>{visited.includes(room.id) ? roomActivities[room.id].completed : roomActivities[room.id].prompt}</p>}
        <div className="world-room-guide__progress" aria-live="polite">{usedByPlace[room.id].length}/{roomActivities[room.id].items.length} {room.id === "projects" ? "salones visitados" : "explorados"} {visited.includes(room.id) && <strong>✓ Lugar descubierto</strong>}</div>
        <div className="world-room-guide__items">{roomActivities[room.id].items.map((item) => {
          const project = room.id === "projects" ? featured.find((entry) => entry.id === item.id) : null;
          return <button key={item.id} onClick={() => inspectItem(room.id, item.id)} aria-label={`${roomActivities[room.id].verb}: ${item.label}`}>
            {project ? <Image className={`world-room-guide__project-logo world-room-guide__project-logo--${project.id}`} src={project.logo} alt="" width={25} height={25}/> : <span>{usedByPlace[room.id].includes(item.id) ? "✓" : "✳"}</span>}{item.label}
            {project && usedByPlace.projects.includes(item.id) && <span className="world-room-guide__visited" aria-hidden="true">✓</span>}
          </button>;
        })}</div>
        {room.id !== "projects" && <p className="world-room-guide__hint">Toca un objeto o su nombre · gira con ← → · <kbd>E</kbd> inspecciona el objeto frente a ti.</p>}
      </>}
    </section>}

    {mapOpen && <aside id="world-map" className="world-map world-map--open" aria-label="Mapa del poblado">
      <div className="world-map__top"><span>EL POBLADO · {visited.length}/6 DESCUBIERTOS</span><button onClick={() => setMapOpen(false)} aria-label="Cerrar mapa">×</button></div><h2>Elige un destino.</h2><p>{visited.length === places.length ? "¡Recorrido completo! Puedes volver a cualquier lugar." : "Camina o viaja directamente para descubrir cada lugar."}</p><div className="world-map__list">{places.map((place, index) => <button key={place.id} onClick={() => openPlace(place.id)} tabIndex={mapOpen ? 0 : -1}><span className="world-map__number">0{index + 1}</span><span className="world-map__glyph" style={{ color: place.color }}><PlaceIcon id={place.id}/></span><span><strong>{place.name}</strong><small>{place.shortName} · {visited.includes(place.id) ? "descubierto" : "sin descubrir"}</small></span><ArrowIcon/></button>)}</div>
    </aside>}

    {active && (selected || station) && <><button className="world-panel-backdrop" aria-label="Volver a la sala" onClick={closePlace}/><aside id="world-content" className="world-panel" role="dialog" aria-modal="true" aria-labelledby="world-panel-title"><div className="world-panel__top"><span className="world-panel__eyebrow"><span style={{ background: active.color }}/>{station && showroom ? showroom.name : active.eyebrow}</span><button ref={closeButton} className="world-panel__close" onClick={closePlace} aria-label="Volver a la sala">×</button></div>{!station && <div className="world-panel__icon" style={{ color: active.color }}><PlaceIcon id={active.id} size={31}/></div>}<h2 id="world-panel-title">{station?.title ?? selected?.label}</h2>{!station && <p className="world-panel__summary">{selected?.detail}</p>}<div className="world-panel__rule"/><div className="world-panel__body">{station && showroom ? <ShowroomContent station={station} projectUrl={showroom.url}/> : selectedSocial ? <><a className="world-primary-link" href={selectedSocial.url} target="_blank" rel="noopener noreferrer">Abrir {selected?.label} <ArrowIcon diagonal/></a><PlaceContent id={active.id} onNavigate={openPlace} selection={selectedItem?.id}/></> : <PlaceContent id={active.id} onNavigate={openPlace} selection={selectedItem?.id}/>}</div><div className="world-panel__footer"><span>{station && showroom ? showroom.name.toUpperCase() : `${usedByPlace[active.id].length}/${roomActivities[active.id].items.length} OBJETOS EXPLORADOS`}</span><button onClick={closePlace}>Volver a la sala <ArrowIcon/></button></div></aside></>}

    {showFinale && !active && <div className="world-finale" role="dialog" aria-modal="true" aria-labelledby="world-finale-title"><span>✳ RECORRIDO COMPLETO</span><h2 id="world-finale-title">El poblado ya es tuyo.</h2><p>Exploraste las seis ideas que lo mantienen vivo. Gracias por caminar conmigo.</p><div><button ref={finaleButton} className="world-enter" onClick={() => { setShowFinale(false); leaveRoom(); }}>Volver al poblado <ArrowIcon/></button><button className="world-intro__secondary" onClick={() => openPlace("contact")}>Conversemos</button></div></div>}

    {started && !active && !showFinale && <div className="world-touch" aria-label="Controles táctiles">{room ? <><button onPointerDown={(e) => {e.currentTarget.setPointerCapture(e.pointerId); world.current?.turnBy(0.16); world.current?.setInput("arrowleft", true);}} onPointerUp={() => world.current?.setInput("arrowleft", false)} onPointerCancel={() => world.current?.setInput("arrowleft", false)} onClick={(e) => { if (e.detail === 0) world.current?.turnBy(0.16); }} aria-label="Girar a la izquierda">↶</button><button onPointerDown={(e) => {e.currentTarget.setPointerCapture(e.pointerId); world.current?.turnBy(-0.16); world.current?.setInput("arrowright", true);}} onPointerUp={() => world.current?.setInput("arrowright", false)} onPointerCancel={() => world.current?.setInput("arrowright", false)} onClick={(e) => { if (e.detail === 0) world.current?.turnBy(-0.16); }} aria-label="Girar a la derecha">↷</button><button className="world-touch__enter" onClick={() => {const item = world.current?.interactRoom(); if (item) { if (projectRoom) inspectProjectStation(projectRoom, item); else inspectItem(room.id, item); }}} aria-label="Inspeccionar objeto cercano">E</button></> : <><div className="world-touch__pad"><button onPointerDown={(e) => {e.currentTarget.setPointerCapture(e.pointerId); world.current?.setInput("w", true);}} onPointerUp={() => world.current?.setInput("w", false)} onPointerCancel={() => world.current?.setInput("w", false)} aria-label="Avanzar">↑</button><span><button onPointerDown={(e) => {e.currentTarget.setPointerCapture(e.pointerId); world.current?.setInput("a", true);}} onPointerUp={() => world.current?.setInput("a", false)} onPointerCancel={() => world.current?.setInput("a", false)} aria-label="Izquierda">←</button><button onPointerDown={(e) => {e.currentTarget.setPointerCapture(e.pointerId); world.current?.setInput("s", true);}} onPointerUp={() => world.current?.setInput("s", false)} onPointerCancel={() => world.current?.setInput("s", false)} aria-label="Retroceder">↓</button><button onPointerDown={(e) => {e.currentTarget.setPointerCapture(e.pointerId); world.current?.setInput("d", true);}} onPointerUp={() => world.current?.setInput("d", false)} onPointerCancel={() => world.current?.setInput("d", false)} aria-label="Derecha">→</button></span></div><button className="world-touch__enter" onClick={() => {const id = world.current?.interact(); if (id) openPlace(id);}} aria-label="Entrar a la sección cercana">E</button></>}</div>}

    {webglFailed && !room && <div className="world-fallback"><p>Tu navegador no pudo mostrar el poblado 3D. Puedes visitar cada lugar desde el mapa.</p><button onClick={() => setMapOpen(true)}>Abrir el mapa <ArrowIcon/></button></div>}
    {!sceneReady && !webglFailed && <div className="world-loading" aria-live="polite"><span className="world-loading__leaf">✳</span> Preparando el poblado…</div>}
  </main>;
}
