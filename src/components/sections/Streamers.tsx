'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Tv, Youtube, Eye, Radio, ExternalLink, Users } from 'lucide-react'

interface Streamer {
  name: string
  avatar?: string
  platform: 'twitch' | 'youtube'
  followers: number
  isLive: boolean
  viewerCount?: number
  description: string
  gradient: string
}

const streamers: Streamer[] = [
  {
    name: 'RPKing_',
    platform: 'twitch',
    followers: 12400,
    isLive: true,
    viewerCount: 347,
    description: 'Especialista en persecuciones y acción',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    name: 'LaJoséRP',
    platform: 'twitch',
    followers: 8700,
    isLive: false,
    description: 'Roleplay policial de alto nivel',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    name: 'NightCityVibes',
    platform: 'youtube',
    followers: 15200,
    isLive: false,
    description: 'Documentales del mundo criminal de LS',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    name: 'DocMartinez',
    platform: 'twitch',
    followers: 5300,
    isLive: true,
    viewerCount: 128,
    description: 'EMS roleplay y rescates épicos',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    name: 'MecánicoMax',
    platform: 'youtube',
    followers: 3800,
    isLive: false,
    description: 'Tuning, carreras y mecánica avanzada',
    gradient: 'from-amber-500 to-yellow-500',
  },
  {
    name: 'ShadowOps',
    platform: 'twitch',
    followers: 6100,
    isLive: false,
    description: 'Operaciones encubiertas y espionaje',
    gradient: 'from-slate-500 to-gray-500',
  },
]

/* ── Twitch SVG Icon (inline, like Discord in Hero) ── */
function TwitchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  )
}

/* ── Counter animation hook ── */
function useCounter(target: number, duration: number = 2000, start: boolean = true) {
  const [count, setCount] = useState(0)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!start) return
    if (startedRef.current) return
    startedRef.current = true

    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [target, duration, start])

  return count
}

/* ── Format follower count ── */
function formatFollowers(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }
  return num.toString()
}

/* ── Platform badge component ── */
function PlatformBadge({ platform }: { platform: 'twitch' | 'youtube' }) {
  if (platform === 'twitch') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold"
        style={{
          backgroundColor: 'rgba(145, 70, 255, 0.2)',
          color: '#a78bfa',
          border: '1px solid rgba(145, 70, 255, 0.3)',
        }}
      >
        <TwitchIcon className="w-3.5 h-3.5" />
        Twitch
      </div>
    )
  }
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold"
      style={{
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        color: '#f87171',
        border: '1px solid rgba(239, 68, 68, 0.3)',
      }}
    >
      <Youtube className="w-3.5 h-3.5" />
      YouTube
    </div>
  )
}

/* ── Live indicator with ping ── */
function LiveIndicator({ viewerCount }: { viewerCount?: number }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
      style={{
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.4)',
      }}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"
        />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
      </span>
      <span className="text-red-400 font-bold text-xs uppercase tracking-wider">En Vivo</span>
      {viewerCount !== undefined && (
        <span className="flex items-center gap-1 text-red-300/80 text-xs">
          <Eye className="w-3 h-3" />
          {viewerCount}
        </span>
      )}
    </div>
  )
}

/* ── Offline indicator ── */
function OfflineIndicator() {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full"
      style={{
        backgroundColor: 'rgba(100, 116, 139, 0.15)',
        border: '1px solid rgba(100, 116, 139, 0.3)',
      }}
    >
      <span className="w-2 h-2 rounded-full bg-slate-500" />
      <span className="text-slate-400 text-xs font-medium">Offline</span>
    </div>
  )
}

