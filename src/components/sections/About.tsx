'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, Shield, Gamepad2, MessageCircle } from 'lucide-react'

/* ── Animated counter hook ── */
function useCountUp(end: number, duration: number = 1500, start: boolean = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    let frame: number
    const animate = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [end, duration, start])

  return count
}

/* ── Data ── */
const gradientDirections = [
  '135deg',
  '225deg',
  '45deg',
  '315deg',
]

const aboutItems = [
  {
    icon: Users,
    title: 'Comunidad Activa',
    description: 'Más de {500} jugadores activos',
    number: 500,
    prefix: 'Más de ',
    suffix: ' jugadores activos',
    color: '#7c3aed',
    glowClass: 'neon-glow',
  },
  {
    icon: Shield,
    title: 'Staff Profesional',
    description: 'Equipo dedicado y comprometido',
    number: null,
    color: '#06b6d4',
    glowClass: 'neon-glow-cyan',
  },
  {
    icon: Gamepad2,
    title: 'Experiencia Única',
    description: 'Roleplay inmersivo de calidad',
    number: null,
    color: '#f59e0b',
    glowClass: 'neon-glow-amber',
  },
  {
    icon: MessageCircle,
    title: 'Comunicación Constante',
    description: 'Siempre conectados',
    number: null,
    color: '#7c3aed',
    glowClass: 'neon-glow',
  },
]

/* ── Card with animated counter ── */
function AboutCard({ item, index }: { item: typeof aboutItems[number]; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const count = useCountUp(item.number ?? 0, 1500, isInView && item.number !== null)
  const Icon = item.icon
  const gradientDir = gradientDirections[index % gradientDirections.length]

  return (
    <motion.div
      ref={ref}
      className="group relative rounded-xl bg-[#0f172a] p-6 sm:p-8 neon-border card-3d cyber-corner shimmer-sweep transition-all duration-300 hover:shadow-[0_0_25px_rgba(124,58,237,0.2)] cursor-default"
      style={{ borderColor: `${item.color}40` }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Subtle gradient background overlay */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `linear-gradient(${gradientDir}, ${item.color}08 0%, transparent 60%)`,
        }}
      />

      {/* Icon container with rotation on hover */}
      <div
        className={`inline-flex items-center justify-center w-14 h-14 rounded-lg mb-5 ${item.glowClass} transition-all duration-300 group-hover:scale-110 group-hover:rotate-[5deg]`}
        style={{ backgroundColor: `${item.color}15` }}
      >
        <Icon
          className="w-7 h-7 transition-colors duration-300"
          style={{ color: item.color }}
        />
      </div>

      {/* Text */}
      <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
      <p className="text-[#94a3b8] text-sm leading-relaxed">
        {item.number !== null ? (
          <>
            {item.prefix}
            <span className="font-bold" style={{ color: item.color, textShadow: `0 0 10px ${item.color}40` }}>
              {count}
            </span>
            {item.suffix}
          </>
        ) : (
          item.description
        )}
      </p>

      {/* Hover glow accent */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 30px ${item.color}10, 0 0 20px ${item.color}08`,
        }}
      />
    </motion.div>
  )
}

/* ── Section ── */
export default function About() {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0 hex-pattern opacity-50" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section title */}
        <motion.div
          className="text-center mb-14 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Quiénes <span className="text-[#7c3aed] neon-text-glow">Somos</span>
          </h2>
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-center text-[#94a3b8] text-base sm:text-lg max-w-3xl mx-auto mb-14 sm:mb-16 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Somos una comunidad apasionada por el roleplay en FiveM, dedicada a crear experiencias
          únicas e inmersivas. En Prestigio RP, cada jugador tiene la oportunidad de vivir
          aventuras irrepetibles en un entorno profesional y acogedor.
        </motion.p>

        {/* Icon grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {aboutItems.map((item, index) => (
            <AboutCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
