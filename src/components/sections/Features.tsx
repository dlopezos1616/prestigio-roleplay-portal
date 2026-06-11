'use client'

import { motion } from 'framer-motion'
import { Gamepad2, Users, Trophy, Shield } from 'lucide-react'

const features = [
  {
    icon: Gamepad2,
    title: 'FiveM Roleplay',
    description: 'Servidor personalizado con scripts únicos y una experiencia de juego sin igual',
    color: '#7c3aed',
    borderColor: 'rgba(124, 58, 237, 0.4)',
    hoverShadow: '0 0 30px rgba(124, 58, 237, 0.3), 0 0 60px rgba(124, 58, 237, 0.1)',
    badge: '01',
    stat: '128 Slots',
  },
  {
    icon: Users,
    title: 'Comunidad',
    description: 'Una comunidad unida por la pasión del roleplay, con eventos y actividades constantes',
    color: '#06b6d4',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    hoverShadow: '0 0 30px rgba(6, 182, 212, 0.3), 0 0 60px rgba(6, 182, 212, 0.1)',
    badge: '02',
    stat: '500+ Jugadores',
  },
  {
    icon: Trophy,
    title: 'Eventos',
    description: 'Eventos semanales, torneos y actividades especiales para toda la comunidad',
    color: '#f59e0b',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    hoverShadow: '0 0 30px rgba(245, 158, 11, 0.3), 0 0 60px rgba(245, 158, 11, 0.1)',
    badge: '03',
    stat: '150+ Realizados',
  },
  {
    icon: Shield,
    title: 'Staff Profesional',
    description: 'Equipo dedicado y comprometido que asegura la calidad del roleplay en cada momento',
    color: '#22c55e',
    borderColor: 'rgba(34, 197, 94, 0.4)',
    hoverShadow: '0 0 30px rgba(34, 197, 94, 0.3), 0 0 60px rgba(34, 197, 94, 0.1)',
    badge: '04',
    stat: '24/7 Disponible',
  },
]

export default function Features() {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0f172a] to-[#030712]" />
      <div className="absolute inset-0 hex-pattern opacity-30" />

      {/* Morphing blob accents */}
      <div
        className="absolute top-1/4 -right-32 w-64 h-64 bg-[#7c3aed]/5 animate-morph-blob"
        style={{ filter: 'blur(80px)' }}
      />
      <div
        className="absolute bottom-1/4 -left-32 w-72 h-72 bg-[#06b6d4]/5 animate-morph-blob"
        style={{ filter: 'blur(80px)', animationDelay: '4s' }}
      />

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
            A Qué Nos <span className="text-[#7c3aed] neon-text-glow">Dedicamos</span>
          </h2>
          <p className="text-[#94a3b8] text-base sm:text-lg max-w-2xl mx-auto mb-6">
            Todo lo que necesitas para vivir la mejor experiencia de roleplay
          </p>
          <div className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                className="group relative rounded-xl glass-card p-6 sm:p-7 card-hover-lift shimmer-sweep neon-hover-glow spotlight-card cursor-default overflow-hidden"
                style={{
                  border: `1px solid ${feature.borderColor}`,
                  boxShadow: `0 0 10px ${feature.borderColor.split('0.4').join('0.1')}30`,
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = feature.hoverShadow
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 0 10px ${feature.borderColor.split('0.4').join('0.1')}30`
                }}
              >
                {/* Numbered badge — top right */}
                <span
                  className="absolute top-4 right-4 text-xs font-mono font-bold tracking-widest opacity-30 group-hover:opacity-60 transition-opacity duration-300"
                  style={{ color: feature.color }}
                >
                  {feature.badge}
                </span>

                {/* Top accent line with shimmer */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] rounded-full accent-shimmer-line"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${feature.color}, ${feature.color}80, ${feature.color}, transparent)`,
                    backgroundSize: '200% 100%',
                    boxShadow: `0 0 10px ${feature.color}80`,
                  }}
                />

                {/* Hover gradient overlay */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at top, ${feature.color}08 0%, transparent 70%)`,
                  }}
                />

                {/* Icon with pulse glow */}
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[3deg]"
                  style={{
                    backgroundColor: `${feature.color}12`,
                    boxShadow: `0 0 15px ${feature.color}20`,
                    color: feature.color,
                    border: `1px solid ${feature.color}25`,
                  }}
                >
                  <Icon
                    className="w-7 h-7 transition-all duration-300"
                    style={{ color: feature.color }}
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[#94a3b8] text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Stat badge at bottom */}
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
                  style={{
                    backgroundColor: `${feature.color}10`,
                    color: feature.color,
                    border: `1px solid ${feature.color}20`,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: feature.color }} />
                  {feature.stat}
                </div>

                {/* Bottom glow on hover */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`,
                    boxShadow: `0 0 15px ${feature.color}60`,
                  }}
                />

                {/* Corner accent glow — top-left */}
                <div
                  className="absolute top-0 left-0 w-16 h-16 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: `radial-gradient(circle at top left, ${feature.color}10, transparent 70%)`,
                  }}
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
