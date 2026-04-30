import { useEffect, useRef, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './sections/Header'
import Hero from './sections/Hero'
import Philosophy from './sections/Philosophy'
import Works from './sections/Works'
import Experiences from './sections/Experiences'
import Capabilities from './sections/Capabilities'
import Spatial from './sections/Spatial'
import Footer from './sections/Footer'
import Preloader from './sections/Preloader'
import RoomDetail from './pages/RoomDetail'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import AIChatbot from './components/AIChatbot'
import AIRoomRecommender from './components/AIRoomRecommender'

function App() {
  const scrollRef = useRef({ y: 0, speed: 0 })
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null)
  const [showRecommender, setShowRecommender] = useState(false)

  useEffect(() => {
    let rafId: number
    let prevY = window.scrollY
    const tick = () => {
      const y = window.scrollY
      const delta = y - prevY
      scrollRef.current.y = y
      scrollRef.current.speed = delta
      prevY = y
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const handleSelectRoom = (id: string) => setCurrentRoomId(id)
  const handleBack = () => {
    setCurrentRoomId(null)
    setTimeout(() => {
      document.querySelector('#works')?.scrollIntoView({ behavior: 'auto' })
    }, 0)
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={
        <>
          <Preloader />
          <Header scrollRef={scrollRef} forceLight={currentRoomId !== null} />
          {currentRoomId ? (
            <RoomDetail roomId={currentRoomId} onBack={handleBack} />
          ) : (
            <main>
              <Spatial />
              <Philosophy />
              <Works scrollRef={scrollRef} onSelectRoom={handleSelectRoom} />

              {/* AI Room Recommender section */}
              <section style={{ padding: "80px 40px", background: "#080808", textAlign: "center" }}>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "0.15em", marginBottom: "12px" }}>POWERED BY AI</div>
                <h2 style={{ color: "#fff", fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 400, marginBottom: "8px" }}>Find Your Perfect Room</h2>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px", marginBottom: "32px" }}>Tell us what you're looking for and our AI will match you.</p>
                {!showRecommender ? (
                  <button onClick={() => setShowRecommender(true)} style={{
                    background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
                    borderRadius: "8px", padding: "12px 28px", fontSize: "13px", cursor: "pointer", letterSpacing: "0.08em"
                  }}>
                    Find My Room
                  </button>
                ) : (
                  <AIRoomRecommender onSelectRoom={handleSelectRoom} />
                )}
              </section>

              <Experiences />
              <Capabilities />
              <Hero />
            </main>
          )}
          <Footer />
          {/* Global AI Chatbot — always visible */}
          <AIChatbot />
        </>
      } />
    </Routes>
  )
}

export default App
