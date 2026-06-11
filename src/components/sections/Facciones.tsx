'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Heart, Eye, Wrench, Skull, User, Users, ChevronDown, Lock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Faction {
  name: string
  icon: LucideIcon
  color: string
  description: string
  members: string
  requirements: string
  activity: 'alta' | 'media' | 'variable'
  tags: string[]
  borderColor: string
  glowClass: string
}

const factions: Faction[] = [
  {
    name: 'Policía',
    icon: Shield,
    color: '#06b6d4',
    description: 'Protege y sirve a la ciudad de Los Santos',
    members: '32 miembros',
    requirements: 'Whitelist + prueba de conducir',
    activity: 'alta',
    tags: ['Patrulla', 'Persecución', 'Control de tráfico'],
    borderColor: 'rgba(6, 182, 212, 0.4)',
    glowClass: '0 0 10px rgba(6, 182, 212, 0.3), 0 0 30px rgba(6, 182, 212, 0.15), inset 0 0 10px rgba(6, 182, 212, 0.05)',
  },
  {
    name: 'EMS',
    icon: Heart,
    color: '#22c55e',
    description: 'Salva vidas y atiende emergencias críticas',
    members: '18 miembros',
    requirements: 'Whitelist + formación médica',
    activity: 'media',
    tags: ['Rescate', 'Cirugía', 'Trauma'],
    borderColor: 'rgba(34, 197, 94, 0.4)',
    glowClass: '0 0 10px rgba(34, 197, 94, 0.3), 0 0 30px rgba(34, 197, 94, 0.15), inset 0 0 10px rgba(34, 197, 94, 0.05)',
  },
  {
    name: 'FBI',
    icon: Eye,
    color: '#f59e0b',
    description: 'Investigaciones de alto nivel y operaciones encubiertas',
    members: '12 miembros',
    requirements: 'Whitelist + examen de aptitud',
    activity: 'media',
    tags: ['Investigación', 'Vigilancia', 'Encubierto'],
    borderColor: 'rgba(245, 158, 11, 0.4)',
    glowClass: '0 0 10px rgba(245, 158, 11, 0.3), 0 0 30px rgba(245, 158, 11, 0.15), inset 0 0 10px rgba(245, 158, 11, 0.05)',
  },
  {
    name: 'Mecánico',
    icon: Wrench,
    color: '#f97316',
    description: 'Repara y personaliza vehículos de la ciudad',
    members: '15 miembros',
    requirements: 'Whitelist aprobada',
    activity: 'alta',
    tags: ['Reparación', 'Tuning', 'Remolque'],
    borderColor: 'rgba(249, 115, 22, 0.4)',
    glowClass: '0 0 10px rgba(249, 115, 22, 0.3), 0 0 30px rgba(249, 115, 22, 0.15), inset 0 0 10px rgba(249, 115, 22, 0.05)',
  },
  {
    name: 'Crimen Organizado',
    icon: Skull,
    color: '#ef4444',
    description: 'Opera desde las sombras de la ciudad',
    members: '24 miembros',
    requirements: 'Invitación exclusiva',
    activity: 'alta',
    tags: ['Negocios', 'Territorio', 'Influencia'],
    borderColor: 'rgba(239, 68, 68, 0.4)',
    glowClass: '0 0 10px rgba(239, 68, 68, 0.3), 0 0 30px rgba(239, 68, 68, 0.15), inset 0 0 10px rgba(239, 68, 68, 0.05)',
  },
  {
    name: 'Civil',
    icon: User,
    color: '#7c3aed',
    description: 'Vive tu vida en la ciudad a tu manera',
    members: '200+ miembros',
    requirements: 'Whitelist aprobada',
    activity: 'variable',
    tags: ['Trabajos', 'Negocios', 'Vida social'],
    borderColor: 'rgba(124, 58, 237, 0.4)',
    glowClass: '0 0 10px rgba(124, 58, 237, 0.3), 0 0 30px rgba(124, 58, 237, 0.15), inset 0 0 10px rgba(124, 58, 237, 0.05)',
  },
]

