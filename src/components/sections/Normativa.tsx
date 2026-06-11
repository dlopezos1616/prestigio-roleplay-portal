'use client'

import { motion } from 'framer-motion'
import { BookOpen, ExternalLink } from 'lucide-react'

export default function Normativa() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#7c3aed] neon-text-glow mb-4"
        >
          Normativa
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#94a3b8] text-lg"
        >
          Conoce las normas que rigen nuestro servidor
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-3xl"
      >
        <motion.a
          href="https://prestigio-roleplay-web.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="group relative block cursor-pointer rounded-xl overflow-hidden neon-border"
        >
          {/* Placeholder gradient image */}
          <div className="relative aspect-video w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed] via-[#4c1d95] to-[#06b6d4]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-60" />

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 grid-pattern opacity-30" />

            {/* Icon decoration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <BookOpen className="w-16 h-16 text-white/20" />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  whileHover={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                >
                  <ExternalLink className="w-8 h-8 text-white" />
                </motion.div>
              </div>
            </div>

            {/* Glassmorphism overlay on hover */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-[#030712]/40 backdrop-blur-md" />
              <div className="relative text-center z-10">
                <BookOpen className="w-12 h-12 text-[#7c3aed] mx-auto mb-3" />
                <p className="text-white text-xl font-bold mb-1">Leer Normativa</p>
                <p className="text-[#94a3b8] text-sm flex items-center justify-center gap-1">
                  Abrir en nueva pestaña <ExternalLink className="w-3 h-3" />
                </p>
              </div>
            </motion.div>
          </div>

          {/* Bottom info bar */}
          <div className="bg-[#0f172a] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#7c3aed]/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-[#7c3aed]" />
              </div>
              <div>
                <p className="text-white font-semibold">Reglamento del Servidor</p>
                <p className="text-[#94a3b8] text-sm">Normas, reglas y lineamientos</p>
              </div>
            </div>
            <div className="text-[#7c3aed] group-hover:translate-x-1 transition-transform">
              <ExternalLink className="w-5 h-5" />
            </div>
          </div>

          {/* Hover glow intensification */}
          <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.4), 0 0 60px rgba(124, 58, 237, 0.2), 0 0 100px rgba(124, 58, 237, 0.1)',
            }}
          />
        </motion.a>
      </motion.div>
    </section>
  )
}
