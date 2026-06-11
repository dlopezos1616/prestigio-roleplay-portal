'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: LucideIcon
  accent?: string // color like '#7c3aed', '#06b6d4', etc.
}

export default function PageHeader({ title, subtitle, icon: Icon, accent = '#7c3aed' }: PageHeaderProps) {
  return (
    <div className="relative py-16 sm:py-20 px-4 sm:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0f172a] to-[#030712]" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div 
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at center, ${accent}15 0%, transparent 60%)` }}
      />
      
      {/* Decorative particles */}
      <div className="absolute top-4 left-1/4 w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: accent, animation: 'particleFloat1 6s ease-in-out infinite' }} />
      <div className="absolute bottom-8 right-1/3 w-1.5 h-1.5 rounded-full opacity-20" style={{ backgroundColor: accent, animation: 'particleFloat2 8s ease-in-out infinite' }} />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {Icon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6"
            style={{ 
              backgroundColor: `${accent}15`,
              border: `1px solid ${accent}30`,
              boxShadow: `0 0 15px ${accent}20`,
            }}
          >
            <Icon className="w-8 h-8" style={{ color: accent }} />
          </motion.div>
        )}
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3"
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#94a3b8] text-base sm:text-lg max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
        
        {/* Bottom neon line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 h-0.5 mx-auto max-w-[120px] rounded-full"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            boxShadow: `0 0 10px ${accent}60`,
          }}
        />
      </div>
    </div>
  )
}
