'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Palette, X, Zap, RotateCcw, Sun, Moon, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

// ── Types ────────────────────────────────────────────────────────
interface ThemeConfig {
  primaryColor: string
  glowIntensity: number
  animationSpeed: 'reduced' | 'normal' | 'fast'
  backgroundStyle: 'gradient' | 'grid' | 'clean'
}

const COLOR_PRESETS = [
  { name: 'Purple', hex: '#7c3aed' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Pink', hex: '#ec4899' },
] as const

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#7c3aed',
  glowIntensity: 50,
  animationSpeed: 'normal',
  backgroundStyle: 'gradient',
}

const STORAGE_KEY = 'prestigio-theme'

const SPEED_OPTIONS: { label: string; value: ThemeConfig['animationSpeed']; icon: typeof Zap }[] = [
  { label: 'Reduced', value: 'reduced', icon: Moon },
  { label: 'Normal', value: 'normal', icon: Sun },
  { label: 'Fast', value: 'fast', icon: Zap },
]

const BG_OPTIONS: { label: string; value: ThemeConfig['backgroundStyle']; icon: typeof Layers }[] = [
  { label: 'Gradient', value: 'gradient', icon: Layers },
  { label: 'Grid Pattern', value: 'grid', icon: Layers },
  { label: 'Clean', value: 'clean', icon: Layers },
]

// ── Helper: hex → "r g b" string for CSS variable usage ─────────
function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `${r} ${g} ${b}`
}

// ── Apply theme to document root CSS variables ───────────────────
function applyTheme(config: ThemeConfig) {
  const root = document.documentElement
  const rgb = hexToRgb(config.primaryColor)

  // Primary color vars
  root.style.setProperty('--primary', config.primaryColor)
  root.style.setProperty('--ring', config.primaryColor)
  root.style.setProperty('--border', `rgba(${rgb}, 0.2)`)

  // Also update sidebar / input vars so everything follows
  root.style.setProperty('--sidebar-primary', config.primaryColor)
  root.style.setProperty('--sidebar-ring', config.primaryColor)
  root.style.setProperty('--sidebar-border', `rgba(${rgb}, 0.2)`)
  root.style.setProperty('--input', `rgba(${rgb}, 0.15)`)

  // Neon primary custom var
  root.style.setProperty('--color-neon-primary', config.primaryColor)

  // Glow intensity — map 0–100 → a multiplier used by data attribute
  root.setAttribute('data-glow-intensity', String(config.glowIntensity))

  // Animation speed
  const speedMs =
    config.animationSpeed === 'reduced' ? '0.6' : config.animationSpeed === 'fast' ? '0.15' : '0.3'
  root.style.setProperty('--transition-speed', `${speedMs}s`)

  // Background style — set data attribute so global CSS can react
  root.setAttribute('data-bg-style', config.backgroundStyle)
}

