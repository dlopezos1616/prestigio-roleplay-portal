'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

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

const particles = [
  { class: 'particleFloat1', size: 'w-1 h-1', pos: 'top-[20%] left-[15%]', delay: '0s', duration: '6s' },
  { class: 'particleFloat2', size: 'w-1.5 h-1.5', pos: 'top-[40%] left-[80%]', delay: '1s', duration: '8s' },
  { class: 'particleFloat3', size: 'w-1 h-1', pos: 'top-[60%] left-[25%]', delay: '2s', duration: '7s' },
  { class: 'particleFloat1', size: 'w-2 h-2', pos: 'top-[30%] left-[65%]', delay: '0.5s', duration: '9s' },
  { class: 'particleFloat2', size: 'w-1 h-1', pos: 'top-[70%] left-[50%]', delay: '1.5s', duration: '6s' },
  { class: 'particleFloat3', size: 'w-1.5 h-1.5', pos: 'top-[50%] left-[10%]', delay: '3s', duration: '8s' },
  { class: 'particleFloat1', size: 'w-1 h-1', pos: 'top-[80%] left-[70%]', delay: '2.5s', duration: '7s' },
  { class: 'particleFloat2', size: 'w-2 h-2', pos: 'top-[15%] left-[45%]', delay: '0.8s', duration: '10s' },
  { class: 'particleFloat3', size: 'w-1 h-1', pos: 'top-[45%] left-[90%]', delay: '1.8s', duration: '6s' },
  { class: 'particleFloat1', size: 'w-1.5 h-1.5', pos: 'top-[75%] left-[35%]', delay: '3.5s', duration: '9s' },
  { class: 'particleFloat2', size: 'w-1 h-1', pos: 'top-[10%] left-[75%]', delay: '0.3s', duration: '7s' },
  { class: 'particleFloat3', size: 'w-1 h-1', pos: 'top-[55%] left-[55%]', delay: '2.2s', duration: '8s' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0f172a] to-[#030712]" />

      {/* Background city image */}
      <div className="absolute inset-0 opacity-20">
        <img src="/gallery/city-night.png" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#030712]/70 to-[#030712]" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern" />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15)_0%,transparent_70%)]" />

      {/* CSS Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p, i) => (
          <div
            key={i}
            className={`absolute ${p.size} ${p.pos} rounded-full bg-[#7c3aed]`}
            style={{
              animation: `${p.class} ${p.duration} ease-in-out ${p.delay} infinite`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* Logo */}
        <motion.div variants={fadeInUp} transition={{ duration: 0.6 }} className="mb-6 sm:mb-8">
          <div className="animate-pulse-glow rounded-full p-1">
            <img
              src="/prestigio-logo.png"
              alt="Prestigio Roleplay Logo"
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain drop-shadow-[0_0_25px_rgba(124,58,237,0.5)]"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-wider neon-text-glow text-white mb-4 sm:mb-6"
        >
          PRESTIGIO <span className="text-[#7c3aed]">ROLEPLAY</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl text-[#94a3b8] max-w-2xl mb-8 sm:mb-10"
        >
          Vive la experiencia de roleplay definitiva
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={fadeInUp} transition={{ duration: 0.6 }}>
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
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-[#7c3aed]/50 flex items-start justify-center p-1">
            <motion.div
              className="w-1.5 h-3 rounded-full bg-[#7c3aed]"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
