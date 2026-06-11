'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
  life: number
  maxLife: number
  type: 'dot' | 'ring' | 'cross'
}

const COLORS = [
  'rgba(124, 58, 237,',  // purple
  'rgba(6, 182, 212,',   // cyan
  'rgba(245, 158, 11,',  // amber
  'rgba(167, 139, 250,', // light purple
  'rgba(103, 232, 249,', // light cyan
]

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animFrameRef = useRef<number>(0)

  const createParticle = useCallback((width: number, height: number): Particle => {
    const type = Math.random() > 0.85 ? (Math.random() > 0.5 ? 'ring' : 'cross') : 'dot'
    const maxLife = 200 + Math.random() * 300
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.2 - Math.random() * 0.4,
      size: type === 'dot' ? 1 + Math.random() * 2.5 : 3 + Math.random() * 4,
      alpha: 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      life: 0,
      maxLife,
      type,
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    resize()
    window.addEventListener('resize', resize)

    // Initialize particles
    const rect = canvas.getBoundingClientRect()
    const initialCount = Math.min(80, Math.floor((rect.width * rect.height) / 8000))
    for (let i = 0; i < initialCount; i++) {
      const p = createParticle(rect.width, rect.height)
      p.life = Math.random() * p.maxLife // stagger
      p.alpha = Math.min(1, p.life / 30) * (0.3 + Math.random() * 0.4)
      particlesRef.current.push(p)
    }

    // Mouse tracking for interactive glow
    const handleMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    canvas.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      const { width, height } = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, width, height)

      const particles = particlesRef.current
      const mouse = mouseRef.current

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy

        // Mouse interaction — gentle push
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.15
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }

        // Damping
        p.vx *= 0.998
        p.vy *= 0.998

        // Fade in/out
        const lifeRatio = p.life / p.maxLife
        if (lifeRatio < 0.1) {
          p.alpha = (lifeRatio / 0.1) * 0.6
        } else if (lifeRatio > 0.8) {
          p.alpha = ((1 - lifeRatio) / 0.2) * 0.6
        } else {
          p.alpha = 0.3 + Math.sin(p.life * 0.02) * 0.15
        }

        // Remove dead particles
        if (p.life >= p.maxLife || p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20) {
          particles[i] = createParticle(width, height)
          continue
        }

        // Draw
        ctx.save()
        ctx.globalAlpha = p.alpha

        if (p.type === 'dot') {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `${p.color}1)`
          ctx.fill()
          // Glow
          ctx.globalAlpha = p.alpha * 0.3
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `${p.color}0.3)`
          ctx.fill()
        } else if (p.type === 'ring') {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.strokeStyle = `${p.color}0.8)`
          ctx.lineWidth = 0.5
          ctx.stroke()
          // Outer glow ring
          ctx.globalAlpha = p.alpha * 0.2
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2)
          ctx.strokeStyle = `${p.color}0.3)`
          ctx.lineWidth = 0.3
          ctx.stroke()
        } else if (p.type === 'cross') {
          ctx.strokeStyle = `${p.color}0.8)`
          ctx.lineWidth = 0.5
          const s = p.size * 0.6
          ctx.beginPath()
          ctx.moveTo(p.x - s, p.y)
          ctx.lineTo(p.x + s, p.y)
          ctx.moveTo(p.x, p.y - s)
          ctx.lineTo(p.x, p.y + s)
          ctx.stroke()
        }

        ctx.restore()
      }

      // Draw connections between nearby particles
      ctx.save()
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.08 * Math.min(a.alpha, b.alpha)
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`
            ctx.lineWidth = 0.3
            ctx.stroke()
          }
        }
      }
      ctx.restore()

      // Mouse glow effect
      if (mouse.x > 0 && mouse.y > 0) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80)
        gradient.addColorStop(0, 'rgba(124, 58, 237, 0.03)')
        gradient.addColorStop(1, 'rgba(124, 58, 237, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(mouse.x - 80, mouse.y - 80, 160, 160)
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [createParticle])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  )
}
