'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Wifi, Trophy, Shield } from 'lucide-react'

function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)

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
      } else {
        setDone(true)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, start])

  return { count, done }
}

interface StatItem {
  icon: React.ElementType
  value: number
  suffix: string
  label: string
  color: string
  /** Progress ring percentage (0-100) */
  progress: number
}

const stats: StatItem[] = [
  { icon: Users, value: 500, suffix: '+', label: 'Jugadores Activos', color: '#7c3aed', progress: 83 },
  { icon: Wifi, value: 24, suffix: '/7', label: 'Servidor Online', color: '#22c55e', progress: 100 },
  { icon: Trophy, value: 150, suffix: '+', label: 'Eventos Realizados', color: '#f59e0b', progress: 60 },
  { icon: Shield, value: 99, suffix: '.8%', label: 'Uptime', color: '#06b6d4', progress: 99 },
]

/* ── Circular Progress Ring ── */
function ProgressRing({ radius, stroke, progress, color }: { radius: number; stroke: number; progress: number; color: string }) {
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <svg
      width={radius * 2}
      height={radius * 2}
      className="absolute inset-0 -rotate-90"
      style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
    >
      {/* Background ring */}
      <circle
        stroke={`${color}15`}
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      {/* Progress ring */}
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        style={{
          transition: 'stroke-dashoffset 2s ease-out',
        }}
      />
    </svg>
  )
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const { count, done } = useCountUp(stat.value, 2000, isInView)
  const Icon = stat.icon
  const ringSize = 100

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -2 }}
      className="group relative bg-[#0f172a] rounded-xl p-6 sm:p-8 text-center neon-border shimmer-sweep animate-card-breathe cursor-default overflow-hidden"
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`,
          boxShadow: `0 0 10px ${stat.color}80`,
        }}
      />

      {/* Icon */}
      <div
        className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${stat.color}15`, border: `1px solid ${stat.color}30`, boxShadow: `0 0 15px ${stat.color}20` }}
      >
        <Icon className="w-7 h-7" style={{ color: stat.color }} />
      </div>

      {/* Number with progress ring */}
      <div className="relative inline-flex items-center justify-center mb-2">
        <ProgressRing
          radius={ringSize / 2}
          stroke={3}
          progress={isInView ? stat.progress : 0}
          color={stat.color}
        />
        <div
          className={`text-4xl sm:text-5xl font-bold text-white ${done ? 'animate-glitch' : ''}`}
          style={{ textShadow: `0 0 20px ${stat.color}40` }}
        >
          {count}{stat.suffix}
        </div>
      </div>

      {/* Label */}
      <p className="text-[#94a3b8] text-sm sm:text-base">{stat.label}</p>

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: `inset 0 0 30px ${stat.color}10, 0 0 20px ${stat.color}08` }}
      />
    </motion.div>
  )
}

export default function StatsCounter() {
  return (
    <section className="relative py-20 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0f172a] to-[#030712]" />
      <div className="absolute inset-0 hex-pattern opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section title */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Números que <span className="text-[#7c3aed] neon-text-glow">Hablan</span>
          </h2>
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4]" style={{ boxShadow: '0 0 15px rgba(124,58,237,0.5)' }} />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
