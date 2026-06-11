'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Heart, Eye, Wrench, Skull, User, Users, ChevronDown, Lock, TrendingUp, Award, Clock, Star } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface FactionRank {
  name: string
  level: number
}

interface Faction {
  name: string
  icon: LucideIcon
  color: string
  description: string
  members: string
  memberCount: number
  maxMembers: number
  requirements: string
  activity: 'alta' | 'media' | 'variable'
  tags: string[]
  borderColor: string
  glowClass: string
  ranks: FactionRank[]
  weeklyOps: number
  leader: string
  about: string
  joinSteps: string[]
}

const factions: Faction[] = [
  {
    name: 'Policía',
    icon: Shield,
    color: '#06b6d4',
    description: 'Protege y sirve a la ciudad de Los Santos',
    members: '32 miembros',
    memberCount: 32,
    maxMembers: 40,
    requirements: 'Whitelist + prueba de conducir',
    activity: 'alta',
    tags: ['Patrulla', 'Persecución', 'Control de tráfico'],
    borderColor: 'rgba(6, 182, 212, 0.4)',
    glowClass: '0 0 10px rgba(6, 182, 212, 0.3), 0 0 30px rgba(6, 182, 212, 0.15), inset 0 0 10px rgba(6, 182, 212, 0.05)',
    ranks: [
      { name: 'Cadete', level: 1 },
      { name: 'Agente', level: 2 },
      { name: 'Sargento', level: 3 },
      { name: 'Teniente', level: 4 },
      { name: 'Capitán', level: 5 },
      { name: 'Comisario', level: 6 },
    ],
    weeklyOps: 15,
    leader: 'Comisario Martínez',
    about: 'Como miembro del LSPD, serás responsable de mantener el orden público, responder a llamadas de emergencia, realizar arrestos legítimos y participar en operativos especiales. Tu integridad y profesionalismo son fundamentales.',
    joinSteps: ['Whitelist del servidor aprobada', 'Prueba de conducción práctica', 'Academia policial completada'],
  },
  {
    name: 'EMS',
    icon: Heart,
    color: '#22c55e',
    description: 'Salva vidas y atiende emergencias críticas',
    members: '18 miembros',
    memberCount: 18,
    maxMembers: 25,
    requirements: 'Whitelist + formación médica',
    activity: 'media',
    tags: ['Rescate', 'Cirugía', 'Trauma'],
    borderColor: 'rgba(34, 197, 94, 0.4)',
    glowClass: '0 0 10px rgba(34, 197, 94, 0.3), 0 0 30px rgba(34, 197, 94, 0.15), inset 0 0 10px rgba(34, 197, 94, 0.05)',
    ranks: [
      { name: 'Practicante', level: 1 },
      { name: 'Paramédico', level: 2 },
      { name: 'Médico', level: 3 },
      { name: 'Cirujano', level: 4 },
      { name: 'Director Médico', level: 5 },
    ],
    weeklyOps: 20,
    leader: 'Dra. Rodríguez',
    about: 'El equipo médico de Los Santos atiende desde emergencias menores hasta cirugías complejas. Debes mantener la calma bajo presión y priorizar la vida de los ciudadanos en todo momento.',
    joinSteps: ['Whitelist del servidor aprobada', 'Formación médica certificada IC', 'Entrevista con el director médico'],
  },
  {
    name: 'FBI',
    icon: Eye,
    color: '#f59e0b',
    description: 'Investigaciones de alto nivel y operaciones encubiertas',
    members: '12 miembros',
    memberCount: 12,
    maxMembers: 16,
    requirements: 'Whitelist + examen de aptitud',
    activity: 'media',
    tags: ['Investigación', 'Vigilancia', 'Encubierto'],
    borderColor: 'rgba(245, 158, 11, 0.4)',
    glowClass: '0 0 10px rgba(245, 158, 11, 0.3), 0 0 30px rgba(245, 158, 11, 0.15), inset 0 0 10px rgba(245, 158, 11, 0.05)',
    ranks: [
      { name: 'Analista', level: 1 },
      { name: 'Agente Especial', level: 2 },
      { name: 'Agente Superior', level: 3 },
      { name: 'Supervisor', level: 4 },
      { name: 'Director Adjunto', level: 5 },
    ],
    weeklyOps: 8,
    leader: 'Dir. Adjunto Thompson',
    about: 'Los agentes federales lideran investigaciones de alto perfil, operaciones encubiertas y vigilancia avanzada. Se requiere discreción, inteligencia analítica y capacidad de trabajo en equipo.',
    joinSteps: ['Whitelist del servidor aprobada', 'Examen de aptitud física y mental', 'Evaluación de antecedentes IC'],
  },
  {
    name: 'Mecánico',
    icon: Wrench,
    color: '#f97316',
    description: 'Repara y personaliza vehículos de la ciudad',
    members: '15 miembros',
    memberCount: 15,
    maxMembers: 20,
    requirements: 'Whitelist aprobada',
    activity: 'alta',
    tags: ['Reparación', 'Tuning', 'Remolque'],
    borderColor: 'rgba(249, 115, 22, 0.4)',
    glowClass: '0 0 10px rgba(249, 115, 22, 0.3), 0 0 30px rgba(249, 115, 22, 0.15), inset 0 0 10px rgba(249, 115, 22, 0.05)',
    ranks: [
      { name: 'Aprendiz', level: 1 },
      { name: 'Mecánico', level: 2 },
      { name: 'Especialista', level: 3 },
      { name: 'Maestro', level: 4 },
      { name: 'Jefe de Taller', level: 5 },
    ],
    weeklyOps: 25,
    leader: 'Jefe García',
    about: 'Los mecánicos mantienen la ciudad en movimiento. Desde reparaciones básicas hasta tuning avanzado y remolques, tu taller será el corazón de la industria automotriz de Los Santos.',
    joinSteps: ['Whitelist del servidor aprobada', 'Compromiso de rol activo', 'Respeto a las normas del servidor'],
  },
  {
    name: 'Crimen Organizado',
    icon: Skull,
    color: '#ef4444',
    description: 'Opera desde las sombras de la ciudad',
    members: '24 miembros',
    memberCount: 24,
    maxMembers: 30,
    requirements: 'Invitación exclusiva',
    activity: 'alta',
    tags: ['Negocios', 'Territorio', 'Influencia'],
    borderColor: 'rgba(239, 68, 68, 0.4)',
    glowClass: '0 0 10px rgba(239, 68, 68, 0.3), 0 0 30px rgba(239, 68, 68, 0.15), inset 0 0 10px rgba(239, 68, 68, 0.05)',
    ranks: [
      { name: 'Asociado', level: 1 },
      { name: 'Soldado', level: 2 },
      { name: 'Capitán', level: 3 },
      { name: 'Subjefe', level: 4 },
      { name: 'Don', level: 5 },
    ],
    weeklyOps: 12,
    leader: '???',
    about: 'Las organizaciones criminales controlan territorios, negocios clandestinos y redes de influencia. Solo los más astutos y leales sobreviven en las sombras de la ciudad.',
    joinSteps: ['Invitación directa de un miembro activo', 'Período de prueba obligatorio', 'Compromiso de actividad semanal'],
  },
  {
    name: 'Civil',
    icon: User,
    color: '#7c3aed',
    description: 'Vive tu vida en la ciudad a tu manera',
    members: '200+ miembros',
    memberCount: 200,
    maxMembers: 999,
    requirements: 'Whitelist aprobada',
    activity: 'variable',
    tags: ['Trabajos', 'Negocios', 'Vida social'],
    borderColor: 'rgba(124, 58, 237, 0.4)',
    glowClass: '0 0 10px rgba(124, 58, 237, 0.3), 0 0 30px rgba(124, 58, 237, 0.15), inset 0 0 10px rgba(124, 58, 237, 0.05)',
    ranks: [
      { name: 'Recién llegado', level: 1 },
      { name: 'Residente', level: 2 },
      { name: 'Ciudadano', level: 3 },
      { name: 'Empresario', level: 4 },
      { name: 'Veterano', level: 5 },
    ],
    weeklyOps: 40,
    leader: 'N/A — Comunidad libre',
    about: 'Los ciudadanos son el corazón de Los Santos. Puedes ser empresario, trabajador, estudiante o lo que desees. La ciudad es tuya para explorar y construir tu historia.',
    joinSteps: ['Whitelist del servidor aprobada', 'Compromiso de rol activo', 'Respeto a las normas del servidor'],
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

function MemberCapacityBar({ current, max, color }: { current: number; max: number; color: string }) {
  const pct = Math.min((current / max) * 100, 100)

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}80)`,
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      </div>
      <span className="text-[10px] text-[#64748b] whitespace-nowrap">
        {current}/{max}
      </span>
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
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0 bg-diagonal-lines opacity-[0.03]" />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-[#7c3aed]/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-[#06b6d4]/5 rounded-full blur-[150px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            <span className="text-[#7c3aed] neon-text-glow">Facciones</span>
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
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-4 h-0.5 mx-auto max-w-[120px] rounded-full bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent"
            style={{ boxShadow: '0 0 10px rgba(124,58,237,0.5)' }}
          />
        </div>

        {/* Faction Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-12"
        >
          <div className="flex items-center gap-2 text-[#94a3b8]">
            <Users className="w-4 h-4 text-[#7c3aed]" />
            <span className="text-sm">6 facciones activas</span>
          </div>
          <div className="flex items-center gap-2 text-[#94a3b8]">
            <TrendingUp className="w-4 h-4 text-[#06b6d4]" />
            <span className="text-sm">300+ miembros totales</span>
          </div>
          <div className="flex items-center gap-2 text-[#94a3b8]">
            <Award className="w-4 h-4 text-[#f59e0b]" />
            <span className="text-sm">120 operaciones semanales</span>
          </div>
        </motion.div>

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
                className="group relative bg-[#0f172a] rounded-xl cursor-pointer transition-shadow duration-500 overflow-hidden card-hover-lift"
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

                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] z-10"
                  style={{
                    background: `linear-gradient(90deg, ${faction.color}, transparent)`,
                  }}
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
                        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                        style={{
                          backgroundColor: `${faction.color}15`,
                          border: `1px solid ${faction.color}30`,
                          boxShadow: `0 0 0 0 ${faction.color}00`,
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
                        {/* Member capacity bar */}
                        <div className="mt-2 w-full max-w-[140px]">
                          <MemberCapacityBar current={faction.memberCount} max={faction.maxMembers} color={faction.color} />
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Description + Requirements + Tags + Stats */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[#cbd5e1] text-sm leading-relaxed mb-3">
                        {faction.description}
                      </p>

                      {/* Quick Stats Row */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-[#64748b]" />
                          <span className="text-[#94a3b8] text-xs">{faction.weeklyOps} ops/semana</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3 h-3 text-[#64748b]" />
                          <span className="text-[#94a3b8] text-xs">{faction.ranks.length} rangos</span>
                        </div>
                      </div>

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
                            className="px-2 py-0.5 rounded-md text-xs font-medium floating-badge"
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
                              <p className="text-[#94a3b8] text-xs leading-relaxed mb-3">
                                {faction.about}
                              </p>

                              {/* Leader info */}
                              <div className="flex items-center gap-2">
                                <Award className="w-3.5 h-3.5" style={{ color: faction.color }} />
                                <span className="text-xs text-[#64748b]">Líder:</span>
                                <span className="text-xs font-medium" style={{ color: faction.color }}>
                                  {faction.leader}
                                </span>
                              </div>
                            </div>

                            {/* Rank structure + Requirements */}
                            <div>
                              <h4
                                className="text-sm font-semibold mb-2"
                                style={{ color: faction.color }}
                              >
                                Escalafón de rangos
                              </h4>
                              <div className="space-y-1.5 mb-4">
                                {faction.ranks.map((rank, idx) => (
                                  <div
                                    key={rank.name}
                                    className="flex items-center gap-2"
                                  >
                                    <div
                                      className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold shrink-0"
                                      style={{
                                        backgroundColor: `${faction.color}${idx === faction.ranks.length - 1 ? '30' : '15'}`,
                                        color: faction.color,
                                        border: `1px solid ${faction.color}${idx === faction.ranks.length - 1 ? '50' : '25'}`,
                                      }}
                                    >
                                      {rank.level}
                                    </div>
                                    <span className={`text-xs ${idx === faction.ranks.length - 1 ? 'font-semibold' : ''}`} style={{ color: idx === faction.ranks.length - 1 ? faction.color : '#94a3b8' }}>
                                      {rank.name}
                                    </span>
                                    {idx === faction.ranks.length - 1 && (
                                      <Star className="w-3 h-3 ml-auto" style={{ color: faction.color }} />
                                    )}
                                  </div>
                                ))}
                              </div>

                              <h4
                                className="text-sm font-semibold mb-2"
                                style={{ color: faction.color }}
                              >
                                Requisitos de ingreso
                              </h4>
                              <ul className="space-y-1.5">
                                {faction.joinSteps.map((step) => (
                                  <li key={step} className="text-[#94a3b8] text-xs flex items-start gap-2">
                                    <span style={{ color: faction.color }}>•</span>
                                    {step}
                                  </li>
                                ))}
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
