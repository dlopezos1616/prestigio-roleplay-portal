import { NextResponse } from "next/server"

/**
 * Diagnostic endpoint to verify NEXTAUTH_SECRET is set and matches what was
 * used to create the session cookie. We don't try to decrypt the JWT here
 * (NextAuth uses HKDF key derivation which is complex to replicate) — we just
 * show enough info to diagnose a secret mismatch.
 */
export async function GET(request: Request) {
  // Read all cookies
  const cookieHeader = request.headers.get("cookie") || ""
  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((c) => c.trim())
      .filter(Boolean)
      .map((c) => {
        const [name, ...rest] = c.split("=")
        return [name.trim(), rest.join("=")]
      })
  )

  const sessionCookie =
    cookies["__Secure-next-auth.session-token"] ||
    cookies["next-auth.session-token"] ||
    null

  // Show secret preview so user can verify it matches what they set in Vercel
  const secret = process.env.NEXTAUTH_SECRET
  const secretPreview = secret
    ? `${secret.slice(0, 4)}...${secret.slice(-4)} (length: ${secret.length})`
    : "NOT SET"

  // Decode the JWE header (first part of the cookie, before the first dot)
  let jweHeader: unknown = null
  if (sessionCookie) {
    try {
      const parts = sessionCookie.split(".")
      if (parts.length >= 1) {
        jweHeader = JSON.parse(Buffer.from(parts[0], "base64url").toString())
      }
    } catch {
      // ignore
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    sessionCookiePresent: !!sessionCookie,
    sessionCookiePreview: sessionCookie
      ? sessionCookie.slice(0, 30) + "..."
      : null,
    sessionCookieLength: sessionCookie?.length ?? 0,
    jweHeader,
    secretPreview,
    secretLength: secret?.length ?? 0,
    secretLooksValid:
      typeof secret === "string" &&
      secret.length >= 32 &&
      !secret.includes("genera-un-secreto"),
    diagnosis: !sessionCookie
      ? "⚠️ No hay cookie de sesión. Necesitas hacer login primero en: https://prestigio-roleplay-portal.vercel.app — click en Discord, autoriza, vuelve a esta URL."
      : !secret
        ? "❌ NEXTAUTH_SECRET no está configurado en Vercel."
        : secret.length < 32
          ? `❌ NEXTAUTH_SECRET es demasiado corto (${secret.length} chars, necesita 32+).`
          : "ℹ️ La cookie existe y el secret está configurado. Si getServerSession sigue devolviendo null, el secret probablemente cambió entre el login y ahora. Borra las cookies del sitio y vuelve a hacer login.",
    instructions: [
      "1. Abre https://prestigio-roleplay-portal.vercel.app en modo incógnito",
      "2. Abre DevTools (F12) → Application → Cookies → https://prestigio-roleplay-portal.vercel.app",
      "3. Borra TODAS las cookies",
      "4. Click en 'Discord' en el navbar, autoriza",
      "5. Vuelve a esta URL inmediatamente",
      "6. Si secretLength > 0 y sessionCookiePresent=true pero la sesión sigue sin funcionar, el problema es el NEXTAUTH_SECRET",
      "7. Verifica que en Vercel → Settings → Environment Variables, NEXTAUTH_SECRET sea EXACTAMENTE el mismo valor (sin comillas extra)",
    ],
  })
}
