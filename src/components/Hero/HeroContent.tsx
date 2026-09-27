import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'
import { ChevronDown } from 'lucide-react'

const NAME = 'YASSINE CHRITT'
const ROLES = [
  'AMOA Consultant',
  'ERP Developer',
  'Data Analyst',
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

      // Name letters stagger — wave distortion that settles
      if (nameRef.current) {
        const chars = nameRef.current.querySelectorAll('.char-span')
        gsap.fromTo(
          chars,
          { opacity: 0, y: 100, skewX: 15, rotateZ: 3 },
          {
            opacity: 1,
            y: 0,
            skewX: 0,
            rotateZ: 0,
            duration: 1,
            stagger: 0.04,
            ease: 'power3.out',
            delay: 0.5,
          },
        )
        // Glow pulse on the name after letters land
        gsap.fromTo(
          nameRef.current,
          { textShadow: '0 0 0px rgba(79,195,247,0)' },
          {
            textShadow: '0 2px 30px rgba(79,195,247,0.25)',
            duration: 1.5,
            delay: 1.3,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: 1,
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

  // Wave animation on name hover — letters ripple up sequentially
  const waveAnimating = useRef(false)
  const handleNameHover = useCallback(() => {
    if (!nameRef.current || waveAnimating.current) return
    waveAnimating.current = true
    const chars = nameRef.current.querySelectorAll('.char-span')
    gsap.to(chars, {
      y: -12,
      color: '#4fc3f7',
      duration: 0.25,
      stagger: 0.03,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(chars, {
          y: 0,
          color: '#ffffff',
          duration: 0.4,
          stagger: 0.03,
          ease: 'elastic.out(1, 0.5)',
          onComplete: () => { waveAnimating.current = false },
        })
      },
    })
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6"
    >
      {/* Greeting */}
      <p
        ref={greetingRef}
        className="text-accent font-mono text-sm md:text-base mb-4 opacity-0 tracking-widest uppercase"
      >
        Hi, my name is
      </p>

      {/* Soft blur glow behind name */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '80%',
          maxWidth: '800px',
          height: '120px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
          background: 'radial-gradient(ellipse, rgba(79,195,247,0.12) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Name */}
      <h1
        ref={nameRef}
        onMouseEnter={handleNameHover}
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-white tracking-tight mb-6 flex flex-wrap justify-center gap-x-3 md:gap-x-5 drop-shadow-[0_2px_25px_rgba(79,195,247,0.18)] cursor-default"
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
        className="flex items-center gap-2 text-lg md:text-2xl text-white/70 font-light mb-12 h-10 opacity-0"
      >
        <span className="text-accent/60 font-mono text-sm">&gt;</span>
        <span ref={subtitleRef} className="font-mono tracking-wide" />
        <span className="w-[2px] h-5 bg-accent animate-pulse rounded-full" />
      </div>

      {/* Social Links + CTA */}
      <div ref={socialsRef} className="flex items-center gap-6 mb-16 opacity-0">
        <a
          href="#projects"
          onClick={(e) => {
            e.preventDefault()
            document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="px-6 py-3 bg-accent text-navy-900 font-medium text-sm rounded-lg hover:bg-accent-light hover:shadow-[0_0_25px_rgba(79,195,247,0.3)] transition-all duration-300"
          data-cursor-hover
        >
          View My Work
        </a>
        <div className="flex items-center gap-4">
          {[
            {
              icon: <FaGithub size={20} />,
              href: 'https://github.com/enissayct',
              label: 'GitHub',
            },
            {
              icon: <FaLinkedin size={20} />,
              href: 'https://linkedin.com/in/chritt-yassine',
              label: 'LinkedIn',
            },
            {
              icon: <HiOutlineMail size={20} />,
              href: 'mailto:chrittyassine@gmail.com',
              label: 'Email',
            },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target={social.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="text-white/40 hover:text-accent hover:-translate-y-1 transition-all duration-300 p-2 rounded-full hover:bg-white/[0.06]"
              data-cursor-hover
              aria-label={social.label}
            >
              {social.icon}
            </a>
          ))}
        </div>
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