/* ── Avatar with gradient fallback ── */
function StreamerAvatar({ streamer, size = 'md' }: { streamer: Streamer; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl sm:w-24 sm:h-24 sm:text-3xl',
  }

  return (
    <div
      className={`relative rounded-full bg-gradient-to-br ${streamer.gradient} ${sizeClasses[size]} flex items-center justify-center font-bold text-white shadow-lg shrink-0`}
    >
      {streamer.avatar ? (
        <img
          src={streamer.avatar}
          alt={streamer.name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        streamer.name.charAt(0).toUpperCase()
      )}
      {/* Platform mini badge */}
      <div className="absolute -bottom-1 -right-1">
        {streamer.platform === 'twitch' ? (
          <div
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#9146FF', boxShadow: '0 0 8px rgba(145, 70, 255, 0.6)' }}
          >
            <TwitchIcon className="w-3 h-3 text-white" />
          </div>
        ) : (
          <div
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#FF0000', boxShadow: '0 0 8px rgba(255, 0, 0, 0.6)' }}
          >
            <Youtube className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Animation variants ── */
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
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

const featuredVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
}

/* ── Featured Streamer Card ── */
function FeaturedStreamerCard({ streamer, inView }: { streamer: Streamer; inView: boolean }) {
  const count = useCounter(streamer.followers, 2200, inView)

  // Get gradient colors for radial glow
  const gradientColors: Record<string, string> = {
    'from-purple-500 to-pink-500': 'rgba(168, 85, 247, 0.12)',
    'from-cyan-500 to-blue-500': 'rgba(6, 182, 212, 0.12)',
    'from-red-500 to-orange-500': 'rgba(239, 68, 68, 0.12)',
    'from-green-500 to-emerald-500': 'rgba(34, 197, 94, 0.12)',
    'from-amber-500 to-yellow-500': 'rgba(245, 158, 11, 0.12)',
    'from-slate-500 to-gray-500': 'rgba(100, 116, 139, 0.12)',
  }

  const glowColor = gradientColors[streamer.gradient] || 'rgba(124, 58, 237, 0.12)'

  return (
    <motion.div
      variants={featuredVariants}
      className="group relative w-full"
    >
      {/* Animated rotating gradient border */}
      <div className="absolute -inset-[1px] rounded-2xl animate-rotate-border overflow-hidden">
        <div className="absolute inset-0"
          style={{
            background: 'conic-gradient(from 0deg, #7c3aed, #06b6d4, #f59e0b, #7c3aed)',
            animation: 'spin 4s linear infinite',
          }}
        />
      </div>

      <div className="relative rounded-2xl bg-[#0f172a] overflow-hidden">
        {/* Subtle radial glow matching streamer gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 20% 50%, ${glowColor}, transparent 70%)`,
          }}
        />

        {/* Top shimmer line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] accent-shimmer-line z-10"
          style={{
            background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, #f59e0b, transparent)',
            backgroundSize: '200% 100%',
          }}
        />

        <div className="relative p-6 sm:p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">
            {/* Avatar with pulsing live ring */}
            <div className="relative">
              {/* Pulsing outer ring when live */}
              {streamer.isLive && (
                <div
                  className="absolute -inset-3 rounded-full animate-pulse-ring"
                  style={{
                    border: '2px solid rgba(239, 68, 68, 0.4)',
                    boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)',
                  }}
                />
              )}
              <StreamerAvatar streamer={streamer} size="lg" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left min-w-0">
              {/* Top row: platform + live status */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-3">
                <PlatformBadge platform={streamer.platform} />
                {streamer.isLive ? (
                  <LiveIndicator viewerCount={streamer.viewerCount} />
                ) : (
                  <OfflineIndicator />
                )}
              </div>

              {/* Name */}
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white neon-text-glow mb-2">
                {streamer.name}
              </h3>

              {/* Follower count with counter animation */}
              <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                <Users className="w-4 h-4 text-[#a78bfa]" />
                <span className="text-lg sm:text-xl font-bold text-[#c4b5fd]">
                  {formatFollowers(count)}
                </span>
                <span className="text-sm text-[#94a3b8]">
                  {streamer.platform === 'twitch' ? 'seguidores' : 'suscriptores'}
                </span>
              </div>

              {/* Description */}
              <p className="text-[#94a3b8] text-sm sm:text-base leading-relaxed mb-5 max-w-lg">
                {streamer.description}
              </p>

              {/* CTA Button */}
              <a
                href="#"
                className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm sm:text-base transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.5),0_0_60px_rgba(124,58,237,0.2)] active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  color: '#ffffff',
                  boxShadow: '0 0 15px rgba(124, 58, 237, 0.3)',
                }}
              >
                <Radio className="w-4 h-4" />
                Ver Stream
                <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.5), rgba(6, 182, 212, 0.5), transparent)',
          }}
        />
      </div>
    </motion.div>
  )
}

