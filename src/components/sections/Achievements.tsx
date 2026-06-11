'use client'

import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  Medal,
  Star,
  Crown,
  Gem,
  Lock,
  Unlock,
  Footprints,
  ShieldCheck,
  Home,
  Clock,
  Brain,
  MessageCircle,
  Award,
  Users,
  Zap,
  Sparkles,
  Flame,
  Target,
  type LucideIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

/* ────────────────────────── Types ────────────────────────── */

type Tier = 'bronce' | 'plata' | 'oro' | 'diamante'

interface Achievement {
  id: string
  name: string
  description: string
  requirement: string
  tier: Tier
  progress: number
  unlocked: boolean
  icon: LucideIcon
}

/* ────────────────────────── Tier Config ────────────────────────── */

const tierConfig: Record<Tier, { color: string; label: string; glowClass: string }> = {
  bronce: {
    color: '#cd7f32',
    label: 'Bronce',
    glowClass: 'animate-bronce-glow',
  },
  plata: {
    color: '#c0c0c0',
    label: 'Plata',
    glowClass: 'animate-plata-glow',
  },
  oro: {
    color: '#ffd700',
    label: 'Oro',
    glowClass: 'animate-oro-glow',
  },
  diamante: {
    color: '#b9f2ff',
    label: 'Diamante',
    glowClass: 'animate-diamante-glow',
  },
}

/* ────────────────────────── Achievement Data ────────────────────────── */

const achievements: Achievement[] = [
  // Bronce — Basic
  {
    id: 'primer-paso',
    name: 'Primer Paso',
    description: 'Has completado tu primera sesión de roleplay en el servidor.',
    requirement: 'Completa 1 sesión de RP',
    tier: 'bronce',
    progress: 100,
    unlocked: true,
    icon: Footprints,
  },
  {
    id: 'sobreviviente',
    name: 'Sobreviviente',
    description: 'Has sobrevivido tus primeras 24 horas en la ciudad sin ser arrestado.',
    requirement: 'Permanece 24h sin arresto',
    tier: 'bronce',
    progress: 100,
    unlocked: true,
    icon: ShieldCheck,
  },
  {
    id: 'habitante',
    name: 'Habitante',
    description: 'Has conseguido tu primera casa y un trabajo estable en la ciudad.',
    requirement: 'Compra una propiedad y consigue empleo',
    tier: 'bronce',
    progress: 100,
    unlocked: true,
    icon: Home,
  },
  // Plata — Intermediate
  {
    id: 'veterano',
    name: 'Veterano',
    description: 'Has acumulado más de 100 horas de juego en el servidor.',
    requirement: 'Acumula 100 horas de juego',
    tier: 'plata',
    progress: 100,
    unlocked: true,
    icon: Clock,
  },
  {
    id: 'estratega',
    name: 'Estratega',
    description: 'Has planificado y ejecutado con éxito 10 operaciones complejas.',
    requirement: 'Completa 10 operaciones estratégicas',
    tier: 'plata',
    progress: 70,
    unlocked: false,
    icon: Brain,
  },
  {
    id: 'comunicador',
    name: 'Comunicador',
    description: 'Has participado activamente en 50 situaciones de roleplay dialogado.',
    requirement: 'Participa en 50 situaciones de RP',
    tier: 'plata',
    progress: 100,
    unlocked: true,
    icon: MessageCircle,
  },
  // Oro — Advanced
  {
    id: 'leyenda',
    name: 'Leyenda',
    description: 'Tu nombre es conocido por toda la ciudad. Has dejado huella en la historia del servidor.',
    requirement: 'Alcanza reputación legendaria (1000+ puntos)',
    tier: 'oro',
    progress: 65,
    unlocked: false,
    icon: Award,
  },
  {
    id: 'lider',
    name: 'Líder',
    description: 'Has liderado una facción con al menos 10 miembros activos.',
    requirement: 'Liderea una facción de 10+ miembros',
    tier: 'oro',
    progress: 100,
    unlocked: true,
    icon: Users,
  },
  {
    id: 'elite',
    name: 'Élite',
    description: 'Has completado todas las misiones de alto nivel disponibles.',
    requirement: 'Completa todas las misiones de élite',
    tier: 'oro',
    progress: 40,
    unlocked: false,
    icon: Zap,
  },
  // Diamante — Rare
  {
    id: 'fundador',
    name: 'Fundador',
    description: 'Fuiste parte de los primeros 50 jugadores que dieron vida a la ciudad.',
    requirement: 'Registro entre los primeros 50 jugadores',
    tier: 'diamante',
    progress: 100,
    unlocked: true,
    icon: Crown,
  },
  {
    id: 'inmortal',
    name: 'Inmortal',
    description: 'Has mantenido una racha de 30 días consecutivos de actividad.',
    requirement: '30 días consecutivos de conexión',
    tier: 'diamante',
    progress: 83,
    unlocked: false,
    icon: Flame,
  },
  {
    id: 'maestro-del-rp',
    name: 'Maestro del RP',
    description: 'Has sido reconocido por el staff como el mejor roleador de la temporada.',
    requirement: 'Gana el premio a Mejor Roleador',
    tier: 'diamante',
    progress: 0,
    unlocked: false,
    icon: Sparkles,
  },
]

