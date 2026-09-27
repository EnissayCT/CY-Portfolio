import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { education } from '../../data/education'
import EducationCard from './EducationCard'

gsap.registerPlugin(ScrollTrigger)

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Use a direct scroll-driven approach for the timeline line
  const updateLine = useCallback(() => {
    if (!lineRef.current || !timelineRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const viewportH = window.innerHeight
    // How far the viewport center has traveled through the timeline container
    const progress = (viewportH * 0.6 - rect.top) / rect.height
    const clamped = Math.max(0, Math.min(1, progress))
    lineRef.current.style.transform = `scaleY(${clamped})`
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section entry — fade in
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
          },
        },
      )

      // Animate cards
      gsap.fromTo(
        '.edu-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
          },
        },
      )
    }, sectionRef)

    // Drive timeline line via rAF scroll listener for reliability with Lenis
    const onScroll = () => updateLine()
    window.addEventListener('scroll', onScroll, { passive: true })
    // Also hook into Lenis via gsap ticker
    gsap.ticker.add(updateLine)
    updateLine()

    return () => {
      ctx.revert()
      window.removeEventListener('scroll', onScroll)
      gsap.ticker.remove(updateLine)
    }
  }, [updateLine])

  return (
    <section
      id="education"
      ref={sectionRef}
      className="section-padding relative"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-16">
          <span className="text-accent font-mono text-sm">05.</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
            Education
          </h2>
          <div className="flex-1 h-px bg-white/10 ml-4" />
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Vertical line */}
          <div
            ref={lineRef}
            className="hidden md:block absolute left-1/2 top-0 w-px h-full bg-accent/30 -translate-x-1/2 origin-top"
            style={{ transform: 'scaleY(0)' }}
          />

          <div className="space-y-12">
            {education.map((edu, i) => (
              <EducationCard key={edu.id} education={edu} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