function ActivityBar({ level, color }: { level: 'alta' | 'media' | 'variable'; color: string }) {
  const segments = 3
  const activeSegments = level === 'alta' ? 3 : level === 'media' ? 2 : 1

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[#64748b] text-xs uppercase tracking-wider mr-1">
        Actividad {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 * i }}
            className="h-2 rounded-full origin-left"
            style={{
              width: i === 0 ? '20px' : i === 1 ? '28px' : '36px',
              backgroundColor: i < activeSegments ? color : 'rgba(100, 116, 139, 0.2)',
              boxShadow: i < activeSegments ? `0 0 6px ${color}40` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
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
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const toggleExpand = (name: string) => {
    setExpandedCard(prev => (prev === name ? null : name))
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-14">
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {factions.map((faction) => {
            const IconComponent = faction.icon
            const isExpanded = expandedCard === faction.name

            return (
              <motion.div
                key={faction.name}
                variants={cardVariants}
                layout
                className="group relative bg-[#0f172a] rounded-xl cursor-pointer transition-shadow duration-500 overflow-hidden"
                style={{
                  border: `1px solid ${faction.borderColor}`,
                  boxShadow: faction.glowClass,
                }}
                onClick={() => toggleExpand(faction.name)}
              >
                {/* Colored left border accent */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl z-10"
                  style={{ backgroundColor: faction.color }}
                />

                {/* Hover glow intensification */}
                <div
                  className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: faction.glowClass.replace(/0 0 10px/g, '0 0 20px').replace(/0 0 30px/g, '0 0 60px'),
                  }}
                />

                <div className="relative p-5 sm:p-6 pl-6 sm:pl-7">
                  {/* 2-column layout on sm+ */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Left Column: Icon + Name + Members */}
                    <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-3 sm:min-w-[160px]">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
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
                      <div className="flex flex-col">
                        <h3
                          className="text-xl font-bold transition-colors duration-300"
                          style={{ color: faction.color }}
                        >
                          {faction.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Users className="w-3.5 h-3.5" style={{ color: faction.color }} />
                          <span className="text-[#94a3b8] text-sm">{faction.members}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Description + Requirements + Tags */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[#cbd5e1] text-sm leading-relaxed mb-3">
                        {faction.description}
                      </p>

                      {/* Requirements */}
                      <div className="flex items-center gap-2 mb-3">
                        <Lock className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
                        <span className="text-[#94a3b8] text-xs">{faction.requirements}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {faction.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md text-xs font-medium"
                            style={{
                              backgroundColor: `${faction.color}15`,
                              color: faction.color,
                              border: `1px solid ${faction.color}25`,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Activity Bar */}
                      <ActivityBar level={faction.activity} color={faction.color} />
                    </div>
                  </div>

                  {/* Expand indicator */}
                  <div className="flex justify-center mt-3">
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4 text-[#64748b]" />
                    </motion.div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div
                          className="mt-4 pt-4 border-t"
                          style={{ borderColor: `${faction.color}20` }}
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Details section */}
                            <div>
                              <h4
                                className="text-sm font-semibold mb-2"
                                style={{ color: faction.color }}
                              >
                                Sobre la facción
                              </h4>
                              <p className="text-[#94a3b8] text-xs leading-relaxed">
                                {faction.name === 'Policía' && 'Como miembro del LSPD, serás responsable de mantener el orden público, responder a llamadas de emergencia, realizar arrestos legítimos y participar en operativos especiales. Tu integridad y profesionalismo son fundamentales.'}
                                {faction.name === 'EMS' && 'El equipo médico de Los Santos atiende desde emergencias menores hasta cirugías complejas. Debes mantener la calma bajo presión y priorizar la vida de los ciudadanos en todo momento.'}
                                {faction.name === 'FBI' && 'Los agentes federales lideran investigaciones de alto perfil, operaciones encubiertas y vigilancia avanzada. Se requiere discreción, inteligencia analítica y capacidad de trabajo en equipo.'}
                                {faction.name === 'Mecánico' && 'Los mecánicos mantienen la ciudad en movimiento. Desde reparaciones básicas hasta tuning avanzado y remolques, tu taller será el corazón de la industria automotriz de Los Santos.'}
                                {faction.name === 'Crimen Organizado' && 'Las organizaciones criminales controlan territorios, negocios clandestinos y redes de influencia. Solo los más astutos y leales sobreviven en las sombras de la ciudad.'}
                                {faction.name === 'Civil' && 'Los ciudadanos son el corazón de Los Santos. Puedes ser empresario, trabajador, estudiante o lo que desees. La ciudad es tuya para explorar y construir tu historia.'}
                              </p>
                            </div>

                            {/* Stats section */}
                            <div>
                              <h4
                                className="text-sm font-semibold mb-2"
                                style={{ color: faction.color }}
                              >
                                Requisitos de ingreso
                              </h4>
                              <ul className="space-y-1.5">
                                {faction.requirements.includes('Invitación') ? (
                                  <>
                                    <li className="text-[#94a3b8] text-xs flex items-start gap-2">
                                      <span style={{ color: faction.color }}>•</span>
                                      Invitación directa de un miembro activo
                                    </li>
                                    <li className="text-[#94a3b8] text-xs flex items-start gap-2">
                                      <span style={{ color: faction.color }}>•</span>
                                      Período de prueba obligatorio
                                    </li>
                                    <li className="text-[#94a3b8] text-xs flex items-start gap-2">
                                      <span style={{ color: faction.color }}>•</span>
                                      Compromiso de actividad semanal
                                    </li>
                                  </>
                                ) : faction.requirements.includes('formación') ? (
                                  <>
                                    <li className="text-[#94a3b8] text-xs flex items-start gap-2">
                                      <span style={{ color: faction.color }}>•</span>
                                      Whitelist del servidor aprobada
                                    </li>
                                    <li className="text-[#94a3b8] text-xs flex items-start gap-2">
                                      <span style={{ color: faction.color }}>•</span>
                                      Formación médica certificada IC
                                    </li>
                                    <li className="text-[#94a3b8] text-xs flex items-start gap-2">
                                      <span style={{ color: faction.color }}>•</span>
                                      Entrevista con el director médico
                                    </li>
                                  </>
                                ) : faction.requirements.includes('examen') ? (
                                  <>
                                    <li className="text-[#94a3b8] text-xs flex items-start gap-2">
                                      <span style={{ color: faction.color }}>•</span>
                                      Whitelist del servidor aprobada
                                    </li>
                                    <li className="text-[#94a3b8] text-xs flex items-start gap-2">
                                      <span style={{ color: faction.color }}>•</span>
                                      Examen de aptitud física y mental
                                    </li>
                                    <li className="text-[#94a3b8] text-xs flex items-start gap-2">
                                      <span style={{ color: faction.color }}>•</span>
                                      Evaluación de antecedentes IC
                                    </li>
                                  </>
                                ) : faction.requirements.includes('conducir') ? (
                                  <>
                                    <li className="text-[#94a3b8] text-xs flex items-start gap-2">
                                      <span style={{ color: faction.color }}>•</span>
                                      Whitelist del servidor aprobada
                                    </li>
                                    <li className="text-[#94a3b8] text-xs flex items-start gap-2">
                                      <span style={{ color: faction.color }}>•</span>
                                      Prueba de conducción práctica
                                    </li>
                                    <li className="text-[#94a3b8] text-xs flex items-start gap-2">
                                      <span style={{ color: faction.color }}>•</span>
                                      Academia policial completada
                                    </li>
                                  </>
                                ) : (
                                  <>
                                    <li className="text-[#94a3b8] text-xs flex items-start gap-2">
                                      <span style={{ color: faction.color }}>•</span>
                                      Whitelist del servidor aprobada
                                    </li>
                                    <li className="text-[#94a3b8] text-xs flex items-start gap-2">
                                      <span style={{ color: faction.color }}>•</span>
                                      Compromiso de rol activo
                                    </li>
                                    <li className="text-[#94a3b8] text-xs flex items-start gap-2">
                                      <span style={{ color: faction.color }}>•</span>
                                      Respeto a las normas del servidor
                                    </li>
                                  </>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
