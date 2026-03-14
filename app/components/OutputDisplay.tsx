'use client';

interface OutputDisplayProps {
  output: string[];
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ output }) => {
  return (
    <div className="mb-4 font-mono">
      {output.map((line, index) => {
        // Safety check for undefined lines
        if (!line && line !== '') return null;
        
        // Determine the appropriate styling based on the line content
        let className = "transition-all duration-300";
        
        if (line.startsWith('>')) {
          className += " text-cyber-yellow font-bold text-glow-yellow";
        } else if (line.startsWith('  •') || line.startsWith('  about') || line.startsWith('  skills') || line.startsWith('  projects') || line.startsWith('  contact') || line.startsWith('  services') || line.startsWith('  help') || line.startsWith('  clear')) {
          className += " text-cyber-teal text-glow-cyan hover:text-cyber-green cursor-pointer";
        } else if (line.includes('TERMINAL') || 
            line.includes('CONNECTION') || 
            line.includes('INITIALIZING') || 
            line.includes('LOADING') ||
            line.includes('BIOS') ||
            line.includes('Memory Test') ||
            line.includes('CPU:') ||
            line.includes('GPU:') ||
            line.includes('BOOTING') ||
            line.includes('SYSTEM READY')) {
          className += " text-cyber-blue text-glow-cyan";
        } else if (line.includes('ERROR') || line.includes('DENIED') || line.includes('FAILED')) {
          className += " text-cyber-red";
        } else if (line.includes('SUCCESS') || line.includes('COMPLETE') || line.includes('VERIFIED') || line.includes('OK')) {
          className += " text-cyber-green";
        } else if (line.includes('IDENTITY') || line.includes('Copyright (c)')) {
          className += " text-cyber-pink text-glow-magenta";
        } else if (line.includes('█')) {
          className += " text-cyber-green text-glow-cyan";
        } else if (line.includes('━')) {
          className += " text-cyber-teal opacity-60";
        } else if (line.includes('⚡')) {
          className += " text-cyber-yellow text-glow-yellow";
        }
        
        // Detect ASCII art lines (contain figlet patterns)
        const isAscii = /[/\\|_(){}]/.test(line) && /[A-Z]/.test(line) === false && line.trim().length > 0 && (line.includes('/') || line.includes('\\') || line.includes('|'));

        // Create a unique key using both index and content
        const lineKey = `line-${index}-${line.substring(0, 10).replace(/\s/g, '')}`;

        return (
          <div
            key={lineKey}
            className={`${isAscii ? 'whitespace-pre' : 'whitespace-pre-wrap'} mb-0.5 leading-tight`}
          >
            <span className={className}>{line}</span>
          </div>
        );
      })}
    </div>
  );
};
