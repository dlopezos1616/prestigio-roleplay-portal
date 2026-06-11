'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Crown, Shield, Award, ChevronLeft, ChevronRight, Trophy, Heart, Swords, Briefcase } from 'lucide-react'
import ScrollReveal from '@/components/layout/ScrollReveal'

interface FeaturedMember {
  id: number
  name: string
  role: string
  faction: string
  bio: string
  avatar: string
  badge: 'top-roleplayer' | 'staff-member' | 'community-star' | 'veteran'
  stats: { label: string; value: string }[]
  accentColor: string
}

const featuredMembers: FeaturedMember[] = [
  {
    id: 1,
    name: 'Carlos "Shadow" Mendoza',
    role: 'Líder de Facción',
    faction: 'LSPD',
    bio: 'Comandante de la LSPD con más de 2 años de servicio. Conocido por sus operativos encubiertos y su dedicación al roleplay policial.',
    avatar: '👮',
    badge: 'top-roleplayer',
    stats: [
      { label: 'Horas RP', value: '2,450+' },
      { label: 'Casos resueltos', value: '340+' },
      { label: 'Rango', value: 'Comandante' },
    ],
    accentColor: '#06b6d4',
  },
  {
    id: 2,
    name: 'María "Nova" García',
    role: 'Directora Médica',
    faction: 'EMS',
    bio: 'Jefa de emergencias del hospital central. Su rapidez y profesionalismo han salvado incontables vidas en Los Santos.',
    avatar: '👩‍⚕️',
    badge: 'community-star',
    stats: [
      { label: 'Rescates', value: '890+' },
      { label: 'Horas RP', value: '1,800+' },
      { label: 'Rango', value: 'Directora' },
    ],
    accentColor: '#22c55e',
  },
  {
    id: 3,
    name: 'Diego "Phantom" Ruiz',
    role: 'Agente Especial',
    faction: 'FBI',
    bio: 'Agente encubierto del FBI especializado en infiltraciones. Sus investigaciones han desarticulado las redes criminales más peligrosas.',
    avatar: '🕵️',
    badge: 'veteran',
    stats: [
      { label: 'Operaciones', value: '150+' },
      { label: 'Años activo', value: '3+' },
      { label: 'Rango', value: 'Agente Sr.' },
    ],
    accentColor: '#f59e0b',
  },
  {
    id: 4,
    name: 'Laura "Viper" Sánchez',
    role: 'Staff Senior',
    faction: 'Staff',
    bio: 'Miembro del equipo de staff desde los inicios del servidor. Referente en la comunidad por su imparcialidad y dedicación.',
    avatar: '⚔️',
    badge: 'staff-member',
    stats: [
      { label: 'Tickets resueltos', value: '2,100+' },
      { label: 'Horas Staff', value: '3,200+' },
      { label: 'Rango', value: 'Admin Sr.' },
    ],
    accentColor: '#7c3aed',
  },
  {
    id: 5,
    name: 'Andrés "Turbo" López',
    role: 'Piloto Profesional',
    faction: 'Civiles',
    bio: 'El mejor piloto de carreras del servidor. Campeón de las últimas 3 temporadas de carreras nocturnas en Los Santos.',
    avatar: '🏎️',
    badge: 'top-roleplayer',
    stats: [
      { label: 'Carreras ganadas', value: '78' },
      { label: 'Títulos', value: '3x Camp.' },
      { label: 'Horas RP', value: '1,500+' },
    ],
    accentColor: '#ef4444',
  },
]

const badgeConfig = {
  'top-roleplayer': { label: 'Top Roleplayer', icon: Trophy, color: '#f59e0b' },
  'staff-member': { label: 'Staff Destacado', icon: Shield, color: '#7c3aed' },
  'community-star': { label: 'Estrella Comunitaria', icon: Star, color: '#06b6d4' },
  'veteran': { label: 'Veterano', icon: Crown, color: '#22c55e' },
}

