'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Swords, MessageCircle, RotateCcw, ChevronDown, ExternalLink } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface RuleCategory {
  id: string
  title: string
  icon: LucideIcon
  color: string
  description: string
  details: string[]
}

const ruleCategories: RuleCategory[] = [
  {
    id: 'generales',
    title: 'Reglas Generales',
    icon: BookOpen,
    color: '#7c3aed',
    description: 'Respeto entre jugadores, prohibido el Power Gaming y Meta Gaming',
    details: [
      'Trata a todos los jugadores con respeto, tanto IC como OOC.',
      'El Power Gaming (forzar acciones sobre otros) está estrictamente prohibido.',
      'El Meta Gaming (usar información OOC de forma IC) es motivo de sanción.',
      'Mantén el rol en todo momento mientras estés en el servidor.',
      'No abuses de bugs o exploits; repórtalos al staff inmediatamente.',
    ],
  },
  {
    id: 'combate',
    title: 'Reglas de Combate',
    icon: Swords,
    color: '#ef4444',
    description: 'NVL, VDM, RDM y valor por la vida son faltas graves',
    details: [
      'NVL (No Value for Life): Tu personaje debe valorar su vida siempre.',
      'VDM (Vehicle Death Match): No atropellar jugadores sin razón de rol.',
      'RDM (Random Death Match): No atacar a otros sin una razón de rol válida.',
      'Las persecuciones y tiroteos deben tener contexto narrativo.',
      'No usar tácticas irreales o exploits durante combates.',
    ],
  },
  {
    id: 'comunicacion',
    title: 'Reglas de Comunicación',
    icon: MessageCircle,
    color: '#06b6d4',
    description: 'IC vs OOC, uso correcto de canales de chat',
    details: [
      'Mantén la separación entre comunicación IC (en personaje) y OOC (fuera de personaje).',
      'Usa los canales de chat correctamente: /b para OOC, /me y /do para acciones.',
      'No reveles información IC a través de canales OOC o viceversa.',
      'La comunicación por radio debe ser realista: no metagaming.',
      'Respeta los tiempos de respuesta en situaciones de rol.',
    ],
  },
  {
    id: 'newlife',
    title: 'New Life Rule',
    icon: RotateCcw,
    color: '#f59e0b',
    description: 'Al morir, tu personaje pierde la memoria del evento',
    details: [
      'Tras morir, tu personaje no recuerda los eventos que llevaron a su muerte.',
      'No puedes regresar al lugar de tu muerte durante 15 minutos.',
      'No puedes buscar venganza por eventos de tu vida anterior.',
      'Las interacciones con otros personajes deben reiniciarse tras respawn.',
      'Los médicos pueden revivirte; si sobrevives, conservas la memoria.',
    ],
  },
]

function RuleCategoryCard({ category, isExpanded, onToggle }: { category: RuleCategory; isExpanded: boolean; onToggle: () => void }) {
  const IconComponent = category.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="relative rounded-xl overflow-hidden"
      style={{
        border: `1px solid ${category.color}30`,
        boxShadow: `0 0 10px ${category.color}10, inset 0 0 10px ${category.color}05`,
      }}
    >
      {/* Colored left border */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 z-10"
        style={{ backgroundColor: category.color }}
      />

      {/* Clickable header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-4 sm:p-5 pl-5 sm:pl-6 bg-[#0f172a] hover:bg-[#0f172a]/80 transition-colors text-left"
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: `${category.color}15`,
            border: `1px solid ${category.color}30`,
          }}
        >
          <IconComponent className="w-5 h-5" style={{ color: category.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-white">{category.title}</h3>
          <p className="text-[#94a3b8] text-xs sm:text-sm mt-0.5 truncate">{category.description}</p>
        </div>

        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-[#64748b]" />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              className="px-4 sm:px-5 pl-5 sm:pl-6 pb-5 pt-2 bg-[#0a0f1e]"
              style={{ borderTop: `1px solid ${category.color}15` }}
            >
              <ul className="space-y-2.5">
                {category.details.map((detail, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * i }}
                    className="flex items-start gap-2.5 text-[#cbd5e1] text-sm"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    {detail}
                  </motion.li>
                ))}
              </ul>

              {/* Read more link */}
              <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${category.color}10` }}>
                <a
                  href="https://prestigio-roleplay-web.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:underline"
                  style={{ color: category.color }}
                >
                  Leer más en la normativa completa
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Normativa() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#7c3aed] neon-text-glow mb-4"
          >
            Normativa
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#94a3b8] text-lg"
          >
            Conoce las normas que rigen nuestro servidor
          </motion.p>
        </div>

        {/* Rule Categories */}
        <div className="space-y-4 mb-10">
          {ruleCategories.map((category) => (
            <RuleCategoryCard
              key={category.id}
              category={category}
              isExpanded={expandedCategories.has(category.id)}
              onToggle={() => toggleCategory(category.id)}
            />
          ))}
        </div>

        {/* External Link Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.a
            href="https://prestigio-roleplay-web.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative block cursor-pointer rounded-xl overflow-hidden neon-border"
          >
            {/* Placeholder gradient image */}
            <div className="relative aspect-video w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed] via-[#4c1d95] to-[#06b6d4]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-60" />

              {/* Grid pattern overlay */}
              <div className="absolute inset-0 grid-pattern opacity-30" />

              {/* Icon decoration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <BookOpen className="w-16 h-16 text-white/20" />
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    whileHover={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                  >
                    <ExternalLink className="w-8 h-8 text-white" />
                  </motion.div>
                </div>
              </div>

              {/* Glassmorphism overlay on hover */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-[#030712]/40 backdrop-blur-md" />
                <div className="relative text-center z-10">
                  <BookOpen className="w-12 h-12 text-[#7c3aed] mx-auto mb-3" />
                  <p className="text-white text-xl font-bold mb-1">Leer Normativa</p>
                  <p className="text-[#94a3b8] text-sm flex items-center justify-center gap-1">
                    Abrir en nueva pestaña <ExternalLink className="w-3 h-3" />
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Bottom info bar */}
            <div className="bg-[#0f172a] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#7c3aed]/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#7c3aed]" />
                </div>
                <div>
                  <p className="text-white font-semibold">Reglamento del Servidor</p>
                  <p className="text-[#94a3b8] text-sm">Normas, reglas y lineamientos</p>
                </div>
              </div>
              <div className="text-[#7c3aed] group-hover:translate-x-1 transition-transform">
                <ExternalLink className="w-5 h-5" />
              </div>
            </div>

            {/* Hover glow intensification */}
            <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.4), 0 0 60px rgba(124, 58, 237, 0.2), 0 0 100px rgba(124, 58, 237, 0.1)',
              }}
            />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
