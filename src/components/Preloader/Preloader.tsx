import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const waveRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const rippleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete })

      // Name reveal with ripple ring
      tl.fromTo(
        nameRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
      )
      tl.fromTo(
        rippleRef.current,
        { scale: 0, opacity: 0.6 },
        { scale: 4, opacity: 0, duration: 0.8, ease: 'power2.out' },
        '<+=0.1',
      )

      // Counter + wave rise
      const counter = { val: 0 }
      tl.to(
        counter,
        {
          val: 100,
          duration: 1.05,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = Math.round(counter.val).toString()
            }
            if (waveRef.current) {
              waveRef.current.style.transform = `translateY(${100 - counter.val}%)`
            }
          },
        },
        0.3,
      )

      // Exit — water recedes downward
      tl.to(waveRef.current, {
        yPercent: 100,
        duration: 0.5,
        ease: 'power3.in',
        delay: 0.05,
      })
      tl.to(
        preloaderRef.current,
        {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut',
        },
        '-=0.2',
      )
    }, preloaderRef)

    return () => ctx.revert()
  }, [onComplete])

  // Generate wave clip-path points
  const wavePoints = () => {
    const pts: string[] = ['0% 100%', '100% 100%', '100% 0%']
    const steps = 20
    for (let i = steps; i >= 0; i--) {
      const x = (i / steps) * 100
      const y = Math.sin((i / steps) * Math.PI * 3) * 3 + 0
      pts.push(`${x}% ${y}%`)
    }
    return pts.join(', ')
  }

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[10000] bg-navy-900 flex flex-col items-center justify-center"
    >
      {/* Rising tide wave */}
      <div
        ref={waveRef}
        className="absolute inset-0 bg-accent/10"
        style={{
          clipPath: `polygon(${wavePoints()})`,
          transform: 'translateY(100%)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-accent/20 via-accent/8 to-transparent" />
      </div>

      {/* Logo + ripple */}
      <div ref={nameRef} className="relative mb-12 opacity-0">
        <span className="text-4xl font-display font-bold text-white relative z-10">
          Y<span className="text-accent">.</span>C
        </span>
        <div
          ref={rippleRef}
          className="absolute inset-0 m-auto w-12 h-12 rounded-full border-2 border-accent/40 pointer-events-none"
          style={{ scale: 0 }}
        />
      </div>

      {/* Counter */}
      <span
        ref={counterRef}
        className="text-accent font-mono text-sm relative z-10"
      >
        0
      </span>
    </div>
  )
}
