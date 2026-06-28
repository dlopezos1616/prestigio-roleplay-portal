# 🎮 Prestigio Roleplay Portal

> Portal web oficial del servidor de Roleplay **Prestigio RP** para FiveM / GTA V.  
> Tema neón oscuro, glassmorphism, animaciones cinematográficas y panel de administración completo.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?logo=prisma)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Características

### 🏠 Página Principal (22+ secciones)
- **Hero cinematográfico** con efectos de scanlines, vignette, glitch title y orbs de nebulosa animados
- **About / Features** con sistema de tarjetas glassmorphism
- **Vehicle Showcase** — Carrusel 3D con 6 vehículos y barras de estadísticas
- **Server Timeline** — Línea de tiempo con 9 hitos históricos
- **Discord Widget** — Vista previa del servidor con miembros en línea
- **Gallery** — Galería de imágenes con IA generada
- **Facciones, Normativa, City Map, Donaciones**
- **StatsCounter, Leaderboard, Testimonials, Streamers**
- **EventCalendar, FAQ, Changelog, Achievements**

### 🔐 Autenticación
- NextAuth.js v4 con Discord OAuth2
- Scopes: `identify`, `guilds`, `guilds.members.read`
- Sesiones persistentes

### 📋 Sistema de Whitelist
- Formulario completo de solicitud de whitelist
- Revisión por staff con estados (pendiente / aprobado / rechazado)
- Comentarios de revisión y auditoría

### 👥 Paneles
- **Staff Panel** (4 tabs): Revisión de whitelist, gestión de tareas, notificaciones, auditoría
- **Admin Panel** (4 tabs): Gestión de usuarios, estadísticas, configuración, herramientas dev

### 🎨 Diseño / Estilo
- **Paleta neón**: Púrpura `#7c3aed`, Cian `#06b6d4`, Ámbar `#f59e0b`, Oscuro `#030712`
- **Glassmorphism**: Tarjetas con `backdrop-filter: blur(16px) saturate(1.5)`
- **Animaciones Framer Motion**: Transiciones suaves, hover effects, scroll reveal
- **Sistema CSS expandido**: 20+ utility classes personalizadas
- **Responsive**: Mobile-first, breakpoints Tailwind
- **Dark mode** con `next-themes`
- **Reproductor de audio** integrado (SSR-safe)
- **Canvas de partículas**, scroll progress, back-to-top
- **Paleta de comandos** (Cmd/Ctrl + K)
- **Personalizador de tema** en vivo

### 🛠️ API Routes
- `/api/whitelist` — Gestión de solicitudes
- `/api/tasks` — Sistema de tareas
- `/api/gallery` — Galería de imágenes
- `/api/notifications` — Notificaciones
- `/api/audit` — Logs de auditoría
- `/api/users` — Gestión de usuarios
- `/api/stats` — Estadísticas del servidor
- `/api/auth/[...nextauth]` — Autenticación Discord
- `/api/chat` — Chat widget con IA

---

## 🧩 Tech Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Next.js** | 16 (App Router, SPA mode) | Framework |
| **TypeScript** | 5 | Lenguaje |
| **Tailwind CSS** | 4 | Estilos |
| **shadcn/ui** | New York | Componentes UI |
| **Prisma ORM** | Latest | Base de datos (SQLite dev / PostgreSQL prod) |
| **NextAuth.js** | v4 | Autenticación Discord OAuth2 |
| **Zustand** | Latest | Estado & navegación SPA |
| **TanStack Query** | Latest | Estado del servidor |
| **Framer Motion** | Latest | Animaciones |
| **Zod** + **react-hook-form** | Latest | Validación de formularios |
| **Lucide Icons** | Latest | Iconografía |

---

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ o Bun
- Una aplicación de Discord Developer Portal (para OAuth2)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/prestigio-roleplay-portal.git
cd prestigio-roleplay-portal

# 2. Instalar dependencias
bun install
# o
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales (ver abajo)

# 4. Configurar base de datos
bun run db:push
# o
npx prisma db push

