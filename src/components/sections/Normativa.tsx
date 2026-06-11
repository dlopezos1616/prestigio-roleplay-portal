'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Swords,
  MessageCircle,
  RotateCcw,
  ChevronDown,
  ExternalLink,
  Car,
  Building,
  Search,
  AlertTriangle,
  Scale,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'

type SeverityLevel = 'Leve' | 'Moderada' | 'Grave'

interface RuleCategory {
  id: string
  title: string
  icon: LucideIcon
  color: string
  description: string
  details: string[]
  severity: SeverityLevel
  penalty: string
}

const severityConfig: Record<SeverityLevel, { color: string; bg: string; border: string; glow: string }> = {
  Leve: {
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.12)',
    border: 'rgba(34, 197, 94, 0.3)',
    glow: '0 0 8px rgba(34, 197, 94, 0.3)',
  },
  Moderada: {
    color: '#eab308',
    bg: 'rgba(234, 179, 8, 0.12)',
    border: 'rgba(234, 179, 8, 0.3)',
    glow: '0 0 8px rgba(234, 179, 8, 0.3)',
  },
  Grave: {
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.12)',
    border: 'rgba(239, 68, 68, 0.3)',
    glow: '0 0 8px rgba(239, 68, 68, 0.3)',
  },
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
    severity: 'Moderada',
    penalty: 'Aviso → Kick temporal',
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
    severity: 'Grave',
    penalty: 'Kick → Ban 3 días',
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
    severity: 'Leve',
    penalty: 'Aviso → Mute temporal',
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
    severity: 'Grave',
    penalty: 'Kick → Ban 1 día',
  },
  {
    id: 'vehiculos',
    title: 'Reglas de Vehículos',
    icon: Car,
    color: '#f97316',
    description: 'Conducción responsable y uso realista de vehículos',
    details: [
      'Respeta los límites de velocidad en zonas urbanas.',
      'No conduzcas bajo los efectos de sustancias IC.',
      'Los vehículos robados deben ser reportados al LSPD.',
      'No abandones vehículos en medio de la carretera.',
      'El tuning excesivo puede ser sancionado si afecta el rendimiento del servidor.',
    ],
    severity: 'Moderada',
    penalty: 'Aviso → Multa IC',
  },
  {
    id: 'propiedades',
    title: 'Reglas de Propiedades',
    icon: Building,
    color: '#8b5cf6',
    description: 'Uso realista de propiedades y transacciones inmobiliarias',
    details: [
      'Las propiedades deben ser usadas de forma realista.',
      'No almacenes items irreales en tu propiedad.',
      'Las transacciones inmobiliarias deben ser roleadas.',
      'El staff puede inspeccionar propiedades si hay sospecha de exploits.',
      'Las propiedades inactivas por 30+ días pueden ser reclamadas.',
    ],
    severity: 'Leve',
    penalty: 'Aviso → Pérdida de propiedad',
  },
]

function SeverityBadge({ severity }: { severity: SeverityLevel }) {
  const config = severityConfig[severity]
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
      style={{
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        boxShadow: config.glow,
      }}
    >
      <AlertTriangle className="w-3 h-3" />
      {severity}
    </span>
  )
}

function PenaltyIndicator({ penalty, color }: { penalty: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium whitespace-nowrap"
      style={{
        color: `${color}cc`,
        backgroundColor: `${color}10`,
        border: `1px solid ${color}20`,
      }}
    >
      <Scale className="w-3 h-3" />
      {penalty}
    </span>
  )
}

