import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

/**
 * Diagnóstico avanzado del flujo OAuth.
 * Llama a este endpoint DESPUÉS de volver de Discord (cuando la sesión debería existir).
 */
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  // Inspeccionar cookies presentes en la petición
  const cookieHeader = request.headers.get("cookie") || ""
  const cookies = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => {
      const [name, ...rest] = c.split("=")
      // Solo mostrar el nombre y los primeros 20 caracteres del valor
      const value = rest.join("=")
      return {
        name,
        valuePreview: value.length > 20 ? value.slice(0, 20) + "..." : value,
        valueLength: value.length,
      }
    })

  // Identificar específicamente las cookies de NextAuth
  const nextAuthCookies = cookies.filter((c) =>
    c.name.includes("next-auth") || c.name.includes("session-token")
  )

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    url: request.url,
    session: session
      ? {
          hasSession: true,
          user: session.user
            ? {
                name: session.user.name,
                email: session.user.email,
                id: (session.user as Record<string, unknown>).id ?? null,
                role: (session.user as Record<string, unknown>).role ?? null,
              }
            : null,
        }
      : { hasSession: false },
    cookies: {
      all: cookies,
      nextAuthCookies,
      totalCookies: cookies.length,
    },
    headers: {
      host: request.headers.get("host"),
      origin: request.headers.get("origin"),
      referer: request.headers.get("referer"),
      userAgent: request.headers.get("user-agent")?.slice(0, 50),
    },
  })
}
