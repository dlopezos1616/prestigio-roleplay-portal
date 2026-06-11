'use client'

import { motion } from 'framer-motion'
import { Heart, ExternalLink, MessageCircle, Gamepad2, Shield } from 'lucide-react'
import { useNavigation } from '@/lib/navigation'

const footerLinks = [
  { label: 'Inicio', page: 'home' as const },
  { label: 'Normativa', page: 'normativa' as const },
  { label: 'Galería', page: 'galeria' as const },
  { label: 'Facciones', page: 'facciones' as const },
  { label: 'Información', page: 'info' as const },
  { label: 'Donaciones', page: 'donaciones' as const },
]

const socialLinks = [
  { label: 'Discord', href: 'https://discord.gg/vGpKd6yt8M', icon: MessageCircle, color: '#7c3aed' },
  { label: 'Normativa', href: 'https://prestigio-roleplay-web.vercel.app/', icon: Shield, color: '#06b6d4' },
  { label: 'FiveM', href: 'https://fivem.net/', icon: Gamepad2, color: '#f59e0b' },
]

export default function Footer() {
  const { navigate } = useNavigation()

  return (
    <footer className="relative mt-auto border-t border-[#7c3aed]/10 bg-[#030712]/80">
      {/* Glow line at top */}
      <div className="glow-line" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden neon-glow">
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
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[#0f172a] border border-[rgba(124,58,237,0.15)] flex items-center justify-center text-gray-500 hover:text-white hover:border-[rgba(124,58,237,0.4)] transition-all duration-200"
                  title={link.label}
                >
                  <link.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-[#7c3aed]" />
              Navegación
            </h4>
            <div className="flex flex-col gap-1.5">
              {footerLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => navigate(link.page)}
                  className="text-sm text-gray-500 hover:text-[#7c3aed] transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* External Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-[#06b6d4]" />
              Comunidad
            </h4>
            <div className="flex flex-col gap-1.5">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-[#06b6d4] transition-colors flex items-center gap-1.5"
                >
                  {link.label} <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>

          {/* Server Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-4 rounded-full bg-[#f59e0b]" />
              Servidor
            </h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-breathe" />
                <p className="text-sm text-gray-400">Online 24/7</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">🎮</span>
                <p className="text-sm text-gray-400">FiveM Roleplay</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">👥</span>
                <p className="text-sm text-gray-400">500+ Miembros</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">🌍</span>
                <p className="text-sm text-gray-400">Comunidad Hispana</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-[#7c3aed]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600 flex items-center gap-1">
            © {new Date().getFullYear()} Prestigio Roleplay — Hecho con{' '}
            <Heart className="w-3 h-3 text-red-500 fill-red-500" /> por la comunidad
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
              v2.0
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}
