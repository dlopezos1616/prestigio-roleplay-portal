'use client'

import { motion, type Variants } from 'framer-motion'
import { type ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
  delay?: number
  duration?: number
  className?: string
}

const getVariants = (direction: ScrollRevealProps['direction']): Variants => {
  switch (direction) {
    case 'left':
      return {
        hidden: { opacity: 0, x: -40 },
        visible: { opacity: 1, x: 0 },
      }
    case 'right':
      return {
        hidden: { opacity: 0, x: 40 },
        visible: { opacity: 1, x: 0 },
      }
    case 'down':
      return {
        hidden: { opacity: 0, y: -40 },
        visible: { opacity: 1, y: 0 },
      }
    case 'scale':
      return {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1 },
      }
    case 'up':
    default:
      return {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 },
      }
  }
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className,
}: ScrollRevealProps) {
  return (
    <motion.div
      variants={getVariants(direction)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
