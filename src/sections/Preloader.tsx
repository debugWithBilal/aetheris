import { useEffect, useState } from 'react'

export default function Preloader() {
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'done'>('loading')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('reveal'), 800)
    const t2 = setTimeout(() => setPhase('done'), 2000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#0b0b0b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: phase === 'reveal' ? 0 : 1,
        transition: 'opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: phase === 'reveal' ? 'none' : 'auto',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <span
          style={{
            display: 'block',
            fontSize: 'clamp(32px, 8vw, 80px)',
            fontWeight: 500,
            letterSpacing: '0.18em',
            color: '#ffffff',
            transform: phase === 'loading' ? 'translateY(30px)' : 'translateY(0)',
            opacity: phase === 'loading' ? 0 : 1,
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
          }}
        >
          AETHERIS
        </span>
        <span
          style={{
            display: 'block',
            fontSize: '10px',
            letterSpacing: '0.32em',
            color: 'rgba(255,255,255,0.4)',
            marginTop: '16px',
            textTransform: 'uppercase',
            opacity: phase === 'loading' ? 0 : 1,
            transition: 'opacity 1.2s ease 0.3s',
          }}
        >
          Aegean Sanctuary
        </span>
      </div>
    </div>
  )
}
