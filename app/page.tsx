'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { VT323 } from 'next/font/google'
import { CommandHandler } from './components/CommandHandler'
import { FormHandler } from './components/FormHandler'
import { OutputDisplay } from './components/OutputDisplay'
import { CommandInput } from './components/CommandInput'
import welcomeContent from './content/welcome.json'

const vt323 = VT323({ weight: '400', subsets: ['latin'] })

const GREETING = ['Hello anon, my name is Alfredo. Welcome to my portfolio. Type a command to begin.', 'Type "help" to see available commands.']

const WELCOME_ASCII = [
  '   ___  __    ______              __     ',
  '  / _ |/ /   / __/ /  ___ ___  __/ /____ ',
  ' / __ / /___/ _// _ \\/ -_) _ \\/ _ \\ / -_)',
  '/_/ |_/____/_/ /_//_/\\__/_//_/\\_,_/_\\__/ ',
  '                                          ',
  'Welcome to my interactive portfolio!      '
]

export default function Portfolio() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<string[]>([])
  const [currentForm, setCurrentForm] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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