// Legacy CRT shell for /city, /links and /redes.
// The old root layout wrapped every page in this chrome; the new home
// (desktop terminal) needs a clean body, so the CRT look lives here only.
export default function LegacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="crt font-mono">
      <div className="terminal-container min-h-screen p-4 md:p-6 lg:p-8">
        <div className="terminal-header">
          <div className="flex items-center">
            <span className="text-terminal-text text-xs font-bold">ALFREDO BONILLA | TERMINAL</span>
          </div>
          <div className="text-xs text-terminal-text opacity-70">
            <a href="/" className="hover:text-cyber-green">← back to shell</a>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
