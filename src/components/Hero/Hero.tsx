import { Suspense } from 'react'
import ParticleField from './ParticleField'
import HeroContent from './HeroContent'

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen overflow-hidden">
      {/* 3D Particle Background */}
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-navy-900/30 via-transparent to-navy-900 pointer-events-none" />

      {/* Content */}
      <HeroContent />
    </section>
  )
}
