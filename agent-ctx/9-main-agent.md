# Task 9 — StatsCounter & NextEvent Sections

## Task
Create two new home page sections for the Prestigio Roleplay portal:
1. **StatsCounter.tsx** — Animated statistics counter with 4 stat cards
2. **NextEvent.tsx** — Live countdown timer to next server event

## Work Completed

### StatsCounter.tsx (`/src/components/sections/StatsCounter.tsx`)
- 4 stat cards: Jugadores Activos (500+), Servidor Online (24/7), Eventos Realizados (150+), Uptime (99.8%)
- Custom `useCountUp` hook: animates from 0 to target number over 2s with ease-out-cubic easing
- Triggered via `useInView` from framer-motion (once: true, margin: -50px)
- Each card: dark `bg-[#0f172a]` background with `neon-border`, colored icon container, animated number with text-shadow glow, label in `text-[#94a3b8]`
- Hover: `scale: 1.03, y: -2` with intensified inner/outer glow
- Section title: "Números que Hablan" with gradient divider line
- Responsive: 2 cols on mobile, 4 cols on lg

### NextEvent.tsx (`/src/components/sections/NextEvent.tsx`)
- Calculates next Friday at 21:00 CET as the event date
- `useCountdown` hook updates every second, returns days/hours/minutes/seconds
- `TimeUnit` sub-component: styled box with purple glow border, zero-padded value
- Event header: Zap icon, "Próximo Evento" title, date (es-ES locale), time
- Amber badge: pulsing dot + "Carreras Nocturnas" event name
- Decorative gradient top line (purple → cyan)
- Background radial gradient glow

## Verification
- ✅ ESLint: 0 errors
- ✅ Dev server: running on port 3000, no compilation errors
- ✅ Both components use `'use client'` directive
- ✅ All animations use framer-motion
- ✅ Neon CSS classes and arbitrary Tailwind values used consistently
