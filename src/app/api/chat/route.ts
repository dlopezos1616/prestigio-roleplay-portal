import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `Eres el asistente virtual de Prestigio Roleplay, un servidor de FiveM/GTA V roleplay en español. Tu nombre es "PrestiBot".

Información del servidor:
- Nombre: Prestigio Roleplay
- IP: connect cfx.re/join/4kp2z9
- Discord: https://discord.gg/vGpKd6yt8M
- Slots: 128 jugadores
- Estado: Online 24/7
- Tipo: Roleplay serio en español
- Reglas principales: No RDM (Random Deathmatch), No VDM (Vehicle Deathmatch), No Metagaming, No Power Gaming, mantener Fear RP, respetar siempre el roleplay
- Facciones disponibles: LSPD (Policía), BCSD (Sheriff), EMS (Médicos), FBI, Gangs, Civiles
- Proceso de whitelist: 1) Unirse al Discord, 2) Completar formulario en el portal web, 3) Esperar revisión del staff (24-48h)
- Staff disponible de 18:00 a 02:00 CET

Responde SIEMPRE en español, de forma amigable pero profesional. Usa emojis moderadamente. Si te preguntan algo fuera del contexto del servidor, redirige cortésmente al tema del servidor. Mantén las respuestas concisas (2-3 oraciones máximo para respuestas simples, más detalle solo si lo piden).`

// Simple in-memory rate limiting
const rateLimiter = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10 // messages per window
const RATE_WINDOW = 60_000 // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimiter.get(ip)

  if (!entry || now > entry.resetTime) {
    rateLimiter.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }

  if (entry.count >= RATE_LIMIT) {
    return false
  }

  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Demasiados mensajes. Espera un momento antes de intentar de nuevo.' },
        { status: 429 }
      )
    }

    const { message, history } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensaje requerido' },
        { status: 400 }
      )
    }

    // Limit message length
    if (message.length > 500) {
      return NextResponse.json(
        { error: 'El mensaje es demasiado largo (máximo 500 caracteres)' },
        { status: 400 }
      )
    }

    // Use z-ai-web-dev-sdk for LLM chat
    const ZAI = await import('z-ai-web-dev-sdk')
    const zai = await ZAI.default.create()

    // Build messages array with history
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
    ]

    // Add conversation history (last 10 messages max)
    if (Array.isArray(history)) {
      const recentHistory = history.slice(-10)
      for (const msg of recentHistory) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          messages.push({ role: msg.role, content: msg.content })
        }
      }
    }

    messages.push({ role: 'user' as const, content: message })

    const response = await zai.chat.completions.create({
      messages,
      temperature: 0.7,
      max_tokens: 300,
    })

    const reply = response.choices?.[0]?.message?.content || 'Lo siento, no pude procesar tu consulta. Intenta de nuevo.'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('[Chat API Error]', error)
    return NextResponse.json(
      { error: 'Error interno del servidor. Intenta de nuevo más tarde.' },
      { status: 500 }
    )
  }
}
