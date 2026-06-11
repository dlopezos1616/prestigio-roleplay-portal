'use client'

import { motion } from 'framer-motion'
import { Heart, ExternalLink, MessageCircle, Gamepad2, Shield, Globe, Users, Wifi, Zap } from 'lucide-react'
import { useNavigation } from '@/lib/navigation'

const footerLinks = [
  { label: 'Inicio', page: 'home' as const },
  { label: 'Normativa', page: 'normativa' as const },
  { label: 'Galería', page: 'galeria' as const },
  { label: 'Facciones', page: 'facciones' as const },
  { label: 'Mapa', page: 'mapa' as const },
  { label: 'Donaciones', page: 'donaciones' as const },
]

const socialLinks = [
  { label: 'Discord', href: 'https://discord.gg/vGpKd6yt8M', icon: MessageCircle, color: '#7c3aed' },
  { label: 'Normativa', href: 'https://prestigio-roleplay-web.vercel.app/', icon: Shield, color: '#06b6d4' },
  { label: 'FiveM', href: 'https://fivem.net/', icon: Gamepad2, color: '#f59e0b' },
]

const serverStats = [
  { icon: Wifi, label: 'Online 24/7', color: '#22c55e', live: true },
  { icon: Gamepad2, label: 'FiveM Roleplay', color: '#7c3aed' },
  { icon: Users, label: '500+ Miembros', color: '#06b6d4' },
  { icon: Globe, label: 'Comunidad Hispana', color: '#f59e0b' },
  { icon: Zap, label: '128 Slots', color: '#22c55e' },
]

export default function Footer() {
  const { navigate } = useNavigation()

  return (
    <footer className="relative mt-auto bg-[#020617]">
      {/* Animated gradient line at top */}
      <div className="h-[2px] animate-gradient-line" />

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-64 h-64 bg-[#7c3aed]/3 rounded-full blur-[100px]" />
        <div className="absolute -top-24 right-1/4 w-72 h-72 bg-[#06b6d4]/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-5 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg overflow-hidden neon-glow transition-all duration-300 hover:scale-105">
                <img
                  src="/prestigio-logo.png"
                  alt="Prestigio RP"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-bold text-[#7c3aed] neon-text-glow text-lg block leading-tight">
                  PRESTIGIO RP
                </span>
                <span className="text-[10px] text-[#64748b] uppercase tracking-widest">
                  FiveM Roleplay Server
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Vive la experiencia de roleplay definitiva. Servidor FiveM con comunidad activa y staff profesional.
            </p>
            {/* Social icons with scale + glow effect */}
            <div className="flex items-center gap-2.5">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/social w-10 h-10 rounded-lg bg-[#0f172a] border border-[rgba(124,58,237,0.15)] flex items-center justify-center text-gray-500 transition-all duration-300 hover:scale-110 hover:text-white"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${link.color}60`
                      e.currentTarget.style.boxShadow = `0 0 12px ${link.color}30, 0 0 24px ${link.color}15`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(124,58,237,0.15)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                    title={link.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links — with hover underline */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-[#7c3aed] shadow-[0_0_8px_rgba(124,58,237,0.4)]" />
              Navegación
            </h4>
            <div className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => { navigate(link.page); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  className="text-sm text-gray-500 hover:text-[#7c3aed] transition-all duration-200 text-left neon-underline w-fit py-0.5"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* External Links — with hover underline */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-[#06b6d4] shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
              Comunidad
            </h4>
            <div className="flex flex-col gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-[#06b6d4] transition-all duration-200 flex items-center gap-1.5 neon-underline w-fit py-0.5"
                >
                  {link.label} <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>

          {/* Server Info — enhanced with icons */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
              Servidor
            </h4>
            <div className="flex flex-col gap-2.5">
              {serverStats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}12`, border: `1px solid ${stat.color}20` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                    </div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                    {stat.live && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Newsletter / CTA mini section */}
        <div className="mt-10 pt-8 border-t border-[#7c3aed]/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-[#7c3aed]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300">¿Tienes preguntas?</p>
                <p className="text-xs text-gray-600">Únete a nuestro Discord y pregunta a la comunidad</p>
              </div>
            </div>
            <a
              href="https://discord.gg/vGpKd6yt8M"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#7c3aed]/10 border border-[#7c3aed]/30 text-[#7c3aed] text-sm font-medium transition-all duration-300 hover:bg-[#7c3aed]/20 hover:border-[#7c3aed]/50 hover:shadow-[0_0_15px_rgba(124,58,237,0.2)]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.373-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
              Abrir Discord
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-5 border-t border-[#7c3aed]/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600 flex items-center gap-1">
            © {new Date().getFullYear()} Prestigio Roleplay — Hecho con{' '}
            <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-heartbeat" /> por la comunidad
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-gray-700">
              Powered by FiveM
            </p>
            <motion.div
              className="flex items-center gap-1 text-xs text-[#64748b]"
              whileHover={{ color: '#7c3aed' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-breathe" />
              v3.0
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}
