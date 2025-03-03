'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { CommandHandler } from './components/CommandHandler'
import { FormHandler } from './components/FormHandler'
import { OutputDisplay } from './components/OutputDisplay'
import { CommandInput } from './components/CommandInput'

const GREETING = [
  'TERMINAL v1.0.1 [Secure Connection Established]',
  'Copyright (c) 2024 Alfredo Bonilla',
  '---------------------------------------------',
  'INITIALIZING SESSION...',
  'LOADING PORTFOLIO DATA...',
  'CONNECTION ESTABLISHED',
  'IDENTITY: Alfredo Bonilla [Full-Stack Developer]',
  '',
  'Welcome to my interactive portfolio terminal.',
  'I\'m Alfredo, a Full-Stack Developer specializing in AI-driven solutions and blockchain technologies.',
  '',
  'Type a command to navigate:',
  '- "about" - Learn more about me',
  '- "skills" - View my technical skills',
  '- "projects" - Browse my portfolio projects',
  '- "contact" - Get in touch',
  '- "help" - See all available commands'
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
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  // Focus input on initial load
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

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
      className="terminal-text font-mono relative h-[calc(100vh-120px)] overflow-auto p-4"
      onClick={() => inputRef.current?.focus()}
      onKeyDown={handleContainerKeyDown}
      ref={outputRef}
      tabIndex={0}
      role="region"
      aria-label="Terminal output"
    >
      <OutputDisplay output={[...WELCOME_ASCII, '', ...GREETING, ...output]} />
      <div className="mt-4 border-t border-terminal-glow pt-2 opacity-80">
        <CommandInput 
          input={input}
          setInput={setInput}
          handleKeyDown={handleKeyDown}
          inputRef={inputRef}
          showPrompt={true}
        />
      </div>
    </div>
  )
}