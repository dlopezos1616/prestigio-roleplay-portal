'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Clock, Trophy, Shield, TrendingUp, TrendingDown } from 'lucide-react'

/* ────────────────────────────────────────────
   Custom useCountUp hook with requestAnimationFrame
   ──────────────────────────────────────────── */
function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, start])

  return count
}

/* ────────────────────────────────────────────
   Activity Chart Data
   ──────────────────────────────────────────── */
const activityData = [45, 52, 48, 65, 88, 112, 95]
const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

/* ────────────────────────────────────────────
   Metric Cards Config
   ──────────────────────────────────────────── */
interface MetricCard {
  icon: React.ElementType
  value: number
  label: string
  sublabel: string
  color: string
  trend: number
}

const metricCards: MetricCard[] = [
  { icon: Users, value: 127, label: 'Nuevos Jugadores', sublabel: 'esta semana', color: '#22c55e', trend: 12 },
  { icon: Clock, value: 2847, label: 'Horas de Juego', sublabel: 'total', color: '#06b6d4', trend: 8 },
  { icon: Trophy, value: 24, label: 'Eventos Completados', sublabel: 'este mes', color: '#f59e0b', trend: -5 },
  { icon: Shield, value: 38, label: 'Solicitudes WL', sublabel: 'esta semana', color: '#7c3aed', trend: 15 },
]

/* ────────────────────────────────────────────
   Faction Distribution Data
   ──────────────────────────────────────────── */
interface FactionBar {
  name: string
  count: number
  percentage: number
  color: string
}

const factionData: FactionBar[] = [
  { name: 'Policía', count: 32, percentage: 25, color: '#06b6d4' },
  { name: 'EMS', count: 18, percentage: 14, color: '#22c55e' },
  { name: 'FBI', count: 12, percentage: 9, color: '#f59e0b' },
  { name: 'Mecánico', count: 15, percentage: 12, color: '#f97316' },
  { name: 'Crimen', count: 24, percentage: 19, color: '#ef4444' },
  { name: 'Civil', count: 200, percentage: 21, color: '#7c3aed' },
]

/* ────────────────────────────────────────────
   SVG Activity Chart Component
   ──────────────────────────────────────────── */
