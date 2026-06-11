'use client'

import { motion } from 'framer-motion'
import { Users, Volume2, Hash, Gem, CheckCircle, ChevronRight, Zap } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const channelData = [
  { name: 'general', icon: Hash, detail: '42 en línea', color: 'text-green-400' },
  { name: 'anuncios', icon: Volume2, detail: '5 nuevos', color: 'text-amber-400' },
  { name: 'whitelist', icon: CheckCircle, detail: '8 esperando', color: 'text-cyan-400' },
]

const featurePills = [
  { label: 'Voz', icon: Volume2 },
  { label: 'Eventos', icon: Zap },
  { label: 'Comunidad', icon: Users },
]

// Discord SVG Icon
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

export default function JoinDiscord() {
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#030712]" />

      {/* Radial gradient glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(124,58,237,0.12)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(6,182,212,0.08)_0%,transparent_55%)]" />

      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-40" />

      {/* Morphing blob animations */}
      <div
        className="absolute top-10 left-[5%] w-72 h-72 sm:w-96 sm:h-96 bg-[#7c3aed]/8 blur-[100px] animate-morph-blob"
      />
      <div
        className="absolute bottom-10 right-[10%] w-64 h-64 sm:w-80 sm:h-80 bg-[#06b6d4]/6 blur-[80px] animate-morph-blob"
        style={{ animationDelay: '3s', animationDuration: '10s' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#7c3aed]/5 blur-[120px] animate-morph-blob"
        style={{ animationDelay: '5s', animationDuration: '12s' }}
      />

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* ===== LEFT COLUMN: CTA ===== */}
        <div className="text-center lg:text-left">
          {/* Discord icon badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 neon-glow">
              <DiscordIcon className="w-5 h-5 text-[#7c3aed]" />
              <span className="text-[#c4b5fd] text-sm font-medium">Servidor Oficial</span>
            </div>
          </motion.div>

          {/* Heading with gradient text animation */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-2 leading-tight"
          >
            Únete a la{' '}
            <span
              className="gradient-text animate-gradient-text bg-gradient-to-r from-[#7c3aed] via-[#06b6d4] to-[#7c3aed] bg-[length:200%_auto]"
            >
              Comunidad
            </span>
          </motion.h2>

          {/* Animated underline */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center lg:justify-start mb-6"
          >
            <div className="h-[3px] w-24 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] shadow-[0_0_12px_rgba(124,58,237,0.5)] animate-gradient-line" />
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-[#94a3b8] text-base sm:text-lg max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed"
          >
            Conecta con más de 500 jugadores, participa en eventos exclusivos y sé parte de la
            familia Prestigio RP. Tu historia comienza aquí.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8"
          >
            {featurePills.map((pill) => (
              <div
                key={pill.label}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0f172a] border border-[rgba(124,58,237,0.25)] text-sm text-[#c4b5fd] hover:border-[#7c3aed]/50 transition-colors duration-300"
              >
                <pill.icon className="w-4 h-4 text-[#06b6d4]" />
                {pill.label}
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8"
          >
            {/* Primary: Unirse al Discord */}
            <a
              href="https://discord.gg/vGpKd6yt8M"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#5865F2] text-white font-bold text-lg transition-all duration-300 hover:bg-[#4752C4] hover:shadow-[0_0_30px_rgba(88,101,242,0.5),0_0_60px_rgba(88,101,242,0.2)] active:scale-95 w-full sm:w-auto justify-center"
            >
              <DiscordIcon className="w-6 h-6" />
              Unirse al Discord
              <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>

            {/* Secondary: Conectar por FiveM */}
            <a
              href="fivem://connect/redirect"
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl border-2 border-[#06b6d4]/50 text-[#06b6d4] font-bold text-lg transition-all duration-300 hover:border-[#06b6d4] hover:bg-[#06b6d4]/10 hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] active:scale-95 w-full sm:w-auto justify-center"
            >
              <Zap className="w-5 h-5" />
              Conectar por FiveM
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-[#94a3b8]"
          >
            <div className="inline-flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-white font-semibold">500+</span> Miembros
            </div>
            <span className="text-[#334155]">•</span>
            <div className="inline-flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse" />
              24/7 Activo
            </div>
            <span className="text-[#334155]">•</span>
            <div className="inline-flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#f59e0b]" />
              6 Facciones
            </div>
          </motion.div>
        </div>

        {/* ===== RIGHT COLUMN: Discord Server Preview Card ===== */}
        <motion.div variants={itemVariants} className="flex justify-center lg:justify-end">
          <a
            href="https://discord.gg/vGpKd6yt8M"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full max-w-md"
          >
            <div className="animate-float">
              <div className="relative rounded-2xl overflow-hidden animate-gradient-border border bg-[rgba(15,23,42,0.75)] backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_30px_rgba(124,58,237,0.1)] transition-all duration-500 hover:shadow-[0_12px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(124,58,237,0.2)]">
                {/* Card inner glow accent */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/50 to-transparent" />

                <div className="p-6">
                  {/* Server header */}
                  <div className="flex items-start gap-4 mb-5">
                    {/* Server icon */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center text-white font-extrabold text-xl shadow-[0_0_20px_rgba(124,58,237,0.4)]">
                        PR
                      </div>
                      {/* Online indicator */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 border-[3px] border-[#0f172a] rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold text-lg truncate">Prestigio Roleplay</h3>
                        {/* Verified badge */}
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#5865F2] flex items-center justify-center">
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                      <p className="text-[#94a3b8] text-sm mt-0.5">Servidor de FiveM Roleplay</p>
                    </div>
                  </div>

                  {/* Member count */}
                  <div className="flex items-center gap-3 mb-5 px-3 py-2.5 rounded-lg bg-[rgba(124,58,237,0.06)] border border-[rgba(124,58,237,0.12)]">
                    <Users className="w-4 h-4 text-[#7c3aed]" />
                    <span className="text-[#c4b5fd] text-sm font-medium">500+ miembros</span>
                    <div className="ml-auto flex items-center gap-1">
                      {/* Online users avatars row */}
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] border-2 border-[#0f172a] flex items-center justify-center">
                          <span className="text-[8px] text-white font-bold">A</span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#06b6d4] to-[#22d3ee] border-2 border-[#0f172a] flex items-center justify-center">
                          <span className="text-[8px] text-white font-bold">M</span>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] border-2 border-[#0f172a] flex items-center justify-center">
                          <span className="text-[8px] text-white font-bold">R</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-green-400 text-xs">128</span>
                      </div>
                    </div>
                  </div>

                  {/* Channel preview */}
                  <div className="space-y-2 mb-5">
                    {channelData.map((channel) => (
                      <div
                        key={channel.name}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[rgba(124,58,237,0.08)] transition-colors duration-200 group/channel"
                      >
                        <channel.icon className="w-4 h-4 text-[#64748b] group-hover/channel:text-[#7c3aed] transition-colors" />
                        <span className="text-[#cbd5e1] text-sm flex-1 group-hover/channel:text-white transition-colors">
                          {channel.name}
                        </span>
                        <span className={`text-xs font-medium ${channel.color}`}>
                          {channel.detail}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="glow-line mb-5" />

                  {/* Boost level */}
                  <div className="flex items-center gap-2 mb-5">
                    <Gem className="w-4 h-4 text-[#f47fff]" />
                    <span className="text-[#f47fff] text-sm font-medium">Nivel 1 de Boost</span>
                    <div className="ml-auto flex gap-0.5">
                      {[...Array(2)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-[#f47fff]"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2Z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Join button */}
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#5865F2] text-white font-bold text-base transition-all duration-300 hover:bg-[#4752C4] hover:shadow-[0_0_20px_rgba(88,101,242,0.4)] active:scale-[0.98]"
                    onClick={(e) => {
                      e.preventDefault()
                      window.open('https://discord.gg/vGpKd6yt8M', '_blank', 'noopener,noreferrer')
                    }}
                  >
                    <DiscordIcon className="w-5 h-5" />
                    Unirse
                  </button>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#06b6d4]/30 to-transparent" />
              </div>
            </div>
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
