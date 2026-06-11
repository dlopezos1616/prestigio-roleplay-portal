'use client'

import { motion } from 'framer-motion'

interface SectionDividerProps {
  variant?: 'default' | 'cyan' | 'amber'
  className?: string
}

export default function SectionDivider({ variant = 'default', className = '' }: SectionDividerProps) {
  const colors = {
    default: { main: '#7c3aed', secondary: '#06b6d4' },
    cyan: { main: '#06b6d4', secondary: '#7c3aed' },
    amber: { main: '#f59e0b', secondary: '#7c3aed' },
  }

  const { main, secondary } = colors[variant]

  return (
    <div className={`relative h-16 sm:h-20 flex items-center justify-center overflow-hidden ${className}`}>
      {/* Gradient line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute left-[10%] right-[10%] h-px origin-center"
        style={{
          background: `linear-gradient(90deg, transparent, ${main}60, ${secondary}60, ${main}60, transparent)`,
          boxShadow: `0 0 8px ${main}30`,
        }}
      />
      {/* Center dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative z-10 w-2 h-2 rounded-full"
        style={{
          backgroundColor: main,
          boxShadow: `0 0 10px ${main}80, 0 0 20px ${main}40`,
        }}
      />
    </div>
  )
}
