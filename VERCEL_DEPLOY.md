# 🚀 Guía de Despliegue en Vercel

Despliega **Prestigio Roleplay Portal** gratis en Vercel con base de datos PostgreSQL.

---

## ⚠️ Importante antes de empezar

Vercel usa un **sistema de archivos efímero** (solo lectura, excepto `/tmp`).  
**SQLite NO funciona en producción en Vercel** porque los datos se pierden en cada despliegue.  

👉 Por eso, usaremos **PostgreSQL** gratuito (Neon, Supabase o Vercel Postgres).

---

## 📋 Resumen de pasos

1. Crear base de datos PostgreSQL gratuita (Neon recomendado)
2. Importar el repo en Vercel
3. Configurar variables de entorno
4. Cambiar Prisma a PostgreSQL
5. Desplegar
6. Configurar Discord OAuth para producción

---

## PASO 1: Crear base de datos PostgreSQL gratuita (Neon)

### Opción A: Neon (recomendado, más fácil) ⭐

1. Ve a 👉 https://neon.tech
2. Click **"Sign up"** (puedes usar tu cuenta de GitHub)
3. Crea un proyecto nuevo:
   - **Project name**: `prestigio-rp`
   - **Postgres version**: 16 (la última)
   - **Region**: `AWS Frankfurt` (o la más cercana a tus usuarios)
4. Una vez creado, ve a **"Dashboard" → "Connection Details"**
5. Copia la **connection string**. Se ve así:
   ```
   postgresql://neondb_owner:npg_abc123xyz@ep-cool-name-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
6. **Guarda esto** — lo necesitarás en el Paso 3.

### Opción B: Vercel Postgres (integrado)

También puedes crearla directamente desde Vercel en el Paso 2 (botón "Storage" → "Create Database").

---

## PASO 2: Importar el repo en Vercel

1. Ve a 👉 https://vercel.com
2. Click **"Sign Up"** → elige **"Continue with GitHub"**
3. Autoriza a Vercel a acceder a tu cuenta de GitHub
4. En el dashboard, click **"Add New..." → "Project"**
5. Verás tu repo `prestigio-roleplay-portal` — click **"Import"**

---

## PASO 3: Configurar variables de entorno

En la pantalla de configuración antes de desplegar, busca la sección **"Environment Variables"** y añade estas variables **una por una**:

| Key | Value | Notas |
|-----|-------|-------|
| `DATABASE_URL` | `postgresql://...` (la de Neon) | **¡Importante!** Sin esta no funciona |
| `NEXTAUTH_URL` | `https://tu-proyecto.vercel.app` | Cambia por tu URL final de Vercel |
| `NEXTAUTH_SECRET` | (genera con el comando abajo) | Ver siguiente sección |
| `DISCORD_CLIENT_ID` | tu_client_id | De Discord Developer Portal |
| `DISCORD_CLIENT_SECRET` | tu_client_secret | De Discord Developer Portal |
| `DISCORD_GUILD_ID` | id_de_tu_servidor | Opcional pero recomendado |
| `ZAI_API_KEY` | tu_zai_api_key | Para chat IA / imágenes (opcional) |

### 🔑 Generar NEXTAUTH_SECRET

Abre una terminal y ejecuta:
```bash
openssl rand -base64 32
```
Copia el resultado y pégalo como valor de `NEXTAUTH_SECRET`.

> 💡 Si no tienes `openssl`, usa cualquier generador online: https://generate-secret.vercel.app/

---

## PASO 4: Configurar Build & Output (opcional)

En la misma pantalla, despliega **"Build and Output Settings"**:

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js (auto-detectado) |
| Build Command | `bun run build` (o déjalo en auto) |
| Output Directory | `.next` (auto) |
| Install Command | `bun install` (o auto) |

> Vercel detecta Next.js automáticamente, así que normalmente **no necesitas tocar nada aquí**.

---

## PASO 5: ¡Desplegar!

1. Click en el botón azul **"Deploy"**
2. Espera 2-5 minutos mientras Vercel:
   - Instala dependencias
   - Ejecuta `postinstall` (genera Prisma client)
   - Ejecuta `next build`
3. Cuando termine, verás **"Congratulations!"** con confeti 🎉
4. Click en **"Visit"** para ver tu web en vivo

