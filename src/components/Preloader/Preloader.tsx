import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ onComplete })

    // Name reveal
    tl.fromTo(
      nameRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
    )

    // Counter + bar animation
    const counter = { val: 0 }
    tl.to(
      counter,
      {
        val: 100,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = Math.round(counter.val).toString()
          }
        },
      },
      0.3,
    )

    tl.to(
      barRef.current,
      {
        width: '100%',
        duration: 2,
        ease: 'power2.inOut',
      },
      0.3,
    )

    // Exit wipe
    tl.to(preloaderRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power4.inOut',
      delay: 0.2,
    })

    return () => {
      tl.kill()
    }
  }, [onComplete])

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[10000] bg-navy-900 flex flex-col items-center justify-center"
    >
      {/* Logo */}
      <div ref={nameRef} className="mb-12 opacity-0">
        <span className="text-4xl font-display font-bold text-white">
          Y<span className="text-accent">.</span>C
        </span>
      </div>

      {/* Progress */}
      <div className="w-48 flex flex-col items-center gap-4">
        <div className="w-full h-[1px] bg-white/10 rounded-full overflow-hidden">
          <div
            ref={barRef}
            className="h-full bg-accent w-0 rounded-full shadow-[0_0_10px_rgba(18,214,64,0.5)]"
          />
        </div>
        <span
          ref={counterRef}
          className="text-accent font-mono text-sm"
        >
          0
        </span>
      </div>
    </div>
  )
}
