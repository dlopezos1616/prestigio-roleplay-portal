'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Zap } from 'lucide-react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getNextEventDate(): Date {
  // Find next Friday at 21:00 (server event time)
  const now = new Date()
  const day = now.getDay()
  const diff = day <= 5 ? 5 - day : 5 - day + 7
  const next = new Date(now)
  next.setDate(now.getDate() + diff)
  next.setHours(21, 0, 0, 0)
  // If it's Friday but past 21:00, move to next Friday
  if (day === 5 && now.getHours() >= 21) {
    next.setDate(next.getDate() + 7)
  }
  return next
}

function useCountdown(targetDate: Date): TimeLeft {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const diff = Math.max(0, target - now)

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }

    calculate()
    const interval = setInterval(calculate, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return timeLeft
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#030712] border border-[#7c3aed]/30 flex items-center justify-center overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(circle at center, #7c3aed, transparent)' }} />
        <span className="relative text-2xl sm:text-3xl font-bold text-white" style={{ textShadow: '0 0 10px rgba(124,58,237,0.5)' }}>
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-[#94a3b8] mt-2 uppercase tracking-wider">{label}</span>
    </div>
  )
}

export default function NextEvent() {
  // Memoize the event date so it doesn't change on re-renders
  const [eventDate] = useState(() => getNextEventDate())
  const timeLeft = useCountdown(eventDate)

  const eventDay = eventDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <section className="relative py-20 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-[#0f172a] rounded-2xl p-8 sm:p-10 neon-border overflow-hidden relative"
        >
          {/* Decorative top line */}
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)', boxShadow: '0 0 15px rgba(124,58,237,0.5)' }} />

          {/* Event header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#7c3aed]/15 border border-[#7c3aed]/30 flex items-center justify-center" style={{ boxShadow: '0 0 15px rgba(124,58,237,0.2)' }}>
                <Zap className="w-6 h-6 text-[#7c3aed]" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">Próximo Evento</h3>
                <div className="flex items-center gap-2 text-[#94a3b8] text-sm mt-1">
                  <Calendar className="w-4 h-4" />
                  <span className="capitalize">{eventDay}</span>
                  <span className="text-[#7c3aed]">•</span>
                  <Clock className="w-4 h-4" />
                  <span>21:00 CET</span>
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse" />
              Carreras Nocturnas
            </span>
          </div>

          {/* Countdown */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-6">
            <TimeUnit value={timeLeft.days} label="Días" />
            <span className="text-2xl text-[#7c3aed] font-bold mt-[-20px]">:</span>
            <TimeUnit value={timeLeft.hours} label="Horas" />
            <span className="text-2xl text-[#7c3aed] font-bold mt-[-20px]">:</span>
            <TimeUnit value={timeLeft.minutes} label="Min" />
            <span className="text-2xl text-[#7c3aed] font-bold mt-[-20px]">:</span>
            <TimeUnit value={timeLeft.seconds} label="Seg" />
          </div>

          {/* Event details */}
          <div className="text-center">
            <p className="text-[#94a3b8] text-sm">
              Grandes premios, carreras emocionantes y mucha diversión. ¡No te lo pierdas!
            </p>
          </div>

          {/* Background glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-[#7c3aed]/5 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </section>
  )
}