export default function MemberSpotlight() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextMember = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredMembers.length)
  }, [])

  const prevMember = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + featuredMembers.length) % featuredMembers.length)
  }, [])

  // Auto-rotate every 6 seconds
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(nextMember, 6000)
    return () => clearInterval(interval)
  }, [isPaused, nextMember])

  const member = featuredMembers[currentIndex]
  const badge = badgeConfig[member.badge]
  const BadgeIcon = badge.icon

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.08)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-5xl">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
            >
              <span className="text-[#7c3aed] neon-text-glow">Miembros</span>{' '}
              Destacados
            </motion.h2>
            <p className="text-[#94a3b8] text-lg flex items-center justify-center gap-2">
              <Award className="w-5 h-5 text-[#f59e0b]" />
              La comunidad que hace posible Prestigio RP
            </p>
            <div
              className="mt-4 h-0.5 mx-auto max-w-[120px] rounded-full bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent"
              style={{ boxShadow: '0 0 10px rgba(124,58,237,0.5)' }}
            />
          </div>
        </ScrollReveal>

        {/* Featured Member Card */}
        <ScrollReveal direction="scale" delay={0.2}>
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -60, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative rounded-2xl overflow-hidden neon-card-animated"
              >
                <div className="relative p-6 sm:p-8 bg-[#0f172a]/90 backdrop-blur-xl">
                  {/* Background glow */}
                  <div
                    className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-10"
                    style={{ backgroundColor: member.accentColor }}
                  />

                  <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-8">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-5xl sm:text-6xl relative"
                        style={{
                          backgroundColor: `${member.accentColor}15`,
                          border: `2px solid ${member.accentColor}40`,
                          boxShadow: `0 0 20px ${member.accentColor}20, 0 0 40px ${member.accentColor}10`,
                        }}
                      >
                        {member.avatar}
                        {/* Animated ring */}
                        <div
                          className="absolute inset-0 rounded-2xl animate-pulse-glow"
                          style={{
                            boxShadow: `0 0 15px ${member.accentColor}30, 0 0 30px ${member.accentColor}15`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                      {/* Badge */}
                      <div
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-3"
                        style={{
                          backgroundColor: `${badge.color}15`,
                          border: `1px solid ${badge.color}30`,
                          color: badge.color,
                        }}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        {badge.label}
                      </div>

                      {/* Name */}
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                        {member.name}
                      </h3>

                      {/* Role & Faction */}
                      <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                        <span
                          className="text-sm font-medium"
                          style={{ color: member.accentColor }}
                        >
                          {member.role}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="flex items-center gap-1 text-sm text-gray-400">
                          <Swords className="w-3.5 h-3.5" />
                          {member.faction}
                        </span>
                      </div>

                      {/* Bio */}
                      <p className="text-[#94a3b8] text-sm sm:text-base leading-relaxed mb-4 max-w-lg">
                        {member.bio}
                      </p>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                        {member.stats.map((stat) => (
                          <div
                            key={stat.label}
                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                            style={{
                              boxShadow: `inset 0 0 10px ${member.accentColor}05`,
                            }}
                          >
                            <p className="text-lg font-bold" style={{ color: member.accentColor }}>
                              {stat.value}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <button
              onClick={prevMember}
              className="absolute left-2 sm:-left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-[#0f172a]/80 border border-[#7c3aed]/20 text-gray-400 hover:text-white hover:border-[#7c3aed]/50 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all backdrop-blur-sm"
              aria-label="Miembro anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMember}
              className="absolute right-2 sm:-right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-[#0f172a]/80 border border-[#7c3aed]/20 text-gray-400 hover:text-white hover:border-[#7c3aed]/50 hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all backdrop-blur-sm"
              aria-label="Siguiente miembro"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </ScrollReveal>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {featuredMembers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-2 bg-[#7c3aed] shadow-[0_0_8px_rgba(124,58,237,0.5)]'
                  : 'w-2 h-2 bg-gray-700 hover:bg-gray-500'
              }`}
              aria-label={`Ver miembro ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
