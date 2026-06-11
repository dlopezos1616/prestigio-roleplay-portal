'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, MessageSquare } from 'lucide-react'

interface Testimonial {
  text: string
  author: string
  faction: string
  factionColor: string
}

const testimonials: Testimonial[] = [
  {
    text: 'El mejor servidor de RP en español. La comunidad es increíble y siempre hay algo interesante que hacer en la ciudad.',
    author: 'Carlos M.',
    faction: 'Civil',
    factionColor: '#94a3b8',
  },
  {
    text: 'Desde que entré a la policía, cada patrulla es una aventura distinta. El roleplay aquí es de otro nivel.',
    author: 'Alex R.',
    faction: 'LSPD',
    factionColor: '#3b82f6',
  },
  {
    text: 'El equipo de EMS me hizo sentir welcome desde el primer día. La formación y el compañerismo son excepcionales.',
    author: 'María L.',
    faction: 'EMS',
    factionColor: '#22c55e',
  },
  {
    text: 'Los eventos de carreras son épicos. Nunca me aburro aquí, siempre hay algo emocionante esperándote.',
    author: 'David K.',
    faction: 'Civil',
    factionColor: '#94a3b8',
  },
  {
    text: 'Ser parte del FBI ha sido la experiencia de RP más intensa que he tenido. Las investigaciones son increíbles.',
    author: 'Sergio P.',
    faction: 'FBI',
    factionColor: '#f59e0b',
  },
  {
    text: 'El staff siempre está atento y las actualizaciones son constantes. Se nota el esfuerzo y la dedicación.',
    author: 'Laura T.',
    faction: 'Mecánico',
    factionColor: '#f97316',
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState(1)

  const goToNext = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }, [])

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(goToNext, 5000)
    return () => clearInterval(interval)
  }, [isPaused, goToNext])

  const current = testimonials[currentIndex]

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.95,
    }),
  }

  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0f172a] to-[#030712]" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Decorative glow orbs */}
      <div className="absolute top-1/3 -left-32 w-72 h-72 bg-[#06b6d4]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 -right-32 w-72 h-72 bg-[#7c3aed]/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section title */}
        <motion.div
          className="text-center mb-14 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 bg-[#06b6d4]/10 border border-[#06b6d4]/20 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <MessageSquare className="w-8 h-8 text-[#06b6d4]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Lo Que Dicen Nuestros{' '}
            <span className="text-[#06b6d4]">Jugadores</span>
          </h2>
          <p className="text-[#94a3b8] text-base sm:text-lg max-w-2xl mx-auto">
            Historias reales de nuestra comunidad
          </p>
          <div
            className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] mt-6"
            style={{ boxShadow: '0 0 15px rgba(6,182,212,0.5)' }}
          />
        </motion.div>

        {/* Testimonial carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Main testimonial card */}
          <div className="relative min-h-[280px] sm:min-h-[260px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <div
                  className="relative h-full rounded-xl bg-[#0f172a] p-6 sm:p-10 transition-all duration-300 overflow-hidden"
                  style={{
                    border: '1px solid transparent',
                    backgroundImage:
                      'linear-gradient(#0f172a, #0f172a), linear-gradient(135deg, #7c3aed, #06b6d4)',
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box',
                    boxShadow:
                      '0 0 25px rgba(124,58,237,0.1), 0 0 50px rgba(6,182,212,0.05)',
                  }}
                >
                  {/* Top gradient border glow */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] rounded-full"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)',
                      boxShadow:
                        '0 0 15px rgba(124,58,237,0.5), 0 0 15px rgba(6,182,212,0.5)',
                    }}
                  />

                  {/* Quote icon */}
                  <div className="mb-5">
                    <Quote className="w-10 h-10 text-[#06b6d4]/30" />
                  </div>

                  {/* Testimonial text */}
                  <p className="text-white/90 text-base sm:text-lg leading-relaxed italic mb-6 sm:mb-8">
                    &ldquo;{current.text}&rdquo;
                  </p>

                  {/* Author info */}
                  <div className="flex items-center gap-3">
                    {/* Avatar placeholder */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${current.factionColor}40, ${current.factionColor}20)`,
                        border: `1px solid ${current.factionColor}50`,
                      }}
                    >
                      {current.author.charAt(0)}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-white font-semibold text-sm sm:text-base">
                        {current.author}
                      </span>
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${current.factionColor}15`,
                          color: current.factionColor,
                          border: `1px solid ${current.factionColor}30`,
                        }}
                      >
                        {current.faction}
                      </span>
                    </div>
                  </div>

                  {/* Bottom gradient glow */}
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, #7c3aed50, #06b6d450, transparent)',
                    }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="relative cursor-pointer"
                aria-label={`Ir al testimonio ${index + 1}`}
              >
                <motion.div
                  className="rounded-full"
                  animate={{
                    width: index === currentIndex ? 28 : 10,
                    height: 10,
                    backgroundColor:
                      index === currentIndex ? '#06b6d4' : '#334155',
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={
                    index === currentIndex
                      ? {
                          boxShadow: '0 0 10px rgba(6,182,212,0.5)',
                        }
                      : {}
                  }
                />
              </button>
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="flex items-center justify-center mt-3">
            <span className="text-[#475569] text-xs">
              {isPaused ? '⏸ Pausado' : '⟳ Auto-reproduciendo'}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
