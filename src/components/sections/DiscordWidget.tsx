'use client'

import { motion } from 'framer-motion'
import { Volume2, Users, ExternalLink } from 'lucide-react'

/* ────────────────────────────────────────────
   Discord SVG Icon
   ──────────────────────────────────────────── */
function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

/* ────────────────────────────────────────────
   Animation Variants
   ──────────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
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

const memberVariants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: 0.3 + i * 0.07,
      ease: [0.34, 1.56, 0.64, 1],
    },
  }),
}

/* ────────────────────────────────────────────
   Member Data
   ──────────────────────────────────────────── */
interface Member {
  name: string
  initials: string
  color: string
  bgColor: string
  role: string
}

const adminMembers: Member[] = [
  { name: 'AlexRPG', initials: 'AR', color: '#f59e0b', bgColor: 'from-[#f59e0b] to-[#d97706]', role: '👑 Admin' },
  { name: 'DarkMaster', initials: 'DM', color: '#f59e0b', bgColor: 'from-[#fbbf24] to-[#f59e0b]', role: '👑 Admin' },
]

const staffMembers: Member[] = [
  { name: 'NightWolf', initials: 'NW', color: '#7c3aed', bgColor: 'from-[#7c3aed] to-[#6d28d9]', role: '🛡️ Staff' },
  { name: 'ShadowMedic', initials: 'SM', color: '#7c3aed', bgColor: 'from-[#a78bfa] to-[#7c3aed]', role: '🛡️ Staff' },
  { name: 'LunaRP', initials: 'LR', color: '#7c3aed', bgColor: 'from-[#8b5cf6] to-[#6d28d9]', role: '🛡️ Staff' },
]

const vipMembers: Member[] = [
  { name: 'CyberRacer', initials: 'CR', color: '#06b6d4', bgColor: 'from-[#06b6d4] to-[#0891b2]', role: '⭐ VIP' },
  { name: 'NeonDrift', initials: 'ND', color: '#06b6d4', bgColor: 'from-[#22d3ee] to-[#06b6d4]', role: '⭐ VIP' },
  { name: 'PhoenixX', initials: 'PX', color: '#06b6d4', bgColor: 'from-[#67e8f9] to-[#06b6d4]', role: '⭐ VIP' },
]

const regularMembers: Member[] = [
  { name: 'StormBlade', initials: 'SB', color: '#22c55e', bgColor: 'from-[#22c55e] to-[#16a34a]', role: '👤 Miembros' },
  { name: 'RogueOne', initials: 'RO', color: '#22c55e', bgColor: 'from-[#4ade80] to-[#22c55e]', role: '👤 Miembros' },
]

const allMemberGroups = [
  { role: '👑 Admin', members: adminMembers, borderColor: '#f59e0b' },
  { role: '🛡️ Staff', members: staffMembers, borderColor: '#7c3aed' },
  { role: '⭐ VIP', members: vipMembers, borderColor: '#06b6d4' },
  { role: '👤 Miembros', members: regularMembers, borderColor: '#22c55e' },
]

/* ────────────────────────────────────────────
   Voice Channel Data
   ──────────────────────────────────────────── */
interface VoiceChannel {
  name: string
  count: number
}

const voiceChannels: VoiceChannel[] = [
  { name: 'Carreras Nocturnas', count: 5 },
  { name: 'General RP', count: 12 },
  { name: 'Staff', count: 3 },
]

/* ────────────────────────────────────────────
   Single Member Component
   ──────────────────────────────────────────── */
