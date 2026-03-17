import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { education } from '../../data/education'
import EducationCard from './EducationCard'

gsap.registerPlugin(ScrollTrigger)

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Draw the timeline line
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              end: 'bottom 80%',
              scrub: 1,
            },
          },
        )
      }

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

    return () => ctx.revert()
  }, [])

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
        <div className="relative">
          {/* Vertical line */}
          <div
            ref={lineRef}
            className="hidden md:block absolute left-1/2 top-0 w-px h-full bg-accent/30 -translate-x-1/2 origin-top"
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
