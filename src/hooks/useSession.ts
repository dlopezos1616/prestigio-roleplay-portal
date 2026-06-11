"use client"

import { useState, useEffect, useCallback } from "react"

interface SessionUser {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string
  discordId?: string
  dbId?: string
}

const DEV_SESSION_KEY = "prestigio-dev-session"

function getDevSession(): SessionUser | null {
  if (typeof window === "undefined" || process.env.NODE_ENV === "production") return null
  try {
    const devSession = localStorage.getItem(DEV_SESSION_KEY)
    if (devSession) {
      const parsed = JSON.parse(devSession)
      if (parsed && parsed.role) return parsed
    }
  } catch {
    // ignore
  }
  return null
}

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(() => getDevSession())
  const [loading, setLoading] = useState(!getDevSession())

  useEffect(() => {
    let cancelled = false

    // If we already have a dev session, skip fetching
    if (getDevSession()) {
      return
    }

    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setUser(data.user)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const setDevSession = useCallback((devUser: SessionUser | null) => {
    if (devUser) {
      localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(devUser))
    } else {
      localStorage.removeItem(DEV_SESSION_KEY)
    }
    setUser(devUser)
  }, [])

  const refetch = useCallback(() => {
    const devSession = getDevSession()
    if (devSession) {
      setUser(devSession)
      setLoading(false)
      return
    }

    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { user, loading, setUser: setDevSession, refetch }
}
