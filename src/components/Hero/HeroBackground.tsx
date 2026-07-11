import { useEffect, useRef, useState } from 'react'
import MetaBalls from './MetaBalls'

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < breakpoint,
  )

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [breakpoint])

  return isMobile
}

export default function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0.05 },
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden bg-navy-900"
    >
      <div className="absolute inset-0 scale-[1.15] blur-2xl max-md:scale-110 max-md:blur-xl">
        <MetaBalls
          baseColor="#4eb896"
          highlightColor="#b0f5de"
          ballCount={isMobile ? 5 : 8}
          animationSize={isMobile ? 26 : 22}
          speed={0.11}
          clumpFactor={1.05}
          fieldThreshold={0.88}
          glassBlur={1.4}
          mouseRadius={11}
          maxPull={1.8}
          followSpeed={0.05}
          returnSpeed={0.08}
          enableMouseInteraction={!isMobile}
          paused={paused}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-navy-900/15 backdrop-blur-[1px]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-900/35 via-transparent to-navy-900" />
    </div>
  )
}
