'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Shield,
  Heart,
  Building,
  Wrench,
  Skull,
  Crosshair,
  X,
  Navigation,
  Layers,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type LocationCategory = 'police' | 'ems' | 'business' | 'crime' | 'mechanic'

interface MapLocation {
  id: string
  name: string
  x: number // percentage position on map (0–100)
  y: number
  category: LocationCategory
  color: string
  description: string
  icon: LucideIcon
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const locations: MapLocation[] = [
  {
    id: 'lspd',
    name: 'Comisaría LSPD',
    x: 35,
    y: 30,
    category: 'police',
    color: '#06b6d4',
    description: 'Cuartel general de la policía de Los Santos. Centro de operaciones de todas las patrullas y unidades especiales.',
    icon: Shield,
  },
  {
    id: 'hospital',
    name: 'Hospital Central',
    x: 55,
    y: 25,
    category: 'ems',
    color: '#22c55e',
    description: 'Centro médico principal de la ciudad. Atención 24/7, cirugías y servicios de emergencia.',
    icon: Heart,
  },
  {
    id: 'garaje',
    name: 'Garaje Central',
    x: 25,
    y: 55,
    category: 'mechanic',
    color: '#f97316',
    description: 'Taller de reparaciones y tuning. El lugar donde los mecánicos hacen su magia.',
    icon: Wrench,
  },
  {
    id: 'crimen-norte',
    name: 'Callejero Norte',
    x: 70,
    y: 20,
    category: 'crime',
    color: '#ef4444',
    description: 'Zona de actividad criminal conocida. Las sombras esconden los secretos más oscuros de la ciudad.',
    icon: Skull,
  },
  {
    id: 'puerto',
    name: 'Puerto',
    x: 15,
    y: 70,
    category: 'business',
    color: '#f59e0b',
    description: 'Zona portuaria y de negocios. Importaciones, exportaciones y tratos bajo la mesa.',
    icon: Building,
  },
  {
    id: 'centro-comercial',
    name: 'Centro Comercial',
    x: 50,
    y: 50,
    category: 'business',
    color: '#f59e0b',
    description: 'Principal zona comercial de LS. Tiendas, restaurantes y vida social.',
    icon: Building,
  },
  {
    id: 'fbi',
    name: 'FBI Headquarters',
    x: 65,
    y: 40,
    category: 'police',
    color: '#f59e0b',
    description: 'Oficinas federales de investigación. Operaciones encubiertas y vigilancia de alto nivel.',
    icon: Crosshair,
  },
  {
    id: 'barrio-sur',
    name: 'Barrio Sur',
    x: 30,
    y: 75,
    category: 'crime',
    color: '#ef4444',
    description: 'Territorio de bandas del sur. Respeta el territorio o enfrenta las consecuencias.',
    icon: Skull,
  },
  {
    id: 'aeropuerto',
    name: 'Aeropuerto',
    x: 80,
    y: 65,
    category: 'business',
    color: '#f59e0b',
    description: 'Aeropuerto internacional de LS. La puerta de entrada y salida de la ciudad.',
    icon: Building,
  },
  {
    id: 'taller-este',
    name: 'Taller Este',
    x: 75,
    y: 50,
    category: 'mechanic',
    color: '#f97316',
    description: 'Segundo taller de la ciudad. Especializado en reparaciones rápidas y tuning de alto rendimiento.',
    icon: Wrench,
  },
]

const categoryConfig: Record<LocationCategory, { label: string; icon: LucideIcon; color: string }> = {
  police: { label: 'Policía', icon: Shield, color: '#06b6d4' },
  ems: { label: 'EMS', icon: Heart, color: '#22c55e' },
  business: { label: 'Negocios', icon: Building, color: '#f59e0b' },
  crime: { label: 'Crimen', icon: Skull, color: '#ef4444' },
  mechanic: { label: 'Talleres', icon: Wrench, color: '#f97316' },
}

const categoryKeys = Object.keys(categoryConfig) as LocationCategory[]

/* ------------------------------------------------------------------ */
/*  SVG Map Sub-components                                             */
/* ------------------------------------------------------------------ */

function CyberpunkGrid() {
  const lines = []
  // Vertical lines
  for (let i = 0; i <= 20; i++) {
    lines.push(
      <line
        key={`v-${i}`}
        x1={`${i * 5}%`}
        y1="0%"
        x2={`${i * 5}%`}
        y2="100%"
        stroke="#7c3aed"
        strokeWidth={i % 4 === 0 ? 0.5 : 0.25}
        opacity={i % 4 === 0 ? 0.12 : 0.05}
      />
    )
  }
  // Horizontal lines
  for (let i = 0; i <= 14; i++) {
    lines.push(
      <line
        key={`h-${i}`}
        x1="0%"
        y1={`${i * 7}%`}
        x2="100%"
        y2={`${i * 7}%`}
        stroke="#7c3aed"
        strokeWidth={i % 2 === 0 ? 0.5 : 0.25}
        opacity={i % 2 === 0 ? 0.12 : 0.05}
      />
    )
  }
  return <g className="grid-lines">{lines}</g>
}

function MajorRoads() {
  return (
    <g className="major-roads">
      {/* Main horizontal highway */}
      <line x1="0%" y1="40%" x2="100%" y2="40%" stroke="#7c3aed" strokeWidth="2" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
      </line>
      {/* Main vertical highway */}
      <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#7c3aed" strokeWidth="2" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3.5s" repeatCount="indefinite" />
      </line>
      {/* Diagonal road NE */}
      <line x1="20%" y1="10%" x2="85%" y2="60%" stroke="#7c3aed" strokeWidth="1.2" opacity="0.18" />
      {/* Diagonal road SW */}
      <line x1="10%" y1="55%" x2="65%" y2="90%" stroke="#7c3aed" strokeWidth="1.2" opacity="0.18" />
      {/* Secondary horizontal */}
      <line x1="5%" y1="22%" x2="90%" y2="22%" stroke="#7c3aed" strokeWidth="0.8" opacity="0.12" />
      <line x1="10%" y1="65%" x2="95%" y2="65%" stroke="#7c3aed" strokeWidth="0.8" opacity="0.12" />
      {/* Secondary vertical */}
      <line x1="30%" y1="5%" x2="30%" y2="95%" stroke="#7c3aed" strokeWidth="0.8" opacity="0.12" />
      <line x1="70%" y1="5%" x2="70%" y2="85%" stroke="#7c3aed" strokeWidth="0.8" opacity="0.12" />
      {/* Ring road segments */}
      <path
        d="M 25 15 Q 50 8 75 15 Q 82 40 80 65 Q 75 85 50 90 Q 25 85 18 65 Q 15 40 25 15"
        stroke="#7c3aed"
        strokeWidth="1"
        fill="none"
        opacity="0.1"
        transform="translate(0,0) scale(1 1)"
      />
      {/* Glow filter for highways */}
      <defs>
        <filter id="road-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Re-draw highways with glow */}
      <line x1="0%" y1="40%" x2="100%" y2="40%" stroke="#7c3aed" strokeWidth="1" opacity="0.6" filter="url(#road-glow)" />
      <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#7c3aed" strokeWidth="1" opacity="0.6" filter="url(#road-glow)" />
    </g>
  )
}

function WaterAreas() {
  return (
    <g className="water-areas">
      {/* Ocean / coastline on the south */}
      <path
        d="M 0 82 Q 15 78 30 83 Q 50 88 70 82 Q 85 79 100 83 L 100 100 L 0 100 Z"
        fill="#06b6d4"
        opacity="0.08"
      />
      {/* Water shimmer */}
      <path
        d="M 0 82 Q 15 78 30 83 Q 50 88 70 82 Q 85 79 100 83 L 100 100 L 0 100 Z"
        fill="none"
        stroke="#06b6d4"
        strokeWidth="0.5"
        opacity="0.25"
      >
        <animate attributeName="opacity" values="0.15;0.35;0.15" dur="4s" repeatCount="indefinite" />
      </path>
      {/* West coast water */}
      <path
        d="M 0 55 Q 5 60 3 70 Q 2 78 0 82 L 0 55 Z"
        fill="#06b6d4"
        opacity="0.08"
      />
      {/* Lake in the hills */}
      <ellipse cx="82" cy="28" rx="6" ry="4" fill="#06b6d4" opacity="0.06" stroke="#06b6d4" strokeWidth="0.3" strokeOpacity="0.15" />
    </g>
  )
}

function BuildingBlocks() {
  return (
    <g className="building-blocks">
      {/* Downtown cluster - center */}
      <rect x="42" y="38" width="16" height="12" rx="1" fill="#1e293b" opacity="0.6" stroke="#334155" strokeWidth="0.3" />
      <rect x="44" y="40" width="5" height="4" rx="0.5" fill="#1e293b" opacity="0.4" stroke="#475569" strokeWidth="0.2" />
      <rect x="51" y="40" width="5" height="4" rx="0.5" fill="#1e293b" opacity="0.4" stroke="#475569" strokeWidth="0.2" />
      <rect x="44" y="45" width="5" height="3" rx="0.5" fill="#1e293b" opacity="0.4" stroke="#475569" strokeWidth="0.2" />
      <rect x="51" y="45" width="5" height="3" rx="0.5" fill="#1e293b" opacity="0.4" stroke="#475569" strokeWidth="0.2" />

      {/* Police district - north central */}
      <rect x="28" y="22" width="14" height="10" rx="1" fill="#1e293b" opacity="0.5" stroke="#0e7490" strokeWidth="0.3" />
      <rect x="30" y="24" width="4" height="3" rx="0.5" fill="#1e293b" opacity="0.3" />
      <rect x="36" y="24" width="4" height="3" rx="0.5" fill="#1e293b" opacity="0.3" />

      {/* Hospital area - northeast */}
      <rect x="50" y="18" width="12" height="9" rx="1" fill="#1e293b" opacity="0.5" stroke="#16a34a" strokeWidth="0.3" />
      <rect x="52" y="20" width="8" height="5" rx="0.5" fill="#1e293b" opacity="0.3" />

      {/* Airport - east */}
      <rect x="73" y="58" width="18" height="8" rx="1" fill="#1e293b" opacity="0.4" stroke="#475569" strokeWidth="0.3" />
      <line x1="75" y1="62" x2="89" y2="62" stroke="#64748b" strokeWidth="0.5" opacity="0.4" strokeDasharray="2 1" />

      {/* Port - southwest */}
      <rect x="8" y="62" width="12" height="8" rx="1" fill="#1e293b" opacity="0.4" stroke="#475569" strokeWidth="0.3" />

      {/* South district */}
      <rect x="22" y="67" width="16" height="10" rx="1" fill="#1e293b" opacity="0.5" stroke="#7f1d1d" strokeWidth="0.3" />
      <rect x="24" y="69" width="5" height="3" rx="0.5" fill="#1e293b" opacity="0.3" />
      <rect x="31" y="69" width="5" height="3" rx="0.5" fill="#1e293b" opacity="0.3" />
      <rect x="24" y="73" width="12" height="2" rx="0.5" fill="#1e293b" opacity="0.3" />

      {/* North hills / residential */}
      <rect x="60" y="12" width="10" height="8" rx="1" fill="#1e293b" opacity="0.35" stroke="#475569" strokeWidth="0.2" />

      {/* Garage block */}
      <rect x="18" y="48" width="12" height="10" rx="1" fill="#1e293b" opacity="0.5" stroke="#c2410c" strokeWidth="0.3" />

      {/* East workshop */}
      <rect x="69" y="43" width="12" height="10" rx="1" fill="#1e293b" opacity="0.5" stroke="#c2410c" strokeWidth="0.3" />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/*  Location Marker                                                    */
/* ------------------------------------------------------------------ */

function LocationMarker({
  location,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  visible,
}: {
  location: MapLocation
  isSelected: boolean
  isHovered: boolean
  onSelect: () => void
  onHover: (id: string | null) => void
  visible: boolean
}) {
  const IconComponent = location.icon

  return (
    <AnimatePresence>
      {visible && (
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
          style={{ cursor: 'pointer' }}
          onClick={onSelect}
          onMouseEnter={() => onHover(location.id)}
          onMouseLeave={() => onHover(null)}
        >
          {/* Pulse ring - outer */}
          <motion.circle
            cx={`${location.x}%`}
            cy={`${location.y}%`}
            r={isSelected ? 14 : isHovered ? 12 : 8}
            fill="none"
            stroke={location.color}
            strokeWidth={isSelected ? 2 : 1}
            opacity={isSelected ? 0.6 : isHovered ? 0.4 : 0.2}
            animate={
              isSelected
                ? { r: [10, 16, 10], opacity: [0.6, 0.2, 0.6] }
                : isHovered
                ? { r: [8, 13, 8], opacity: [0.4, 0.15, 0.4] }
                : {}
            }
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Second pulse ring for selected */}
          {isSelected && (
            <motion.circle
              cx={`${location.x}%`}
              cy={`${location.y}%`}
              r={18}
              fill="none"
              stroke={location.color}
              strokeWidth={1}
              animate={{ r: [14, 22, 14], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            />
          )}

          {/* Glow circle */}
          <circle
            cx={`${location.x}%`}
            cy={`${location.y}%`}
            r={isHovered || isSelected ? 7 : 5}
            fill={location.color}
            opacity={0.15}
            filter="url(#marker-glow)"
          />

          {/* Main dot */}
          <motion.circle
            cx={`${location.x}%`}
            cy={`${location.y}%`}
            r={isSelected ? 6 : isHovered ? 5.5 : 4}
            fill={location.color}
            style={{
              filter: `drop-shadow(0 0 4px ${location.color}) drop-shadow(0 0 8px ${location.color}40)`,
            }}
            animate={
              isSelected
                ? { scale: [1, 1.15, 1] }
                : isHovered
                ? { scale: [1, 1.1, 1] }
                : {}
            }
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Inner white dot */}
          <circle
            cx={`${location.x}%`}
            cy={`${location.y}%`}
            r={1.5}
            fill="white"
            opacity={0.8}
          />

          {/* Icon at marker - only on hover/select */}
          {(isHovered || isSelected) && (
            <motion.foreignObject
              x={`${location.x - 1.5}%`}
              y={`${location.y - 3}%`}
              width="3%"
              height="3%"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              style={{ overflow: 'visible' }}
            >
              <div className="flex items-center justify-center w-full h-full">
                <IconComponent
                  style={{ color: location.color, width: '100%', height: '100%', maxWidth: 16, maxHeight: 16, filter: `drop-shadow(0 0 3px ${location.color})` }}
                />
              </div>
            </motion.foreignObject>
          )}

          {/* Label tooltip on hover */}
          {(isHovered || isSelected) && (
            <motion.g
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              <rect
                x={`${location.x - 8}%`}
                y={`${location.y - 10}%`}
                width="16%"
                height="5%"
                rx="3"
                fill="#0f172a"
                stroke={location.color}
                strokeWidth="0.5"
                opacity="0.95"
              />
              <text
                x={`${location.x}%`}
                y={`${location.y - 7.2}%`}
                textAnchor="middle"
                fill={location.color}
                fontSize="3.2"
                fontFamily="system-ui, sans-serif"
                fontWeight="600"
                style={{ textShadow: `0 0 6px ${location.color}60` }}
              >
                {location.name}
              </text>
            </motion.g>
          )}
        </motion.g>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/*  Details Panel                                                      */
/* ------------------------------------------------------------------ */

function DetailsPanel({
  location,
  onClose,
}: {
  location: MapLocation | null
  onClose: () => void
}) {
  const IconComponent = location?.icon ?? MapPin

  return (
    <AnimatePresence>
      {location && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute top-4 right-4 w-80 max-w-[calc(100%-2rem)] z-20"
        >
          <div
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: '#0f172a',
              border: `1px solid ${location.color}40`,
              boxShadow: `0 0 20px ${location.color}20, 0 0 60px ${location.color}10, 0 8px 32px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Header */}
            <div
              className="relative p-5 pb-4"
              style={{
                background: `linear-gradient(135deg, ${location.color}15 0%, transparent 60%)`,
                borderBottom: `1px solid ${location.color}20`,
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-1.5 rounded-lg transition-colors hover:bg-white/10"
                style={{ color: location.color }}
                aria-label="Cerrar panel"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${location.color}15`,
                    border: `1px solid ${location.color}30`,
                  }}
                >
                  <IconComponent
                    className="w-6 h-6"
                    style={{ color: location.color, filter: `drop-shadow(0 0 4px ${location.color})` }}
                  />
                </div>
                <div className="min-w-0">
                  <h3
                    className="text-lg font-bold truncate"
                    style={{ color: location.color }}
                  >
                    {location.name}
                  </h3>
                  <span
                    className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: `${location.color}15`,
                      color: location.color,
                      border: `1px solid ${location.color}25`,
                    }}
                  >
                    {categoryConfig[location.category].label}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-5">
              <p className="text-[#94a3b8] text-sm leading-relaxed mb-5">
                {location.description}
              </p>

              {/* Location coordinates */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4"
                style={{ backgroundColor: `${location.color}08`, border: `1px solid ${location.color}15` }}
              >
                <Navigation className="w-4 h-4" style={{ color: location.color }} />
                <span className="text-xs text-[#64748b]">
                  Coordenadas: {location.x.toFixed(0)}°N, {location.y.toFixed(0)}°W
                </span>
              </div>

              {/* Status indicator */}
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: location.color, boxShadow: `0 0 6px ${location.color}` }}
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs text-[#64748b]">Ubicación activa</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function CityMap() {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState<Set<LocationCategory>>(
    new Set(categoryKeys)
  )

  const toggleFilter = useCallback((category: LocationCategory) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
        // Don't allow deselecting all
        if (next.size > 1) {
          next.delete(category)
        }
      } else {
        next.add(category)
      }
      return next
    })
  }, [])

