'use client'

import { motion } from 'framer-motion'

interface SectionDividerProps {
  variant?: 'default' | 'cyan' | 'amber'
  className?: string
}

export default function SectionDivider({ variant = 'default', className = '' }: SectionDividerProps) {
  const colors = {
    default: { main: '#7c3aed', secondary: '#06b6d4', tertiary: '#f59e0b' },
    cyan: { main: '#06b6d4', secondary: '#7c3aed', tertiary: '#22c55e' },
    amber: { main: '#f59e0b', secondary: '#7c3aed', tertiary: '#ef4444' },
  }

  const { main, secondary, tertiary } = colors[variant]

  return (
    <div className={`relative h-20 sm:h-24 flex items-center justify-center overflow-hidden ${className}`}>
      {/* Wide subtle gradient band */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="absolute left-0 right-0 h-8 top-1/2 -translate-y-1/2"
        style={{
          background: `radial-gradient(ellipse at center, ${main}08 0%, transparent 70%)`,
        }}
      />

      {/* Primary gradient line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute left-[5%] right-[5%] h-px origin-center"
        style={{
          background: `linear-gradient(90deg, transparent, ${main}40, ${main}80, ${secondary}80, ${main}80, ${main}40, transparent)`,
          boxShadow: `0 0 12px ${main}30, 0 0 24px ${main}10`,
        }}
      />

      {/* Secondary thin line below */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        className="absolute left-[15%] right-[15%] h-px origin-center top-1/2 mt-1.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${tertiary}20, ${secondary}30, ${tertiary}20, transparent)`,
        }}
      />

      {/* Center diamond shape */}
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        whileInView={{ scale: 1, rotate: 45 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6, type: 'spring', stiffness: 200 }}
        className="relative z-10 w-3 h-3 border"
        style={{
          borderColor: main,
          backgroundColor: `${main}30`,
          boxShadow: `0 0 10px ${main}80, 0 0 20px ${main}40, inset 0 0 4px ${main}40`,
        }}
      />

      {/* Left decorative dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="absolute z-10 w-1.5 h-1.5 rounded-full"
        style={{
          left: 'calc(5% + 20px)',
          backgroundColor: secondary,
          boxShadow: `0 0 6px ${secondary}80`,
        }}
      />

      {/* Right decorative dot */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="absolute z-10 w-1.5 h-1.5 rounded-full"
        style={{
          right: 'calc(5% + 20px)',
          backgroundColor: tertiary,
          boxShadow: `0 0 6px ${tertiary}80`,
        }}
      />
    </div>
  )
}
