'use client'

import { useState, useCallback, useRef } from 'react'
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
  Crosshair as CrosshairIcon,
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
/*  Data — positions calibrated to the real GTA V Los Santos map      */
/*  (map image is 2048x2048, square, satellite view)                  */
/*  North is up. Coordinates are approximate but match real POIs.     */
/* ------------------------------------------------------------------ */

const locations: MapLocation[] = [
  {
    id: 'lspd',
    name: 'Comisaría LSPD (Mission Row)',
    x: 42,
    y: 52,
    category: 'police',
    color: '#06b6d4',
    description: 'Cuartel general de la policía de Los Santos en Mission Row. Centro de operaciones de todas las patrullas y unidades especiales.',
    icon: Shield,
  },
  {
    id: 'hospital',
    name: 'Hospital Central (Pillbox Hill)',
    x: 47,
    y: 47,
    category: 'ems',
    color: '#22c55e',
    description: 'Centro médico principal de la ciudad en Pillbox Hill. Atención 24/7, cirugías y servicios de emergencia.',
    icon: Heart,
  },
  {
    id: 'garaje',
    name: 'Garaje Central (Strawberry)',
    x: 38,
    y: 60,
    category: 'mechanic',
    color: '#f97316',
    description: 'Taller de reparaciones y tuning en Strawberry. El lugar donde los mecánicos hacen su magia.',
    icon: Wrench,
  },
  {
    id: 'crimen-norte',
    name: 'Callejero Norte (Vinewood Hills)',
    x: 55,
    y: 25,
    category: 'crime',
    color: '#ef4444',
    description: 'Zona de actividad criminal conocida en las colinas de Vinewood. Las sombras esconden los secretos más oscuros de la ciudad.',
    icon: Skull,
  },
  {
    id: 'puerto',
    name: 'Puerto (LSIA / Terminal)',
    x: 28,
    y: 75,
    category: 'business',
    color: '#f59e0b',
    description: 'Zona portuaria y de negocios cerca del aeropuerto. Importaciones, exportaciones y tratos bajo la mesa.',
    icon: Building,
  },
  {
    id: 'centro-comercial',
    name: 'Centro Comercial (Burton)',
    x: 50,
    y: 38,
    category: 'business',
    color: '#f59e0b',
    description: 'Principal zona comercial de LS en Burton. Tiendas de lujo, restaurantes y vida social.',
    icon: Building,
  },
  {
    id: 'fbi',
    name: 'FIB Headquarters (Pillbox Hill)',
    x: 44,
    y: 44,
    category: 'police',
    color: '#f59e0b',
    description: 'Oficinas federales de investigación en Pillbox Hill. Operaciones encubiertas y vigilancia de alto nivel.',
    icon: Crosshair,
  },
  {
    id: 'barrio-sur',
    name: 'Barrio Sur (Davis / Chamberlain)',
    x: 40,
    y: 68,
    category: 'crime',
    color: '#ef4444',
    description: 'Territorio de bandas del sur en Davis. Respeta el territorio o enfrenta las consecuencias.',
    icon: Skull,
  },
  {
    id: 'aeropuerto',
    name: 'Aeropuerto (LSIA)',
    x: 35,
    y: 80,
    category: 'business',
    color: '#f59e0b',
    description: 'Aeropuerto internacional de Los Santos. La puerta de entrada y salida de la ciudad.',
    icon: Building,
  },
  {
    id: 'taller-este',
    name: 'Taller Este (El Burro)',
    x: 60,
    y: 62,
    category: 'mechanic',
    color: '#f97316',
    description: 'Segundo taller de la ciudad en El Burro Heights. Especializado en reparaciones rápidas y tuning de alto rendimiento.',
    icon: Wrench,
  },
  {
    id: 'vespucci',
    name: 'Vespucci Beach',
    x: 22,
    y: 55,
    category: 'business',
    color: '#f59e0b',
    description: 'Playa y zona residencial de Vespucci. Surf, sol y negocios junto al mar.',
    icon: Building,
  },
  {
    id: 'sandy',
    name: 'Sandy Shores',
    x: 70,
    y: 30,
    category: 'crime',
    color: '#ef4444',
    description: 'Pueblo del condado de Blaine. Zona rural con actividad criminal y contrabando.',
    icon: Skull,
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
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
          className="absolute cursor-pointer z-10"
          style={{
            left: `${location.x}%`,
            top: `${location.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
          onMouseEnter={() => onHover(location.id)}
          onMouseLeave={() => onHover(null)}
        >
          {/* Pulse rings */}
          {(isHovered || isSelected) && (
            <>
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 32,
                  height: 32,
                  left: -16,
                  top: -16,
                  border: `2px solid ${location.color}`,
                }}
                animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
              />
              {isSelected && (
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    width: 32,
                    height: 32,
                    left: -16,
                    top: -16,
                    border: `1px solid ${location.color}`,
                  }}
                  animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
                />
              )}
            </>
          )}

          {/* Glow background */}
          <div
            className="absolute rounded-full"
            style={{
              width: isHovered || isSelected ? 28 : 20,
              height: isHovered || isSelected ? 28 : 20,
              left: -(isHovered || isSelected ? 14 : 10),
              top: -(isHovered || isSelected ? 14 : 10),
              backgroundColor: location.color,
              opacity: 0.2,
              filter: 'blur(6px)',
            }}
          />

          {/* Main dot */}
          <motion.div
            className="relative rounded-full flex items-center justify-center"
            style={{
              width: isSelected ? 22 : isHovered ? 20 : 16,
              height: isSelected ? 22 : isHovered ? 20 : 16,
              backgroundColor: location.color,
              boxShadow: `0 0 8px ${location.color}, 0 0 16px ${location.color}80, 0 2px 4px rgba(0,0,0,0.5)`,
              border: '2px solid rgba(255,255,255,0.9)',
            }}
            animate={
              isSelected
                ? { scale: [1, 1.15, 1] }
                : isHovered
                ? { scale: [1, 1.1, 1] }
                : {}
            }
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <IconComponent
              className="text-white"
              style={{
                width: isSelected ? 12 : isHovered ? 11 : 9,
                height: isSelected ? 12 : isHovered ? 11 : 9,
              }}
            />
          </motion.div>

          {/* Label tooltip on hover */}
          {(isHovered || isSelected) && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap z-20"
              style={{ bottom: 'calc(100% + 8px)' }}
            >
              <div
                className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  backgroundColor: '#0f172a',
                  color: location.color,
                  border: `1px solid ${location.color}60`,
                  boxShadow: `0 0 12px ${location.color}30, 0 4px 12px rgba(0,0,0,0.6)`,
                }}
              >
                {location.name}
              </div>
              {/* Arrow */}
              <div
                className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
                style={{
                  backgroundColor: '#0f172a',
                  borderRight: `1px solid ${location.color}60`,
                  borderBottom: `1px solid ${location.color}60`,
                }}
              />
            </motion.div>
          )}
        </motion.div>
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
          className="absolute top-4 right-4 w-80 max-w-[calc(100%-2rem)] z-30"
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
                  Coordenadas: {location.x.toFixed(1)}%, {location.y.toFixed(1)}%
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
  const [editMode, setEditMode] = useState(false)
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const toggleFilter = useCallback((category: LocationCategory) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
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

  // Edit mode: click anywhere on the map to read coordinates.
  // Useful for placing new markers accurately.
  const handleMapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!editMode || !mapRef.current) return
    const rect = mapRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setHoverCoords({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 })
  }, [editMode])

  const handleMapMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!editMode || !mapRef.current) return
    const rect = mapRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setHoverCoords({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 })
  }, [editMode])

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
            Mapa real del GTA V — ubicaciones precisas de negocios y servicios
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
          {/* Real GTA V Map Image + Markers */}
          <div
            ref={mapRef}
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: '1 / 1', maxHeight: '75vh', backgroundColor: '#0f172a' }}
            onClick={handleMapClick}
            onMouseMove={handleMapMouseMove}
            onMouseLeave={() => setHoverCoords(null)}
          >
            {/* Map image */}
            <img
              src="/maps/los-santos.jpg"
              alt="Mapa real de Los Santos - GTA V"
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
              draggable={false}
            />

            {/* Subtle dark overlay so markers pop */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(180deg, rgba(3,7,18,0.15) 0%, rgba(3,7,18,0.35) 100%)' }}
            />

            {/* Scanline overlay (subtle, for theme consistency) */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(124,58,237,0.04) 0px, rgba(124,58,237,0.04) 1px, transparent 1px, transparent 3px)',
              }}
            />

            {/* Vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ boxShadow: 'inset 0 0 80px rgba(3,7,18,0.6)' }}
            />

            {/* Edit mode crosshair cursor overlay */}
            {editMode && (
              <div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                  cursor: 'crosshair',
                  backgroundColor: 'rgba(124,58,237,0.05)',
                  border: '2px dashed rgba(124,58,237,0.4)',
                }}
              />
            )}

            {/* Edit mode coordinate readout */}
            {editMode && hoverCoords && (
              <div className="absolute top-4 left-4 z-30 px-3 py-2 rounded-lg bg-[#0f172a]/95 border border-[#7c3aed]/50 font-mono text-xs text-[#a78bfa] pointer-events-none">
                <div className="flex items-center gap-2 mb-1">
                  <CrosshairIcon className="w-3 h-3" />
                  <span className="text-[#7c3aed] font-bold">MODO EDICIÓN</span>
                </div>
                <div>x: {hoverCoords.x.toFixed(1)}%</div>
                <div>y: {hoverCoords.y.toFixed(1)}%</div>
                <div className="mt-1 text-[10px] text-[#64748b]">
                  Click para fijar · usa estos valores en CityMap.tsx
                </div>
              </div>
            )}

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

            {/* Details Panel */}
            <DetailsPanel
              location={selectedLocation}
              onClose={() => setSelectedLocation(null)}
            />
          </div>

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

          {/* Map label + Edit toggle */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" style={{ boxShadow: '0 0 4px #7c3aed' }} />
            <span className="tracking-widest uppercase font-mono text-[#64748b] text-xs">
              Los Santos · GTA V Real Map
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" style={{ boxShadow: '0 0 4px #7c3aed' }} />
          </div>

          {/* Edit mode toggle — subtle, in top-right corner */}
          <button
            onClick={() => {
              setEditMode((v) => !v)
              setHoverCoords(null)
            }}
            className="absolute top-3 right-3 z-40 px-2 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all"
            style={{
              backgroundColor: editMode ? 'rgba(124,58,237,0.3)' : 'rgba(15,23,42,0.7)',
              color: editMode ? '#a78bfa' : '#475569',
              border: `1px solid ${editMode ? 'rgba(124,58,237,0.6)' : 'rgba(71,85,105,0.3)'}`,
            }}
            title="Activar modo edición para ver coordenadas"
          >
            {editMode ? '◉ Edit ON' : '◌ Edit'}
          </button>
        </motion.div>

        {/* Location Quick List (below map) */}
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

        {/* Edit mode help text */}
        <AnimatePresence>
          {editMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 p-4 rounded-xl bg-[#7c3aed]/10 border border-[#7c3aed]/30"
            >
              <p className="text-sm text-[#a78bfa] flex items-start gap-2">
                <CrosshairIcon className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  <strong className="text-[#c4b5fd]">Modo edición activo:</strong> mueve el ratón
                  sobre el mapa para ver las coordenadas <code className="px-1 py-0.5 rounded bg-[#0f172a] text-[#a78bfa]">x</code>/<code className="px-1 py-0.5 rounded bg-[#0f172a] text-[#a78bfa]">y</code> en porcentaje.
                  Usa estos valores en el array <code className="px-1 py-0.5 rounded bg-[#0f172a] text-[#a78bfa]">locations</code> de
                  <code className="px-1 py-0.5 rounded bg-[#0f172a] text-[#a78bfa]">src/components/sections/CityMap.tsx</code> para
                  colocar nuevos negocios con precisión sobre el mapa real.
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