  const handleLocationSelect = useCallback((location: MapLocation) => {
    setSelectedLocation((prev) => (prev?.id === location.id ? null : location))
  }, [])

  const isLocationVisible = useCallback(
    (location: MapLocation) => activeFilters.has(location.category),
    [activeFilters]
  )

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            <span className="text-[#7c3aed] neon-text-glow">Mapa de Los Santos</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#94a3b8] text-lg flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            Explora los puntos de interés y territorios de la ciudad
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

        {/* Filter Legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          <div className="flex items-center gap-2 mr-2 text-[#64748b] text-sm">
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros:</span>
          </div>
          {categoryKeys.map((category) => {
            const config = categoryConfig[category]
            const Icon = config.icon
            const isActive = activeFilters.has(category)

            return (
              <button
                key={category}
                onClick={() => toggleFilter(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white'
                    : 'text-[#475569] bg-[#0f172a] border border-[#1e293b] opacity-50'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: `${config.color}20`,
                        border: `1px solid ${config.color}50`,
                        boxShadow: `0 0 10px ${config.color}25, 0 0 30px ${config.color}10`,
                      }
                    : {}
                }
              >
                <Icon className="w-4 h-4" style={{ color: isActive ? config.color : undefined }} />
                <span style={{ color: isActive ? config.color : undefined }}>
                  {config.label}
                </span>
              </button>
            )
          })}
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            border: '1px solid rgba(124, 58, 237, 0.2)',
            boxShadow: '0 0 30px rgba(124, 58, 237, 0.1), 0 0 80px rgba(124, 58, 237, 0.05), inset 0 0 30px rgba(0,0,0,0.3)',
          }}
        >
          {/* Map SVG */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-auto block"
            style={{ backgroundColor: '#0f172a', minHeight: '400px', maxHeight: '70vh' }}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* SVG Defs */}
            <defs>
              <filter id="marker-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="map-vignette" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="100%" stopColor="#030712" stopOpacity="0.4" />
              </radialGradient>
              {/* Scanline effect */}
              <pattern id="scanlines" patternUnits="userSpaceOnUse" width="100" height="2">
                <line x1="0" y1="0" x2="100" y2="0" stroke="#7c3aed" strokeWidth="0.15" opacity="0.03" />
              </pattern>
            </defs>

