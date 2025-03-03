'use client';

interface OutputDisplayProps {
  output: string[];
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ output }) => {
  return (
    <div className="mb-4 font-mono">
      {output.map((line, index) => {
        // Determine the appropriate styling based on the line content
        let className = "";
        
        if (line.startsWith('>')) {
          className = "text-cyber-yellow font-bold";
        } else if (line.startsWith('-') && (
          line.includes('"about"') || 
          line.includes('"skills"') || 
          line.includes('"projects"') || 
          line.includes('"contact"') || 
          line.includes('"help"')
        )) {
          className = "text-cyber-teal";
        } else if (line.includes('TERMINAL') || 
            line.includes('CONNECTION') || 
            line.includes('INITIALIZING') || 
            line.includes('LOADING')) {
          className = "text-cyber-blue";
        } else if (line.includes('ERROR') || line.includes('DENIED') || line.includes('FAILED')) {
          className = "text-cyber-red";
        } else if (line.includes('SUCCESS') || line.includes('COMPLETE') || line.includes('VERIFIED')) {
          className = "text-cyber-green";
        } else if (line.includes('IDENTITY') || line === 'Copyright (c) 2025 Alfredo Bonilla') {
          className = "text-cyber-pink";
        }
        
        // Create a unique key using both index and content
        const lineKey = `line-${index}-${line.substring(0, 10).replace(/\s/g, '')}`;
        
        return (
          <div 
            key={lineKey} 
            className="whitespace-pre-wrap mb-0.5 leading-tight"
          >
            <span className={className}>{line}</span>
          </div>
        );
      })}
    </div>
  );
};
