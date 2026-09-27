import { useEffect, useRef } from 'react'
import lottie, { type AnimationItem } from 'lottie-web'
import { prefersReducedMotion } from '../../utils/perfBudget'

interface LottieCreature {
  container: HTMLDivElement
  anim: AnimationItem
}

// Creatures that traverse the screen horizontally
interface Traveller {
  path: string
  width: number
  height: number
  speed: number        // px/s
  direction: 'ltr' | 'rtl'
  top: string          // CSS top (vh-based or %)
  opacity: number
  flipX?: boolean
}

// Creatures that stay in place
interface Stationary {
  path: string
  width: number
  height: number
  positions: { top: string; left: string }[]
  opacity: number
}

const TRAVELLERS: Traveller[] = [
  // Fish.json — school of fish, left-to-right
  { path: '/fish/Fish.json', width: 280, height: 108, speed: 30, direction: 'ltr', top: '35vh', opacity: 0.18 },
  // fish (1).json — single fish, right-to-left
  { path: '/fish/fish (1).json', width: 140, height: 140, speed: 22, direction: 'rtl', top: '60vh', opacity: 0.15, flipX: true },
  // Another fish (1) instance at different height, ltr
  { path: '/fish/fish (1).json', width: 110, height: 110, speed: 18, direction: 'ltr', top: '78vh', opacity: 0.12 },
]

const STATIONARY: Stationary[] = [
  // jellyfish hovering at multiple positions
  {
    path: '/fish/jellyfish.json',
    width: 80,
    height: 80,
    opacity: 0.13,
    positions: [
      { top: '25vh', left: '8vw' },
      { top: '50vh', left: '85vw' },
      { top: '70vh', left: '45vw' },
    ],
  },
  // fish (2) swimming in place at a couple spots
  {
    path: '/fish/fish (2).json',
    width: 70,
    height: 70,
    opacity: 0.12,
    positions: [
      { top: '40vh', left: '75vw' },
      { top: '65vh', left: '20vw' },
    ],
  },
]

export default function SwimmingFish() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const creaturesRef = useRef<LottieCreature[]>([])
  const rafsRef = useRef<number[]>([])

  useEffect(() => {
    if (prefersReducedMotion) return
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const creatures: LottieCreature[] = []
    const rafs: number[] = []

    // --- Travellers: animate across the viewport ---
    for (const t of TRAVELLERS) {
      const el = document.createElement('div')
      el.style.cssText = `position:fixed;pointer-events:none;width:${t.width}px;height:${t.height}px;top:${t.top};opacity:${t.opacity};z-index:-1;will-change:transform;${t.flipX ? 'transform:scaleX(-1);' : ''}`
      wrapper.appendChild(el)

      const anim = lottie.loadAnimation({
        container: el,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: t.path,
        rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
      })

      creatures.push({ container: el, anim })

      // CSS-driven infinite horizontal traversal
      const screenW = window.innerWidth
      let x = t.direction === 'ltr' ? -t.width : screenW + t.width
      const dir = t.direction === 'ltr' ? 1 : -1
      let last = performance.now()

      function move(now: number) {
        const dt = (now - last) / 1000
        last = now
        x += t.speed * dir * dt

        // Wrap
        if (t.direction === 'ltr' && x > screenW + t.width) x = -t.width
        if (t.direction === 'rtl' && x < -t.width) x = screenW + t.width

        el.style.left = `${x}px`
        const id = requestAnimationFrame(move)
        rafs.push(id)
      }

      const id = requestAnimationFrame(move)
      rafs.push(id)
    }

    // --- Stationary creatures ---
    for (const s of STATIONARY) {
      for (const pos of s.positions) {
        const el = document.createElement('div')
        el.style.cssText = `position:fixed;pointer-events:none;width:${s.width}px;height:${s.height}px;top:${pos.top};left:${pos.left};opacity:${s.opacity};z-index:-1;`
        wrapper.appendChild(el)

        const anim = lottie.loadAnimation({
          container: el,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: s.path,
          rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
        })

        creatures.push({ container: el, anim })
      }
    }

    creaturesRef.current = creatures
    rafsRef.current = rafs

    return () => {
      for (const id of rafsRef.current) cancelAnimationFrame(id)
      for (const c of creaturesRef.current) {
        c.anim.destroy()
        c.container.remove()
      }
      creaturesRef.current = []
      rafsRef.current = []
    }
  }, [])

  if (prefersReducedMotion) return null

  return <div ref={wrapperRef} aria-hidden="true" />
}
