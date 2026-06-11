'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Flame,
  Zap,
} from 'lucide-react'

/* ────────────────────────── Types ────────────────────────── */

interface PlayerRank {
  rank: number
  name: string
  faction: string
  factionColor: string
  hoursPlayed: number
  eventsAttended: number
  trend: 'up' | 'down' | 'same'
  avatar?: string
}

type FilterPeriod = 'semana' | 'mes' | 'temporada'

/* ────────────────────────── Mock Data ────────────────────────── */

const leaderboardData: PlayerRank[] = [
  { rank: 1, name: 'ShadowRider', faction: 'Crimen Organizado', factionColor: '#ef4444', hoursPlayed: 342, eventsAttended: 28, trend: 'up' },
  { rank: 2, name: 'NightOwl', faction: 'Policía', factionColor: '#06b6d4', hoursPlayed: 298, eventsAttended: 25, trend: 'up' },
  { rank: 3, name: 'GhostMedic', faction: 'EMS', factionColor: '#22c55e', hoursPlayed: 276, eventsAttended: 22, trend: 'same' },
  { rank: 4, name: 'UrbanLegend', faction: 'Civil', factionColor: '#7c3aed', hoursPlayed: 254, eventsAttended: 20, trend: 'down' },
  { rank: 5, name: 'SteelNerve', faction: 'FBI', factionColor: '#f59e0b', hoursPlayed: 241, eventsAttended: 19, trend: 'up' },
  { rank: 6, name: 'TurboMax', faction: 'Mecánico', factionColor: '#f97316', hoursPlayed: 228, eventsAttended: 18, trend: 'same' },
  { rank: 7, name: 'DarkPhoenix', faction: 'Crimen Organizado', factionColor: '#ef4444', hoursPlayed: 215, eventsAttended: 17, trend: 'up' },
  { rank: 8, name: 'BlueSiren', faction: 'Policía', factionColor: '#06b6d4', hoursPlayed: 203, eventsAttended: 15, trend: 'down' },
  { rank: 9, name: 'QuickFix', faction: 'Mecánico', factionColor: '#f97316', hoursPlayed: 189, eventsAttended: 14, trend: 'up' },
  { rank: 10, name: 'SilentWolf', faction: 'Civil', factionColor: '#7c3aed', hoursPlayed: 176, eventsAttended: 12, trend: 'same' },
]

/* ────────────────────────── Counter Hook ────────────────────────── */

function useCountUp(end: number, duration: number = 1800, start: boolean = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
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

/* ────────────────────────── Gradient Avatar ────────────────────────── */

function AvatarCircle({ name, color, size = 'md' }: { name: string; color: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white shrink-0`}
      style={{
        background: `linear-gradient(135deg, ${color}80, ${color}40)`,
        border: `2px solid ${color}60`,
        boxShadow: `0 0 12px ${color}30`,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

/* ────────────────────────── Trend Icon ────────────────────────── */

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'same' }) {
  if (trend === 'up') {
    return (
      <div className="flex items-center gap-0.5 text-[#22c55e]">
        <TrendingUp className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">+</span>
      </div>
    )
  }
  if (trend === 'down') {
    return (
      <div className="flex items-center gap-0.5 text-[#ef4444]">
        <TrendingDown className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">-</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-0.5 text-[#94a3b8]">
      <Minus className="w-3.5 h-3.5" />
    </div>
  )
}

/* ────────────────────────── Faction Badge ────────────────────────── */

function FactionBadge({ faction, color }: { faction: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap"
      style={{
        backgroundColor: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      {faction}
    </span>
  )
}

/* ────────────────────────── Sparkle Particles for 1st place ────────────────────────── */

function SparkleParticles() {
  const sparkles = [
    { x: '-10%', y: '-5%', delay: '0s', size: 'w-1 h-1' },
    { x: '105%', y: '10%', delay: '0.5s', size: 'w-1.5 h-1.5' },
    { x: '5%', y: '105%', delay: '1s', size: 'w-1 h-1' },
    { x: '95%', y: '95%', delay: '1.5s', size: 'w-1.5 h-1.5' },
    { x: '50%', y: '-8%', delay: '0.8s', size: 'w-1 h-1' },
    { x: '-5%', y: '60%', delay: '1.2s', size: 'w-1 h-1' },
  ]

  return (
    <>
      {sparkles.map((s, i) => (
        <div
          key={i}
          className={`absolute ${s.size} rounded-full bg-[#ffd700]`}
          style={{
            left: s.x,
            top: s.y,
            animation: `sparkle 1.5s ease-in-out ${s.delay} infinite`,
            boxShadow: '0 0 6px rgba(255,215,0,0.8)',
          }}
        />
      ))}
    </>
  )
}

