'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { VT323 } from 'next/font/google'
import { CommandHandler } from './components/CommandHandler'
import { FormHandler } from './components/FormHandler'
import { OutputDisplay } from './components/OutputDisplay'
import { CommandInput } from './components/CommandInput'

const vt323 = VT323({ weight: '400', subsets: ['latin'] })

const GREETING = ['Hello anon, my name is Alfredo. Welcome to my portfolio. Type a command to begin.', 'Type "help" to see available commands.']

const WELCOME_ASCII = [
    " _   _      _ _       ",
    "| | | | ___| | | ___  ",
    "| |_| |/ _ \\ | |/ _ \\ ",
    "|  _  |  __/ | | (_) |",
    "|_| |_|\\___|_|_|\\___/ ",
    "                      "
]

export default function Portfolio() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<string[]>([])
  const [currentForm, setCurrentForm] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const handleCommand = useCallback((cmd: string) => {
    return CommandHandler(cmd, setCurrentForm, setOutput)
  }, [])

  const handleFormInput = useCallback(async (input: string) => {
    return FormHandler(input, currentForm, setCurrentForm)
  }, [currentForm])

  const handleSubmit = useCallback(() => {
    if (input.trim()) {
      const result = currentForm ? handleFormInput(input.trim()) : handleCommand(input.trim());
      if (input.trim().toLowerCase() !== 'clear') {
        Promise.resolve(result).then(resolvedResult => {
          setOutput(prev => [...prev, `> ${input}`, ...resolvedResult]);
          setTimeout(() => {
            if (outputRef.current) {
              outputRef.current.scrollTop = outputRef.current.scrollHeight;
            }
          }, 0);
        });
      } else {
        setOutput([]);
      }
      setInput('');
    }
  }, [input, handleCommand, handleFormInput, currentForm])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, []) // Remove 'output' from the dependency array

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.ctrlKey && e.key === 'u') || (e.ctrlKey && e.key === 'c')) {
      e.preventDefault()
      setInput('')
    } else if (e.key === 'Enter') {
      handleSubmit()
    }
  }, [handleSubmit])

  return (
    <div 
      className={`bg-black text-green-500 p-4 h-screen overflow-auto ${vt323.className}`}
      style={{ fontSize: '1.2rem' }}
      onClick={() => inputRef.current?.focus()}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.focus()}
      ref={outputRef}
    >
      <OutputDisplay output={[...WELCOME_ASCII, '', ...GREETING, ...output]} />
      <CommandInput 
        input={input}
        setInput={setInput}
        handleKeyDown={handleKeyDown}
        inputRef={inputRef}
        showPrompt={true}
      />
    </div>
  )
}