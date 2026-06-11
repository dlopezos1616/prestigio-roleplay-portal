'use client'

import { motion } from 'framer-motion'
import { Shield, Zap, Crown, Check, ExternalLink } from 'lucide-react'

const DISCORD_LINK = 'https://discord.gg/vGpKd6yt8M'

interface Tier {
  name: string
  price: number
  color: string
  borderClass: string
  icon: React.ReactNode
  perks: string[]
  featured?: boolean
  popular?: boolean
}

const tiers: Tier[] = [
  {
    name: 'Bronce',
    price: 5,
    color: '#cd7f32',
    borderClass: 'border-[#cd7f32]/30',
    icon: <Shield className="w-7 h-7" />,
    perks: ['Rango VIP', 'Vehículo exclusivo', 'Chat color'],
  },
  {
    name: 'Plata',
    price: 10,
    color: '#c0c0c0',
    borderClass: 'border-[#c0c0c0]/30',
    icon: <Zap className="w-7 h-7" />,
    perks: [
      'Rango VIP+',
      '3 vehículos exclusivos',
      'Chat color + tag',
      'Acceso anticipado a eventos',
      'Cosmético único',
    ],
    featured: true,
  },
  {
    name: 'Oro',
    price: 20,
    color: '#ffd700',
    borderClass: 'border-[#ffd700]/30',
    icon: <Crown className="w-7 h-7" />,
    perks: [
      'Rango VIP++',
      'Todos los vehículos exclusivos',
      'Chat color + tag + efecto',
      'Acceso anticipado a todo',
      '3 cosméticos únicos',
      'Soporte prioritario',
      'Nombre en los créditos',
    ],
    featured: true,
    popular: true,
  },
]

export default function Donaciones() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 gradient-bg opacity-50" />

      {/* Floating glow orbs matching tier colors */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-[#cd7f32]/10 rounded-full blur-3xl animate-float" />
      <div className="absolute top-1/2 -right-32 w-72 h-72 bg-[#c0c0c0]/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#ffd700]/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#7c3aed]/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

      <div className="relative mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#7c3aed] neon-text-glow mb-4"
          >
            Apoya el Servidor
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#94a3b8] text-lg max-w-2xl mx-auto"
          >
            Tu contribución nos permite mantener el servidor activo y seguir mejorando la experiencia de juego para toda la comunidad.
          </motion.p>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 * index }}
              className={`relative bg-[#0f172a] rounded-2xl border ${tier.borderClass} overflow-hidden flex flex-col ${
                tier.popular
                  ? 'md:scale-105 md:shadow-[0_0_40px_rgba(255,215,0,0.15)] z-10'
                  : tier.featured
                    ? 'md:shadow-[0_0_20px_rgba(192,192,192,0.08)]'
                    : ''
              }`}
            >
              {/* Top glow line */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
                style={{
                  background: `linear-gradient(to right, transparent, ${tier.color}50, transparent)`,
                }}
              />

              {/* POPULAR badge */}
              {tier.popular && (
                <div className="absolute top-4 right-4 z-20">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${tier.color}20`,
                      color: tier.color,
                      border: `1px solid ${tier.color}40`,
                    }}
                  >
                    Popular
                  </span>
                </div>
              )}

              {/* Gold card outer glow for Oro */}
              {tier.popular && (
                <div
                  className="absolute -inset-px rounded-2xl opacity-30 blur-sm"
                  style={{
                    background: `linear-gradient(135deg, ${tier.color}20, transparent, ${tier.color}20)`,
                  }}
                />
              )}

              <div className="relative z-10 p-6 sm:p-8 flex flex-col flex-1">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${tier.color}15`,
                      border: `1px solid ${tier.color}30`,
                    }}
                  >
                    <div style={{ color: tier.color }}>{tier.icon}</div>
                  </div>
                </div>

                {/* Tier name */}
                <h3 className="text-2xl font-bold text-white text-center mb-2">
                  {tier.name}
                </h3>

                {/* Price */}
                <div className="text-center mb-6">
                  <span className="text-4xl font-extrabold" style={{ color: tier.color }}>
                    €{tier.price}
                  </span>
                  <span className="text-[#64748b] text-sm ml-1">/mes</span>
                </div>

                {/* Divider */}
                <div
                  className="w-full h-px mb-6"
                  style={{
                    background: `linear-gradient(to right, transparent, ${tier.color}30, transparent)`,
                  }}
                />

                {/* Perks list */}
                <div className="flex-1 space-y-3 mb-8">
                  {tier.perks.map((perk, perkIndex) => (
                    <motion.div
                      key={perk}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.3 + perkIndex * 0.06 }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${tier.color}20`,
                        }}
                      >
                        <Check className="w-3 h-3" style={{ color: tier.color }} />
                      </div>
                      <span className="text-[#cbd5e1] text-sm">{perk}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Donate button */}
                <motion.a
                  href={DISCORD_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 ${
                    tier.popular
                      ? 'text-black hover:shadow-[0_0_25px_rgba(255,215,0,0.4)]'
                      : 'border hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                  }`}
                  style={{
                    backgroundColor: tier.popular ? tier.color : 'transparent',
                    borderColor: tier.popular ? 'transparent' : `${tier.color}50`,
                    color: tier.popular ? '#030712' : tier.color,
                  }}
                >
                  Donar
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </motion.a>
              </div>

              {/* Bottom decorative glow */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
                style={{
                  background: `linear-gradient(to right, transparent, ${tier.color}50, transparent)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center text-[#475569] text-sm mt-10"
        >
          Para donar, contacta con el staff a través de Discord. ¡Gracias por tu apoyo!
        </motion.p>
      </div>
    </section>
  )
}