# 5. Iniciar servidor de desarrollo
bun run dev
# o
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

---

## 🔧 Variables de Entorno

Crea un archivo `.env` en la raíz con:

```env
# Base de datos (SQLite para desarrollo)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-super-seguro-aqui"

# Discord OAuth2
DISCORD_CLIENT_ID="tu_client_id"
DISCORD_CLIENT_SECRET="tu_client_secret"

# Opcional: z-ai-web-dev-sdk (chat widget, IA)
ZAI_API_KEY="tu_api_key"
```

### Obtener credenciales de Discord
1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Crea una nueva aplicación
3. En **OAuth2 → General**:
   - Copia el `CLIENT_ID` y `CLIENT_SECRET`
   - Añade redirect URI: `http://localhost:3000/api/auth/callback/discord`
4. En **OAuth2 → URL Generator** selecciona los scopes:
   - `identify`
   - `guilds`
   - `guilds.members.read`

---

## 📂 Estructura del Proyecto

```
prestigio-roleplay-portal/
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
├── public/                    # Assets estáticos
├── src/
│   ├── app/
│   │   ├── api/               # API routes (whitelist, tasks, etc.)
│   │   ├── globals.css        # Estilos globales + sistema neón
│   │   ├── layout.tsx         # Layout raíz
│   │   └── page.tsx           # Entry point SPA
│   ├── components/
│   │   ├── admin/             # AdminPanel
│   │   ├── layout/            # Navbar, Footer, AudioPlayer, etc.
│   │   ├── staff/             # StaffPanel
│   │   ├── sections/          # 22+ secciones de la home
│   │   ├── profile/           # UserProfile
│   │   ├── whitelist/         # WhitelistForm
│   │   └── ui/                # Componentes shadcn/ui
│   ├── hooks/                 # Hooks personalizados
│   └── lib/
│       ├── auth.ts            # NextAuth config
│       ├── db.ts              # Prisma client
│       ├── navigation.ts      # Zustand SPA router
│       └── utils.ts           # Utilidades
├── db/                        # SQLite database file
├── mini-services/             # Microservicios (websocket, etc.)
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Scripts Disponibles

```bash
bun run dev       # Servidor de desarrollo (puerto 3000)
bun run build     # Build de producción
bun run start     # Servidor de producción
bun run lint      # ESLint
bun run db:push   # Push schema a base de datos
bun run db:studio # Prisma Studio (GUI)
```

---

## 🌐 Despliegue

### Vercel (recomendado)
1. Sube el repo a GitHub
2. Importa el proyecto en [vercel.com](https://vercel.com)
3. Configura las variables de entorno
4. Para producción, cambia `DATABASE_URL` a PostgreSQL
5. Deploy

### Producción con PostgreSQL
Cambia en `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
Y en `.env`:
```env
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
```

---

## 🎨 Personalización

### Tema / Colores
Edita las variables CSS en `src/app/globals.css` y la config de Tailwind en `tailwind.config.ts`.

### Contenido
- **Vehículos**: `src/components/sections/VehicleShowcase.tsx`
- **Timeline**: `src/components/sections/ServerTimeline.tsx`
- **Discord Widget**: `src/components/sections/DiscordWidget.tsx`
- **Galería**: API `/api/gallery` + `src/components/sections/Gallery.tsx`
- **Facciones, Normativa**: Secciones respectivas

---

## 📜 Licencia

MIT License © 2025 Prestigio Roleplay

---

## 🤝 Contribuir

1. Fork del repositorio
2. Crea una rama: `git checkout -b feature/mi-feature`
3. Commit: `git commit -m 'feat: añade mi feature'`
4. Push: `git push origin feature/mi-feature`
5. Abre un Pull Request

---

## 📞 Contacto

- **Discord**: [Prestigio Roleplay](https://discord.gg/tu-invite)
- **Email**: staff@prestigiorp.com

---

<sub>Hecho con 💜 por el equipo de Prestigio Roleplay</sub>
