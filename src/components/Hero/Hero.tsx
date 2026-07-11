import HeroBackground from './HeroBackground'
import HeroContent from './HeroContent'

export default function Hero() {
  return (
    <section id="hero" className="relative h-screen overflow-hidden bg-navy-900">
      <HeroBackground />
      <HeroContent />
    </section>
  )
}
