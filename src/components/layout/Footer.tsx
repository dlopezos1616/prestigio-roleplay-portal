'use client'

import { motion } from 'framer-motion'
import { Heart, ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-[#7c3aed]/10 bg-[#030712]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden neon-glow">
                <img
                  src="/prestigio-logo.png"
                  alt="Prestigio RP"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-[#7c3aed] neon-text-glow">
                PRESTIGIO RP
              </span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs">
              Vive la experiencia de roleplay definitiva. Servidor FiveM con comunidad activa y staff profesional.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Enlaces
            </h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://discord.gg/vGpKd6yt8M"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-[#7c3aed] transition-colors flex items-center gap-1"
              >
                Discord <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://prestigio-roleplay-web.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-[#7c3aed] transition-colors flex items-center gap-1"
              >
                Normativa <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Server Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Servidor
            </h4>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-gray-500">🎮 FiveM Roleplay</p>
              <p className="text-sm text-gray-500">🕐 24/7 Online</p>
              <p className="text-sm text-gray-500">👥 500+ Miembros</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-[#7c3aed]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600 flex items-center gap-1">
            © {new Date().getFullYear()} Prestigio Roleplay — Hecho con{' '}
            <Heart className="w-3 h-3 text-red-500 fill-red-500" /> por la comunidad
          </p>
          <p className="text-xs text-gray-700">
            Powered by FiveM
          </p>
        </div>
      </div>
    </footer>
  )
}
