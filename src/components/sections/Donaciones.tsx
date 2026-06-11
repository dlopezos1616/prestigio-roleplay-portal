'use client'

import { motion } from 'framer-motion'
import { Heart, Check, ExternalLink } from 'lucide-react'

const perks = [
  'Rango VIP',
  'Vehículos exclusivos',
  'Acceso anticipado',
  'Cosméticos únicos',
]

export default function Donaciones() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-bg opacity-50" />

      {/* Floating glow orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-[#7c3aed]/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-[#06b6d4]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#7c3aed] neon-text-glow mb-4"
          >
            Apoya el Servidor
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#94a3b8] text-lg max-w-2xl mx-auto"
          >
            Tu contribución nos permite mantener el servidor activo y seguir mejorando la experiencia de juego para toda la comunidad.
          </motion.p>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative bg-[#0f172a] rounded-2xl p-8 sm:p-10 neon-border overflow-hidden"
        >
          {/* Inner glow effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/50 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/50 to-transparent" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Heart icon */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-2xl bg-[#7c3aed]/15 border border-[#7c3aed]/30 flex items-center justify-center mb-6"
            >
              <Heart className="w-8 h-8 text-[#7c3aed]" />
            </motion.div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Haz tu Donación
            </h3>
            <p className="text-[#94a3b8] mb-8 max-w-lg">
              Cada donación ayuda a cubrir los costos del servidor y financiar nuevas actualizaciones. ¡Cada cuenta!
            </p>

            {/* Perks List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 w-full max-w-md">
              {perks.map((perk, index) => (
                <motion.div
                  key={perk}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3 bg-[#030712]/50 rounded-lg p-3 border border-[rgba(124,58,237,0.15)]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#7c3aed]/20 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-[#7c3aed]" />
                  </div>
                  <span className="text-[#f1f5f9] text-sm font-medium">{perk}</span>
                </motion.div>
              ))}
            </div>

            {/* Donate Button */}
            <motion.a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#7c3aed] text-white font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(124,58,237,0.5),0_0_60px_rgba(124,58,237,0.3)]"
            >
              <Heart className="w-5 h-5 group-hover:animate-pulse" />
              Donar Ahora
              <ExternalLink className="w-4 h-4 opacity-70" />
            </motion.a>
          </div>

          {/* Background decorative elements */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-[#7c3aed]/5 rounded-full blur-2xl" />
          <div className="absolute bottom-4 left-4 w-40 h-40 bg-[#06b6d4]/5 rounded-full blur-2xl" />
        </motion.div>
      </div>
    </section>
  )
}
