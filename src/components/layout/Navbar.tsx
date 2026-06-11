'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Menu, Home, BookOpen, ImageIcon, Swords, Map, Info, Heart, 
  Shield, Crown, LogIn, LogOut, User, ChevronDown, Bell, UserCircle,
  Search, Scale
} from 'lucide-react'
import { useNavigation, type PageId } from '@/lib/navigation'
import { useSession } from '@/hooks/useSession'
import { CommandPaletteTrigger, openCommandPalette } from '@/components/layout/CommandPalette'
import { openServerRules } from '@/components/layout/ServerRulesModal'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import NotificationPanel from '@/components/layout/NotificationPanel'

const navItems: { id: PageId; label: string; icon: React.ReactNode; auth?: boolean; role?: string }[] = [
  { id: 'home', label: 'Inicio', icon: <Home className="w-4 h-4" /> },
  { id: 'normativa', label: 'Normativa', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'galeria', label: 'Galería', icon: <ImageIcon className="w-4 h-4" /> },
  { id: 'facciones', label: 'Facciones', icon: <Swords className="w-4 h-4" /> },
  { id: 'mapa', label: 'Mapa', icon: <Map className="w-4 h-4" /> },
  { id: 'info', label: 'Info', icon: <Info className="w-4 h-4" /> },
  { id: 'donaciones', label: 'Donaciones', icon: <Heart className="w-4 h-4" /> },
  { id: 'whitelist', label: 'Whitelist', icon: <Shield className="w-4 h-4" />, auth: true },
  { id: 'staff', label: 'Staff', icon: <Shield className="w-4 h-4" />, auth: true, role: 'STAFF' },
  { id: 'admin', label: 'Admin', icon: <Crown className="w-4 h-4" />, auth: true, role: 'ADMIN' },
]