function MemberAvatar({ member, index }: { member: Member; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={memberVariants}
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#36393f]/60 transition-colors duration-200 group/member"
    >
      {/* Avatar circle */}
      <div className="relative flex-shrink-0">
        <div
          className={`w-9 h-9 rounded-full bg-gradient-to-br ${member.bgColor} flex items-center justify-center text-white text-xs font-bold shadow-[0_0_10px_${member.color}30]`}
        >
          {member.initials}
        </div>
        {/* Online status dot */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-[2.5px] border-[#2b2d31]">
          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-40" />
        </div>
      </div>

      {/* Username */}
      <span
        className="text-sm font-medium truncate transition-colors duration-200"
        style={{ color: member.color }}
      >
        {member.name}
      </span>
    </motion.div>
  )
}

/* ────────────────────────────────────────────
   Voice Channel Row Component
   ──────────────────────────────────────────── */
function VoiceChannelRow({ channel, index }: { channel: VoiceChannel; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: 0.5 + index * 0.12 }}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1e1f22]/60 hover:bg-[#2b2d31]/80 transition-colors duration-200 group/channel"
    >
      <Volume2 className="w-4 h-4 text-[#94a3b8] group-hover/channel:text-[#06b6d4] transition-colors" />
      <span className="text-[#cbd5e1] text-sm flex-1 group-hover/channel:text-white transition-colors">
        {channel.name}
      </span>
      <div className="flex items-center gap-1.5">
        <Users className="w-3 h-3 text-[#64748b]" />
        <span className="text-xs font-medium text-green-400 animate-breathe">
          {channel.count} en canal
        </span>
      </div>
    </motion.div>
  )
}

/* ────────────────────────────────────────────
   Main DiscordWidget Section
   ──────────────────────────────────────────── */
