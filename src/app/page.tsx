'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useNavigation } from '@/lib/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AudioPlayer from '@/components/layout/AudioPlayer'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Features from '@/components/sections/Features'
import JoinDiscord from '@/components/sections/JoinDiscord'
import Normativa from '@/components/sections/Normativa'
import Gallery from '@/components/sections/Gallery'
import Facciones from '@/components/sections/Facciones'
import ServerInfo from '@/components/sections/ServerInfo'
import Donaciones from '@/components/sections/Donaciones'
import { WhitelistForm } from '@/components/whitelist/WhitelistForm'
import StaffPanel from '@/components/staff/StaffPanel'
import AdminPanel from '@/components/admin/AdminPanel'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

function HomePage() {
  return (
    <div className="space-y-0">
      <Hero />
      <About />
      <Features />
      <JoinDiscord />
    </div>
  )
}

export default function MainRouter() {
  const { currentPage } = useNavigation()

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
      case 'info':
        return <ServerInfo />
      case 'donaciones':
        return <Donaciones />
      case 'whitelist':
        return <WhitelistForm />
      case 'staff':
        return <StaffPanel />
      case 'admin':
        return <AdminPanel />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-foreground gradient-bg">
      <Navbar />
      <main className="flex-1 pt-16">
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
    </div>
  )
}