/* ────────────────────────── Podium Card (Top 3) ────────────────────────── */

function PodiumCard({ player, index, isInView }: { player: PlayerRank; index: number; isInView: boolean }) {
  const hours = useCountUp(player.hoursPlayed, 2200, isInView)

  const isGold = player.rank === 1
  const isSilver = player.rank === 2
  const isBronze = player.rank === 3

  const accentColor = isGold ? '#ffd700' : isSilver ? '#c0c0c0' : '#cd7f32'
  const glowClass = isGold ? 'animate-popular-glow' : ''
  const cardOrder = isGold ? 'order-2 lg:order-2' : isSilver ? 'order-1 lg:order-1' : 'order-3 lg:order-3'
  const heightClass = isGold ? 'sm:pt-10' : 'sm:pt-6'

  const podiumVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        delay: isGold ? 0.3 : isSilver ? 0.15 : 0,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <motion.div
      variants={podiumVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      whileHover={{ scale: 1.04, y: -5 }}
      className={`relative ${cardOrder} flex-1 min-w-0`}
    >
      <div
        className={`relative bg-[#0f172a] rounded-2xl p-4 sm:p-6 text-center overflow-hidden ${glowClass} shimmer-sweep group cursor-default`}
        style={{
          border: `1px solid ${accentColor}40`,
          boxShadow: `0 0 15px ${accentColor}15, inset 0 0 15px ${accentColor}05`,
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[2px] rounded-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            boxShadow: `0 0 12px ${accentColor}80`,
          }}
        />

        {/* Sparkle particles for Gold */}
        {isGold && <SparkleParticles />}

        {/* Crown / Medal icon */}
        <div className={`flex justify-center mb-3 ${heightClass}`}>
          {isGold ? (
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              <Crown className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: accentColor, filter: `drop-shadow(0 0 8px ${accentColor}80)` }} />
            </motion.div>
          ) : (
            <Medal className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: accentColor, filter: `drop-shadow(0 0 6px ${accentColor}60)` }} />
          )}
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-3">
          <div className="relative">
            <AvatarCircle name={player.name} color={accentColor} size={isGold ? 'lg' : 'md'} />
            {/* Rank badge */}
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 8px ${accentColor}60`,
              }}
            >
              {player.rank}
            </div>
          </div>
        </div>

        {/* Name */}
        <h3
          className={`font-bold text-white mb-1 ${isGold ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'}`}
          style={{ textShadow: `0 0 15px ${accentColor}30` }}
        >
          {player.name}
        </h3>

        {/* Faction badge */}
        <div className="flex justify-center mb-3">
          <FactionBadge faction={player.faction} color={player.factionColor} />
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-[#94a3b8]">
            <Clock className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span className="font-semibold text-white">{hours}h</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#94a3b8]">
            <Flame className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span className="font-semibold text-white">{player.eventsAttended}</span>
          </div>
        </div>

        {/* Trend indicator */}
        <div className="flex justify-center mt-2">
          <TrendIcon trend={player.trend} />
        </div>

        {/* Podium bar at bottom */}
        <div
          className="mt-4 h-2 rounded-full mx-auto"
          style={{
            width: isGold ? '80%' : '60%',
            background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`,
            boxShadow: `0 0 8px ${accentColor}30`,
          }}
        />

        {/* Hover glow overlay */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ boxShadow: `inset 0 0 30px ${accentColor}10, 0 0 20px ${accentColor}08` }}
        />
      </div>
    </motion.div>
  )
}

/* ────────────────────────── Rank Row (4-10) ────────────────────────── */

function RankRow({ player, index, isInView }: { player: PlayerRank; index: number; isInView: boolean }) {
  const hours = useCountUp(player.hoursPlayed, 1600 + index * 100, isInView)
  const isEven = index % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ scale: 1.01, x: 4 }}
      className="group relative cursor-default"
    >
      <div
        className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 rounded-xl transition-all duration-300 ${
          isEven ? 'bg-[#0f172a]/60' : 'bg-[#0f172a]/30'
        }`}
        style={{
          border: '1px solid rgba(124, 58, 237, 0.1)',
        }}
      >
        {/* Hover neon glow */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            border: '1px solid rgba(124, 58, 237, 0.3)',
            boxShadow: '0 0 15px rgba(124, 58, 237, 0.1), inset 0 0 15px rgba(124, 58, 237, 0.03)',
          }}
        />

        {/* Rank number */}
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold text-[#94a3b8] shrink-0"
          style={{
            backgroundColor: 'rgba(124, 58, 237, 0.1)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
          }}
        >
          {player.rank}
        </div>

        {/* Avatar */}
        <AvatarCircle name={player.name} color={player.factionColor} size="sm" />

        {/* Name & Faction */}
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-semibold text-white truncate">{player.name}</p>
          <p className="text-[10px] sm:text-xs text-[#94a3b8] truncate">{player.faction}</p>
        </div>

        {/* Faction badge (hidden on small) */}
        <div className="hidden md:block">
          <FactionBadge faction={player.faction} color={player.factionColor} />
        </div>

        {/* Hours */}
        <div className="flex items-center gap-1 text-[#94a3b8] shrink-0">
          <Clock className="w-3 h-3 text-[#7c3aed]" />
          <span className="text-xs sm:text-sm font-semibold text-white">{hours}h</span>
        </div>

        {/* Events (hidden on small) */}
        <div className="hidden sm:flex items-center gap-1 text-[#94a3b8] shrink-0">
          <Zap className="w-3 h-3 text-[#f59e0b]" />
          <span className="text-xs sm:text-sm font-semibold text-white">{player.eventsAttended}</span>
        </div>

        {/* Trend */}
        <div className="shrink-0">
          <TrendIcon trend={player.trend} />
        </div>
      </div>
    </motion.div>
  )
}

/* ────────────────────────── Filter Tabs ────────────────────────── */

function FilterTabs({ active, onChange }: { active: FilterPeriod; onChange: (p: FilterPeriod) => void }) {
  const tabs: { key: FilterPeriod; label: string }[] = [
    { key: 'semana', label: 'Semana' },
    { key: 'mes', label: 'Mes' },
    { key: 'temporada', label: 'Temporada' },
  ]

  return (
    <div className="flex items-center justify-center gap-2 mb-10 sm:mb-14">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            active === tab.key
              ? 'text-white'
              : 'text-[#94a3b8] hover:text-white'
          }`}
          style={
            active === tab.key
              ? {
                  background: 'linear-gradient(135deg, #7c3aed40, #06b6d430)',
                  border: '1px solid rgba(124, 58, 237, 0.5)',
                  boxShadow: '0 0 15px rgba(124, 58, 237, 0.3), 0 0 30px rgba(6, 182, 212, 0.1)',
                }
              : {
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(124, 58, 237, 0.15)',
                }
          }
        >
          {tab.label}
          {active === tab.key && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #7c3aed20, #06b6d420)',
                border: '1px solid rgba(124, 58, 237, 0.4)',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  )
}

/* ────────────────────────── Main Component ────────────────────────── */

export default function Leaderboard() {
  const [filter, setFilter] = useState<FilterPeriod>('semana')
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const top3 = leaderboardData.slice(0, 3)
  const rest = leaderboardData.slice(3)

  const handleFilterChange = useCallback((p: FilterPeriod) => {
    setFilter(p)
  }, [])

  return (
    <section ref={sectionRef} className="relative py-20 px-4 sm:px-6 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0f172a] to-[#030712]" />
      <div className="absolute inset-0 hex-pattern opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.08)_0%,transparent_60%)]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* ── Section Header ── */}
        <motion.div
          className="text-center mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-[#f59e0b]" style={{ filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.6))' }} />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Ranking de{' '}
              <span
                className="neon-text-glow-amber"
                style={{
                  background: 'linear-gradient(135deg, #ffd700, #f59e0b, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Jugadores
              </span>
            </h2>
          </div>
          <p className="text-[#94a3b8] text-base sm:text-lg max-w-md mx-auto">
            Los mejores roleadores de la ciudad — clasificados por dedicación y actividad
          </p>
          <div
            className="w-24 h-1 mx-auto rounded-full mt-4"
            style={{
              background: 'linear-gradient(90deg, #7c3aed, #06b6d4, #f59e0b)',
              boxShadow: '0 0 15px rgba(124,58,237,0.4), 0 0 15px rgba(6,182,212,0.3)',
            }}
          />
        </motion.div>

        {/* ── Filter Tabs ── */}
        <FilterTabs active={filter} onChange={handleFilterChange} />

        {/* ── Top 3 Podium ── */}
        <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-5 mb-8 sm:mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-5 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {top3.map((player, i) => (
                <PodiumCard key={player.name} player={player} index={i} isInView={isInView} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Divider ── */}
        <div className="glow-line mb-8 sm:mb-10" />

        {/* ── Rank List (4-10) ── */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {rest.map((player, i) => (
                <RankRow key={player.name} player={player} index={i} isInView={isInView} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom decoration ── */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-[#94a3b8]/60 text-xs sm:text-sm italic">
            Los rankings se actualizan cada lunes a las 00:00 UTC
          </p>
        </motion.div>
      </div>
    </section>
  )
}