function ActivityChart({ isInView }: { isInView: boolean }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const chartRef = useRef<SVGSVGElement>(null)

  // Chart dimensions
  const width = 700
  const height = 280
  const paddingX = 50
  const paddingY = 30
  const chartW = width - paddingX * 2
  const chartH = height - paddingY * 2

  // Scale data to chart
  const maxVal = 128
  const points = activityData.map((val, i) => ({
    x: paddingX + (i / (activityData.length - 1)) * chartW,
    y: paddingY + chartH - (val / maxVal) * chartH,
    value: val,
  }))

  // Build smooth bezier curve
  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return ''
    let d = `M ${pts[0].x},${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i]
      const next = pts[i + 1]
      const cpx1 = curr.x + (next.x - curr.x) * 0.4
      const cpx2 = curr.x + (next.x - curr.x) * 0.6
      d += ` C ${cpx1},${curr.y} ${cpx2},${next.y} ${next.x},${next.y}`
    }
    return d
  }

  const linePath = buildSmoothPath(points)
  const areaPath = `${linePath} L ${points[points.length - 1].x},${paddingY + chartH} L ${points[0].x},${paddingY + chartH} Z`

  // Calculate total path length for dash animation
  const pathLength = 1200

  // Y-axis ticks
  const yTicks = [0, 32, 64, 96, 128]

  // Tooltip positioning
  const getTooltipPos = useCallback((idx: number) => {
    if (idx < 0 || idx >= points.length) return { x: 0, y: 0 }
    return points[idx]
  }, [])

  return (
    <div className="relative w-full">
      <svg
        ref={chartRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <defs>
          {/* Purple-to-cyan gradient for line */}
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="1" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="1" />
          </linearGradient>

          {/* Area fill gradient */}
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
            <stop offset="40%" stopColor="#06b6d4" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>

          {/* Glow filter for the line */}
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Dot glow filter */}
          <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {yTicks.map((tick) => {
          const y = paddingY + chartH - (tick / maxVal) * chartH
          return (
            <g key={tick}>
              <line
                x1={paddingX}
                y1={y}
                x2={paddingX + chartW}
                y2={y}
                stroke="rgba(148, 163, 184, 0.08)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX - 10}
                y={y + 4}
                textAnchor="end"
                className="fill-[#94a3b8]/40 text-[10px]"
                style={{ fontSize: '10px', fill: 'rgba(148, 163, 184, 0.4)' }}
              >
                {tick}
              </text>
            </g>
          )
        })}

        {/* X-axis day labels */}
        {points.map((pt, i) => (
          <text
            key={i}
            x={pt.x}
            y={paddingY + chartH + 20}
            textAnchor="middle"
            style={{ fontSize: '11px', fill: 'rgba(148, 163, 184, 0.5)' }}
          >
            {dayLabels[i]}
          </text>
        ))}

        {/* Gradient area fill */}
        <motion.path
          d={areaPath}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        />

        {/* Main line with glow effect */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lineGlow)"
          strokeDasharray={pathLength}
          strokeDashoffset={pathLength}
          animate={isInView ? { strokeDashoffset: 0 } : { strokeDashoffset: pathLength }}
          transition={{ duration: 2, ease: 'easeInOut', delay: 0.3 }}
        />

        {/* Data point dots */}
        {points.map((pt, i) => (
          <g key={i}>
            {/* Invisible hit area for hover */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r="20"
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            />
            {/* Visible dot */}
            <motion.circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredIndex === i ? 6 : 4}
              fill={hoveredIndex === i ? '#06b6d4' : '#7c3aed'}
              stroke="#0f172a"
              strokeWidth="2"
              filter="url(#dotGlow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.15 }}
              style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
              onMouseEnter={() => setHoveredIndex(i)}
              className="cursor-pointer"
            />
          </g>
        ))}

        {/* Hover tooltip */}
        {hoveredIndex !== null && (() => {
          const pt = getTooltipPos(hoveredIndex)
          const tooltipY = pt.y - 35
          return (
            <g>
              {/* Vertical dashed line */}
              <line
                x1={pt.x}
                y1={pt.y}
                x2={pt.x}
                y2={paddingY + chartH}
                stroke="rgba(124, 58, 237, 0.3)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              {/* Tooltip background */}
              <rect
                x={pt.x - 32}
                y={tooltipY - 10}
                width="64"
                height="28"
                rx="6"
                fill="rgba(15, 23, 42, 0.95)"
                stroke="rgba(124, 58, 237, 0.4)"
                strokeWidth="1"
              />
              {/* Tooltip value */}
              <text
                x={pt.x}
                y={tooltipY + 9}
                textAnchor="middle"
                style={{ fontSize: '12px', fill: '#06b6d4', fontWeight: 'bold' }}
              >
                {activityData[hoveredIndex]} players
              </text>
            </g>
          )
        })()}
      </svg>
    </div>
  )
}

/* ────────────────────────────────────────────
   Metric Card Component
   ──────────────────────────────────────────── */
function MetricCardComponent({ card, index }: { card: MetricCard; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const count = useCountUp(card.value, 2200, isInView)
  const Icon = card.icon
  const isPositive = card.trend >= 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="group relative bg-[#0f172a] rounded-xl p-5 neon-border shimmer-sweep card-lift cursor-default overflow-hidden"
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
          boxShadow: `0 0 8px ${card.color}80`,
        }}
      />

      {/* Subtle background glow on hover */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: `inset 0 0 30px ${card.color}08, 0 0 20px ${card.color}06` }}
      />

      <div className="relative z-10">
        {/* Icon + trend row */}
        <div className="flex items-center justify-between mb-3">
          <div
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `${card.color}15`,
              border: `1px solid ${card.color}30`,
              boxShadow: `0 0 12px ${card.color}20`,
            }}
          >
            <Icon className="w-5 h-5" style={{ color: card.color }} />
          </div>

          {/* Trend indicator */}
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium"
            style={{
              backgroundColor: isPositive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${isPositive ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
              color: isPositive ? '#22c55e' : '#ef4444',
            }}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? '↑' : '↓'}{Math.abs(card.trend)}%
          </div>
        </div>

        {/* Counter value */}
        <div
          className="text-2xl sm:text-3xl font-bold text-white mb-1"
          style={{ textShadow: `0 0 15px ${card.color}30` }}
        >
          {count.toLocaleString()}
        </div>

        {/* Label + sublabel */}
        <div className="text-[#94a3b8] text-xs sm:text-sm leading-tight">
          {card.label}
          <span className="text-[#94a3b8]/60 ml-1 text-[10px] sm:text-xs">
            {card.sublabel}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ────────────────────────────────────────────
   Faction Distribution Bar Component
   ──────────────────────────────────────────── */
function FactionBarComponent({ faction, index, isInView }: { faction: FactionBar; index: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {/* Color dot */}
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{
              backgroundColor: faction.color,
              boxShadow: `0 0 6px ${faction.color}60`,
            }}
          />
          <span className="text-[#e2e8f0] text-sm font-medium">{faction.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#94a3b8] text-xs">{faction.count}+</span>
          <span className="text-[#94a3b8]/50 text-[11px] w-8 text-right">{faction.percentage}%</span>
        </div>
      </div>

      {/* Progress bar track */}
      <div className="h-2 rounded-full bg-[#1e293b]/80 overflow-hidden">
        <motion.div
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${faction.color}, ${faction.color}cc)`,
            boxShadow: `0 0 8px ${faction.color}40`,
          }}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${faction.percentage}%` } : { width: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 + index * 0.1 }}
        >
          {/* Glow shimmer on bar */}
          <div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${faction.color}40 50%, transparent 100%)`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite',
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ────────────────────────────────────────────
   Main CommunityStats Section
   ──────────────────────────────────────────── */
