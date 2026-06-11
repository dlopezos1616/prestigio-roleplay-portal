'use client'

import { motion } from 'framer-motion'
import { Users, Shield, Gamepad2, MessageCircle } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
}

const aboutItems = [
  {
    icon: Users,
    title: 'Comunidad Activa',
    description: 'Más de 500 jugadores activos',
    color: '#7c3aed',
    glowClass: 'neon-glow',
  },
  {
    icon: Shield,
    title: 'Staff Profesional',
    description: 'Equipo dedicado y comprometido',
    color: '#06b6d4',
    glowClass: 'neon-glow-cyan',
  },
  {
    icon: Gamepad2,
    title: 'Experiencia Única',
    description: 'Roleplay inmersivo de calidad',
    color: '#f59e0b',
    glowClass: 'neon-glow-amber',
  },
  {
    icon: MessageCircle,
    title: 'Comunicación Constante',
    description: 'Siempre conectados',
    color: '#7c3aed',
    glowClass: 'neon-glow',
  },
]

export default function About() {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0 grid-pattern opacity-50" />

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
            Quiénes <span className="text-[#7c3aed]">Somos</span>
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
          {aboutItems.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                className="group relative rounded-xl bg-[#0f172a] p-6 sm:p-8 neon-border transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(124,58,237,0.2)] cursor-default"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Icon container */}
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-lg mb-5 ${item.glowClass} transition-all duration-300 group-hover:scale-110`}
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <Icon
                    className="w-7 h-7 transition-colors duration-300"
                    style={{ color: item.color }}
                  />
                </div>

                {/* Text */}
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-[#94a3b8] text-sm leading-relaxed">{item.description}</p>

                {/* Hover glow accent */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 30px ${item.color}10, 0 0 20px ${item.color}08`,
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
