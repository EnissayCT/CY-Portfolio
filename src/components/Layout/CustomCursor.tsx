import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

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

    const handleMouseMove = (e: MouseEvent) => {
      pos.mouseX = e.clientX
      pos.mouseY = e.clientY
      setIsVisible(true)
    }

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      setIsHovering(
        !!target.closest(
          'a, button, [data-cursor-hover], input, textarea, select',
        ),
      )
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousemove', handleElementHover)
    document.documentElement.addEventListener('mouseleave', handleMouseLeave)
    document.documentElement.addEventListener('mouseenter', handleMouseEnter)

    let rafId: number

    const animate = () => {
      pos.cursorX += (pos.mouseX - pos.cursorX) * 0.15
      pos.cursorY += (pos.mouseY - pos.cursorY) * 0.15
      pos.dotX += (pos.mouseX - pos.dotX) * 0.6
      pos.dotY += (pos.mouseY - pos.dotY) * 0.6

      if (cursorRef.current) {
        cursorRef.current.style.left = `${pos.cursorX}px`
        cursorRef.current.style.top = `${pos.cursorY}px`
      }
      if (dotRef.current) {
        dotRef.current.style.left = `${pos.dotX}px`
        dotRef.current.style.top = `${pos.dotY}px`
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousemove', handleElementHover)
      document.documentElement.removeEventListener(
        'mouseleave',
        handleMouseLeave,
      )
      document.documentElement.removeEventListener(
        'mouseenter',
        handleMouseEnter,
      )
      cancelAnimationFrame(rafId)
    }
  }, [])

  if (isTouchDevice) return null

  return (
    <>
      <div
        ref={cursorRef}
        className={`fixed -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none z-[99999] transition-[width,height,border-color,background-color] duration-300 ease-out ${
          isHovering
            ? 'w-16 h-16 border-accent bg-accent/10'
            : 'w-10 h-10 border-accent/50'
        } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        ref={dotRef}
        className={`fixed -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent pointer-events-none z-[99999] transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </>
  )
}