            {/* Background layers */}
            <rect x="0" y="0" width="100" height="100" fill="#0f172a" />

            {/* Grid */}
            <CyberpunkGrid />

            {/* Water */}
            <WaterAreas />

            {/* Roads */}
            <MajorRoads />

            {/* Buildings */}
            <BuildingBlocks />

            {/* Scanlines overlay */}
            <rect x="0" y="0" width="100" height="100" fill="url(#scanlines)" />

            {/* Vignette */}
            <rect x="0" y="0" width="100" height="100" fill="url(#map-vignette)" />

            {/* Location Markers */}
            {locations.map((location) => (
              <LocationMarker
                key={location.id}
                location={location}
                isSelected={selectedLocation?.id === location.id}
                isHovered={hoveredLocation === location.id}
                onSelect={() => handleLocationSelect(location)}
                onHover={setHoveredLocation}
                visible={isLocationVisible(location)}
              />
            ))}
          </svg>

          {/* Map border glow animation */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{
              boxShadow: [
                '0 0 30px rgba(124, 58, 237, 0.1), inset 0 0 30px rgba(0,0,0,0.3)',
                '0 0 40px rgba(124, 58, 237, 0.15), inset 0 0 30px rgba(0,0,0,0.3)',
                '0 0 30px rgba(124, 58, 237, 0.1), inset 0 0 30px rgba(0,0,0,0.3)',
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Corner decorations */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#7c3aed]/40 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#7c3aed]/40 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#7c3aed]/40 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#7c3aed]/40 rounded-br-sm pointer-events-none" />

          {/* Map label */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[#64748b] text-xs pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" style={{ boxShadow: '0 0 4px #7c3aed' }} />
            <span className="tracking-widest uppercase font-mono">Los Santos City Map</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" style={{ boxShadow: '0 0 4px #7c3aed' }} />
          </div>

          {/* Details Panel */}
          <DetailsPanel
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        </motion.div>

        {/* Location Quick List (below map on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categoryKeys.map((category) => {
              const config = categoryConfig[category]
              const Icon = config.icon
              const categoryLocations = locations.filter((l) => l.category === category)
              const isFiltered = activeFilters.has(category)

              return (
                <motion.button
                  key={category}
                  onClick={() => {
                    if (!isFiltered) toggleFilter(category)
                    const firstLoc = categoryLocations[0]
                    if (firstLoc && isFiltered) {
                      setSelectedLocation(firstLoc)
                    }
                  }}
                  className="p-3 rounded-xl text-left transition-all duration-300 group"
                  style={{
                    backgroundColor: isFiltered ? `${config.color}08` : '#0f172a',
                    border: `1px solid ${isFiltered ? `${config.color}25` : '#1e293b'}`,
                    opacity: isFiltered ? 1 : 0.4,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 shrink-0" style={{ color: config.color }} />
                    <span className="text-xs font-semibold truncate" style={{ color: config.color }}>
                      {config.label}
                    </span>
                  </div>
                  <span className="text-[#64748b] text-xs">
                    {categoryLocations.length} {categoryLocations.length === 1 ? 'lugar' : 'lugares'}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
