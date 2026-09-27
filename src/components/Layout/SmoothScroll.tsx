import { useEffect, ReactNode } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.75,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    })

    let lastDepth = -1
    lenis.on('scroll', (e: any) => {
      ScrollTrigger.update()
      // Throttle CSS variable writes — only when value actually changes
      const depth = Math.round(Math.min(e.progress || 0, 1) * 100) / 100
      if (depth !== lastDepth) {
        lastDepth = depth
        document.documentElement.style.setProperty('--scroll-depth', depth.toString())
      }
    })

    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(raf)

    const handleScrollLock = (
      event: Event,
    ) => {
      const customEvent = event as CustomEvent<{ locked?: boolean }>
      if (customEvent.detail?.locked) {
        lenis.stop()
      } else {
        lenis.start()
      }
    }

    window.addEventListener('portfolio:scroll-lock', handleScrollLock)

    return () => {
      gsap.ticker.remove(raf)
      window.removeEventListener('portfolio:scroll-lock', handleScrollLock)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
