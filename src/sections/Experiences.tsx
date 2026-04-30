import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const experiences = [
  {
    id: '01',
    title: 'Sea Spa Rituals',
    description: 'Our thermal spa draws from the ancient healing traditions of the Aegean. Seawater hydrotherapy, marine mineral wraps, and signature massages using locally sourced botanical oils. Each treatment is tailored to the rhythms of the sea.',
    image: '/images/experience-spa.jpg',
  },
  {
    id: '02',
    title: 'Cliffside Dining',
    description: 'Two restaurants, one philosophy: ingredients pulled from the water at dawn and the garden at midday. Private dining experiences on your terrace, with menus crafted by our executive chef and paired with rare regional wines.',
    image: '/images/experience-dining.jpg',
  },
  {
    id: '03',
    title: 'Coastal Voyages',
    description: 'Explore hidden coves and secret beaches aboard our private yacht. Half-day and full-day charters include a captain, fresh provisions, and the freedom to anchor wherever the water calls. Snorkeling equipment and paddleboards included.',
    image: '/images/experience-yacht.jpg',
  },
]

export default function Experiences() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.exp-item', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          once: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="experiences"
      ref={sectionRef}
      style={{
        backgroundColor: '#ffffff',
        padding: '120px clamp(20px, 4vw, 60px)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '72px',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            paddingBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '11px',
                letterSpacing: '0.24em',
                color: '#888888',
                textTransform: 'uppercase',
                marginBottom: '14px',
              }}
            >
              Curated Moments
            </p>
            <h2
              style={{
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                lineHeight: 1,
                color: '#000000',
              }}
            >
              Experiences
            </h2>
          </div>
          <span
            style={{
              fontSize: '12px',
              letterSpacing: '0.18em',
              color: '#888888',
              textTransform: 'uppercase',
            }}
          >
            Discover More
          </span>
        </div>

        {/* Experience Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            gap: '40px',
          }}
        >
          {experiences.map((exp) => (
            <div key={exp.id} className="exp-item">
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '65%',
                  overflow: 'hidden',
                  marginBottom: '24px',
                  backgroundColor: '#f0f0f0',
                }}
              >
                <img
                  src={exp.image}
                  alt={exp.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLImageElement).style.transform = 'scale(1.04)'
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLImageElement).style.transform = 'scale(1)'
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  color: '#888888',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                {exp.id} · Experience
              </p>
              <h3
                style={{
                  fontSize: '24px',
                  fontWeight: 500,
                  color: '#000000',
                  letterSpacing: '-0.01em',
                  marginBottom: '12px',
                }}
              >
                {exp.title}
              </h3>
              <p
                style={{
                  fontSize: '15px',
                  lineHeight: 1.7,
                  color: '#555555',
                }}
              >
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
