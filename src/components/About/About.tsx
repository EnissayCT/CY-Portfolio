import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Trophy, Briefcase, GraduationCap, Globe } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  {
    icon: <Trophy size={24} />,
    value: '3rd',
    label: 'Place Worldwide',
    suffix: '',
    hoverInfo: "3rd in Huawei's ICT Cloud Track Competition — Global Final in China",
  },
  {
    icon: <Briefcase size={24} />,
    value: '3',
    label: 'Years Experience',
    suffix: '+',
    hoverInfo: 'ERP development, data analytics, web development & freelance automation since 2023',
  },
  {
    icon: <GraduationCap size={24} />,
    value: 'INPT',
    label: 'Engineering School',
    suffix: '',
    hoverInfo: 'AMOA Program — Digital Transformation & IT Consulting at Institut National des Postes et Télécommunications, Rabat',
  },
  {
    icon: <Globe size={24} />,
    value: '3',
    label: 'Languages Spoken',
    suffix: '',
    hoverInfo: 'Arabic — Fluent | English — C2 (TOEIC) | French — Intermediate',
  },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

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
      className="section-padding !pb-4 relative overflow-hidden"
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
                className="w-full aspect-[3/4] object-cover object-top rounded-2xl group-hover:scale-[1.03] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-accent/8 group-hover:bg-transparent transition-colors duration-500 rounded-2xl" />
            </div>
            {/* Subtle corner accent */}
            <div className="absolute -bottom-3 -right-3 w-full h-full border border-accent/15 rounded-2xl -z-10" />
          </div>

          {/* Content */}
          <div ref={contentRef} className="space-y-6">
            <p className="reveal-text text-white/70 text-lg leading-relaxed">
              I'm an{' '}
              <span className="text-accent font-medium">
                AMOA student at INPT
              </span>{' '}
              with hands-on experience in ERP systems (SAP &amp; Odoo),
              automation tools, and data analytics.
            </p>
            <p className="reveal-text text-white/70 text-lg leading-relaxed">
              I participated in multiple national and international
              competitions, including the{' '}
              <span className="text-accent font-medium">
                Huawei ICT Global Final in China
              </span>
              , where our team won{' '}
              <span className="text-accent font-medium">
                3rd place worldwide
              </span>
              .
            </p>
            <p className="reveal-text text-white/70 text-lg leading-relaxed">
              My expertise spans digital transformation consulting, ERP
              implementation, process automation, data analytics, and
              full-stack web development. I'm passionate about bridging
              business needs with technology solutions.
            </p>

            {/* Quick Info */}
            <div className="reveal-text grid grid-cols-2 gap-4 pt-4">
              {[
                { label: 'Location', value: 'Casablanca, Morocco' },
                { label: 'Education', value: 'INPT — AMOA' },
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
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="stat-card glass-card p-6 text-center hover:glow-border transition-all duration-300 group relative"
            >
              <div className="text-accent mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl font-display font-bold text-white">
                {stat.value}
                <span className="text-accent">{stat.suffix}</span>
              </div>
              <p className="text-white/50 text-sm mt-1">{stat.label}</p>

              {/* Tooltip on hover */}
              <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 px-4 py-3 rounded-xl bg-navy-800/95 backdrop-blur-md border border-white/10 shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-20">
                <p className="text-white/80 text-xs leading-relaxed text-center">
                  {stat.hoverInfo}
                </p>
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-navy-800/95" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
