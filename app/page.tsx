'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { CommandHandler } from './components/CommandHandler'
import { FormHandler } from './components/FormHandler'
import { OutputDisplay } from './components/OutputDisplay'
import { CommandInput } from './components/CommandInput'

const BOOT_SEQUENCE = [
  'BIOS v2.1.3 - Terminal Interface',
  'Memory Test... 16GB OK',
  'CPU: Neural Processing Unit - AI Enhanced',
  'GPU: Quantum Renderer - Blockchain Optimized',
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  '',
  'BOOTING ALFREDO BONILLA PORTFOLIO SYSTEM...',
  '',
  '█████████████████████████████████████████ 100%',
  '',
  'SYSTEM READY',
  ''
];

const GREETING = [
  'TERMINAL v1.0.1 [Secure Connection Established]',
  'Copyright (c) 2025 Alfredo Bonilla',
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  'INITIALIZING SESSION...',
  'LOADING PORTFOLIO DATA...',
  'CONNECTION ESTABLISHED',
  'IDENTITY: Alfredo Bonilla [CTO @ Dojo Coding | AI & Blockchain Developer]',
  '',
  'Welcome to my interactive portfolio terminal.',
  'I\'m Alfredo, CTO at Dojo Coding and Founder of Indie Mind, specializing in AI-driven solutions and blockchain technologies.',
  '',
  '⚡ Enhanced Terminal Features:',
  '  • Tab completion for commands',
  '  • Command history (↑/↓ arrows)',
  '  • Real-time autocomplete suggestions',
  '',
  'Available Commands:',
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  '  about    - Learn more about me',
  '  skills   - View my technical skills',
  '  projects - Browse my portfolio projects',
  '  contact  - Get in touch',
  '  services - Explore services I offer', 
  '  help     - See all available commands',
  '  clear    - Clear terminal screen',
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
]

const WELCOME_ASCII = [
    "    _    _  __               _       ",
    "   / \\  | |/ _|_ __ ___  __| | ___  ",
    "  / _ \\ | | |_| '__/ _ \\/ _` |/ _ \\ ",
    " / ___ \\| |  _| | |  __/ (_| | (_) |",
    "/_/   \\_\\_|_| |_|  \\___|\\__,_|\\___/ ",
    "                                     ",
    " ____              _ _ _             ",
    "| __ )  ___  _ __ (_) | | __ _      ",
    "|  _ \\ / _ \\| '_ \\| | | |/ _` |     ",
    "| |_) | (_) | | | | | | | (_| |     ",
    "|____/ \\___/|_| |_|_|_|_|\\__,_|     ",
    "                                     "
]

export default function Portfolio() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<string[]>([])
  const [currentForm, setCurrentForm] = useState<string | null>(null)
  const [bootComplete, setBootComplete] = useState(false)
  const [displayedBootLines, setDisplayedBootLines] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Boot sequence animation
  useEffect(() => {
    let currentIndex = 0;
    const bootInterval = setInterval(() => {
      if (currentIndex < BOOT_SEQUENCE.length) {
        setDisplayedBootLines(prev => [...prev, BOOT_SEQUENCE[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(bootInterval);
        setTimeout(() => {
          setBootComplete(true);
          inputRef.current?.focus();
        }, 1000);
      }
    }, 200);

    return () => clearInterval(bootInterval);
  }, []);

  // Focus input on boot complete
  useEffect(() => {
    if (bootComplete) {
      inputRef.current?.focus()
    }
  }, [bootComplete])

  // Scroll to bottom whenever output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  const handleCommand = useCallback((cmd: string) => {
    return CommandHandler(cmd, setCurrentForm, setOutput)
  }, [])

  const handleFormInput = useCallback((input: string) => {
    return FormHandler(input, currentForm, setCurrentForm)
  }, [currentForm])

  const handleSubmit = useCallback(() => {
    if (input.trim()) {
      const result = currentForm ? handleFormInput(input.trim()) : handleCommand(input.trim())
      if (input.trim().toLowerCase() !== 'clear') {
        Promise.resolve(result).then(resolvedResult => {
          setOutput((prev: string[]) => [...prev, `> ${input}`, ...resolvedResult])
          // Scroll to bottom after output is updated
          setTimeout(() => {
            if (outputRef.current) {
              outputRef.current.scrollTop = outputRef.current.scrollHeight
            }
          }, 10)
        })
      } else {
        setOutput([])
      }
      setInput('')
    }
  }, [input, handleCommand, handleFormInput, currentForm])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }, [handleSubmit])

  const handleContainerKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.focus()
    }
  }, [])

  return (
    <div 
      className="terminal-text font-mono relative h-[calc(100vh-120px)] overflow-auto p-2 sm:p-4"
      onClick={() => inputRef.current?.focus()}
      onKeyDown={handleContainerKeyDown}
      ref={outputRef}
      tabIndex={0}
      role="region"
      aria-label="Terminal output"
    >
      {!bootComplete ? (
        <div className="relative">
          <OutputDisplay output={displayedBootLines} />
          <button
            onClick={() => {
              setBootComplete(true);
              inputRef.current?.focus();
            }}
            className="absolute top-4 right-4 px-4 py-2 bg-cyber-pink text-black font-bold rounded border-2 border-cyber-pink hover:bg-transparent hover:text-cyber-pink transition-all duration-300 text-sm z-20"
          >
            SKIP INTRO →
          </button>
        </div>
      ) : (
        <OutputDisplay output={[...WELCOME_ASCII, '', ...GREETING, ...output]} />
      )}
      {bootComplete && (
        <>
          {/* Quick Action Buttons */}
          <div className="mt-4 mb-4 flex flex-wrap gap-3 justify-center md:justify-start">
            <a
              href="mailto:alfredo@alfredobonilla.com"
              className="px-4 py-2 bg-cyber-green text-black font-bold rounded border-2 border-cyber-green hover:bg-transparent hover:text-cyber-green transition-all duration-300 text-sm"
            >
              📧 HIRE ME
            </a>
            <a
              href="https://calendly.com/brolag/sesion-1-1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-cyber-blue text-black font-bold rounded border-2 border-cyber-blue hover:bg-transparent hover:text-cyber-blue transition-all duration-300 text-sm"
            >
              📅 BOOK CONSULTATION
            </a>
            <a
              href="https://github.com/brolag"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-cyber-purple text-white font-bold rounded border-2 border-cyber-purple hover:bg-transparent hover:text-cyber-purple transition-all duration-300 text-sm"
            >
              🐙 VIEW WORK
            </a>
            <a
              href="https://www.linkedin.com/in/brolag/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-cyber-teal text-black font-bold rounded border-2 border-cyber-teal hover:bg-transparent hover:text-cyber-teal transition-all duration-300 text-sm"
            >
              💼 CONNECT
            </a>
          </div>
          
          <div className="mt-4 border-t border-terminal-glow pt-2 opacity-80">
            <CommandInput 
              input={input}
              setInput={setInput}
              handleKeyDown={handleKeyDown}
              inputRef={inputRef}
              showPrompt={true}
            />
          </div>
        </>
      )}
    </div>
  )
}