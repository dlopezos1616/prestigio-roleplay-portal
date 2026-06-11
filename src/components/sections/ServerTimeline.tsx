'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface Milestone {
  date: string
  title: string
  description: string
  emoji: string
  color: string
}

const milestones: Milestone[] = [
  {
    date: 'Ene 2024',
    title: 'Nacimiento del Servidor',
    description:
      'Prestigio RP abre sus puertas con la misión de crear el mejor roleplay en español.',
    emoji: '🚀',
    color: '#7c3aed',
  },
  {
    date: 'Mar 2024',
    title: 'Primeros 100 Jugadores',
    description:
      'La comunidad crece rápidamente, alcanzando los primeros 100 miembros activos.',
    emoji: '👥',
    color: '#06b6d4',
  },
  {
    date: 'May 2024',
    title: 'Sistema de Facciones v2',
    description:
      'Implementación del sistema de facciones mejorado con rangos y estructura jerárquica.',
    emoji: '⚔️',
    color: '#f59e0b',
  },
  {
    date: 'Jul 2024',
    title: 'Evento Aniversario',
    description:
      'Primer gran evento comunitario con carreras, torneos y premios exclusivos.',
    emoji: '🏆',
    color: '#22c55e',
  },
  {
    date: 'Sep 2024',
    title: 'Economía v2.0',
    description:
      'Rediseño completo del sistema económico con nuevos trabajos y negocios.',
    emoji: '💰',
    color: '#7c3aed',
  },
  {
    date: 'Nov 2024',
    title: '500 Miembros',
    description:
      'La comunidad alcanza los 500 miembros activos, un hito increíble.',
    emoji: '🎉',
    color: '#06b6d4',
  },
  {
    date: 'Ene 2025',
    title: 'Custom Scripts',
    description:
      'Implementación de scripts personalizados exclusivos del servidor.',
    emoji: '⚡',
    color: '#f59e0b',
  },
  {
    date: 'Mar 2025',
    title: 'Anti-Cheat Avanzado',
    description:
      'Nuevo sistema anti-cheat para garantizar juego limpio y justo.',
    emoji: '🛡️',
    color: '#ef4444',
  },
  {
    date: 'Jun 2025',
    title: 'Hoy',
    description:
      'Continuamos creciendo y mejorando. ¡El mejor está por venir!',
    emoji: '🌟',
    color: '#7c3aed',
  },
]