function TimelineNode({
  index,
  color,
  isExpanded,
  isLast,
}: {
  index: number
  color: string
  isExpanded: boolean
  isLast: boolean
}) {
  return (
    <div className="relative flex flex-col items-center" style={{ width: '36px' }}>
      {/* Vertical line segment above the circle */}
      {index > 0 && (
        <motion.div
          className="absolute -top-4 w-0.5"
          style={{
            height: 'calc(100% + 1rem)',
            top: '-1rem',
            background: isExpanded
              ? `linear-gradient(to bottom, ${color}40, ${color}80)`
              : `linear-gradient(to bottom, rgba(100,116,139,0.2), rgba(100,116,139,0.1))`,
            boxShadow: isExpanded ? `0 0 8px ${color}40` : 'none',
          }}
          animate={{
            background: isExpanded
              ? `linear-gradient(to bottom, ${color}40, ${color}80)`
              : `linear-gradient(to bottom, rgba(100,116,139,0.2), rgba(100,116,139,0.1))`,
            boxShadow: isExpanded ? `0 0 8px ${color}40` : '0 0 0px transparent',
          }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Numbered circle */}
      <motion.div
        className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={{
          backgroundColor: isExpanded ? `${color}25` : 'rgba(15, 23, 42, 0.8)',
          border: `2px solid ${isExpanded ? color : 'rgba(100,116,139,0.3)'}`,
          color: isExpanded ? color : '#64748b',
          boxShadow: isExpanded ? `0 0 12px ${color}50, 0 0 24px ${color}20` : 'none',
        }}
        animate={
          isExpanded
            ? {
                boxShadow: [
                  `0 0 12px ${color}50, 0 0 24px ${color}20`,
                  `0 0 18px ${color}70, 0 0 32px ${color}30`,
                  `0 0 12px ${color}50, 0 0 24px ${color}20`,
                ],
              }
            : {}
        }
        transition={
          isExpanded
            ? {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : {}
        }
      >
        {index + 1}
      </motion.div>

      {/* Vertical line segment below the circle (to next node) */}
      {!isLast && (
        <motion.div
          className="w-0.5 flex-1"
          style={{
            minHeight: '1rem',
            background: isExpanded
              ? `linear-gradient(to bottom, ${color}80, ${color}20)`
              : `linear-gradient(to bottom, rgba(100,116,139,0.1), rgba(100,116,139,0.05))`,
          }}
          animate={{
            background: isExpanded
              ? `linear-gradient(to bottom, ${color}80, ${color}20)`
              : `linear-gradient(to bottom, rgba(100,116,139,0.1), rgba(100,116,139,0.05))`,
          }}
          transition={{ duration: 0.4 }}
        />
      )}
    </div>
  )
}

function RuleCategoryCard({
  category,
  index,
  isLast,
  isExpanded,
  onToggle,
  searchQuery,
}: {
  category: RuleCategory
  index: number
  isLast: boolean
  isExpanded: boolean
  onToggle: () => void
  searchQuery: string
}) {
  const IconComponent = category.icon
  const sevConfig = severityConfig[category.severity]

  // Highlight matching text if search query exists
  const highlightText = (text: string) => {
    if (!searchQuery) return text
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-500/30 text-yellow-200 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className="flex gap-0 items-stretch">
      {/* Timeline column */}
      <div className="hidden sm:flex flex-col items-center shrink-0" style={{ width: '36px' }}>
        <TimelineNode index={index} color={category.color} isExpanded={isExpanded} isLast={isLast} />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.07 }}
        className="relative flex-1 rounded-xl overflow-hidden transition-shadow duration-400"
        style={{
          border: `1px solid ${category.color}${isExpanded ? '40' : '20'}`,
          boxShadow: isExpanded
            ? `0 0 15px ${category.color}15, 0 0 30px ${category.color}08, inset 0 0 15px ${category.color}05`
            : `0 0 10px ${category.color}08, inset 0 0 10px ${category.color}03`,
        }}
      >
        {/* Animated left border */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 z-10 transition-all duration-400"
          style={{
            backgroundColor: category.color,
            width: '4px',
            boxShadow: isExpanded ? `0 0 10px ${category.color}, 0 0 20px ${category.color}60` : 'none',
          }}
        />

        {/* Clickable header */}
        <button
          onClick={onToggle}
          className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 pl-5 sm:pl-6 transition-colors text-left"
          style={{
            backgroundColor: isExpanded ? `${category.color}08` : '#0f172a',
          }}
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
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-white">{category.title}</h3>
              <SeverityBadge severity={category.severity} />
            </div>
            <p className="text-[#94a3b8] text-xs sm:text-sm mt-0.5 truncate">
              {highlightText(category.description)}
            </p>
            <div className="mt-1.5">
              <PenaltyIndicator penalty={category.penalty} color={sevConfig.color} />
            </div>
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
              transition={{
                height: { type: 'spring', stiffness: 200, damping: 25 },
                opacity: { duration: 0.25 },
              }}
              className="overflow-hidden"
            >
              <motion.div
                className="px-4 sm:px-5 pl-5 sm:pl-6 pb-5 pt-3"
                style={{
                  background: isExpanded
                    ? `linear-gradient(135deg, ${category.color}06 0%, #0a0f1e 40%, #0a0f1e 100%)`
                    : '#0a0f1e',
                  borderTop: `1px solid ${category.color}15`,
                }}
                initial={{ background: '#0a0f1e' }}
                animate={{
                  background: `linear-gradient(135deg, ${category.color}08 0%, #0a0f1e 40%, #0a0f1e 100%)`,
                }}
                transition={{ duration: 0.6 }}
              >
                <ul className="space-y-2.5">
                  {category.details.map((detail, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -12, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.35,
                        delay: 0.06 * i,
                        type: 'spring',
                        stiffness: 180,
                        damping: 20,
                      }}
                      className="flex items-start gap-2.5 text-[#cbd5e1] text-sm"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: category.color }}
                      />
                      {highlightText(detail)}
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
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default function Normativa() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const totalRules = useMemo(() => ruleCategories.reduce((sum, cat) => sum + cat.details.length, 0), [])

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return ruleCategories
    const q = searchQuery.toLowerCase()
    return ruleCategories.filter(
      (cat) =>
        cat.title.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.details.some((d) => d.toLowerCase().includes(q)) ||
        cat.severity.toLowerCase().includes(q) ||
        cat.penalty.toLowerCase().includes(q)
    )
  }, [searchQuery])

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => {
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
        <div className="text-center mb-10">
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

        {/* Summary Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6 rounded-xl px-4 sm:px-5 py-3 flex items-center justify-center gap-2 sm:gap-3 text-sm"
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(124, 58, 237, 0.15)',
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.08), inset 0 0 20px rgba(124, 58, 237, 0.03)',
          }}
        >
          <BookOpen className="w-4 h-4 text-[#7c3aed] shrink-0" />
          <span className="text-[#94a3b8]">
            <span className="text-white font-semibold">{ruleCategories.length}</span> Categorías
          </span>
          <span className="text-[#475569]">•</span>
          <span className="text-[#94a3b8]">
            <span className="text-white font-semibold">{totalRules}</span> Reglas
          </span>
          <span className="text-[#475569]">•</span>
          <span className="text-[#94a3b8]">
            Última actualización: <span className="text-[#7c3aed] font-medium">Ene 2025</span>
          </span>
        </motion.div>

        {/* Quick Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b] pointer-events-none" />
          <Input
            type="text"
            placeholder="Buscar regla..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-[#0f172a]/80 border-[#1e293b] text-[#e2e8f0] placeholder:text-[#475569] focus-visible:ring-[#7c3aed] focus-visible:border-[#7c3aed] focus-visible:shadow-[0_0_15px_rgba(124,58,237,0.25)] h-10 rounded-lg transition-all duration-300"
            style={{
              backdropFilter: 'blur(8px)',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white transition-colors text-xs"
            >
              ✕
            </button>
          )}
        </motion.div>

        {/* Rule Categories with Timeline */}
        <div className="space-y-4 mb-10">
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
              >
                <RuleCategoryCard
                  category={category}
                  index={ruleCategories.indexOf(category)}
                  isLast={index === filteredCategories.length - 1}
                  isExpanded={expandedCategories.has(category.id)}
                  onToggle={() => toggleCategory(category.id)}
                  searchQuery={searchQuery}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredCategories.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-[#64748b]"
            >
              <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">No se encontraron reglas</p>
              <p className="text-sm mt-1">Intenta con otro término de búsqueda</p>
            </motion.div>
          )}
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
            <div
              className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                boxShadow:
                  '0 0 20px rgba(124, 58, 237, 0.4), 0 0 60px rgba(124, 58, 237, 0.2), 0 0 100px rgba(124, 58, 237, 0.1)',
              }}
            />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
