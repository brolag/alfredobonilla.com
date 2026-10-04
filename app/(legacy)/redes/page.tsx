import type { Metadata } from "next";

const socialLinks = [
  {
    label: "Agendar una llamada",
    handle: "calendar.app.google",
    href: "https://calendar.app.google/HuYi74jb1S32YBNHA",
    mark: "GC",
    accent: "border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-black",
  },
  {
    label: "Escribirme por email",
    handle: "info@alfredobonilla.com",
    href: "mailto:info@alfredobonilla.com",
    mark: "@",
    accent: "border-cyber-teal text-cyber-teal hover:bg-cyber-teal hover:text-black",
  },
  {
    label: "GitHub",
    handle: "github.com/brolag",
    href: "https://github.com/brolag",
    mark: "GH",
    accent: "border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-white",
  },
  {
    label: "LinkedIn",
    handle: "linkedin.com/in/brolag",
    href: "https://www.linkedin.com/in/brolag/",
    mark: "in",
    accent: "border-cyber-blue text-cyber-blue hover:bg-cyber-blue hover:text-black",
  },
  {
    label: "Instagram",
    handle: "instagram.com/brolag",
    href: "https://www.instagram.com/brolag/",
    mark: "IG",
    accent: "border-cyber-pink text-cyber-pink hover:bg-cyber-pink hover:text-black",
  },
  {
    label: "Indie Mind",
    handle: "indie-mind.com",
    href: "https://indie-mind.com",
    mark: "IM",
    accent: "border-cyber-yellow text-cyber-yellow hover:bg-cyber-yellow hover:text-black",
  },
];

export const metadata: Metadata = {
  title: "Alfredo Bonilla - Redes",
  description: "Todos los enlaces oficiales de Alfredo Bonilla en un solo lugar.",
};

export default function SocialLinksPage() {
  return (
    <main className="terminal-text mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-2xl flex-col justify-center px-2 py-6 sm:px-4">
      <section className="relative overflow-hidden border border-terminal-glow/40 bg-cyber-black/70 p-5 shadow-terminal sm:p-8">
        <div className="absolute inset-x-0 top-0 h-px bg-terminal-glow/70" aria-hidden="true" />

        <div className="flex flex-col items-center pt-3 text-center sm:pt-2">
          <p className="mb-2 text-xs uppercase tracking-[0.28em] text-cyber-teal">
            enlaces oficiales
          </p>
          <h1 className="text-3xl font-bold text-cyber-green text-glow-cyan sm:text-5xl">
            Alfredo Bonilla
          </h1>
          <p className="mt-3 max-w-md text-sm leading-6 text-terminal-text/80 sm:text-base">
            Founder de Indie Mind.
          </p>
        </div>

        <nav aria-label="Redes sociales de Alfredo Bonilla" className="mt-8 space-y-3">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className={`group flex min-h-16 items-center gap-4 border bg-black/30 px-4 py-3 transition-all duration-300 ${link.accent}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-current font-bold">
                {link.mark}
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-base font-bold leading-tight">{link.label}</span>
                <span className="mt-1 block truncate text-xs opacity-75 sm:text-sm">{link.handle}</span>
              </span>
              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                &gt;
              </span>
            </a>
          ))}
        </nav>

        <div className="mt-8 flex items-center justify-between border-t border-terminal-glow/30 pt-4 text-xs text-terminal-text/60">
          <a href="/" className="text-cyber-teal transition-colors hover:text-cyber-green">
            abrir terminal
          </a>
          <span>alfredobonilla.com/redes</span>
        </div>
      </section>
    </main>
  );
}
