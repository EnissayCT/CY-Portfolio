import { useEffect, useRef, useState, useCallback } from 'react'
import { prefersReducedMotion } from '../../utils/perfBudget'

const TRAIL_COUNT = 5

type CursorMode = 'default' | 'hover' | 'title'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<HTMLDivElement[]>([])
  const rippleContainerRef = useRef<HTMLDivElement>(null)
  const [cursorMode, setCursorMode] = useState<CursorMode>('default')
  const [isVisible, setIsVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const spawnRipple = useCallback((x: number, y: number) => {
    if (!rippleContainerRef.current || prefersReducedMotion) return
    const ring = document.createElement('div')
    ring.className = 'fixed pointer-events-none z-[99998] rounded-full border border-accent/40'
    ring.style.cssText = `left:${x}px;top:${y}px;width:0;height:0;transform:translate(-50%,-50%);`
    rippleContainerRef.current.appendChild(ring)
    ring.animate(
      [
        { width: '0px', height: '0px', opacity: 0.6 },
        { width: '80px', height: '80px', opacity: 0 },
      ],
      { duration: 600, easing: 'cubic-bezier(0.22,1,0.36,1)' },
    ).onfinish = () => ring.remove()
  }, [])

  useEffect(() => {
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches
    if (isTouch) {
      setIsTouchDevice(true)
      return
    }

    const pos = {
      mouseX: 0,
      mouseY: 0,
      cursorX: 0,
      cursorY: 0,
      dotX: 0,
      dotY: 0,
    }

    const trail = Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 }))

    let magnetTarget: HTMLElement | null = null
    let magnetRect: DOMRect | null = null
    let idle = false
    let idleTimer: ReturnType<typeof setTimeout> | null = null

    // Single mousemove handler (was 2 separate listeners before)
    const handleMouseMove = (e: MouseEvent) => {
      pos.mouseX = e.clientX
      pos.mouseY = e.clientY
      setIsVisible(true)

      // Reset idle detection
      idle = false
      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = setTimeout(() => { idle = true }, 2000)

      // Element hover detection (inlined, no second listener)
      const target = e.target as HTMLElement

      // Check for title/heading elements first
      const titleEl = target.closest('h1, h2, h3, [data-cursor-title]') as HTMLElement | null
      const hoverEl = target.closest(
        'a, button, [data-cursor-hover], input, textarea, select',
      ) as HTMLElement | null

      if (titleEl) {
        setCursorMode('title')
      } else if (hoverEl) {
        setCursorMode('hover')
      } else {
        setCursorMode('default')
      }
      magnetTarget = hoverEl || titleEl
      magnetRect = magnetTarget ? magnetTarget.getBoundingClientRect() : null
    }

    const handleMouseDown = (e: MouseEvent) => {
      spawnRipple(e.clientX, e.clientY)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)
    document.documentElement.addEventListener('mouseenter', handleMouseEnter)

    let rafId: number

    const animate = () => {
      rafId = requestAnimationFrame(animate)

      // Skip all work when idle
      if (idle) return

      // Magnetic pull — only re-read rect when actively hovering
      let targetX = pos.mouseX
      let targetY = pos.mouseY
      if (magnetTarget && magnetRect) {
        const cx = magnetRect.left + magnetRect.width / 2
        const cy = magnetRect.top + magnetRect.height / 2
        const dx = cx - pos.mouseX
        const dy = cy - pos.mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 80) {
          const pull = (1 - dist / 80) * 0.35
          targetX = pos.mouseX + dx * pull
          targetY = pos.mouseY + dy * pull
        }
      }

      pos.cursorX += (targetX - pos.cursorX) * 0.15
      pos.cursorY += (targetY - pos.cursorY) * 0.15
      pos.dotX += (targetX - pos.dotX) * 0.6
      pos.dotY += (targetY - pos.dotY) * 0.6

      // Use transform instead of left/top (composited, no layout)
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.cursorX}px, ${pos.cursorY}px) translate(-50%, -50%)`
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.dotX}px, ${pos.dotY}px) translate(-50%, -50%)`
      }

      // Foam trail
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const prev = i === 0 ? { x: pos.dotX, y: pos.dotY } : trail[i - 1]
        const lerp = 0.25 - i * 0.03
        trail[i].x += (prev.x - trail[i].x) * lerp
        trail[i].y += (prev.y - trail[i].y) * lerp
        const el = trailRefs.current[i]
        if (el) {
          el.style.transform = `translate(${trail[i].x}px, ${trail[i].y}px) translate(-50%, -50%)`
        }
      }
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      document.documentElement.removeEventListener(
        'mouseleave',
        handleMouseLeave,
      )
      document.documentElement.removeEventListener(
        'mouseenter',
        handleMouseEnter,
      )
      cancelAnimationFrame(rafId)
      if (idleTimer) clearTimeout(idleTimer)
    }
  }, [spawnRipple])

  if (isTouchDevice) return null

  return (
    <>
      {/* Ripple container */}
      <div ref={rippleContainerRef} className="fixed inset-0 pointer-events-none z-[99998]" />

      {/* Foam trail dots */}
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailRefs.current[i] = el }}
          className="fixed top-0 left-0 rounded-full bg-accent pointer-events-none z-[99997] transition-opacity duration-300"
          style={{
            width: `${3 - i * 0.3}px`,
            height: `${3 - i * 0.3}px`,
            opacity: isVisible ? 0.4 - i * 0.06 : 0,
            willChange: 'transform',
          }}
        />
      ))}

      {/* Main ring */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 rounded-full border pointer-events-none z-[99999] transition-[width,height,border-color,background-color] duration-300 ease-out ${
          cursorMode === 'title'
            ? 'w-20 h-20 border-accent/70 bg-accent/5'
            : cursorMode === 'hover'
              ? 'w-16 h-16 border-accent bg-accent/10'
              : 'w-10 h-10 border-accent/50'
        } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{ willChange: 'transform' }}
      />
      {/* Center dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full bg-accent pointer-events-none z-[99999] transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ willChange: 'transform' }}
      />
    </>
  )
}
