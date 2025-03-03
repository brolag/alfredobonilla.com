'use client';

import { useState, useEffect } from 'react';

interface CommandInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  showPrompt: boolean;
}

export const CommandInput: React.FC<CommandInputProps> = ({
  input,
  setInput,
  handleKeyDown,
  inputRef,
  showPrompt,
}) => {
  const [cursorVisible, setCursorVisible] = useState(true);
  
  // Simple blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 600);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center group relative">
      <span className="terminal-prompt mr-2 text-terminal-glow font-bold">
        {showPrompt ? 'visitor@alfredo:~$' : ' '}
      </span>
      <div className="flex-grow flex items-center relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          className="bg-transparent text-terminal-text outline-none flex-grow font-mono w-full pr-2"
          aria-label="Terminal input"
          spellCheck="false"
        />
        <span 
          className="absolute right-0 h-4 w-2 ml-0.5 transition-all duration-300"
          style={{ 
            backgroundColor: 'rgb(var(--terminal-glow))',
            opacity: cursorVisible ? 1 : 0
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};