/* ────────────────────────── Progress Ring ────────────────────────── */

function ProgressRing({ progress, color, size = 64, strokeWidth = 4 }: { progress: number; color: string; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="-rotate-90">
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={`${color}15`}
        strokeWidth={strokeWidth}
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          filter: `drop-shadow(0 0 4px ${color}60)`,
          transition: 'stroke-dashoffset 1.2s ease-out',
        }}
      />
    </svg>
  )
}

/* ────────────────────────── Sparkle Overlay for Diamante ────────────────────────── */

function DiamondSparkles() {
  const particles = [
    { x: '8%', y: '12%', delay: '0s', size: 'w-1 h-1' },
    { x: '88%', y: '8%', delay: '0.6s', size: 'w-1.5 h-1.5' },
    { x: '15%', y: '85%', delay: '1.1s', size: 'w-1 h-1' },
    { x: '92%', y: '82%', delay: '0.3s', size: 'w-1 h-1' },
    { x: '50%', y: '5%', delay: '0.9s', size: 'w-1.5 h-1.5' },
    { x: '5%', y: '50%', delay: '1.4s', size: 'w-1 h-1' },
    { x: '95%', y: '45%', delay: '0.2s', size: 'w-1 h-1' },
    { x: '45%', y: '92%', delay: '0.7s', size: 'w-1.5 h-1.5' },
  ]

  return (
    <>
      {particles.map((p, i) => (
        <div
          key={i}
          className={`absolute ${p.size} rounded-full bg-[#b9f2ff] animate-sparkle pointer-events-none`}
          style={{
            left: p.x,
            top: p.y,
            animationDelay: p.delay,
            boxShadow: '0 0 6px rgba(185,242,255,0.9), 0 0 12px rgba(185,242,255,0.4)',
          }}
        />
      ))}
    </>
  )
}

/* ────────────────────────── Achievement Card ────────────────────────── */

