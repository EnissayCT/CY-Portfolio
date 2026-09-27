import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import WaterShader from './WaterShader'
import HeroContent from './HeroContent'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const waterRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax: water tilts as user scrolls past hero
      gsap.to(waterRef.current, {
        rotateX: 3,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
      // Content scrolls away faster
      gsap.to(contentRef.current, {
        y: -120,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '60% top',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-[#0a1628]"
      style={{ perspective: '1200px' }}
    >
      {/* Water Shader Background — parallax container */}
      <div
        ref={waterRef}
        className="absolute inset-0 z-0"
        style={{ transformOrigin: 'center bottom', willChange: 'transform' }}
      >
        <WaterShader />
      </div>

      {/* ── Layered overlays for designed look ── */}

      {/* Color tint — pulls shader palette toward the site's navy brand */}
      <div className="absolute inset-0 z-[1] bg-navy-900/50 mix-blend-multiply pointer-events-none" />

      {/* Vignette — darkens the edges, draws focus to center */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 45%, transparent 0%, rgba(10,22,40,0.55) 70%, rgba(10,22,40,0.92) 100%)',
        }}
      />

      {/* Top fade — seamless blend with navbar */}
      <div className="absolute inset-x-0 top-0 h-32 z-[3] bg-gradient-to-b from-navy-900/80 to-transparent pointer-events-none" />

      {/* Bottom fade — seamless blend into next section */}
      <div className="absolute inset-x-0 bottom-0 h-40 z-[3] bg-gradient-to-t from-navy-900 via-navy-900/80 to-transparent pointer-events-none" />

      {/* Subtle accent glow behind center content (pre-blurred via wide gradient stops) */}
      <div
        className="absolute z-[2] pointer-events-none opacity-25"
        style={{
          width: '900px',
          height: '650px',
          left: '50%',
          top: '42%',
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(ellipse, rgba(79,195,247,0.10) 0%, rgba(3,149,214,0.04) 30%, transparent 55%)',
        }}
      />

      {/* Content — parallax wrapper */}
      <div ref={contentRef} className="relative z-[4]">
        <HeroContent />
      </div>
    </section>
  )
}