// ── Component ────────────────────────────────────────────────────
export default function ThemeCustomizer() {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_THEME)
  const [mounted, setMounted] = useState(false)

  // Load persisted theme on mount
  useEffect(() => {
    async function initTheme() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as ThemeConfig
          setConfig(parsed)
          applyTheme(parsed)
        }
      } catch {
        // ignore corrupt data
      }
      setMounted(true)
    }
    initTheme()
  }, [])

  // Persist + apply whenever config changes (after mount)
  useEffect(() => {
    if (!mounted) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    applyTheme(config)
  }, [config, mounted])

  const updateConfig = useCallback(<K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetTheme = useCallback(() => {
    setConfig(DEFAULT_THEME)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* ── Floating trigger button ── */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-32 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-[#0f172a] border border-[#7c3aed]/30 text-[#7c3aed] hover:bg-[#7c3aed]/20 hover:shadow-[0_0_12px_rgba(124,58,237,0.4)] transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Personalizar tema"
      >
        <Palette className="size-5" />
      </motion.button>

      {/* ── Backdrop ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="theme-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Slide-in panel ── */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="theme-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 h-full w-[320px] max-w-[85vw] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Glass morphism container */}
            <div className="h-full bg-[#0f172a]/90 backdrop-blur-xl border-l border-[rgba(124,58,237,0.3)] shadow-[-8px_0_30px_rgba(124,58,237,0.1)]">
              {/* ── Header ── */}
              <div className="flex items-center justify-between p-4 border-b border-[rgba(124,58,237,0.15)]">
                <div className="flex items-center gap-2">
                  <Palette className="size-5 text-[#7c3aed]" />
                  <h2 className="text-sm font-semibold text-[#f1f5f9] tracking-wide">
                    Theme Customizer
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-white/5"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar panel"
                >
                  <X className="size-4" />
                </Button>
              </div>

              <div className="p-4 space-y-6">
                {/* ── Primary Color ── */}
                <section>
                  <h3 className="text-xs font-medium uppercase tracking-wider text-[#94a3b8] mb-3">
                    Primary Color
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {COLOR_PRESETS.map((preset) => {
                      const isSelected = config.primaryColor === preset.hex
                      return (
                        <button
                          key={preset.hex}
                          onClick={() => updateConfig('primaryColor', preset.hex)}
                          className={`
                            flex items-center gap-2 px-2 py-2 rounded-lg border transition-all text-left
                            ${
                              isSelected
                                ? 'border-current bg-white/5 shadow-[0_0_12px_rgba(124,58,237,0.25)]'
                                : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                            }
                          `}
                          style={{ color: preset.hex }}
                        >
                          {/* Swatch */}
                          <span
                            className="shrink-0 size-4 rounded-full border border-white/10"
                            style={{
                              backgroundColor: preset.hex,
                              boxShadow: isSelected
                                ? `0 0 8px ${preset.hex}80, 0 0 16px ${preset.hex}40`
                                : 'none',
                            }}
                          />
                          <span className="text-[11px] font-medium text-[#cbd5e1] leading-tight">
                            {preset.name}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </section>

                {/* ── Accent Glow Intensity ── */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-medium uppercase tracking-wider text-[#94a3b8]">
                      Glow Intensity
                    </h3>
                    <span
                      className="text-xs font-mono text-[#7c3aed]"
                      style={{ color: config.primaryColor }}
                    >
                      {config.glowIntensity}%
                    </span>
                  </div>
                  <Slider
                    value={[config.glowIntensity]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(val) => updateConfig('glowIntensity', val[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-1.5 text-[10px] text-[#64748b]">
                    <span>Off</span>
                    <span>Max</span>
                  </div>
                </section>

                {/* ── Animation Speed ── */}
                <section>
                  <h3 className="text-xs font-medium uppercase tracking-wider text-[#94a3b8] mb-3">
                    Animation Speed
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {SPEED_OPTIONS.map((opt) => {
                      const isSelected = config.animationSpeed === opt.value
                      const Icon = opt.icon
                      return (
                        <button
                          key={opt.value}
                          onClick={() => updateConfig('animationSpeed', opt.value)}
                          className={`
                            flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg border transition-all
                            ${
                              isSelected
                                ? 'border-current bg-white/5 shadow-[0_0_8px_rgba(124,58,237,0.2)]'
                                : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                            }
                          `}
                          style={{ color: isSelected ? config.primaryColor : undefined }}
                        >
                          <Icon className="size-4 text-[#94a3b8]" />
                          <span className="text-[10px] font-medium text-[#cbd5e1]">{opt.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </section>

                {/* ── Background Style ── */}
                <section>
                  <h3 className="text-xs font-medium uppercase tracking-wider text-[#94a3b8] mb-3">
                    Background Style
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {BG_OPTIONS.map((opt) => {
                      const isSelected = config.backgroundStyle === opt.value
                      const Icon = opt.icon
                      return (
                        <button
                          key={opt.value}
                          onClick={() => updateConfig('backgroundStyle', opt.value)}
                          className={`
                            flex flex-col items-center gap-1.5 px-2 py-2.5 rounded-lg border transition-all
                            ${
                              isSelected
                                ? 'border-current bg-white/5 shadow-[0_0_8px_rgba(124,58,237,0.2)]'
                                : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                            }
                          `}
                          style={{ color: isSelected ? config.primaryColor : undefined }}
                        >
                          <Icon className="size-4 text-[#94a3b8]" />
                          <span className="text-[10px] font-medium text-[#cbd5e1]">{opt.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </section>

                {/* ── Reset ── */}
                <section className="pt-2 border-t border-white/5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-white/10 text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-white/5 hover:border-white/20"
                    onClick={resetTheme}
                  >
                    <RotateCcw className="size-3.5 mr-1.5" />
                    Reset to Default
                  </Button>
                </section>

                {/* ── Live preview swatch ── */}
                <section className="pt-1">
                  <div
                    className="h-12 rounded-lg border border-white/5 flex items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: `${config.primaryColor}15`,
                      borderColor: `${config.primaryColor}30`,
                      boxShadow:
                        config.glowIntensity > 0
                          ? `0 0 ${config.glowIntensity * 0.3}px ${config.primaryColor}${
                              Math.round(config.glowIntensity * 0.4)
                                .toString(16)
                                .padStart(2, '0')
                            }`
                          : 'none',
                    }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{ color: config.primaryColor }}
                    >
                      Live Preview
                    </span>
                  </div>
                </section>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
