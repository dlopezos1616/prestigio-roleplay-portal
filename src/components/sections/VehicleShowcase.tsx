'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Gauge,
  Zap,
  CircleDot,
  Wind,
  Car,
  Bike,
  Truck,
  Flag,
} from 'lucide-react'

interface Vehicle {
  name: string
  class: string
  speed: number
  acceleration: number
  braking: number
  traction: number
  description: string
  icon: typeof Car
}

const vehicles: Vehicle[] = [
  {
    name: 'Inferno Z',
    class: 'Deportivo',
    speed: 95,
    acceleration: 88,
    braking: 76,
    traction: 82,
    description: 'El superdeportivo más rápido de Los Santos',
    icon: Car,
  },
  {
    name: 'Patriot Custom',
    class: 'SUV',
    speed: 72,
    acceleration: 65,
    braking: 70,
    traction: 85,
    description: 'Todo terreno con estilo militar',
    icon: Truck,
  },
  {
    name: 'Sabre GT',
    class: 'Muscle',
    speed: 82,
    acceleration: 90,
    braking: 60,
    traction: 68,
    description: 'Potencia bruta americana en cada curva',
    icon: Car,
  },
  {
    name: 'Sultan RS',
    class: 'Deportivo',
    speed: 88,
    acceleration: 85,
    braking: 80,
    traction: 78,
    description: 'El sedán deportivo definitivo',
    icon: Car,
  },
  {
    name: 'Sandking SWB',
    class: 'Off-Road',
    speed: 65,
    acceleration: 55,
    braking: 58,
    traction: 92,
    description: 'Domina cualquier terreno con facilidad',
    icon: Truck,
  },
  {
    name: 'Bati 801',
    class: 'Moto',
    speed: 90,
    acceleration: 95,
    braking: 65,
    traction: 60,
    description: 'Adrenalina sobre dos ruedas',
    icon: Bike,
  },
]

const classColors: Record<string, { color: string; rgb: string }> = {
  Deportivo: { color: '#06b6d4', rgb: '6, 182, 212' },
  SUV: { color: '#f59e0b', rgb: '245, 158, 11' },
  Muscle: { color: '#ef4444', rgb: '239, 68, 68' },
  'Off-Road': { color: '#22c55e', rgb: '34, 197, 94' },
  Moto: { color: '#7c3aed', rgb: '124, 58, 237' },
}

function StatBar({
  label,
  value,
  color,
  rgb,
  icon: Icon,
  delay = 0,
  animate,
}: {
  label: string
  value: number
  color: string
  rgb: string
  icon: typeof Gauge
  delay?: number
  animate: boolean
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5" style={{ color }} />
          <span className="text-[#94a3b8] text-xs font-medium uppercase tracking-wider">
            {label}
          </span>
        </div>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>
          {value}
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: animate ? `${value}%` : 0 }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}99)`,
            boxShadow: `0 0 8px rgba(${rgb}, 0.4)`,
          }}
        >
          {/* Shimmer highlight */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(${rgb}, 0.3), transparent)`,
              animation: 'shimmerMove 2s ease-in-out infinite',
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}

