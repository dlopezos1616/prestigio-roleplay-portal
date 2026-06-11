'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Shield, Crown, ClipboardCheck, UserCircle } from 'lucide-react'
import { useNavigation } from '@/lib/navigation'
import Navbar from '@/components/layout/Navbar'
import AnnouncementBanner from '@/components/layout/AnnouncementBanner'
import Footer from '@/components/layout/Footer'
import AudioPlayer from '@/components/layout/AudioPlayer'
import BackToTop from '@/components/layout/BackToTop'
import CookieConsent from '@/components/layout/CookieConsent'
import ChatWidget from '@/components/layout/ChatWidget'
import ThemeCustomizer from '@/components/layout/ThemeCustomizer'
import ScrollProgress from '@/components/layout/ScrollProgress'
import LoadingOverlay from '@/components/layout/LoadingOverlay'
import DevLogin from '@/components/layout/DevLogin'
import CommandPalette from '@/components/layout/CommandPalette'
import ServerRulesModal from '@/components/layout/ServerRulesModal'
import PageHeader from '@/components/layout/PageHeader'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import HowToConnect from '@/components/sections/HowToConnect'
import Features from '@/components/sections/Features'
import FAQ from '@/components/sections/FAQ'
import Testimonials from '@/components/sections/Testimonials'
import JoinDiscord from '@/components/sections/JoinDiscord'
import Normativa from '@/components/sections/Normativa'
import Gallery from '@/components/sections/Gallery'
import Facciones from '@/components/sections/Facciones'
import ServerInfo from '@/components/sections/ServerInfo'
import ServerStatusWidget from '@/components/sections/ServerStatusWidget'
import Changelog from '@/components/sections/Changelog'
import CommunityStats from '@/components/sections/CommunityStats'
import EventCalendar from '@/components/sections/EventCalendar'
import StatsCounter from '@/components/sections/StatsCounter'
import NextEvent from '@/components/sections/NextEvent'
import Donaciones from '@/components/sections/Donaciones'
import CityMap from '@/components/sections/CityMap'
import Streamers from '@/components/sections/Streamers'
import Leaderboard from '@/components/sections/Leaderboard'
import Achievements from '@/components/sections/Achievements'
import NewsTicker from '@/components/sections/NewsTicker'
import SectionDivider from '@/components/layout/SectionDivider'
import VehicleShowcase from '@/components/sections/VehicleShowcase'
import ServerTimeline from '@/components/sections/ServerTimeline'
import DiscordWidget from '@/components/sections/DiscordWidget'
import { WhitelistForm } from '@/components/whitelist/WhitelistForm'
import StaffPanel from '@/components/staff/StaffPanel'
import AdminPanel from '@/components/admin/AdminPanel'
import UserProfile from '@/components/profile/UserProfile'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

function HomePage() {
  return (
    <div className="space-y-0">
      <Hero />
      <SectionDivider />
      <About />
      <SectionDivider variant="cyan" />
      <HowToConnect />
      <SectionDivider variant="amber" />
      <NewsTicker />
      <SectionDivider variant="cyan" />
      <Features />
      <SectionDivider variant="amber" />
      <VehicleShowcase />
      <SectionDivider variant="cyan" />
      <FAQ />
      <SectionDivider />
      <Testimonials />
      <SectionDivider variant="cyan" />
      <Streamers />
      <SectionDivider variant="amber" />
      <StatsCounter />
      <SectionDivider />
      <ServerTimeline />
      <SectionDivider variant="amber" />
      <Leaderboard />
      <SectionDivider variant="cyan" />
      <Achievements />
      <SectionDivider variant="amber" />
      <ServerStatusWidget />
      <SectionDivider variant="amber" />
      <NextEvent />
      <SectionDivider />
      <DiscordWidget />
      <SectionDivider variant="cyan" />
      <Changelog />
      <SectionDivider variant="cyan" />
      <CommunityStats />
      <SectionDivider variant="amber" />
      <EventCalendar />
      <JoinDiscord />
    </div>
  )
}

function WhitelistPage() {
  return (
    <div>
      <PageHeader
        title="Solicitud de Whitelist"
        subtitle="Demuestra que estás listo para el roleplay. Completa el formulario y nuestro staff revisará tu solicitud."
        icon={ClipboardCheck}
        accent="#7c3aed"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <WhitelistForm />
      </div>
    </div>
  )
}

function StaffPage() {
  return (
    <div>
      <PageHeader
        title="Panel de Staff"
        subtitle="Gestiona las solicitudes de whitelist, tareas diarias y actividad del equipo."
        icon={Shield}
        accent="#06b6d4"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <StaffPanel />
      </div>
    </div>
  )
}

function AdminPage() {
  return (
    <div>
      <PageHeader
        title="Panel de Administración"
        subtitle="Control total: métricas, usuarios, galería y auditoría del servidor."
        icon={Crown}
        accent="#f59e0b"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <AdminPanel />
      </div>
    </div>
  )
}

function ProfilePage() {
  return (
    <div>
      <PageHeader
        title="Mi Perfil"
        subtitle="Revisa tu información, estado de whitelist y historial de solicitudes."
        icon={UserCircle}
        accent="#7c3aed"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <UserProfile />
      </div>
    </div>
  )
}

export default function MainRouter() {
  const { currentPage } = useNavigation()
  const [bannerVisible, setBannerVisible] = useState(false)

  const handleBannerVisibilityChange = useCallback((visible: boolean) => {
    setBannerVisible(visible)
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'normativa':
        return <Normativa />
      case 'galeria':
        return <Gallery />
      case 'facciones':
        return <Facciones />
      case 'mapa':
        return <CityMap />
      case 'info':
        return <ServerInfo />
      case 'donaciones':
        return <Donaciones />
      case 'whitelist':
        return <WhitelistPage />
      case 'staff':
        return <StaffPage />
      case 'admin':
        return <AdminPage />
      case 'profile':
        return <ProfilePage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-foreground gradient-bg relative">
      <ScrollProgress />
      <LoadingOverlay />
      <AnnouncementBanner onVisibilityChange={handleBannerVisibilityChange} />
      <Navbar bannerVisible={bannerVisible} />
      <main className={`flex-1 transition-all duration-300 ${bannerVisible ? 'pt-[104px]' : 'pt-16'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <AudioPlayer />
      <BackToTop />
      <CookieConsent />
      <ChatWidget />
      <ThemeCustomizer />
      <DevLogin />
      <CommandPalette />
      <ServerRulesModal />
    </div>
  )
}
