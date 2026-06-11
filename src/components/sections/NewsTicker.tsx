'use client'

import { motion } from 'framer-motion'
import { Newspaper, Zap, Trophy, Shield, Clock, ChevronRight } from 'lucide-react'

/* ── Data ── */

const tickerContent =
  '🎮 Nuevos vehículos custom disponibles • ⚡ Mantenimiento programado: 15 Jun 04:00 CET • 🏆 Torneo de carreras este sábado • 🛡️ Anti-cheat v3.2 activado • 🎭 Nuevas animaciones RP'

interface FeaturedNews {
  id: number
  title: string
  description: string
  date: string
  category: string
  color: string
  icon: typeof Newspaper
}

const featuredNews: FeaturedNews[] = [
  {
    id: 1,
    title: 'Sistema de Vehículos Custom',
    description:
      'Nuevas opciones de personalización: paint jobs, body kits, interiores y performance upgrades disponibles en todos los talleres.',
    date: '12 Jun 2026',
    category: 'Actualización',
    color: '#7c3aed',
    icon: Newspaper,
  },
  {
    id: 2,
    title: 'Evento: Carreras Nocturnas',
    description:
      'Este viernes a las 21:00 CET. Premios en efectivo para los 3 primeros. Inscríbete en Discord.',
    date: '11 Jun 2026',
    category: 'Evento',
    color: '#f59e0b',
    icon: Trophy,
  },
  {
    id: 3,
    title: 'Economía v2.0',
    description:
      'Nuevo sistema económico con inflación dinámica, mercado de valores y negocios rentables.',
    date: '10 Jun 2026',
    category: 'Economía',
    color: '#06b6d4',
    icon: Zap,
  },
  {
    id: 4,
    title: 'Anti-Cheat Actualizado',
    description:
      'Mayor seguridad con detección mejorada, bans automáticos y sistema de reportes.',
    date: '9 Jun 2026',
    category: 'Seguridad',
    color: '#22c55e',
    icon: Shield,
  },
]

interface RecentUpdate {
  id: number
  text: string
  timestamp: string
  icon: typeof Clock
}

const recentUpdates: RecentUpdate[] = [
  { id: 1, text: 'Nuevas animaciones de combate', timestamp: 'Hace 2h', icon: Zap },
  { id: 2, text: 'Fix: Garage de mecánicos', timestamp: 'Hace 5h', icon: Shield },
  { id: 3, text: 'Nuevo trabajo: Repartidor', timestamp: 'Hace 1d', icon: Newspaper },
  { id: 4, text: 'Balance de armas actualizado', timestamp: 'Hace 2d', icon: Trophy },
  { id: 5, text: 'Nueva zona: Puerto industrial', timestamp: 'Hace 3d', icon: Clock },
]

/* ── Sub-components ── */

function FeaturedNewsCard({ item, index }: { item: FeaturedNews; index: number }) {
  const Icon = item.icon

  return (
    <motion.div
      className="group relative rounded-xl glass-card p-5 sm:p-6 card-hover-lift shimmer-sweep overflow-hidden transition-all duration-300"
      style={{ borderColor: `${item.color}20` }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, ${item.color}, ${item.color}80, transparent)`,
          boxShadow: `0 0 12px ${item.color}50`,
        }}
      />

      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${item.color}06 0%, transparent 60%)`,
          boxShadow: `inset 0 0 30px ${item.color}08, 0 0 20px ${item.color}05`,
        }}
      />

      <div className="relative z-10">
        {/* Header: icon + category badge */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg"
            style={{ backgroundColor: `${item.color}15` }}
          >
            <Icon className="w-5 h-5" style={{ color: item.color }} />
          </div>
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider"
            style={{
              backgroundColor: `${item.color}15`,
              border: `1px solid ${item.color}30`,
              color: item.color,
            }}
          >
            {item.category}
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-base sm:text-lg font-bold text-white mb-2 leading-tight"
          style={{ textShadow: `0 0 8px ${item.color}20` }}
        >
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mb-3">
          {item.description}
        </p>

        {/* Date */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#64748b]" />
          <span className="text-[11px] sm:text-xs text-[#64748b] font-medium">{item.date}</span>
        </div>
      </div>
    </motion.div>
  )
}

