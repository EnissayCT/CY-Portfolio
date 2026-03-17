import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronRight } from 'lucide-react'
import { experiences } from '../../data/experience'
import ExperienceCard from './ExperienceCard'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile || !scrollRef.current || !triggerRef.current) return

    const ctx = gsap.context(() => {
      const scrollWidth =
        scrollRef.current!.scrollWidth - window.innerWidth + 100

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
  }, [isMobile])

  return (
    <section id="experience" ref={sectionRef} className="relative">
      {isMobile ? (
        /* Mobile: Horizontal Scroll */
        <div className="section-padding overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-accent font-mono text-sm">02.</span>
              <h2 className="text-3xl font-display font-bold text-white">
                Where I've Worked
              </h2>
              <div className="flex-1 h-px bg-white/10 ml-4" />
            </div>
            <div className="relative">
              <div
                ref={mobileScrollRef}
                onScroll={() => { if (!hasScrolled) setHasScrolled(true) }}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 px-2 scrollbar-hide"
              >
                {experiences.map((exp) => (
                  <div key={exp.id} className="snap-start flex-shrink-0 w-[85vw]">
                    <ExperienceCard experience={exp} />
                  </div>
                ))}
              </div>

              {/* Scroll indicator — fades out after first swipe */}
              <div
                className={`absolute right-0 top-0 bottom-4 w-14 flex items-center justify-end pr-1 pointer-events-none bg-gradient-to-l from-navy-900 via-navy-900/80 to-transparent transition-opacity duration-700 ${
                  hasScrolled ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <ChevronRight size={22} className="text-accent animate-nudge-right" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop: Horizontal Scroll */
        <div ref={triggerRef} className="min-h-screen flex flex-col justify-center overflow-hidden">
          <div className="px-6 md:px-12 lg:px-24 mb-12">
            <div className="flex items-center gap-4 max-w-7xl mx-auto">
              <span className="text-accent font-mono text-sm">02.</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                Where I've Worked
              </h2>
              <div className="flex-1 h-px bg-white/10 ml-4" />
            </div>
            <p className="text-white/50 mt-4 max-w-7xl mx-auto">
              <span className="text-accent font-mono text-xs">
                {'// '}
              </span>
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
            {/* Spacer for last card visibility */}
            <div className="min-w-[200px] flex-shrink-0" />
          </div>
        </div>
      )}
    </section>
  )
}
