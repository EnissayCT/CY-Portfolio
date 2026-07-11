import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Trophy, Briefcase, GraduationCap, Globe } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  {
    icon: <Trophy size={24} />,
    value: '2×',
    label: '3rd Worldwide',
    suffix: '',
    hoverInfo:
      'Huawei ICT Global Finals in China — 3rd Place Cloud Track (2025) and 3rd Place Innovation Track (2026)',
  },
  {
    icon: <Briefcase size={24} />,
    value: '3',
    label: 'Years Experience',
    suffix: '+',
    hoverInfo:
      'Odoo production ERP, SAP S/4HANA, data analytics, and web development since 2023',
  },
  {
    icon: <GraduationCap size={24} />,
    value: 'INPT',
    label: 'Engineering Graduate',
    suffix: '',
    hoverInfo:
      'Engineering Degree in AMOA (Assistance à la Maîtrise d’Ouvrage) — graduated July 2026, INPT Rabat',
  },
  {
    icon: <Globe size={24} />,
    value: '3',
    label: 'Languages Spoken',
    suffix: '',
    hoverInfo: 'Arabic — Native | English — C2 (TOEIC) | French — Professional',
  },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Image entrance
      gsap.fromTo(
        imageRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        },
      )

      // Content text reveal
      const textElements =
        contentRef.current?.querySelectorAll('.reveal-text')
      if (textElements) {
        gsap.fromTo(
          textElements,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 75%',
            },
          },
        )
      }

      // Stats cards
      const statElements =
        statsRef.current?.querySelectorAll('.stat-card')
      if (statElements) {
        gsap.fromTo(
          statElements,
          { y: 30, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
            },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-16">
          <span className="text-accent font-mono text-sm">01.</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
            About Me
          </h2>
          <div className="flex-1 h-px bg-white/10 ml-4" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Image */}
          <div ref={imageRef} className="relative group">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="/images/mee.jpg"
                alt="Yassine CHRITT"
                className="w-full aspect-[3/4] object-cover object-top rounded-2xl group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-accent/10 group-hover:bg-transparent transition-colors duration-500 rounded-2xl" />
            </div>
            {/* Decorative border */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-accent/20 rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div ref={contentRef} className="space-y-6">
            <p className="reveal-text text-white/70 text-lg leading-relaxed">
              AMOA graduate from{' '}
              <span className="text-accent font-medium">INPT</span>, I work as
              an ERP consultant with production experience in{' '}
              <span className="text-accent font-medium">Odoo</span> and{' '}
              <span className="text-accent font-medium">SAP S/4HANA</span>{' '}
              (SD, MM, FI) — from process analysis and implementation to rollout.
            </p>
            <p className="reveal-text text-white/70 text-lg leading-relaxed">
              Twice represented Morocco at the{' '}
              <span className="text-accent font-medium">
                Huawei ICT Global Finals in China
              </span>
              , earning{' '}
              <span className="text-accent font-medium">
                3rd place worldwide
              </span>{' '}
              on the Cloud Track (2025) and Innovation Track (2026).
            </p>
            <p className="reveal-text text-white/70 text-lg leading-relaxed">
              I focus on digitizing business processes, building reliable ERP
              solutions, and connecting operational needs with the right
              technology.
            </p>

            {/* Quick Info */}
            <div className="reveal-text grid grid-cols-2 gap-4 pt-4">
              {[
                { label: 'Location', value: 'Casablanca, Morocco' },
                { label: 'Education', value: 'INPT — AMOA Graduate' },
                {
                  label: 'Email',
                  value: 'chrittyassine@gmail.com',
                },
                { label: 'Languages', value: 'AR · EN · FR' },
              ].map((info) => (
                <div key={info.label}>
                  <span className="text-accent font-mono text-xs">
                    {info.label}
                  </span>
                  <p className="text-white/80 text-sm mt-1">
                    {info.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="stat-card glass-card p-6 text-center hover:glow-border transition-all duration-300 group relative"
            >
              <div className="text-accent mb-3 flex justify-center group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-3xl font-display font-bold text-white">
                {stat.value}
                <span className="text-accent">{stat.suffix}</span>
              </div>
              <p className="text-white/50 text-sm mt-1">{stat.label}</p>
              {/* Hover info overlay */}
              <div className="absolute inset-0 rounded-2xl bg-navy-800/95 backdrop-blur-sm flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white/80 text-xs leading-relaxed text-center">
                  {stat.hoverInfo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