/* ─── Single milestone dot used by both desktop & mobile ─── */
function TimelineDot({
  color,
  visible,
}: {
  color: string
  visible: boolean
}) {
  return (
    <div className="relative flex-shrink-0 flex items-center justify-center">
      {/* Outer pulse ring */}
      {visible && (
        <motion.span
          className="absolute rounded-full"
          style={{ border: `2px solid ${color}40` }}
          initial={{ width: 16, height: 16, opacity: 0.8 }}
          animate={{
            width: [16, 32, 16],
            height: [16, 32, 16],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Glow backdrop */}
      <span
        className="absolute rounded-full"
        style={{
          width: 28,
          height: 28,
          background: `${color}25`,
          filter: 'blur(4px)',
        }}
      />

      {/* Core dot */}
      <span
        className="relative z-10 rounded-full border-[3px]"
        style={{
          width: 16,
          height: 16,
          backgroundColor: color,
          borderColor: '#030712',
          boxShadow: `0 0 12px ${color}70, 0 0 24px ${color}35`,
        }}
      />
    </div>
  )
}

/* ─── Desktop milestone card (alternating left/right) ─── */
function DesktopMilestone({
  milestone,
  index,
}: {
  milestone: Milestone
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const isLeft = index % 2 === 0

  return (
    <div
      ref={ref}
      className={`relative flex items-start mb-12 last:mb-0 ${
        isLeft ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      {/* Card side */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        className={`w-[calc(50%-32px)] ${isLeft ? 'pr-2' : 'pl-2'}`}
      >
        <motion.div
          whileHover={{ y: -6, scale: 1.015 }}
          transition={{ duration: 0.25 }}
          className="card-lift group relative rounded-2xl bg-[#0f172a]/70 backdrop-blur-xl border border-white/[0.06] p-5 sm:p-6 hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
        >
          {/* Colored accent line on the side closest to timeline */}
          <div
            className={`absolute top-0 bottom-0 w-[3px] ${
              isLeft ? 'right-0' : 'left-0'
            } rounded-full`}
            style={{
              background: `linear-gradient(to bottom, ${milestone.color}, ${milestone.color}60)`,
              boxShadow: `0 0 8px ${milestone.color}50`,
            }}
          />

          {/* Hover glow overlay */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              boxShadow: `inset 0 0 40px ${milestone.color}08, 0 0 30px ${milestone.color}06`,
            }}
          />

          {/* Top gradient line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(90deg, transparent, ${milestone.color}, transparent)`,
              boxShadow: `0 0 12px ${milestone.color}60`,
            }}
          />

          <div className="relative z-10">
            {/* Date badge + emoji row */}
            <div
              className={`flex items-center gap-3 mb-4 ${
                isLeft ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Date badge */}
              <span
                className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold tracking-wide"
                style={{
                  backgroundColor: `${milestone.color}12`,
                  border: `1px solid ${milestone.color}40`,
                  color: milestone.color,
                  boxShadow: `0 0 8px ${milestone.color}15`,
                }}
              >
                {milestone.date}
              </span>

              {/* Emoji circle */}
              <span
                className="flex items-center justify-center w-10 h-10 rounded-full text-lg"
                style={{
                  backgroundColor: `${milestone.color}15`,
                  border: `1px solid ${milestone.color}30`,
                  boxShadow: `0 0 14px ${milestone.color}25`,
                }}
              >
                {milestone.emoji}
              </span>
            </div>

            {/* Title */}
            <h3
              className={`text-lg font-bold text-white mb-2 ${
                isLeft ? 'text-right' : 'text-left'
              }`}
              style={{ textShadow: `0 0 10px ${milestone.color}20` }}
            >
              {milestone.title}
            </h3>

            {/* Description */}
            <p
              className={`text-sm text-[#94a3b8] leading-relaxed ${
                isLeft ? 'text-right' : 'text-left'
              }`}
            >
              {milestone.description}
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Center dot */}
      <div className="flex-shrink-0 flex items-center justify-center w-16 relative z-10">
        <TimelineDot color={milestone.color} visible={isInView} />
      </div>

      {/* Spacer */}
      <div className="w-[calc(50%-32px)]" />
    </div>
  )
}

/* ─── Mobile milestone card (left-aligned, dots on right) ─── */
function MobileMilestone({
  milestone,
  index,
}: {
  milestone: Milestone
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative flex items-start gap-4 mb-8 last:mb-0"
    >
      {/* Card */}
      <div className="flex-1">
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="card-lift group relative rounded-xl bg-[#0f172a]/70 backdrop-blur-xl border border-white/[0.06] p-4 hover:border-white/[0.12] transition-all duration-300 overflow-hidden"
        >
          {/* Left accent line */}
          <div
            className="absolute top-0 bottom-0 left-0 w-[3px] rounded-full"
            style={{
              background: `linear-gradient(to bottom, ${milestone.color}, ${milestone.color}60)`,
              boxShadow: `0 0 6px ${milestone.color}50`,
            }}
          />

          {/* Top gradient line */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(90deg, transparent, ${milestone.color}, transparent)`,
              boxShadow: `0 0 10px ${milestone.color}50`,
            }}
          />

          <div className="relative z-10 pl-2">
            {/* Date badge + emoji */}
            <div className="flex items-center gap-2.5 mb-3">
              <span
                className="flex items-center justify-center w-9 h-9 rounded-full text-base"
                style={{
                  backgroundColor: `${milestone.color}15`,
                  border: `1px solid ${milestone.color}30`,
                  boxShadow: `0 0 12px ${milestone.color}20`,
                }}
              >
                {milestone.emoji}
              </span>
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide"
                style={{
                  backgroundColor: `${milestone.color}12`,
                  border: `1px solid ${milestone.color}35`,
                  color: milestone.color,
                  boxShadow: `0 0 6px ${milestone.color}12`,
                }}
              >
                {milestone.date}
              </span>
            </div>

            {/* Title */}
            <h3
              className="text-base font-bold text-white mb-1.5"
              style={{ textShadow: `0 0 8px ${milestone.color}18` }}
            >
              {milestone.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              {milestone.description}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Dot on right side */}
      <div className="flex-shrink-0 flex items-start pt-5">
        <TimelineDot color={milestone.color} visible={isInView} />
      </div>
    </motion.div>
  )
}

/* ─── Progressive line segment ─── */
function LineSegment({ index, total }: { index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-20px' })

  // Gradient color interpolation: purple → cyan → amber
  const getSegmentGradient = (i: number) => {
    const colors = ['#7c3aed', '#06b6d4', '#f59e0b']
    const segmentCount = total
    const colorIndex = (i / segmentCount) * (colors.length - 1)
    const lowerIndex = Math.floor(colorIndex)
    const upperIndex = Math.min(lowerIndex + 1, colors.length - 1)
    return `${colors[lowerIndex]}, ${colors[upperIndex]}`
  }

  return (
    <div ref={ref} className="w-full flex-1" style={{ minHeight: 80 }}>
      <motion.div
        className="w-full h-full"
        style={{
          background: `linear-gradient(to bottom, ${getSegmentGradient(index)})`,
        }}
        initial={{ scaleY: 0 }}
        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        // origin top so line grows downward
      />
    </div>
  )
}

/* ───────────────────── Main Component ───────────────────── */
export default function ServerTimeline() {
  return (
    <section className="relative py-20 px-4 sm:px-6 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0 grid-pattern opacity-15" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 30%, rgba(124,58,237,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(6,182,212,0.04) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Section Title ── */}
        <motion.div
          className="text-center mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Nuestra{' '}
            <span
              className="text-[#7c3aed]"
              style={{ textShadow: '0 0 20px rgba(124,58,237,0.5)' }}
            >
              Historia
            </span>
          </h2>
          <div
            className="w-28 h-1 mx-auto rounded-full mb-5"
            style={{
              background: 'linear-gradient(90deg, #7c3aed, #06b6d4, #f59e0b)',
              boxShadow:
                '0 0 12px rgba(124,58,237,0.3), 0 0 24px rgba(6,182,212,0.2)',
            }}
          />
          <p
            className="text-[#94a3b8] text-sm sm:text-base max-w-lg mx-auto"
            style={{ textShadow: '0 0 20px rgba(124,58,237,0.15)' }}
          >
            El camino que nos ha traído hasta aquí
          </p>
        </motion.div>

        {/* ── Desktop Timeline ── */}
        <div className="hidden sm:block relative">
          {/* Central vertical line — static gradient base */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 opacity-20"
            style={{
              background:
                'linear-gradient(to bottom, #7c3aed, #06b6d4, #f59e0b, #7c3aed)',
            }}
          />

          {/* Animated progressive fill line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 flex flex-col">
            {milestones.map((_, i) => (
              <LineSegment
                key={`line-${i}`}
                index={i}
                total={milestones.length}
              />
            ))}
          </div>

          {/* Milestone entries */}
          {milestones.map((milestone, i) => (
            <DesktopMilestone
              key={`desktop-${i}`}
              milestone={milestone}
              index={i}
            />
          ))}
        </div>

        {/* ── Mobile Timeline ── */}
        <div className="sm:hidden relative pr-1">
          {/* Right-side vertical line base */}
          <div
            className="absolute right-[15px] top-0 bottom-0 w-[2px] opacity-15"
            style={{
              background:
                'linear-gradient(to bottom, #7c3aed, #06b6d4, #f59e0b, #7c3aed)',
            }}
          />

          {/* Animated progressive fill */}
          <div className="absolute right-[15px] top-0 bottom-0 w-[2px] flex flex-col">
            {milestones.map((_, i) => (
              <LineSegment
                key={`mobile-line-${i}`}
                index={i}
                total={milestones.length}
              />
            ))}
          </div>

          {/* Milestone entries */}
          {milestones.map((milestone, i) => (
            <MobileMilestone
              key={`mobile-${i}`}
              milestone={milestone}
              index={i}
            />
          ))}
        </div>

        {/* ── Bottom CTA glow ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-14"
        >
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f172a]/60 backdrop-blur-md border border-[#7c3aed]/20 text-[#94a3b8] text-sm"
            style={{ boxShadow: '0 0 20px rgba(124,58,237,0.08)' }}
          >
            <span className="text-[#7c3aed]">🌟</span>
            <span>Y seguimos escribiendo nuestra historia…</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
