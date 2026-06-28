import { NextResponse } from "next/server"
import { decode } from "next-auth/jwt"

/**
 * End-to-end test: uses the EXACT same decode() function that NextAuth uses
 * internally to decrypt the session cookie. If this returns the token payload,
 * we know the secret matches and the issue is in getServerSession(). If it
 * returns null, the secret does NOT match the one used to encrypt the cookie.
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

  const secret = process.env.NEXTAUTH_SECRET

  if (!sessionCookie) {
    return NextResponse.json({
      status: "no_cookie",
      message: "No hay cookie de sesión. Visita la web, haz login, y vuelve aquí.",
    })
  }

  if (!secret) {
    return NextResponse.json({
      status: "no_secret",
      message: "NEXTAUTH_SECRET no está configurado en este deployment.",
    })
  }

  // Try to decode the cookie using NextAuth's own decode function
  let decoded: unknown = null
  let decodeError: string | null = null
  try {
    decoded = await decode({
      token: sessionCookie,
      secret,
    })
  } catch (e) {
    decodeError = e instanceof Error ? e.message : String(e)
  }

  // Also create a fresh token and decode it, to verify the secret works at all
  let freshEncodeWorks = false
  let freshDecodeWorks = false
  let freshError: string | null = null
  try {
    // Dynamically import encode
    const { encode } = await import("next-auth/jwt")
    const testToken = await encode({
      token: { test: "hello", ts: Date.now() },
      secret,
    })
    freshEncodeWorks = !!testToken
    if (testToken) {
      const reparsed = await decode({ token: testToken, secret })
      freshDecodeWorks = !!reparsed
    }
  } catch (e) {
    freshError = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    secretPreview: `${secret.slice(0, 4)}...${secret.slice(-4)}`,
    secretLength: secret.length,
    cookiePresent: !!sessionCookie,
    cookieLength: sessionCookie.length,
    decode: {
      success: decoded !== null,
      error: decodeError,
      payload: decoded,
    },
    freshRoundTrip: {
      encodeWorks: freshEncodeWorks,
      decodeWorks: freshDecodeWorks,
      error: freshError,
    },
    diagnosis:
      decoded !== null
        ? "✅ La cookie se descifra correctamente con el secret actual. El problema NO es el secret — está en getServerSession o el callback session()."
        : freshDecodeWorks
          ? "❌ El secret funciona (round-trip ok), PERO la cookie existente NO se descifra. Esto significa que la cookie fue creada con un SECRET DIFERENTE. Solución: borra TODAS las cookies del sitio y vuelve a hacer login."
          : "❌ El secret NO funciona ni siquiera para un round-trip fresco. NEXTAUTH_SECRET está mal configurado (vacío, muy corto, o con caracteres inválidos).",
    nextSteps:
      decoded === null
        ? [
            "1. Abre https://prestigio-roleplay-portal.vercel.app en el navegador",
            "2. Pulsa F12 → Application → Cookies → https://prestigio-roleplay-portal.vercel.app",
            "3. Selecciona TODAS las cookies y bórralas (botón Clear o click derecho → Delete)",
            "4. Recarga la página (Ctrl+F5)",
            "5. Click en 'Discord' en el navbar, autoriza en Discord",
            "6. Vuelve a esta URL inmediatamente: /api/dev/decode-test",
            "7. Si decode.success = true, el login funciona. Visita la home y debería aparecer tu avatar.",
          ]
        : [
            "El secret funciona. El problema está en getServerSession o el callback session().",
            "Revisa los logs de Vercel: Dashboard → tu proyecto → Deployments → Functions → busca errores [next-auth] o [auth].",
          ],
  })
}