function AchievementCard({ achievement, index, isInView }: { achievement: Achievement; index: number; isInView: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  const { color, label } = tierConfig[achievement.tier]
  const isDiamante = achievement.tier === 'diamante'
  const Icon = achievement.icon

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      whileHover={{ scale: 1.04, y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      <div
        className={`relative rounded-xl p-4 sm:p-5 overflow-hidden shimmer-sweep group cursor-default ${
          achievement.unlocked ? 'glass' : 'glass opacity-70'
        }`}
        style={{
          border: `1px solid ${achievement.unlocked ? `${color}40` : 'rgba(100,116,139,0.15)'}`,
          boxShadow: achievement.unlocked
            ? `0 0 12px ${color}15, inset 0 0 12px ${color}05`
            : 'none',
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] rounded-full"
          style={{
            background: achievement.unlocked
              ? `linear-gradient(90deg, transparent, ${color}, transparent)`
              : 'linear-gradient(90deg, transparent, rgba(100,116,139,0.3), transparent)',
            boxShadow: achievement.unlocked ? `0 0 8px ${color}60` : 'none',
          }}
        />

        {/* Sparkles for Diamante tier */}
        {isDiamante && achievement.unlocked && <DiamondSparkles />}

        {/* Lock/Unlock indicator */}
        <div className="absolute top-3 right-3">
          {achievement.unlocked ? (
            <Unlock className="w-3.5 h-3.5" style={{ color, filter: `drop-shadow(0 0 4px ${color}60)` }} />
          ) : (
            <Lock className="w-3.5 h-3.5 text-[#475569]" />
          )}
        </div>

        {/* Icon + Progress Ring */}
        <div className="flex items-center gap-4 mb-3">
          <div className="relative shrink-0">
            <ProgressRing
              progress={achievement.progress}
              color={achievement.unlocked ? color : '#475569'}
              size={56}
              strokeWidth={3}
            />
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                filter: achievement.unlocked ? `drop-shadow(0 0 6px ${color}50)` : 'none',
              }}
            >
              {achievement.unlocked ? (
                <Icon className="w-5 h-5" style={{ color }} />
              ) : (
                <Lock className="w-5 h-5 text-[#475569]" />
              )}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className={`font-bold text-sm sm:text-base truncate ${
                achievement.unlocked ? 'text-white' : 'text-[#64748b]'
              }`}
              style={
                achievement.unlocked
                  ? { textShadow: `0 0 12px ${color}25` }
                  : {}
              }
            >
              {achievement.unlocked ? achievement.name : '???'}
            </h3>
            <p
              className={`text-xs mt-0.5 truncate ${
                achievement.unlocked ? 'text-[#94a3b8]' : 'text-[#475569]'
              }`}
            >
              {achievement.unlocked ? achievement.description : 'Sigue jugando para desbloquear este logro'}
            </p>
          </div>
        </div>

        {/* Tier Badge */}
        <div className="flex items-center justify-between mb-2">
          <Badge
            className="text-[10px] px-2 py-0 h-5"
            style={{
              backgroundColor: `${color}15`,
              color: achievement.unlocked ? color : '#64748b',
              border: `1px solid ${achievement.unlocked ? `${color}30` : 'rgba(100,116,139,0.2)'}`,
            }}
          >
            {achievement.unlocked ? (
              <Star className="w-2.5 h-2.5 mr-1" style={{ color: achievement.unlocked ? color : '#64748b' }} />
            ) : null}
            {label}
          </Badge>
          <span
            className={`text-xs font-semibold ${
              achievement.unlocked ? '' : 'text-[#475569]'
            }`}
            style={achievement.unlocked ? { color } : {}}
          >
            {achievement.progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-[#1e293b] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: achievement.unlocked
                ? `linear-gradient(90deg, ${color}90, ${color})`
                : 'rgba(100,116,139,0.3)',
              boxShadow: achievement.unlocked ? `0 0 8px ${color}40` : 'none',
            }}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${achievement.progress}%` } : { width: 0 }}
            transition={{ duration: 1.2, delay: 0.3 + index * 0.06, ease: 'easeOut' }}
          />
        </div>

        {/* Hover overlay — shows requirement */}
        <AnimatePresence>
          {isHovered && achievement.unlocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 rounded-xl flex items-center justify-center p-4"
              style={{
                background: `linear-gradient(135deg, rgba(3,7,18,0.92), rgba(15,23,42,0.95))`,
                border: `1px solid ${color}40`,
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="text-center">
                <Icon className="w-6 h-6 mx-auto mb-2" style={{ color, filter: `drop-shadow(0 0 6px ${color}60)` }} />
                <p className="text-white font-bold text-sm mb-1">{achievement.name}</p>
                <p className="text-[#94a3b8] text-xs mb-2">{achievement.description}</p>
                <div
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px]"
                  style={{
                    backgroundColor: `${color}15`,
                    color,
                    border: `1px solid ${color}30`,
                  }}
                >
                  <Target className="w-2.5 h-2.5" />
                  {achievement.requirement}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glow overlay on hover for unlocked */}
        {achievement.unlocked && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ boxShadow: `inset 0 0 25px ${color}08, 0 0 15px ${color}06` }}
          />
        )}
      </div>
    </motion.div>
  )
}

/* ────────────────────────── Filter Tabs ────────────────────────── */

type FilterTier = 'todos' | Tier

function FilterTabs({ active, onChange }: { active: FilterTier; onChange: (t: FilterTier) => void }) {
  const tabs: { key: FilterTier; label: string; color?: string }[] = [
    { key: 'todos', label: 'Todos' },
    { key: 'bronce', label: 'Bronce', color: '#cd7f32' },
    { key: 'plata', label: 'Plata', color: '#c0c0c0' },
    { key: 'oro', label: 'Oro', color: '#ffd700' },
    { key: 'diamante', label: 'Diamante', color: '#b9f2ff' },
  ]

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap mb-10 sm:mb-12">
      {tabs.map((tab) => {
        const isActive = active === tab.key
        const accentColor = tab.color || '#7c3aed'
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              isActive ? 'text-white' : 'text-[#94a3b8] hover:text-white'
            }`}
            style={
              isActive
                ? {
                    background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`,
                    border: `1px solid ${accentColor}50`,
                    boxShadow: `0 0 12px ${accentColor}25`,
                  }
                : {
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(124, 58, 237, 0.15)',
                  }
            }
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="achievementTab"
                className="absolute inset-0 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}08)`,
                  border: `1px solid ${accentColor}40`,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

/* ────────────────────────── Stats Summary ────────────────────────── */

function StatsSummary({ unlocked, total, totalProgress }: { unlocked: number; total: number; totalProgress: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="glass rounded-2xl p-5 sm:p-6 mb-10 sm:mb-12"
      style={{
        border: '1px solid rgba(124, 58, 237, 0.25)',
        boxShadow: '0 0 20px rgba(124, 58, 237, 0.08), inset 0 0 20px rgba(124, 58, 237, 0.03)',
      }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #7c3aed30, #06b6d420)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              boxShadow: '0 0 12px rgba(124, 58, 237, 0.2)',
            }}
          >
            <Trophy className="w-5 h-5 text-[#f59e0b]" style={{ filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.6))' }} />
          </div>
          <div>
            <p className="text-white font-bold text-lg">
              {unlocked}/{total}{' '}
              <span className="text-[#94a3b8] font-normal text-sm">logros desbloqueados</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Gem className="w-4 h-4 text-[#b9f2ff]" style={{ filter: 'drop-shadow(0 0 4px rgba(185,242,255,0.5))' }} />
            <span className="text-xs text-[#94a3b8]">
              {achievements.filter((a) => a.tier === 'diamante' && a.unlocked).length} Diamante
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-[#ffd700]" style={{ filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.5))' }} />
            <span className="text-xs text-[#94a3b8]">
              {achievements.filter((a) => a.tier === 'oro' && a.unlocked).length} Oro
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Medal className="w-4 h-4 text-[#c0c0c0]" style={{ filter: 'drop-shadow(0 0 4px rgba(192,192,192,0.5))' }} />
            <span className="text-xs text-[#94a3b8]">
              {achievements.filter((a) => a.tier === 'plata' && a.unlocked).length} Plata
            </span>
          </div>
        </div>
      </div>
      {/* Total progress bar */}
      <div className="w-full h-2.5 rounded-full bg-[#1e293b] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #cd7f32, #c0c0c0, #ffd700, #b9f2ff)',
            boxShadow: '0 0 10px rgba(124,58,237,0.3), 0 0 20px rgba(6,182,212,0.15)',
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${totalProgress}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </div>
      <p className="text-[#94a3b8] text-xs mt-2 text-right">{totalProgress}% progreso total</p>
    </motion.div>
  )
}

/* ────────────────────────── Main Component ────────────────────────── */

export default function Achievements() {
  const [filter, setFilter] = useState<FilterTier>('todos')
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const filteredAchievements =
    filter === 'todos' ? achievements : achievements.filter((a) => a.tier === filter)

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length
  const totalProgress = Math.round(achievements.reduce((sum, a) => sum + a.progress, 0) / totalCount)

  return (
    <section ref={sectionRef} className="relative py-20 px-4 sm:px-6 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0f172a] to-[#030712]" />
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.06)_0%,transparent_60%)]" />

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
            <Trophy
              className="w-7 h-7 sm:w-8 sm:h-8 text-[#f59e0b]"
              style={{ filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.6))' }}
            />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Logros y{' '}
              <span
                className="gradient-text animate-gradient-text"
                style={{
                  background: 'linear-gradient(90deg, #cd7f32, #c0c0c0, #ffd700, #b9f2ff, #ffd700, #c0c0c0, #cd7f32)',
                  backgroundSize: '200% auto',
                }}
              >
                Conquistas
              </span>
            </h2>
          </div>
          <p className="text-[#94a3b8] text-base sm:text-lg max-w-md mx-auto">
            Demuestra tu dedicación — desbloquea logros y sube de tier
          </p>
          <div
            className="w-24 h-1 mx-auto rounded-full mt-4"
            style={{
              background: 'linear-gradient(90deg, #cd7f32, #c0c0c0, #ffd700, #b9f2ff)',
              boxShadow: '0 0 15px rgba(255,215,0,0.3), 0 0 15px rgba(185,242,255,0.2)',
            }}
          />
        </motion.div>

        {/* ── Stats Summary ── */}
        <StatsSummary unlocked={unlockedCount} total={totalCount} totalProgress={totalProgress} />

        {/* ── Filter Tabs ── */}
        <FilterTabs active={filter} onChange={setFilter} />

        {/* ── Achievement Grid ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
          >
            {filteredAchievements.map((achievement, i) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                index={i}
                isInView={isInView}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom decoration ── */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-[#94a3b8]/60 text-xs sm:text-sm italic">
            Los logros se actualizan automáticamente según tu actividad en el servidor
          </p>
        </motion.div>
      </div>
    </section>
  )
}
