'use client'

import { useState, useRef, useEffect } from 'react'
import { IoSend } from "react-icons/io5"

interface Message {
  me?: boolean
  bot?: boolean
  message: string
  date: string
}

interface Props {
  challenge: any
  myPartecipation: any
}

export default function AgentChat({ challenge, myPartecipation }: Props): JSX.Element {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const messages: Message[] = [
    { me: true, message: "Ciao sono un utente", date: "11112" },
    { bot: true, message: "Ciao sono il bot", date: "11114" },
  ]

  // Gestisce l'auto-resize della textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      textarea.style.height = `${Math.min(scrollHeight, 96)}px` // 96px = 3 righe circa
    }
  }, [message])

  const handleSubmit = () => {
    if (!message.trim()) return
    
    console.log('Messaggio inviato:', message)
    setMessage('')
    
    // Reset altezza textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow-lg ">
      {/* Area messaggi con scroll */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.me ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                msg.me 
                  ? 'bg-green-300 text-gray-800 rounded-br-none' 
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.message}</p>
              <span className={`text-xs ${msg.me ? 'text-primary-content' : 'text-gray-500'} mt-1 block`}>
                {msg.date}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input area fissa in basso */}
      <div className="border-t bg-white p-4">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Scrivi un messaggio..."
            className="text-gray-600 flex-1 resize-none overflow-hidden bg-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white min-h-[40px] max-h-24 transition-all"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!message.trim()}
            className={`p-2 rounded-full ${
              message.trim() 
                ? 'bg-gray-100 text-gray-700 hover:bg-primary-focus' 
                : 'bg-gray-200 text-gray-400'
            } transition-colors`}
          >
            <IoSend size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}