export default function DiscordWidget() {
  return (
    <section
      className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden"
      aria-label="Comunidad Discord"
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_30%,rgba(124,58,237,0.10)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_65%_70%,rgba(6,182,212,0.07)_0%,transparent_55%)]" />
      <div className="absolute inset-0 dot-pattern opacity-30" />

      {/* Morphing blob accents */}
      <div
        className="absolute top-16 left-[8%] w-72 h-72 bg-[#7c3aed]/6 blur-[100px] animate-morph-blob"
      />
      <div
        className="absolute bottom-16 right-[12%] w-64 h-64 bg-[#06b6d4]/5 blur-[80px] animate-morph-blob"
        style={{ animationDelay: '3s', animationDuration: '11s' }}
      />

      {/* ── Main content ── */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* ── Section Header ── */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7c3aed]/10 border border-[#7c3aed]/20 neon-glow mb-5">
            <DiscordIcon className="w-5 h-5 text-[#7c3aed]" />
            <span className="text-[#c4b5fd] text-sm font-medium">Servidor de Discord</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
            Nuestra Comunidad en{' '}
            <span
              className="gradient-text animate-gradient-text bg-gradient-to-r from-[#7c3aed] via-[#06b6d4] to-[#7c3aed] bg-[length:200%_auto]"
            >
              Discord
            </span>
          </h2>

          <p className="text-[#94a3b8] text-base sm:text-lg max-w-xl mx-auto">
            Conecta con cientos de jugadores
          </p>

          <motion.div
            variants={itemVariants}
            className="flex justify-center mt-4"
          >
            <div className="h-[3px] w-24 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] shadow-[0_0_12px_rgba(124,58,237,0.5)]" />
          </motion.div>
        </motion.div>

        {/* ── Discord Server Preview Card ── */}
        <motion.div variants={itemVariants}>
          <div className="relative rounded-2xl overflow-hidden bg-[#0f172a]/80 backdrop-blur-xl border border-[rgba(124,58,237,0.2)] shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_30px_rgba(124,58,237,0.1)] transition-all duration-500 hover:shadow-[0_12px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(124,58,237,0.2)]">
            {/* Top neon accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#7c3aed]/60 to-transparent shadow-[0_0_12px_rgba(124,58,237,0.4)]" />
            {/* Bottom neon accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#06b6d4]/30 to-transparent" />

            <div className="p-5 sm:p-7">
              {/* ── Server Header ── */}
              <div className="flex items-center gap-4 mb-6">
                {/* Server icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center shadow-[0_0_24px_rgba(124,58,237,0.4)]">
                    <DiscordIcon className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
                  </div>
                  {/* Online indicator on server icon */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 border-[3px] border-[#0f172a] rounded-full" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-bold text-lg sm:text-xl truncate">Prestigio Roleplay</h3>
                    {/* EN LÍNEA Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/30">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                      </span>
                      <span className="text-green-400 text-[11px] font-bold tracking-wide">EN LÍNEA</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-green-400 text-sm font-semibold">87</span>
                      <span className="text-[#94a3b8] text-sm">en línea ahora</span>
                    </div>
                    <span className="text-[#334155] text-sm">•</span>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#64748b]" />
                      <span className="text-[#94a3b8] text-sm">
                        <span className="text-white font-semibold">523</span> miembros
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Online Members Grid ── */}
              <div className="rounded-xl bg-[#2b2d31] p-4 sm:p-5 mb-5 border border-[rgba(255,255,255,0.04)]">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-[#7c3aed]" />
                  <span className="text-[#cbd5e1] text-sm font-semibold">Miembros en línea</span>
                  <span className="ml-auto text-[11px] text-[#94a3b8]/50 uppercase tracking-wider">87 conectados</span>
                </div>

                <div className="space-y-3">
                  {allMemberGroups.map((group, gi) => {
                    // Compute cumulative offset for stagger animation
                    const groupStartIndex = allMemberGroups
                      .slice(0, gi)
                      .reduce((sum, g) => sum + g.members.length, 0)

                    return (
                      <div key={group.role} className="mb-1">
                        {/* Role header */}
                        <div className="flex items-center gap-2 px-3 mb-1">
                          <span
                            className="w-1 h-4 rounded-full"
                            style={{ backgroundColor: group.borderColor, boxShadow: `0 0 6px ${group.borderColor}60` }}
                          />
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]/70">
                            {group.role}
                          </span>
                          <span className="text-[10px] text-[#94a3b8]/40">— {group.members.length}</span>
                        </div>

                        {/* Members in this group */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5">
                          {group.members.map((member, mi) => (
                            <MemberAvatar
                              key={member.name}
                              member={member}
                              index={groupStartIndex + mi}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* ── Voice Channels Preview ── */}
              <div className="rounded-xl bg-[#2b2d31] p-4 sm:p-5 mb-6 border border-[rgba(255,255,255,0.04)]">
                <div className="flex items-center gap-2 mb-4">
                  <Volume2 className="w-4 h-4 text-[#06b6d4]" />
                  <span className="text-[#cbd5e1] text-sm font-semibold">Canales de Voz</span>
                  <span className="ml-auto text-[11px] text-[#94a3b8]/50 uppercase tracking-wider">activos ahora</span>
                </div>

                <div className="space-y-2">
                  {voiceChannels.map((channel, i) => (
                    <VoiceChannelRow key={channel.name} channel={channel} index={i} />
                  ))}
                </div>

                {/* Total in voice */}
                <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.04)] flex items-center justify-between">
                  <span className="text-[11px] text-[#94a3b8]/40">Total en canales de voz</span>
                  <span className="text-sm font-bold text-white" style={{ textShadow: '0 0 10px rgba(6,182,212,0.3)' }}>
                    {voiceChannels.reduce((sum, ch) => sum + ch.count, 0)}
                  </span>
                </div>
              </div>

              {/* ── CTA Section ── */}
              <div className="text-center">
                <p className="text-[#94a3b8] text-sm mb-5">
                  Conecta con la comunidad
                </p>

                <a
                  href="https://discord.gg/vGpKd6yt8M"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#5865F2] text-white font-bold text-lg transition-all duration-300 hover:bg-[#4752C4] hover:shadow-[0_0_30px_rgba(88,101,242,0.5),0_0_60px_rgba(88,101,242,0.2)] active:scale-95"
                >
                  {/* Pulse ring animation */}
                  <span className="absolute inset-0 rounded-xl animate-ping bg-[#5865F2]/20 pointer-events-none" />

                  <DiscordIcon className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">Unirse a Discord</span>
                  <ExternalLink className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