function RecentUpdateItem({ item, index }: { item: RecentUpdate; index: number }) {
  const Icon = item.icon

  return (
    <motion.div
      className="group flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0 transition-colors duration-200 hover:bg-white/[0.02] rounded-lg px-2 -mx-2"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-md bg-[#7c3aed]/10 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-[#7c3aed]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm text-[#cbd5e1] truncate">{item.text}</p>
      </div>
      <span className="flex-shrink-0 text-[10px] sm:text-xs text-[#64748b] font-medium">
        {item.timestamp}
      </span>
    </motion.div>
  )
}

/* ── Main Component ── */

export default function NewsTicker() {
  return (
    <section className="relative py-16 sm:py-20 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(245,158,11,0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(124,58,237,0.04) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ─── Part 1: Scrolling News Ticker Banner ─── */}
        <motion.div
          className="mb-12 sm:mb-14"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)',
              boxShadow: '0 0 20px rgba(124,58,237,0.25), 0 4px 15px rgba(0,0,0,0.3)',
            }}
          >
            {/* Left fade mask */}
            <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-[#7c3aed] to-transparent" />
            {/* Right fade mask */}
            <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-[#6d28d9] to-transparent" />

            {/* Ticker container */}
            <div className="group py-3 overflow-hidden">
              <div
                className="flex whitespace-nowrap"
                style={{
                  animation: 'tickerScroll 35s linear infinite',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.animationPlayState = 'paused'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.animationPlayState = 'running'
                }}
              >
                {/* Duplicate content for seamless loop */}
                {[0, 1].map((key) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-2 px-2 text-white/95 text-sm sm:text-base font-medium"
                  >
                    {tickerContent}
                    <span className="mx-4 text-white/40">◆</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Section Header ─── */}
        <motion.div
          className="text-center mb-10 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Últimas{' '}
            <span className="text-[#f59e0b] neon-text-glow">Noticias</span>
          </h2>
          <p className="text-[#94a3b8] text-sm sm:text-base max-w-xl mx-auto">
            Mantente informado sobre las novedades del servidor
          </p>
          <div
            className="w-24 h-1 mx-auto mt-5 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #7c3aed, #f59e0b)',
              boxShadow: '0 0 15px rgba(245,158,11,0.3)',
            }}
          />
        </motion.div>

        {/* ─── Part 2 & 3: Featured News Grid + Recent Updates ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Featured News — 2x2 grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {featuredNews.map((item, index) => (
              <FeaturedNewsCard key={item.id} item={item} index={index} />
            ))}
          </div>

          {/* Recent Updates — sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="rounded-xl glass-card p-5 sm:p-6 overflow-hidden relative">
              {/* Top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background: 'linear-gradient(90deg, #f59e0b, #f59e0b80, transparent)',
                  boxShadow: '0 0 12px rgba(245,158,11,0.4)',
                }}
              />

              <h3 className="text-base sm:text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#f59e0b]" />
                Actualizaciones Recientes
              </h3>
              <p className="text-xs text-[#64748b] mb-4">Últimos cambios del servidor</p>

              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {recentUpdates.map((item, index) => (
                  <RecentUpdateItem key={item.id} item={item} index={index} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── CTA Button ─── */}
        <motion.div
          className="text-center mt-10 sm:mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <a
            href="https://discord.gg/vGpKd6yt8M"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#0f172a] border border-[#f59e0b]/30 text-[#f59e0b] font-bold text-sm sm:text-base transition-all duration-300 hover:bg-[#f59e0b]/10 hover:border-[#f59e0b]/60 hover:shadow-[0_0_25px_rgba(245,158,11,0.2)] active:scale-95"
          >
            <Newspaper className="w-5 h-5" />
            Ver todas las noticias
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <p className="text-[#94a3b8]/50 text-xs mt-3">
            Más detalles y anuncios en nuestro canal de Discord
          </p>
        </motion.div>
      </div>

      {/* ─── Ticker keyframes injected as style tag ─── */}
      <style jsx>{`
        @keyframes tickerScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}
