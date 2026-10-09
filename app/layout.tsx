import type { Metadata } from "next";
import { JetBrains_Mono, Nunito } from "next/font/google";
import "./globals.css";
import "./styles/theme.css";
import "./styles/terminal.css";
import "./styles/paper.css";
import "./styles/paper-site.css";
import "./styles/social-paper.css";
import "./styles/legacy-crt.css";

// Terminal monospace font (prompt, commands, banner)
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// Rounded UI font, only used for prose in "paper" mode
const ui = Nunito({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-ui",
});

export const metadata: Metadata = {
  title: "Alfredo Bonilla — Un mundo por explorar",
  description:
    "Conoce a Alfredo Bonilla: ingeniero de software, fundador de Indie Mind y creador de productos y sistemas de IA. Explora sus proyectos, servicios y formas de colaborar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // suppressHydrationWarning: data-theme is applied client-side from localStorage
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${mono.variable} ${ui.variable}`}>{children}</body>
    </html>
  );
}