/* ── Regular Streamer Card ── */
function StreamerCard({ streamer, inView }: { streamer: Streamer; inView: boolean }) {
  const count = useCounter(streamer.followers, 1800, inView)

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        scale: 1.03,
        rotateY: 2,
        transition: { duration: 0.25 },
      }}
      className="group relative shimmer-sweep"
    >
      <div
        className="relative rounded-xl bg-[#0f172a] p-5 sm:p-6 h-full transition-all duration-300 overflow-hidden"
        style={{
          border: '1px solid rgba(124, 58, 237, 0.2)',
          boxShadow: '0 0 10px rgba(124, 58, 237, 0.08)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.5)'
          e.currentTarget.style.boxShadow = '0 0 20px rgba(124, 58, 237, 0.2), 0 0 40px rgba(124, 58, 237, 0.08)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.2)'
          e.currentTarget.style.boxShadow = '0 0 10px rgba(124, 58, 237, 0.08)'
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(124, 58, 237, 0.4), rgba(6, 182, 212, 0.4), transparent)',
          }}
        />

        <div className="flex items-start gap-4">
          {/* Avatar */}
          <StreamerAvatar streamer={streamer} size="md" />

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name */}
            <h4 className="text-base sm:text-lg font-bold text-white truncate group-hover:text-[#c4b5fd] transition-colors duration-300">
              {streamer.name}
            </h4>

            {/* Platform */}
            <div className="mt-1 mb-2">
              <PlatformBadge platform={streamer.platform} />
            </div>

            {/* Follower count */}
            <div className="flex items-center gap-1.5 mb-2">
              <Users className="w-3.5 h-3.5 text-[#94a3b8]" />
              <span className="text-sm font-semibold text-[#e2e8f0]">
                {formatFollowers(count)}
              </span>
              <span className="text-xs text-[#64748b]">
                {streamer.platform === 'twitch' ? 'seguidores' : 'subs'}
              </span>
            </div>

            {/* Status */}
            <div className="mb-2">
              {streamer.isLive ? (
                <LiveIndicator viewerCount={streamer.viewerCount} />
              ) : (
                <OfflineIndicator />
              )}
            </div>

            {/* Description */}
            <p className="text-[#94a3b8] text-xs sm:text-sm leading-relaxed">
              {streamer.description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Main Section ── */
export default function Streamers() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  // Featured streamer is the first one (RPKing_)
  const featured = streamers[0]
  const others = streamers.slice(1)

  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden" ref={sectionRef}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0f172a] to-[#030712]" />
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Decorative glow orbs */}
      <div className="absolute top-1/4 -left-40 w-80 h-80 bg-[#7c3aed]/5 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-[#06b6d4]/5 rounded-full blur-[140px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#f59e0b]/3 rounded-full blur-[160px]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-14 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 bg-[#7c3aed]/10 border border-[#7c3aed]/20 shadow-[0_0_20px_rgba(124,58,237,0.15)]">
            <Tv className="w-8 h-8 text-[#7c3aed]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Creadores de{' '}
            <span className="text-[#7c3aed] neon-text-glow">Contenido</span>
          </h2>
          <p className="text-[#94a3b8] text-base sm:text-lg max-w-2xl mx-auto">
            Nuestros streamers y creadores que hacen la comunidad más grande
          </p>
          <div
            className="w-24 h-1 mx-auto rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] mt-6"
            style={{ boxShadow: '0 0 15px rgba(124, 58, 237, 0.5)' }}
          />
        </motion.div>

        {/* Featured Streamer */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mb-10 sm:mb-14"
        >
          <FeaturedStreamerCard streamer={featured} inView={isInView} />
        </motion.div>

        {/* Streamers Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {others.map((streamer) => (
            <StreamerCard key={streamer.name} streamer={streamer} inView={isInView} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-[#64748b] text-sm">
            ¿Quieres unirte como creador de contenido?{' '}
            <a
              href="#"
              className="text-[#7c3aed] hover:text-[#a78bfa] transition-colors duration-300 hover-underline font-medium"
            >
              Contáctanos
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
