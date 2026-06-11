'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Server, Shield, BookOpen, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatMessage {
  id: string
  sender: 'bot' | 'user'
  text: string
  timestamp: Date
}

const BOT_RESPONSES: Record<string, string> = {
  servidor:
    '🖥️ **Estado del Servidor:** El servidor está actualmente en línea con 64/128 jugadores. Ping promedio: 32ms. Último reinicio fue hace 4 horas. ¡Todo funcionando con normalidad!',
  whitelist:
    '📝 **Proceso de Whitelist:** Para entrar al servidor necesitas: 1) Registrarte en nuestro Discord, 2) Completar el formulario de whitelist en nuestro portal, 3) Esperar la revisión del staff (24-48h). ¡Buena suerte!',
  normativa:
    '📖 **Normativa:** Puedes consultar la normativa completa en la sección "Normativa" del menú. Las reglas principales son: respetar el roleplay, no hacer RDM/VDM, no metear información OOC, y siempre mantener el Fear RP. ¡Léela completa antes de entrar!',
  staff:
    '🎧 **Contactar Staff:** Puedes abrir un ticket en Discord (#support) o usar el comando /reporte en el servidor. Nuestro equipo de staff está disponible de 18:00 a 02:00 CET. Para urgencias, contacta a un administrador en Discord.',
}

const QUICK_ACTIONS = [
  { label: 'Estado del servidor', keyword: 'servidor', icon: Server },
  { label: 'Whitelist', keyword: 'whitelist', icon: Shield },
  { label: 'Normativa', keyword: 'normativa', icon: BookOpen },
  { label: 'Contactar Staff', keyword: 'staff', icon: Headphones },
]

const INITIAL_GREETING: ChatMessage = {
  id: 'greeting',
  sender: 'bot',
  text: '¡Hola! 👋 Soy el asistente de Prestigio RP. ¿En qué puedo ayudarte?',
  timestamp: new Date(),
}

function getTimestamp(date: Date): string {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function findBotResponse(text: string): string | null {
  const lower = text.toLowerCase()
  for (const [keyword, response] of Object.entries(BOT_RESPONSES)) {
    if (lower.includes(keyword)) {
      return response
    }
  }
  return '🤔 No estoy seguro de entender tu consulta. Prueba preguntando sobre: **servidor**, **whitelist**, **normativa** o **staff**. ¡Estoy aquí para ayudarte!'
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const addMessage = useCallback((sender: 'bot' | 'user', text: string) => {
    const msg: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sender,
      text,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, msg])
    return msg
  }, [])

  const handleSend = useCallback(
    (text?: string) => {
      const messageText = (text ?? inputValue).trim()
      if (!messageText || isTyping) return

      setInputValue('')
      addMessage('user', messageText)

      // Show typing indicator
      setIsTyping(true)

      // Simulate bot thinking
      const delay = 1000 + Math.random() * 1000
      setTimeout(() => {
        const response = findBotResponse(messageText)
        addMessage('bot', response)
        setIsTyping(false)
      }, delay)
    },
    [inputValue, isTyping, addMessage]
  )

  const handleQuickAction = useCallback(
    (keyword: string, label: string) => {
      if (isTyping) return
      addMessage('user', label)
      setIsTyping(true)
      const delay = 1000 + Math.random() * 1000
      setTimeout(() => {
        const response = BOT_RESPONSES[keyword] ?? 'Información no disponible.'
        addMessage('bot', response)
        setIsTyping(false)
      }, delay)
    },
    [isTyping, addMessage]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mb-3 w-[calc(100vw-3rem)] sm:w-[380px] rounded-2xl glass-strong neon-border overflow-hidden flex flex-col shadow-[0_0_30px_rgba(124,58,237,0.2),0_20px_60px_rgba(0,0,0,0.5)]"
            style={{ maxHeight: 'min(520px, calc(100vh - 120px))' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#7c3aed]/10 border-b border-[#7c3aed]/20">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/40 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[#7c3aed]" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0f172a] animate-breathe" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Soporte Prestigio RP
                  </h3>
                  <p className="text-[11px] text-emerald-400">En línea</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                aria-label="Minimizar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0" style={{ maxHeight: '320px' }}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border ${
                      msg.sender === 'bot'
                        ? 'bg-[#06b6d4]/15 border-[#06b6d4]/30'
                        : 'bg-[#7c3aed]/15 border-[#7c3aed]/30'
                    }`}
                  >
                    {msg.sender === 'bot' ? (
                      <Bot className="w-3.5 h-3.5 text-[#06b6d4]" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-[#7c3aed]" />
                    )}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      msg.sender === 'bot'
                        ? 'bg-[#06b6d4]/10 border border-[#06b6d4]/20 text-gray-200 rounded-tl-sm'
                        : 'bg-[#7c3aed]/15 border border-[#7c3aed]/25 text-gray-100 rounded-tr-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <p
                      className={`mt-1 text-[10px] ${
                        msg.sender === 'bot' ? 'text-[#06b6d4]/50' : 'text-[#7c3aed]/50'
                      }`}
                    >
                      {getTimestamp(msg.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#06b6d4]/15 border border-[#06b6d4]/30 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-[#06b6d4]" />
                  </div>
                  <div className="bg-[#06b6d4]/10 border border-[#06b6d4]/20 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-[#06b6d4]/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-[#06b6d4]/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-[#06b6d4]/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-2">
              <div className="flex gap-1.5 flex-wrap">
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={action.keyword}
                      onClick={() => handleQuickAction(action.keyword, action.label)}
                      disabled={isTyping}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] rounded-full bg-white/5 border border-[#7c3aed]/20 text-gray-300 hover:bg-[#7c3aed]/10 hover:border-[#7c3aed]/40 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Icon className="w-3 h-3" />
                      {action.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-1">
              <div className="flex items-center gap-2 bg-white/5 border border-[#7c3aed]/20 rounded-xl px-3 py-2 focus-within:border-[#7c3aed]/50 focus-within:shadow-[0_0_10px_rgba(124,58,237,0.15)] transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                  disabled={isTyping}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleSend()}
                  disabled={!inputValue.trim() || isTyping}
                  className="h-7 w-7 rounded-lg text-[#7c3aed] hover:text-white hover:bg-[#7c3aed]/20 disabled:opacity-30"
                  aria-label="Enviar mensaje"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative p-4 rounded-full transition-all duration-300 ${
          isOpen
            ? 'bg-[#7c3aed] text-white neon-glow'
            : 'bg-[#0f172a]/90 border border-[#7c3aed]/30 text-gray-300 hover:text-[#7c3aed] hover:border-[#7c3aed]/60 backdrop-blur-sm'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? 'Cerrar chat de soporte' : 'Abrir chat de soporte'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulsing glow ring when closed */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full animate-pulse-glow pointer-events-none" />
        )}

        {/* Unread indicator dot */}
        {!isOpen && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-[#06b6d4] rounded-full border-2 border-[#0f172a] animate-breathe" />
        )}
      </motion.button>
    </div>
  )
}
