import type { Metadata } from "next";
import { VT323, Fira_Code } from "next/font/google";
import "./globals.css";

// Terminal monospace font
const firaCode = Fira_Code({ 
  subsets: ["latin"],
  variable: '--font-fira-code',
});

// Terminal display font
const vt323 = VT323({ 
  weight: '400', 
  subsets: ["latin"],
  variable: '--font-vt323',
});

export const metadata: Metadata = {
  title: "Alfredo Bonilla - Senior Software Engineer",
  description: "Personal website of Alfredo Bonilla, a Senior Software Engineer specializing in Web3 and blockchain technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${firaCode.variable} ${vt323.variable} font-mono`}>
        <div className="terminal-container min-h-screen p-4 md:p-6 lg:p-8">
          <div className="terminal-header">
            <div className="flex items-center">
              <span className="text-terminal-text text-xs font-bold">ALFREDO BONILLA | TERMINAL</span>
            </div>
            <div className="text-xs text-terminal-text opacity-70">
              {new Date().toLocaleString()}
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
