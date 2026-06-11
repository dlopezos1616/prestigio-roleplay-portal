'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Server, Clock, BookOpen, Mic, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import type { LucideIcon } from 'lucide-react'

interface InfoCard {
  icon: LucideIcon
  label: string
  value: string
  color: string
  copyable?: boolean
}

const infoCards: InfoCard[] = [
  {
    icon: Server,
    label: 'IP del Servidor',
    value: 'connect cfx.re/join/abc123',
    color: '#7c3aed',
    copyable: true,
  },
  {
    icon: Clock,
    label: 'Horario',
    value: '24/7 - Eventos especiales viernes y sábado',
    color: '#06b6d4',
  },
  {
    icon: BookOpen,
    label: 'Lore',
    value: 'Los Santos, una ciudad donde cada decisión cuenta. En Prestigio RP, tú escribes tu historia...',
    color: '#f59e0b',
  },
  {
    icon: Mic,
    label: 'Voice',
    value: 'Voice chat obligatorio - Inmersión total',
    color: '#22c55e',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function ServerInfo() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('IP copiada al portapapeles', {
        style: {
          background: '#0f172a',
          border: '1px solid rgba(124, 58, 237, 0.4)',
          color: '#f1f5f9',
        },
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('No se pudo copiar', {
        style: {
          background: '#0f172a',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#f1f5f9',
        },
      })
    }
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#7c3aed] neon-text-glow mb-4"
          >
            Información del Servidor
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#94a3b8] text-lg"
          >
            Todo lo que necesitas saber para comenzar
          </motion.p>
        </div>

        {/* Info Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {infoCards.map((card) => {
            const IconComponent = card.icon
            return (
              <motion.div
                key={card.label}
                variants={cardVariants}
                whileHover={{ y: -3, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative bg-[#0f172a] rounded-xl p-6 neon-border cursor-default"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: `0 0 15px ${card.color}30, 0 0 40px ${card.color}15`,
                  }}
                />

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: `${card.color}15`,
                    border: `1px solid ${card.color}30`,
                  }}
                >
                  <IconComponent className="w-6 h-6" style={{ color: card.color }} />
                </div>

                {/* Label */}
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: card.color }}
                >
                  {card.label}
                </p>

                {/* Value */}
                <div className="flex items-start gap-2">
                  <p className="text-[#f1f5f9] text-sm leading-relaxed flex-1">
                    {card.value}
                  </p>
                  {card.copyable && (
                    <button
                      onClick={() => handleCopy(card.value)}
                      className="shrink-0 mt-0.5 p-2 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/30 hover:bg-[#7c3aed]/20 transition-colors duration-200"
                      title="Copiar IP"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-[#22c55e]" />
                      ) : (
                        <Copy className="w-4 h-4 text-[#7c3aed]" />
                      )}
                    </button>
                  )}
                </div>

                {/* Bottom accent */}
                <div
                  className="mt-4 h-0.5 rounded-full transition-all duration-500 group-hover:w-full"
                  style={{
                    width: '20%',
                    background: `linear-gradient(90deg, ${card.color}, transparent)`,
                  }}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
