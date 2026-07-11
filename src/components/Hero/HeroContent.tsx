import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'
import { ChevronDown } from 'lucide-react'

const NAME = 'YASSINE CHRITT'
const ROLES = [
  'ERP Consultant',
  'SAP S/4HANA & Odoo',
  'AMOA Graduate',
  'Problem Solver',
]

export default function HeroContent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLSpanElement>(null)
  const greetingRef = useRef<HTMLParagraphElement>(null)
  const subtitleWrapperRef = useRef<HTMLDivElement>(null)
  const socialsRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Greeting
      gsap.fromTo(
        greetingRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' },
      )

      // Name letters stagger
      if (nameRef.current) {
        gsap.fromTo(
          nameRef.current.querySelectorAll('.char-span'),
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.04,
            ease: 'power3.out',
            delay: 0.5,
          },
        )
      }

      // Subtitle wrapper
      gsap.fromTo(
        subtitleWrapperRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          delay: 1.5,
          onComplete: startTypewriter,
        },
      )

      // Social links
      gsap.fromTo(
        socialsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 2 },
      )

      // Scroll indicator
      gsap.fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 2.5 },
      )
    }, containerRef)

    // Typewriter effect
    let typewriterTimeout: ReturnType<typeof setTimeout>
    let roleIndex = 0
    let charIndex = 0
    let isDeleting = false

    function startTypewriter() {
      typeStep()
    }

    function typeStep() {
      const currentRole = ROLES[roleIndex]

      if (!isDeleting) {
        charIndex++
        if (charIndex > currentRole.length) {
          typewriterTimeout = setTimeout(() => {
            isDeleting = true
            typeStep()
          }, 2000)
          return
        }
      } else {
        charIndex--
        if (charIndex === 0) {
          isDeleting = false
          roleIndex = (roleIndex + 1) % ROLES.length
        }
      }

      if (subtitleRef.current) {
        subtitleRef.current.textContent = currentRole.substring(0, charIndex)
      }

      typewriterTimeout = setTimeout(
        typeStep,
        isDeleting ? 40 : 80,
      )
    }

    return () => {
      ctx.revert()
      clearTimeout(typewriterTimeout)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6"
    >
      {/* Greeting */}
      <p
        ref={greetingRef}
        className="text-accent font-mono text-sm md:text-base mb-4 opacity-0"
      >
        Hi, my name is
      </p>

      {/* Name */}
      <h1
        ref={nameRef}
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-white tracking-tight mb-6 flex flex-wrap justify-center gap-x-3 md:gap-x-5"
      >
        {NAME.split(' ').map((word, wi) => (
          <span key={wi} className="inline-block">
            {word.split('').map((char, ci) => (
              <span
                key={`${wi}-${ci}`}
                className="inline-block char-span opacity-0"
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </h1>

      {/* Typewriter Role */}
      <div
        ref={subtitleWrapperRef}
        className="flex items-center gap-1 text-lg md:text-2xl text-white/60 font-light mb-12 h-10 opacity-0"
      >
        <span className="text-accent font-mono">&gt;</span>
        <span ref={subtitleRef} className="font-mono" />
        <span className="w-[2px] h-6 bg-accent animate-pulse" />
      </div>

      {/* Social Links */}
      <div ref={socialsRef} className="flex items-center gap-6 mb-16 opacity-0">
        {[
          {
            icon: <FaGithub size={22} />,
            href: 'https://github.com/enissayct',
            label: 'GitHub',
          },
          {
            icon: <FaLinkedin size={22} />,
            href: 'https://linkedin.com/in/chritt-yassine',
            label: 'LinkedIn',
          },
          {
            icon: <HiOutlineMail size={22} />,
            href: 'mailto:chrittyassine@gmail.com',
            label: 'Email',
          },
        ].map((social) => (
          <a
            key={social.label}
            href={social.href}
            target={social.href.startsWith('mailto') ? undefined : '_blank'}
            rel="noopener noreferrer"
            className="text-white/50 hover:text-accent hover:-translate-y-1 transition-all duration-300"
            data-cursor-hover
            aria-label={social.label}
          >
            {social.icon}
          </a>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-white/30 opacity-0"
      >
        <span className="text-xs font-mono tracking-widest uppercase">
          Scroll
        </span>
        <ChevronDown size={20} className="animate-bounce" />
      </div>
    </div>
  )
}
