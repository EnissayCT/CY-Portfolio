import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const isHoveringRef = useRef(false)
  const isVisibleRef = useRef(false)
  const [isTouchDevice] = useState(
    () =>
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches,
  )

  useEffect(() => {
    if (isTouchDevice) return

    const pos = {
      mouseX: 0,
      mouseY: 0,
      cursorX: 0,
      cursorY: 0,
      dotX: 0,
      dotY: 0,
    }

    const applyHoverStyle = (hovering: boolean) => {
      const cursor = cursorRef.current
      if (!cursor || hovering === isHoveringRef.current) return
      isHoveringRef.current = hovering
      cursor.classList.toggle('w-16', hovering)
      cursor.classList.toggle('h-16', hovering)
      cursor.classList.toggle('border-accent', hovering)
      cursor.classList.toggle('bg-accent/10', hovering)
      cursor.classList.toggle('w-10', !hovering)
      cursor.classList.toggle('h-10', !hovering)
      cursor.classList.toggle('border-accent/50', !hovering)
    }

    const applyVisible = (visible: boolean) => {
      const cursor = cursorRef.current
      const dot = dotRef.current
      if (!cursor || !dot || visible === isVisibleRef.current) return
      isVisibleRef.current = visible
      cursor.classList.toggle('opacity-100', visible)
      cursor.classList.toggle('opacity-0', !visible)
      dot.classList.toggle('opacity-100', visible)
      dot.classList.toggle('opacity-0', !visible)
    }

    const handleMouseMove = (e: MouseEvent) => {
      pos.mouseX = e.clientX
      pos.mouseY = e.clientY
      applyVisible(true)

      const target = e.target as HTMLElement
      applyHoverStyle(
        !!target.closest(
          'a, button, [data-cursor-hover], input, textarea, select',
        ),
      )
    }

    const handleMouseLeave = () => applyVisible(false)
    const handleMouseEnter = () => applyVisible(true)

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)
    document.documentElement.addEventListener('mouseenter', handleMouseEnter)

    let rafId = 0

    const animate = () => {
      pos.cursorX += (pos.mouseX - pos.cursorX) * 0.15
      pos.cursorY += (pos.mouseY - pos.cursorY) * 0.15
      pos.dotX += (pos.mouseX - pos.dotX) * 0.6
      pos.dotY += (pos.mouseY - pos.dotY) * 0.6

      const cursor = cursorRef.current
      const dot = dotRef.current
      if (cursor) {
        cursor.style.transform = `translate(${pos.cursorX}px, ${pos.cursorY}px) translate(-50%, -50%)`
      }
      if (dot) {
        dot.style.transform = `translate(${pos.dotX}px, ${pos.dotY}px) translate(-50%, -50%)`
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave)
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter)
      cancelAnimationFrame(rafId)
    }
  }, [isTouchDevice])

  if (isTouchDevice) return null

  return (
    <>
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[99999] hidden h-10 w-10 rounded-full border border-accent/50 opacity-0 transition-[width,height,border-color,background-color] duration-300 ease-out will-change-transform md:block"
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[99999] hidden h-2 w-2 rounded-full bg-accent opacity-0 transition-opacity duration-300 will-change-transform md:block"
      />
    </>
  )
}