function MiniStatBar({
  value,
  color,
  rgb,
}: {
  value: number
  color: string
  rgb: string
}) {
  return (
    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}, ${color}99)`,
          boxShadow: `0 0 6px rgba(${rgb}, 0.3)`,
        }}
      />
    </div>
  )
}

export default function VehicleShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [animateStats, setAnimateStats] = useState(false)

  const activeVehicle = vehicles[activeIndex]
  const classInfo = classColors[activeVehicle.class] || classColors['Deportivo']

  const navigate = useCallback(
    (dir: number) => {
      setDirection(dir)
      const newIndex = (activeIndex + dir + vehicles.length) % vehicles.length
      setActiveIndex(newIndex)
      setAnimateStats(false)
    },
    [activeIndex]
  )

  useEffect(() => {
    const timer = setTimeout(() => setAnimateStats(true), 50)
    return () => clearTimeout(timer)
  }, [activeIndex])

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      navigate(1)
    }, 5000)
    return () => clearInterval(interval)
  }, [navigate])

  const getCarouselPosition = (index: number) => {
    const diff = index - activeIndex
    // Handle wrapping
    const wrappedDiff =
      diff > vehicles.length / 2
        ? diff - vehicles.length
        : diff < -vehicles.length / 2
          ? diff + vehicles.length
          : diff

    if (wrappedDiff === 0) return { x: 0, scale: 1, rotateY: 0, z: 10, opacity: 1 }
    if (Math.abs(wrappedDiff) === 1)
      return {
        x: wrappedDiff * 260,
        scale: 0.82,
        rotateY: wrappedDiff * -15,
        z: 0,
        opacity: 0.7,
      }
    if (Math.abs(wrappedDiff) === 2)
      return {
        x: wrappedDiff * 380,
        scale: 0.65,
        rotateY: wrappedDiff * -25,
        z: -10,
        opacity: 0.4,
      }
    return { x: wrappedDiff * 460, scale: 0.5, rotateY: wrappedDiff * -30, z: -20, opacity: 0 }
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0 hex-pattern opacity-40" />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#7c3aed]/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-[#06b6d4]/5 rounded-full blur-[150px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#7c3aed]/50" />
            <Car className="w-6 h-6 text-[#7c3aed]" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#7c3aed]/50" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
          >
            <span className="text-[#7c3aed] neon-text-glow">Vehículos Destacados</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#94a3b8] text-lg"
          >
            Los mejores vehículos custom del servidor
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-4 h-0.5 mx-auto max-w-[120px] rounded-full bg-gradient-to-r from-transparent via-[#7c3aed] to-transparent"
            style={{ boxShadow: '0 0 10px rgba(124,58,237,0.5)' }}
          />
        </div>

        {/* 3D Carousel */}
        <div className="relative mb-16">
          {/* Navigation Arrows */}
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#0f172a]/80 backdrop-blur-xl border border-[rgba(124,58,237,0.3)] flex items-center justify-center text-[#7c3aed] hover:bg-[#7c3aed]/20 hover:border-[#7c3aed]/60 transition-all duration-300 group"
            style={{
              boxShadow: '0 0 10px rgba(124,58,237,0.15)',
            }}
            aria-label="Vehículo anterior"
          >
            <ChevronLeft className="w-6 h-6 transition-transform duration-300 group-hover:-translate-x-0.5" />
          </button>
          <button
            onClick={() => navigate(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-[#0f172a]/80 backdrop-blur-xl border border-[rgba(124,58,237,0.3)] flex items-center justify-center text-[#7c3aed] hover:bg-[#7c3aed]/20 hover:border-[#7c3aed]/60 transition-all duration-300 group"
            style={{
              boxShadow: '0 0 10px rgba(124,58,237,0.15)',
            }}
            aria-label="Siguiente vehículo"
          >
            <ChevronRight className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>

          {/* Carousel Stage */}
          <div className="flex items-center justify-center py-8 sm:py-12" style={{ perspective: '1200px' }}>
            <div className="relative w-full max-w-6xl h-[320px] sm:h-[360px]">
              {vehicles.map((vehicle, index) => {
                const pos = getCarouselPosition(index)
                const isActive = index === activeIndex
                const vClass = classColors[vehicle.class] || classColors['Deportivo']
                const IconComponent = vehicle.icon

                return (
                  <motion.div
                    key={vehicle.name}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ perspective: '800px' }}
                    animate={{
                      x: pos.x,
                      scale: pos.scale,
                      rotateY: pos.rotateY,
                      zIndex: pos.z + 10,
                      opacity: pos.opacity,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 30,
                    }}
                    onClick={() => {
                      if (!isActive) {
                        setDirection(index > activeIndex ? 1 : -1)
                        setActiveIndex(index)
                        setAnimateStats(false)
                      }
                    }}
                  >
                    <div
                      className={`relative w-[260px] sm:w-[300px] rounded-xl overflow-hidden cursor-pointer transition-shadow duration-500 ${
                        isActive ? 'shimmer-sweep' : ''
                      }`}
                      style={{
                        background: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(24px)',
                        border: isActive
                          ? `1.5px solid ${vClass.color}`
                          : '1px solid rgba(124, 58, 237, 0.15)',
                        boxShadow: isActive
                          ? `0 0 15px rgba(${vClass.rgb}, 0.3), 0 0 40px rgba(${vClass.rgb}, 0.15), inset 0 0 15px rgba(${vClass.rgb}, 0.05)`
                          : '0 0 10px rgba(0,0,0,0.2)',
                      }}
                    >
                      {/* Top accent line */}
                      <div
                        className="absolute top-0 left-0 right-0 h-[2px] z-10"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${vClass.color}, transparent)`,
                          opacity: isActive ? 1 : 0.4,
                        }}
                      />

                      {/* Vehicle icon area */}
                      <div
                        className="relative h-32 sm:h-36 flex items-center justify-center overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, rgba(${vClass.rgb}, 0.08), rgba(${vClass.rgb}, 0.02))`,
                        }}
                      >
                        {/* Decorative circles */}
                        <div
                          className="absolute w-40 h-40 rounded-full opacity-10"
                          style={{
                            border: `2px solid ${vClass.color}`,
                            top: '-20px',
                            right: '-20px',
                          }}
                        />
                        <div
                          className="absolute w-24 h-24 rounded-full opacity-5"
                          style={{
                            border: `1.5px solid ${vClass.color}`,
                            bottom: '-10px',
                            left: '-10px',
                          }}
                        />

                        <motion.div
                          animate={{
                            scale: isActive ? 1 : 0.85,
                          }}
                          transition={{ duration: 0.4 }}
                        >
                          <IconComponent
                            className="w-16 h-16 transition-all duration-500"
                            style={{
                              color: vClass.color,
                              filter: isActive
                                ? `drop-shadow(0 0 12px rgba(${vClass.rgb}, 0.5))`
                                : 'none',
                            }}
                          />
                        </motion.div>

                        {/* Class badge */}
                        <div
                          className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor: `rgba(${vClass.rgb}, 0.15)`,
                            color: vClass.color,
                            border: `1px solid rgba(${vClass.rgb}, 0.3)`,
                          }}
                        >
                          {vehicle.class}
                        </div>
                      </div>

                      {/* Card content */}
                      <div className="p-4 space-y-3">
                        <h3
                          className="text-lg font-bold truncate"
                          style={{ color: isActive ? vClass.color : '#e2e8f0' }}
                        >
                          {vehicle.name}
                        </h3>

                        {/* Mini stat bars */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Gauge className="w-3 h-3 text-[#64748b] shrink-0" />
                            <div className="flex-1">
                              <MiniStatBar value={vehicle.speed} color={vClass.color} rgb={vClass.rgb} />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-[#64748b] shrink-0" />
                            <div className="flex-1">
                              <MiniStatBar value={vehicle.acceleration} color={vClass.color} rgb={vClass.rgb} />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <CircleDot className="w-3 h-3 text-[#64748b] shrink-0" />
                            <div className="flex-1">
                              <MiniStatBar value={vehicle.traction} color={vClass.color} rgb={vClass.rgb} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hover glow overlay */}
                      <div
                        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          boxShadow: `0 0 25px rgba(${vClass.rgb}, 0.4), 0 0 60px rgba(${vClass.rgb}, 0.15)`,
                        }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 mt-2">
            {vehicles.map((vehicle, index) => {
              const vClass = classColors[vehicle.class] || classColors['Deportivo']
              const isActive = index === activeIndex
              return (
                <button
                  key={vehicle.name}
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1)
                    setActiveIndex(index)
                    setAnimateStats(false)
                  }}
                  className="transition-all duration-300"
                  aria-label={`Seleccionar ${vehicle.name}`}
                >
                  <motion.div
                    animate={{
                      width: isActive ? 28 : 8,
                      backgroundColor: isActive ? vClass.color : 'rgba(100, 116, 139, 0.3)',
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-2 rounded-full"
                    style={{
                      boxShadow: isActive ? `0 0 8px rgba(${vClass.rgb}, 0.4)` : 'none',
                    }}
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* Vehicle Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeVehicle.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative rounded-xl overflow-hidden"
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(24px)',
              border: `1.5px solid rgba(${classInfo.rgb}, 0.3)`,
              boxShadow: `0 0 20px rgba(${classInfo.rgb}, 0.1), inset 0 0 20px rgba(${classInfo.rgb}, 0.03)`,
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] z-10"
              style={{
                background: `linear-gradient(90deg, transparent, ${classInfo.color}, transparent)`,
              }}
            />

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left Column: Vehicle Info */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: `rgba(${classInfo.rgb}, 0.12)`,
                          border: `1px solid rgba(${classInfo.rgb}, 0.25)`,
                        }}
                      >
                        <activeVehicle.icon
                          className="w-5 h-5"
                          style={{ color: classInfo.color }}
                        />
                      </div>
                      <div>
                        <span
                          className="text-xs font-bold uppercase tracking-widest"
                          style={{ color: classInfo.color }}
                        >
                          {activeVehicle.class}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      {activeVehicle.name}
                    </h3>
                    <p className="text-[#94a3b8] text-base leading-relaxed">
                      {activeVehicle.description}
                    </p>
                  </div>

                  {/* Overall rating */}
                  <div
                    className="flex items-center gap-4 p-4 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, rgba(${classInfo.rgb}, 0.06), rgba(${classInfo.rgb}, 0.02))`,
                      border: `1px solid rgba(${classInfo.rgb}, 0.12)`,
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl"
                      style={{
                        backgroundColor: `rgba(${classInfo.rgb}, 0.15)`,
                        color: classInfo.color,
                        border: `1px solid rgba(${classInfo.rgb}, 0.3)`,
                        boxShadow: `0 0 10px rgba(${classInfo.rgb}, 0.2)`,
                      }}
                    >
                      {Math.round(
                        (activeVehicle.speed +
                          activeVehicle.acceleration +
                          activeVehicle.braking +
                          activeVehicle.traction) /
                          4
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Puntuación Global</div>
                      <div className="text-xs text-[#64748b]">
                        Promedio de todas las estadísticas
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    className="group relative w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider text-white overflow-hidden transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${classInfo.color}, ${classInfo.color}cc)`,
                      boxShadow: `0 0 15px rgba(${classInfo.rgb}, 0.3), 0 0 40px rgba(${classInfo.rgb}, 0.15)`,
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Flag className="w-4 h-4" />
                      Ver en servidor
                    </span>
                    {/* Hover sweep */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)`,
                      }}
                    />
                  </button>
                </div>

                {/* Right Column: Detailed Stats */}
                <div className="space-y-5">
                  <h4
                    className="text-sm font-bold uppercase tracking-widest flex items-center gap-2"
                    style={{ color: classInfo.color }}
                  >
                    <Wind className="w-4 h-4" />
                    Estadísticas Detalladas
                  </h4>

                  <div className="space-y-4">
                    <StatBar
                      label="Velocidad Máxima"
                      value={activeVehicle.speed}
                      color={classInfo.color}
                      rgb={classInfo.rgb}
                      icon={Gauge}
                      delay={0}
                      animate={animateStats}
                    />
                    <StatBar
                      label="Aceleración"
                      value={activeVehicle.acceleration}
                      color={classInfo.color}
                      rgb={classInfo.rgb}
                      icon={Zap}
                      delay={0.1}
                      animate={animateStats}
                    />
                    <StatBar
                      label="Frenado"
                      value={activeVehicle.braking}
                      color={classInfo.color}
                      rgb={classInfo.rgb}
                      icon={CircleDot}
                      delay={0.2}
                      animate={animateStats}
                    />
                    <StatBar
                      label="Tracción"
                      value={activeVehicle.traction}
                      color={classInfo.color}
                      rgb={classInfo.rgb}
                      icon={Wind}
                      delay={0.3}
                      animate={animateStats}
                    />
                  </div>

                  {/* Stat summary badges */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <div
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{
                        backgroundColor: `rgba(${classInfo.rgb}, 0.1)`,
                        color: classInfo.color,
                        border: `1px solid rgba(${classInfo.rgb}, 0.2)`,
                      }}
                    >
                      <span className="font-black">{activeVehicle.speed}</span> Vel. Máx
                    </div>
                    <div
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{
                        backgroundColor: `rgba(${classInfo.rgb}, 0.1)`,
                        color: classInfo.color,
                        border: `1px solid rgba(${classInfo.rgb}, 0.2)`,
                      }}
                    >
                      <span className="font-black">{activeVehicle.acceleration}</span> Aceleración
                    </div>
                    <div
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{
                        backgroundColor: `rgba(${classInfo.rgb}, 0.1)`,
                        color: classInfo.color,
                        border: `1px solid rgba(${classInfo.rgb}, 0.2)`,
                      }}
                    >
                      <span className="font-black">{activeVehicle.braking}</span> Frenado
                    </div>
                    <div
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{
                        backgroundColor: `rgba(${classInfo.rgb}, 0.1)`,
                        color: classInfo.color,
                        border: `1px solid rgba(${classInfo.rgb}, 0.2)`,
                      }}
                    >
                      <span className="font-black">{activeVehicle.traction}</span> Tracción
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
