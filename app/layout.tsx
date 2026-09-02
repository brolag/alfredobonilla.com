import type { Metadata } from "next";
import { JetBrains_Mono, Nunito } from "next/font/google";
import "./globals.css";
import "./styles/theme.css";
import "./styles/terminal.css";
import "./styles/paper.css";
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
  title: "Alfredo Bonilla — brolag@portfolio",
  description:
    "Personal website of Alfredo Bonilla, Founder of Indie Mind. Software engineer specializing in AI-driven solutions and agentic coding. Type `help` to start.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // suppressHydrationWarning: data-theme is applied client-side from localStorage
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${mono.variable} ${ui.variable}`}>{children}</body>
    </html>
  );
}
