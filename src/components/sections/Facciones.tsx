'use client'

import { motion } from 'framer-motion'
import { Shield, Heart, Eye, Wrench, Skull, User } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Faction {
  name: string
  icon: LucideIcon
  color: string
  description: string
  borderColor: string
  glowClass: string
}

const factions: Faction[] = [
  {
    name: 'Policía',
    icon: Shield,
    color: '#06b6d4',
    description: 'Protege y sirve a la ciudad',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    glowClass: '0 0 10px rgba(6, 182, 212, 0.3), 0 0 30px rgba(6, 182, 212, 0.15), inset 0 0 10px rgba(6, 182, 212, 0.05)',
  },
  {
    name: 'EMS',
    icon: Heart,
    color: '#22c55e',
    description: 'Salva vidas y atiende emergencias',
    borderColor: 'rgba(34, 197, 94, 0.4)',
    glowClass: '0 0 10px rgba(34, 197, 94, 0.3), 0 0 30px rgba(34, 197, 94, 0.15), inset 0 0 10px rgba(34, 197, 94, 0.05)',
  },
  {
    name: 'FBI',
    icon: Eye,
    color: '#f59e0b',
    description: 'Investigaciones de alto nivel',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    glowClass: '0 0 10px rgba(245, 158, 11, 0.3), 0 0 30px rgba(245, 158, 11, 0.15), inset 0 0 10px rgba(245, 158, 11, 0.05)',
  },
  {
    name: 'Mecánico',
    icon: Wrench,
    color: '#f97316',
    description: 'Repara y personaliza vehículos',
    borderColor: 'rgba(249, 115, 22, 0.4)',
    glowClass: '0 0 10px rgba(249, 115, 22, 0.3), 0 0 30px rgba(249, 115, 22, 0.15), inset 0 0 10px rgba(249, 115, 22, 0.05)',
  },
  {
    name: 'Crimen Organizado',
    icon: Skull,
    color: '#ef4444',
    description: 'Opera desde las sombras',
    borderColor: 'rgba(239, 68, 68, 0.4)',
    glowClass: '0 0 10px rgba(239, 68, 68, 0.3), 0 0 30px rgba(239, 68, 68, 0.15), inset 0 0 10px rgba(239, 68, 68, 0.05)',
  },
  {
    name: 'Civil',
    icon: User,
    color: '#7c3aed',
    description: 'Vive tu vida en la ciudad',
    borderColor: 'rgba(124, 58, 237, 0.4)',
    glowClass: '0 0 10px rgba(124, 58, 237, 0.3), 0 0 30px rgba(124, 58, 237, 0.15), inset 0 0 10px rgba(124, 58, 237, 0.05)',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

export default function Facciones() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#7c3aed] neon-text-glow mb-4"
          >
            Facciones
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#94a3b8] text-lg"
          >
            Elige tu camino en la ciudad
          </motion.p>
        </div>

        {/* Faction Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {factions.map((faction) => {
            const IconComponent = faction.icon
            return (
              <motion.div
                key={faction.name}
                variants={cardVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative bg-[#0f172a] rounded-xl p-6 cursor-pointer transition-shadow duration-500"
                style={{
                  border: `1px solid ${faction.borderColor}`,
                  boxShadow: faction.glowClass,
                }}
              >
                {/* Hover glow intensification */}
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: faction.glowClass.replace(/0 0 10px/g, '0 0 20px').replace(/0 0 30px/g, '0 0 60px').replace(/0 0 15px/g, '0 0 30px'),
                  }}
                />

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: `${faction.color}15`,
                    border: `1px solid ${faction.color}30`,
                  }}
                >
                  <IconComponent
                    className="w-7 h-7 transition-transform duration-300 group-hover:scale-110"
                    style={{ color: faction.color }}
                  />
                </div>

                {/* Title */}
                <h3
                  className="text-xl font-bold mb-2 transition-colors duration-300"
                  style={{ color: faction.color }}
                >
                  {faction.name}
                </h3>

                {/* Description */}
                <p className="text-[#94a3b8] text-sm leading-relaxed">
                  {faction.description}
                </p>

                {/* Bottom accent line */}
                <div
                  className="mt-4 h-0.5 rounded-full transition-all duration-500 group-hover:w-full"
                  style={{
                    width: '30%',
                    background: `linear-gradient(90deg, ${faction.color}, transparent)`,
                  }}
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
