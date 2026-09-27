import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!barRef.current) return
      const scrollTop = window.scrollY
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      barRef.current.style.width = `${progress * 100}%`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[9998] bg-transparent">
      <div
        ref={barRef}
        className="h-full bg-accent shadow-[0_0_10px_rgba(79,195,247,0.5)]"
        style={{ width: '0%' }}
      />
    </div>
  )
}
