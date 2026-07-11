import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experiences } from '../../data/experience'
import ExperienceCard from './ExperienceCard'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      if (!scrollRef.current || !triggerRef.current) return

      const ctx = gsap.context(() => {
        const scrollWidth = scrollRef.current!.scrollWidth - window.innerWidth + 100

        gsap.to(scrollRef.current, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: triggerRef.current,
            start: 'top top',
            end: () => `+=${scrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
      }, sectionRef)

      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [])

  return (
    <section id="experience" ref={sectionRef} className="relative">
      {/* Mobile: vertical stack */}
      <div className="section-padding md:hidden">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-4">
            <span className="font-mono text-sm text-accent">02.</span>
            <h2 className="font-display text-3xl font-bold text-white">
              Where I've Worked
            </h2>
            <div className="ml-4 h-px flex-1 bg-white/10" />
          </div>
          <div className="flex flex-col gap-5">
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} stacked />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: horizontal scroll */}
      <div
        ref={triggerRef}
        className="hidden min-h-screen flex-col justify-center overflow-hidden md:flex"
      >
        <div className="mb-12 px-6 md:px-12 lg:px-24">
          <div className="mx-auto flex max-w-7xl items-center gap-4">
            <span className="font-mono text-sm text-accent">02.</span>
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              Where I've Worked
            </h2>
            <div className="ml-4 h-px flex-1 bg-white/10" />
          </div>
          <p className="mx-auto mt-4 max-w-7xl text-white/50">
            <span className="font-mono text-xs text-accent">{'// '}</span>
            Scroll to explore my journey
          </p>
        </div>

        <div
          ref={scrollRef}
          className="flex items-center gap-8 px-6 md:px-12 lg:px-24 will-change-transform"
        >
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
          <div className="min-w-[200px] flex-shrink-0" />
        </div>
      </div>
    </section>
  )
}
