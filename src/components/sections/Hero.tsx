'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronRight, Shield, Star, Users, Zap } from 'lucide-react'
import { useNavigation } from '@/lib/navigation'
import ParticleCanvas from '@/components/layout/ParticleCanvas'

const taglines = [
  'Vive la experiencia de roleplay definitiva',
  'Tu historia comienza en Los Santos',
  'Comunidad, acción y roleplay',
  'Únete a cientos de jugadores',
]

function useTypingEffect() {
  const [text, setText] = useState('')
  const [taglineIndex, setTaglineIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentTagline = taglines[taglineIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting) {
      if (text.length < currentTagline.length) {
        timeout = setTimeout(() => {
          setText(currentTagline.slice(0, text.length + 1))
        }, 40)
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true)
        }, 2000)
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(currentTagline.slice(0, text.length - 1))
        }, 25)
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false)
          setTaglineIndex((prev) => (prev + 1) % taglines.length)
        }, 300)
      }
    }

    return () => clearTimeout(timeout)
  }, [text, taglineIndex, isDeleting])

  return text
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

// Floating geometric shapes — hexagons, triangles, diamonds
const geoShapes = [
  {
    type: 'hexagon',
    pos: 'top-[12%] left-[10%]',
    size: 'w-12 h-12 sm:w-16 sm:h-16',
    color: 'border-[#7c3aed]',
    anim: 'geoFloat1',
    duration: '8s',
    delay: '0s',
  },
  {
    type: 'diamond',
    pos: 'top-[65%] left-[82%]',
    size: 'w-10 h-10 sm:w-14 sm:h-14',
    color: 'border-[#06b6d4]',
    anim: 'geoFloat2',
    duration: '10s',
    delay: '1.5s',
  },
  {
    type: 'triangle',
    pos: 'top-[30%] left-[88%]',
    size: 'w-14 h-14 sm:w-20 sm:h-20',
    color: 'border-[#f59e0b]',
    anim: 'geoFloat3',
    duration: '9s',
    delay: '0.8s',
  },
  {
    type: 'hexagon',
    pos: 'top-[78%] left-[18%]',
    size: 'w-8 h-8 sm:w-12 sm:h-12',
    color: 'border-[#06b6d4]',
    anim: 'geoFloat4',
    duration: '11s',
    delay: '2.5s',
  },
]

// Quick stats shown below the CTA buttons
const quickStats = [
  { icon: Users, value: '500+', label: 'Jugadores', color: '#7c3aed' },
  { icon: Zap, value: '24/7', label: 'Online', color: '#22c55e' },
  { icon: Star, value: '99.8%', label: 'Uptime', color: '#06b6d4' },
]

function HeroSubtitle() {
  const typedText = useTypingEffect()

  return (
    <motion.p
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
      className="text-lg sm:text-xl md:text-2xl text-[#94a3b8] max-w-2xl mb-8 sm:mb-10 min-h-[2.5rem] sm:min-h-[3rem]"
    >
      {typedText}
      <span className="text-[#06b6d4] animate-pulse ml-0.5" aria-hidden="true">|</span>
    </motion.p>
  )
}

