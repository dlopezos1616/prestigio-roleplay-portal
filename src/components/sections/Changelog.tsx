'use client'

import { motion } from 'framer-motion'
import { ChevronRight, Map } from 'lucide-react'

interface ChangelogEntry {
  id: number
  emoji: string
  date: string
  title: string
  description: string
  color: string
  category: string
}

const entries: ChangelogEntry[] = [
  {
    id: 1,
    emoji: '🆕',
    date: '15 Ene 2025',
    title: 'Nuevo sistema de vehículos custom',
    description: 'Añadimos más de 50 vehículos personalizados con tuning avanzado, pinturas exclusivas y mejoras de rendimiento para cada clase.',
    color: '#7c3aed',
    category: 'Contenido',
  },
  {
    id: 2,
    emoji: '⚡',
    date: '10 Ene 2025',
    title: 'Optimización del servidor',
    description: 'Mejora significativa en el rendimiento general: reducción del lag en un 40%, tiempos de carga más rápidos y mayor estabilidad.',
    color: '#06b6d4',
    category: 'Rendimiento',
  },
  {
    id: 3,
    emoji: '🎭',
    date: '5 Ene 2025',
    title: 'Nuevas animaciones RP',
    description: 'Implementación de +200 animaciones para roleplay: expresiones, gestos, interacciones con objetos y escenas de emergencia.',
    color: '#22c55e',
    category: 'Gameplay',
  },
  {
    id: 4,
    emoji: '🔧',
    date: '28 Dic 2024',
    title: 'Sistema de economía v2',
    description: 'Rebalanceo completo de la economía: nuevos trabajos, salarios ajustados, sistema de impuestos y mercado de bienes raíces.',
    color: '#f59e0b',
    category: 'Sistemas',
  },
  {
    id: 5,
    emoji: '🏆',
    date: '20 Dic 2024',
    title: 'Evento Navideño',
    description: 'Evento especial con premios exclusivos: carreras de trineos, misiones festivas y recompensas únicas de temporada limitada.',
    color: '#ef4444',
    category: 'Evento',
  },
  {
    id: 6,
    emoji: '🛡️',
    date: '15 Dic 2024',
    title: 'Anti-cheat actualizado',
    description: 'Nuevo sistema de detección mejorado con IA:detección de mods prohibidos en tiempo real y sistema de apelaciones para sanciones.',
    color: '#06b6d4',
    category: 'Seguridad',
  },
]

