import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { skillCategories } from '../../data/skills'
import SkillItem from './SkillItem'

gsap.registerPlugin(ScrollTrigger)

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)

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

      gsap.fromTo(
        '.skill-category',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        },
      )

      gsap.fromTo(
        '.skill-item',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.04,
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!spotlightRef.current || !gridRef.current) return
    const rect = gridRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    spotlightRef.current.style.background = `radial-gradient(circle 200px at ${x}px ${y}px, rgba(79,195,247,0.06), transparent 70%)`
  }

  const handleMouseLeave = () => {
    if (spotlightRef.current) {
      spotlightRef.current.style.background = 'transparent'
    }
  }

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-padding relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-16">
          <span className="text-accent font-mono text-sm">04.</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
            Skills &amp; Tools
          </h2>
          <div className="flex-1 h-px bg-white/10 ml-4" />
        </div>

        {/* Skills Grid with Spotlight */}
        <div
          ref={gridRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative isolate overflow-visible rounded-[2rem] px-6 py-6 -mx-6 -my-6 md:px-8 md:py-8 md:-mx-8 md:-my-8"
        >
          <div
            ref={spotlightRef}
            className="absolute -inset-16 pointer-events-none z-10 rounded-[2.5rem] blur-2xl"
          />

          <div className="grid md:grid-cols-3 gap-10">
            {skillCategories.map((category) => (
              <div key={category.id} className="skill-category glass-card p-8 hover:glow-border transition-all duration-500">
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="text-lg font-display font-semibold text-white">
                    {category.title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {category.skills.map((skill) => (
                    <SkillItem key={skill.name} name={skill.name} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