/** Orbiting ring with glowing orbs around the logo */
function LogoOrbitRing() {
  const orbitRadius = 'clamp(70px, 10vw, 110px)'

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Outer orbit ring (visual track) */}
      <div
        className="absolute rounded-full border border-[#7c3aed]/20"
        style={{
          width: `calc(${orbitRadius} * 2 + 8px)`,
          height: `calc(${orbitRadius} * 2 + 8px)`,
        }}
      />

      {/* Inner orbit ring (visual track, reverse) */}
      <div
        className="absolute rounded-full border border-[#06b6d4]/15"
        style={{
          width: `calc(${orbitRadius} * 2 - 30px)`,
          height: `calc(${orbitRadius} * 2 - 30px)`,
        }}
      />

      {/* Third orbit ring — outermost, very faint */}
      <div
        className="absolute rounded-full border border-[#f59e0b]/8"
        style={{
          width: `calc(${orbitRadius} * 2 + 40px)`,
          height: `calc(${orbitRadius} * 2 + 40px)`,
        }}
      />

      {/* Orbiting orbs - ring 1 (purple) */}
      <div
        className="absolute"
        style={{
          width: `calc(${orbitRadius} * 2)`,
          height: `calc(${orbitRadius} * 2)`,
          animation: 'orbitSpin 8s linear infinite',
        }}
      >
        {/* Orb 1 */}
        <div
          className="absolute w-3 h-3 rounded-full bg-[#7c3aed] shadow-[0_0_12px_rgba(124,58,237,0.8),0_0_24px_rgba(124,58,237,0.4)]"
          style={{ top: '-6px', left: '50%', transform: 'translateX(-50%)' }}
        />
        {/* Orb 2 */}
        <div
          className="absolute w-2 h-2 rounded-full bg-[#a78bfa] shadow-[0_0_8px_rgba(167,139,250,0.8),0_0_16px_rgba(167,139,250,0.4)]"
          style={{ bottom: '-4px', left: '50%', transform: 'translateX(-50%)' }}
        />
      </div>

      {/* Orbiting orbs - ring 2 (cyan, reverse) */}
      <div
        className="absolute"
        style={{
          width: `calc(${orbitRadius} * 2 - 30px)`,
          height: `calc(${orbitRadius} * 2 - 30px)`,
          animation: 'orbitSpinReverse 12s linear infinite',
        }}
      >
        {/* Orb 3 */}
        <div
          className="absolute w-2.5 h-2.5 rounded-full bg-[#06b6d4] shadow-[0_0_10px_rgba(6,182,212,0.8),0_0_20px_rgba(6,182,212,0.4)]"
          style={{ top: '-5px', right: '20%', transform: 'translateX(50%)' }}
        />
      </div>

      {/* Orbiting orbs - ring 3 (amber, slowest) */}
      <div
        className="absolute"
        style={{
          width: `calc(${orbitRadius} * 2 + 40px)`,
          height: `calc(${orbitRadius} * 2 + 40px)`,
          animation: 'orbitSpin 20s linear infinite',
        }}
      >
        <div
          className="absolute w-1.5 h-1.5 rounded-full bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.8),0_0_16px_rgba(245,158,11,0.4)]"
          style={{ top: '-3px', left: '30%' }}
        />
      </div>

      {/* Logo itself */}
      <div className="animate-pulse-glow rounded-full p-1 relative z-10">
        <img
          src="/prestigio-logo.png"
          alt="Prestigio Roleplay Logo"
          className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain drop-shadow-[0_0_25px_rgba(124,58,237,0.5)]"
        />
      </div>
    </div>
  )
}

/** Renders a geometric shape based on type */
function GeoShape({ type, color }: { type: string; color: string }) {
  if (type === 'hexagon') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        <polygon
          points="50,3 95,25 95,75 50,97 5,75 5,25"
          className={color}
          strokeWidth="1.5"
          stroke="currentColor"
          fill="none"
        />
      </svg>
    )
  }
  if (type === 'diamond') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        <rect
          x="15"
          y="15"
          width="70"
          height="70"
          className={color}
          strokeWidth="1.5"
          stroke="currentColor"
          fill="none"
          transform="rotate(45 50 50)"
        />
      </svg>
    )
  }
  if (type === 'triangle') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
        <polygon
          points="50,8 95,90 5,90"
          className={color}
          strokeWidth="1.5"
          stroke="currentColor"
          fill="none"
        />
      </svg>
    )
  }
  return null
}