### ⚠️ Si falla el primer despliegue
Es normal si aún no has creado las tablas en la base de datos. Ejecuta el comando de migración (ver Paso 6).

---

## PASO 6: Crear las tablas en la base de datos PostgreSQL

Como la base de datos Neon está vacía, necesitas crear las tablas. Tienes 2 opciones:

### Opción A: Desde tu PC (recomendado)

```bash
# En tu PC, clona el repo si no lo tienes
git clone https://github.com/dlopezos1616/prestigio-roleplay-portal.git
cd prestigio-roleplay-portal
bun install

# Crea un archivo .env temporal con la DATABASE_URL de Neon
echo 'DATABASE_URL="postgresql://...tu-url-de-neon..."' > .env

# Sube el schema a la base de datos
bun run db:push

# ¡Listo! Las tablas están creadas
```

### Opción B: Desde el panel de Neon

1. Entra a tu dashboard de Neon
2. Ve a **"SQL Editor"**
3. Copia el contenido de `prisma/schema.prisma` traducido a SQL (puedes usar `prisma migrate diff` para generarlo)

---

## PASO 7: Configurar Discord OAuth para producción

Tu OAuth de Discord funciona en localhost pero necesitas añadir la URL de producción:

1. Ve a 👉 https://discord.com/developers/applications
2. Selecciona tu aplicación
3. En **OAuth2 → General → Redirects**, añade:
   ```
   https://tu-proyecto.vercel.app/api/auth/callback/discord
   ```
   (junto a la de localhost, no la borres)
4. Guarda los cambios

---

## 🎉 ¡Listo!

Tu web ya está en vivo en `https://prestigio-roleplay-portal.vercel.app` (o similar).

### Características del plan gratuito de Vercel:
- ✅ **100 GB de ancho de banda** al mes
- ✅ **100 GB-hours** de serverless execution
- ✅ **Deployments ilimitados**
- ✅ **HTTPS automático** y certificados SSL
- ✅ **CDN global** (super rápido en todo el mundo)
- ✅ **Preview deployments** en cada Pull Request
- ✅ **Custom domain** (puedes conectar tu propio dominio)

---

## 🔄 Actualizaciones futuras

Cada vez que hagas `git push` a la rama `main`:

```bash
cd /home/z/my-project
git add -A
git commit -m "feat: nueva funcionalidad"
git push
```

Vercel **desplegará automáticamente** la nueva versión. 🚀

---

## 🌐 Conectar un dominio personalizado (opcional)

1. En el dashboard de Vercel → tu proyecto → **"Settings" → "Domains"**
2. Escribe tu dominio (ej: `prestigio-rp.com`) y click **"Add"**
3. Vercel te dará los registros DNS que debes añadir en tu proveedor de dominio:
   - Un registro `A` apuntando a `76.76.21.21`
   - Un registro `CNAME` para `www` apuntando a `cname.vercel-dns.com`
4. Espera 5-30 minutos a que se propaguen los DNS
5. ¡Listo! HTTPS se activa automáticamente

---

## 🆘 Problemas comunes

### ❌ "Error: Can't reach database server"
- Verifica que `DATABASE_URL` en Vercel tenga `?sslmode=require` al final
- Verifica que la IP de Vercel no esté bloqueada por Neon (Neon permite todas por defecto)

### ❌ "PrismaClientInitializationError"
- Falta ejecutar `postinstall`. Verifica que el script está en `package.json`
- En Vercel → Settings → Functions → verifica que Node.js 18+ esté seleccionado

### ❌ Las tablas no existen
- Ejecuta `bun run db:push` con la `DATABASE_URL` de producción (Paso 6)

### ❌ Discord login no funciona
- Verifica que `NEXTAUTH_URL` en Vercel sea `https://tu-dominio.vercel.app` (sin `/` al final)
- Verifica que la URL de callback esté añadida en Discord (Paso 7)
- Verifica que `NEXTAUTH_SECRET` esté configurado

### ❌ Build timeout
- Vercel free tiene 45 min de build. Si tarda más, reduce dependencias o usa `--turbo`

---

## 📞 Soporte

- 📖 [Docs de Vercel](https://vercel.com/docs)
- 📖 [Docs de Prisma en Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- 📖 [Docs de Neon](https://neon.tech/docs)

---

¡Disfruta tu web en producción! 🎮💜