function TimelineEntry({ entry, index }: { entry: ChangelogEntry; index: number }) {
  const isLeft = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative flex items-start gap-4 sm:gap-8 mb-8 sm:mb-10 ${
        isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
      }`}
    >
      {/* Content card */}
      <div className={`flex-1 ${isLeft ? 'sm:text-right' : 'sm:text-left'}`}>
        <motion.div
          whileHover={{ scale: 1.02, y: -3 }}
          transition={{ duration: 0.2 }}
          className="group relative rounded-xl bg-[#0f172a]/80 backdrop-blur-md border border-[rgba(124,58,237,0.2)] p-5 sm:p-6 hover:border-[rgba(124,58,237,0.45)] transition-all duration-300 overflow-hidden"
        >
          {/* Card top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(90deg, transparent, ${entry.color}, transparent)`,
              boxShadow: `0 0 10px ${entry.color}60`,
            }}
          />

          {/* Hover glow */}
          <div
            className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ boxShadow: `inset 0 0 30px ${entry.color}08, 0 0 20px ${entry.color}05` }}
          />

          <div className="relative z-10">
            {/* Date badge */}
            <div className={`flex items-center gap-2 mb-3 ${isLeft ? 'sm:justify-end' : 'sm:justify-start'}`}>
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${entry.color}15`,
                  border: `1px solid ${entry.color}30`,
                  color: entry.color,
                }}
              >
                {entry.category}
              </span>
              <span
                className="text-[10px] sm:text-xs font-semibold"
                style={{ color: entry.color }}
              >
                {entry.date}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2" style={{ textShadow: `0 0 8px ${entry.color}20` }}>
              <span className="text-lg sm:text-xl">{entry.emoji}</span>
              {entry.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              {entry.description}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Timeline dot */}
      <div className="relative flex-shrink-0 hidden sm:flex flex-col items-center">
        <div
          className="w-4 h-4 rounded-full border-[3px] z-10"
          style={{
            backgroundColor: entry.color,
            borderColor: '#0f172a',
            boxShadow: `0 0 10px ${entry.color}60, 0 0 20px ${entry.color}30`,
          }}
        />
      </div>

      {/* Spacer for alignment */}
      <div className="flex-1 hidden sm:block" />
    </motion.div>
  )
}

function MobileTimelineEntry({ entry, index }: { entry: ChangelogEntry; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative flex gap-4 mb-6 sm:hidden"
    >
      {/* Timeline dot & line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-3 h-3 rounded-full border-2 z-10 mt-2"
          style={{
            backgroundColor: entry.color,
            borderColor: '#030712',
            boxShadow: `0 0 8px ${entry.color}60`,
          }}
        />
        {index < entries.length - 1 && (
          <div className="w-[2px] flex-1 min-h-8 bg-gradient-to-b from-[#7c3aed]/30 to-transparent" />
        )}
      </div>

      {/* Card */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className="flex-1 group relative rounded-xl bg-[#0f172a]/80 backdrop-blur-md border border-[rgba(124,58,237,0.2)] p-4 hover:border-[rgba(124,58,237,0.4)] transition-all duration-300 overflow-hidden"
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${entry.color}, transparent)`,
            boxShadow: `0 0 10px ${entry.color}60`,
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${entry.color}15`,
                border: `1px solid ${entry.color}30`,
                color: entry.color,
              }}
            >
              {entry.category}
            </span>
            <span className="text-[10px] font-semibold" style={{ color: entry.color }}>
              {entry.date}
            </span>
          </div>
          <h3 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
            <span>{entry.emoji}</span>
            {entry.title}
          </h3>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            {entry.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Changelog() {
  return (
    <section className="relative py-20 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(245,158,11,0.04) 0%, transparent 60%)' }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Novedades del{' '}
            <span className="text-[#f59e0b]" style={{ textShadow: '0 0 15px rgba(245,158,11,0.4)' }}>
              Servidor
            </span>
          </h2>
          <div
            className="w-24 h-1 mx-auto rounded-full"
            style={{
              background: 'linear-gradient(90deg, #7c3aed, #f59e0b)',
              boxShadow: '0 0 15px rgba(245,158,11,0.3)',
            }}
          />
          <p className="text-[#94a3b8] text-sm sm:text-base mt-4 max-w-xl mx-auto">
            Mantente al día con las últimas actualizaciones, mejoras y eventos del servidor
          </p>
        </motion.div>

        {/* Desktop Timeline — alternating left/right */}
        <div className="hidden sm:block relative">
          {/* Central timeline line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2"
            style={{
              background: 'linear-gradient(to bottom, rgba(124,58,237,0.6), rgba(245,158,11,0.6), rgba(124,58,237,0.3))',
              boxShadow: '0 0 8px rgba(124,58,237,0.2), 0 0 20px rgba(245,158,11,0.1)',
            }}
          />

          {entries.map((entry, i) => (
            <TimelineEntry key={entry.id} entry={entry} index={i} />
          ))}
        </div>

        {/* Mobile Timeline — left-aligned */}
        <div className="sm:hidden relative">
          {/* Left timeline line */}
          <div
            className="absolute left-[7px] top-0 bottom-0 w-[2px]"
            style={{
              background: 'linear-gradient(to bottom, rgba(124,58,237,0.5), rgba(245,158,11,0.5), rgba(124,58,237,0.2))',
              boxShadow: '0 0 6px rgba(124,58,237,0.15)',
            }}
          />

          {entries.map((entry, i) => (
            <MobileTimelineEntry key={`mobile-${entry.id}`} entry={entry} index={i} />
          ))}
        </div>

        {/* Roadmap CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="https://discord.gg/vGpKd6yt8M"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#0f172a] border border-[#f59e0b]/30 text-[#f59e0b] font-bold text-sm sm:text-base transition-all duration-300 hover:bg-[#f59e0b]/10 hover:border-[#f59e0b]/60 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] active:scale-95"
          >
            <Map className="w-5 h-5" />
            Ver Roadmap Completo
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <p className="text-[#94a3b8]/50 text-xs mt-4">
            Consulta las próximas características y planes en nuestro Discord
          </p>
        </motion.div>
      </div>
    </section>
  )
}