/** Hero badge — SERVIDOR ACTIVO */
function HeroBadge() {
  return (
    <motion.div
      variants={fadeInUp}
      transition={{ duration: 0.6 }}
      className="mb-4 sm:mb-6"
    >
      <div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/5 text-sm sm:text-base text-[#22c55e] font-medium"
        style={{ animation: 'badgePulse 3s ease-in-out infinite' }}
      >
        <span
          className="w-2 h-2 rounded-full bg-[#22c55e] inline-block"
          style={{ animation: 'greenDotPulse 1.5s ease-in-out infinite' }}
        />
        🌙 SERVIDOR ACTIVO
      </div>
    </motion.div>
  )
}

export default function Hero() {
  const navigate = useNavigation((s) => s.navigate)
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, 50])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0f172a] to-[#030712]" />

      {/* Background city image with parallax */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{ y: backgroundY }}
      >
        <img src="/gallery/city-night.png" alt="" className="w-full h-full object-cover scale-110" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#030712]/70 to-[#030712]" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern" />

      {/* Radial glow — center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15)_0%,transparent_70%)]" />
      {/* Radial glow — bottom left amber tint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(245,158,11,0.06)_0%,transparent_50%)]" />
      {/* Radial glow — top right cyan tint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(6,182,212,0.08)_0%,transparent_50%)]" />

      {/* Canvas-based particle system */}
      <ParticleCanvas />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {geoShapes.map((shape, i) => (
          <div
            key={`geo-${i}`}
            className={`absolute ${shape.pos} ${shape.size} ${shape.color}`}
            style={{
              animation: `${shape.anim} ${shape.duration} ease-in-out ${shape.delay} infinite`,
            }}
          >
            <GeoShape type={shape.type} color={shape.color} />
          </div>
        ))}
      </div>

      {/* Main content — with parallax fade */}
      <motion.div
        className="relative flex flex-col items-center text-center px-4 sm:px-6"
        style={{ zIndex: 10, opacity: contentOpacity, y: contentY }}
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Hero Badge */}
        <HeroBadge />

        {/* Logo with orbit ring */}
        <motion.div variants={fadeInUp} transition={{ duration: 0.6 }} className="mb-6 sm:mb-8">
          <LogoOrbitRing />
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-wider neon-text-glow text-white mb-4 sm:mb-6"
        >
          PRESTIGIO <span className="text-[#7c3aed]">ROLEPLAY</span>
        </motion.h1>

        {/* Subtitle with typing effect */}
        <HeroSubtitle />

        {/* Dual CTA Buttons */}
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          {/* Discord CTA — Primary filled */}
          <a
            href="https://discord.gg/vGpKd6yt8M"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[#7c3aed] text-white font-bold text-lg sm:text-xl transition-all duration-300 hover:bg-[#6d28d9] hover:shadow-[0_0_30px_rgba(124,58,237,0.5),0_0_60px_rgba(124,58,237,0.2)] active:scale-95"
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Unirse a Discord
            <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>

          {/* Whitelist CTA — Outlined/ghost variant with neon border */}
          <button
            onClick={() => navigate('whitelist')}
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-[#06b6d4]/50 text-[#06b6d4] font-bold text-lg sm:text-xl transition-all duration-300 hover:border-[#06b6d4] hover:bg-[#06b6d4]/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.3),0_0_60px_rgba(6,182,212,0.1)] active:scale-95 bg-transparent"
          >
            <Shield className="w-6 h-6 sm:w-7 sm:h-7" />
            Solicitar Whitelist
            <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* Quick stats row */}
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-6 sm:gap-10 mt-10 sm:mt-12"
        >
          {quickStats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex items-center gap-2 text-[#94a3b8]">
                <Icon className="w-4 h-4" style={{ color: stat.color }} />
                <span className="font-bold text-white text-sm sm:text-base" style={{ textShadow: `0 0 8px ${stat.color}40` }}>
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm">{stat.label}</span>
              </div>
            )
          })}
        </motion.div>

        {/* Scroll indicator with text */}
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-[#7c3aed]/50 flex items-start justify-center p-1.5">
            <motion.div
              className="w-1.5 h-2.5 rounded-full bg-[#7c3aed]"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <span
            className="text-xs sm:text-sm text-[#7c3aed]/60 font-medium tracking-widest uppercase"
            style={{ animation: 'scrollBounce 2s ease-in-out infinite' }}
          >
            Descubre más
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}