function NotificationBell({ onClick }: { onClick: () => void }) {
  const user = useSession((s) => s.user)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const prevCountRef = useRef(0)

  useEffect(() => {
    if (!user?.dbId) return

    let cancelled = false
    const userId = user.dbId

    const fetchUnreadCount = async () => {
      try {
        const res = await fetch(`/api/notifications/unread-count?userId=${userId}`)
        if (!cancelled && res.ok) {
          const data = await res.json()
          const newCount = data.unreadCount ?? 0
          // Animate when new notifications arrive
          if (newCount > prevCountRef.current) {
            setIsAnimating(true)
            setTimeout(() => setIsAnimating(false), 600)
          }
          prevCountRef.current = newCount
          setUnreadCount(newCount)
        }
      } catch {
        // Silently fail
      }
    }

    // Fetch immediately
    fetchUnreadCount()
    // Poll every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [user?.dbId])

  if (!user) return null

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
      aria-label="Notificaciones"
    >
      <motion.div
        animate={isAnimating ? { 
          rotate: [0, -15, 15, -10, 10, 0],
          scale: [1, 1.15, 1]
        } : {}}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <Bell className="w-5 h-5" />
      </motion.div>
      {unreadCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full"
          style={{ boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)' }}
        />
      )}
    </button>
  )
}

interface NavbarProps {
  bannerVisible?: boolean
}

export default function Navbar({ bannerVisible = false }: NavbarProps) {
  const { currentPage, navigate } = useNavigation()
  const user = useSession((s) => s.user)
  const loading = useSession((s) => s.loading)
  const setUser = useSession((s) => s.setUser)
  const initSession = useSession((s) => s.initSession)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  // Initialize session on mount
  useEffect(() => {
    initSession()
  }, [initSession])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavigate = (page: PageId) => {
    navigate(page)
    setMobileOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogin = () => {
    window.location.href = '/api/auth/signin/discord'
  }

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    setUser(null)
    navigate('home')
  }

  const canAccess = (item: typeof navItems[0]) => {
    if (!item.auth) return true
    if (!user) return false
    if (item.role === 'STAFF') return user.role === 'STAFF' || user.role === 'ADMIN'
    if (item.role === 'ADMIN') return user.role === 'ADMIN'
    return true
  }

  const visibleItems = navItems.filter(canAccess)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${bannerVisible ? 'top-[40px]' : 'top-0'} ${
        scrolled
          ? 'glass-strong shadow-lg shadow-[#7c3aed]/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavigate('home')}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden neon-glow transition-all duration-300 group-hover:scale-105">
              <img
                src="/prestigio-logo.png"
                alt="Prestigio RP"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-lg hidden sm:block neon-text-glow text-[#7c3aed]">
              PRESTIGIO RP
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {visibleItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  currentPage === item.id
                    ? 'text-[#7c3aed] bg-[#7c3aed]/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
                {currentPage === item.id && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#7c3aed] rounded-full"
                    style={{ boxShadow: '0 0 8px rgba(124, 58, 237, 0.6)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {/* Command Palette Search Button */}
            <CommandPaletteTrigger />

            {/* Server Rules Quick-View Button */}
            <button
              onClick={openServerRules}
              className="hidden md:flex p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Normas del servidor"
              title="Normas"
            >
              <Scale className="w-5 h-5" />
            </button>

            {/* Notification Bell - between nav items and user dropdown */}
            <NotificationBell onClick={() => setNotifOpen(true)} />

            {loading ? (
              <div className="w-8 h-8 rounded-full bg-[#1e293b] animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#7c3aed]/40">
                      {user.image ? (
                        <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#7c3aed]/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-[#7c3aed]" />
                        </div>
                      )}
                    </div>
                    <span className="hidden sm:block text-sm text-gray-300 max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#0f172a] border-[#7c3aed]/20">
                  <DropdownMenuItem
                    onClick={() => handleNavigate('profile')}
                    className="text-gray-300 focus:text-white focus:bg-[#7c3aed]/10"
                  >
                    <UserCircle className="w-4 h-4 mr-2" />
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigate('whitelist')}
                    className="text-gray-300 focus:text-white focus:bg-[#7c3aed]/10"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Mi Whitelist
                  </DropdownMenuItem>
                  {(user.role === 'STAFF' || user.role === 'ADMIN') && (
                    <DropdownMenuItem
                      onClick={() => handleNavigate('staff')}
                      className="text-gray-300 focus:text-white focus:bg-[#7c3aed]/10"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Panel Staff
                    </DropdownMenuItem>
                  )}
                  {user.role === 'ADMIN' && (
                    <DropdownMenuItem
                      onClick={() => handleNavigate('admin')}
                      className="text-gray-300 focus:text-white focus:bg-[#7c3aed]/10"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Panel Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-[#7c3aed]/10" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleLogin}
                className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white neon-glow text-sm"
              >
                <LogIn className="w-4 h-4 mr-1.5" />
                Discord
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0f172a] border-[#7c3aed]/20 w-72">
                <SheetTitle className="text-[#7c3aed] neon-text-glow text-lg mb-6">
                  PRESTIGIO RP
                </SheetTitle>
                <div className="flex flex-col gap-1 mt-4">
                  {visibleItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        currentPage === item.id
                          ? 'text-[#7c3aed] bg-[#7c3aed]/10 neon-glow'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                  {/* Quick Rules Button (mobile) */}
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      openServerRules()
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Scale className="w-4 h-4" />
                    Normas
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationPanel open={notifOpen} onOpenChange={setNotifOpen} />

      {/* Mobile search FAB */}
      <button
        onClick={openCommandPalette}
        className="md:hidden fixed bottom-20 right-4 z-40 p-3 rounded-full bg-[#0f172a] border border-white/10 text-gray-400 hover:text-white hover:border-[#7c3aed]/30 transition-all shadow-lg"
        aria-label="Abrir búsqueda"
      >
        <Search className="w-5 h-5" />
      </button>
    </motion.nav>
  )
}