export default function CommunityStats() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const chartRef = useRef(null)
  const chartInView = useInView(chartRef, { once: true, margin: '-50px' })
  const barsRef = useRef(null)
  const barsInView = useInView(barsRef, { once: true, margin: '-50px' })

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 sm:px-6 overflow-hidden"
      aria-label="Estadísticas de la Comunidad"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0f172a] to-[#030712]" />
      <div className="absolute inset-0 hex-pattern opacity-15" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(124,58,237,0.04) 0%, transparent 50%)' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 20% 70%, rgba(6,182,212,0.03) 0%, transparent 50%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Section Header ── */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Estadísticas de la{' '}
            <span
              className="gradient-text animate-gradient-text"
              style={{
                backgroundImage: 'linear-gradient(90deg, #7c3aed, #06b6d4, #7c3aed)',
              }}
            >
              Comunidad
            </span>
          </h2>
          <p className="text-[#94a3b8] text-sm sm:text-base max-w-xl mx-auto">
            Actividad en tiempo real, métricas de crecimiento y distribución de facciones del servidor
          </p>
          <div
            className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] mt-4"
            style={{ boxShadow: '0 0 15px rgba(124,58,237,0.5)' }}
          />
        </motion.div>

        {/* ── Activity Chart ── */}
        <motion.div
          ref={chartRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          <div className="relative rounded-2xl bg-[#0f172a]/80 backdrop-blur-xl neon-border overflow-hidden cyber-corner">
            {/* Top decorative line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, #7c3aed, transparent)',
                boxShadow: '0 0 12px rgba(124,58,237,0.5)',
              }}
            />
            {/* Corner glow accents */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-[#7c3aed]/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-28 h-28 bg-[#06b6d4]/5 rounded-full blur-2xl" />

            <div className="relative p-5 sm:p-7">
              {/* Chart header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#7c3aed]" />
                  <span className="text-sm text-[#94a3b8] font-medium">
                    Actividad de Jugadores — Última Semana
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-breathe" />
                  <span className="text-xs text-[#94a3b8]/60">En vivo</span>
                </div>
              </div>

              {/* SVG Chart */}
              <ActivityChart isInView={chartInView} />

              {/* Peak note */}
              <div className="flex items-center gap-4 mt-3 text-[10px] sm:text-xs text-[#94a3b8]/40">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-[2px] rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] inline-block" />
                  <span>Actividad</span>
                </div>
                <span>Pico: Sábado (112)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Metric Cards Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
          {metricCards.map((card, i) => (
            <MetricCardComponent key={card.label} card={card} index={i} />
          ))}
        </div>

        {/* ── Faction Distribution Bars ── */}
        <motion.div
          ref={barsRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative rounded-2xl bg-[#0f172a]/80 backdrop-blur-xl neon-border overflow-hidden">
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: 'linear-gradient(90deg, transparent, #06b6d4, #f59e0b, #06b6d4, transparent)',
                boxShadow: '0 0 12px rgba(6,182,212,0.4)',
              }}
            />

            <div className="relative p-5 sm:p-7">
              {/* Section header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#06b6d4]" />
                  <span className="text-sm text-[#94a3b8] font-medium">
                    Distribución de Facciones
                  </span>
                </div>
                <span className="text-[10px] text-[#94a3b8]/40 uppercase tracking-wider">
                  Miembros activos
                </span>
              </div>

              {/* Faction bars */}
              <div className="space-y-4">
                {factionData.map((faction, i) => (
                  <FactionBarComponent
                    key={faction.name}
                    faction={faction}
                    index={i}
                    isInView={barsInView}
                  />
                ))}
              </div>

              {/* Total count footer */}
              <div className="mt-5 pt-4 border-t border-[rgba(124,58,237,0.1)] flex items-center justify-between">
                <span className="text-xs text-[#94a3b8]/50">Total miembros en facciones</span>
                <span
                  className="text-sm font-bold text-white"
                  style={{ textShadow: '0 0 10px rgba(124,58,237,0.3)' }}
                >
                  301+
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
