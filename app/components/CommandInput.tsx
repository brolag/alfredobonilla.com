'use client';

import { useState, useEffect } from 'react';

interface CommandInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  showPrompt: boolean;
}

const AVAILABLE_COMMANDS = ['about', 'skills', 'projects', 'contact', 'services', 'help', 'clear'];

export const CommandInput: React.FC<CommandInputProps> = ({
  input,
  setInput,
  handleKeyDown,
  inputRef,
  showPrompt,
}) => {
  const [cursorVisible, setCursorVisible] = useState(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Simple blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 600);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-complete functionality
  useEffect(() => {
    if (input.trim()) {
      const filtered = AVAILABLE_COMMANDS.filter(cmd => 
        cmd.toLowerCase().startsWith(input.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && filtered[0] !== input);
    } else {
      setShowSuggestions(false);
    }
  }, [input]);

  const handleEnhancedKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      setCommandHistory(prev => [...prev, input.trim()]);
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab' && suggestions.length > 0) {
      e.preventDefault();
      setInput(suggestions[0]);
      setShowSuggestions(false);
    }
    
    handleKeyDown(e);
  };

  return (
    <div className="relative">
      <div className="flex items-center group relative">
        <span className="terminal-prompt mr-2 text-terminal-glow font-bold">
          {showPrompt ? 'visitor@alfredo:~$' : ' '}
        </span>
        <div className="flex-grow flex items-center relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleEnhancedKeyDown}
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
      
      {/* Auto-complete suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 mt-1 bg-terminal-bg border border-terminal-glow rounded-sm p-2 z-20">
          {suggestions.slice(0, 3).map((suggestion, index) => (
            <div 
              key={suggestion}
              className="text-terminal-text text-sm font-mono cursor-pointer hover:text-terminal-glow transition-colors"
              onClick={() => {
                setInput(suggestion);
                setShowSuggestions(false);
                inputRef.current?.focus();
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
