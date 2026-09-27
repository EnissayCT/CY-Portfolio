import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3, rootMargin: '-80px 0px -80px 0px' },
    )

    const sections = document.querySelectorAll('section[id]')
    sections.forEach((s) => observer.observe(s))

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 w-full z-[1000] transition-all duration-500 ${
        isScrolled
          ? 'py-3 bg-navy-900/90 backdrop-blur-md border-b border-white/5'
          : 'py-6 bg-transparent'
      }`}
    >
      {/* Shimmer gradient when scrolled */}
      {isScrolled && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(79,195,247,0.03) 25%, transparent 50%, rgba(79,195,247,0.03) 75%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'navShimmer 8s ease-in-out infinite',
          }}
        />
      )}
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="text-2xl font-display font-bold text-white hover:text-accent transition-colors"
          data-cursor-hover
        >
          Y<span className="text-accent">.</span>C
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                className={`relative text-sm font-medium transition-colors hover:text-accent ${
                  activeSection === link.href.slice(1)
                    ? 'text-accent'
                    : 'text-white/70'
                }`}
                data-cursor-hover
              >
                {link.label}
                {/* Wave underline */}
                <svg
                  className={`absolute -bottom-1 left-0 w-full h-[4px] transition-opacity duration-300 ${
                    activeSection === link.href.slice(1) ? 'opacity-100' : 'opacity-0'
                  }`}
                  viewBox="0 0 100 4"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 2 Q 10 0, 20 2 T 40 2 T 60 2 T 80 2 T 100 2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-accent"
                  />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        {/* Resume Button (Desktop) */}
        <a
          href="/resume.pdf"
          download="Yassine_CHRITT_Resume.pdf"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-accent border border-accent/30 rounded-lg hover:bg-accent/10 hover:border-accent/50 transition-all duration-300"
          data-cursor-hover
        >
          Resume
        </a>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 top-0 z-[1001] bg-navy-900/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 transition-all duration-500 ${
          isMobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-6 right-6 text-white p-2 z-10"
          aria-label="Close menu"
        >
          <X size={28} />
        </button>
        {navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => {
              e.preventDefault()
              handleNavClick(link.href)
            }}
            className="text-2xl font-display font-semibold text-white/80 hover:text-accent transition-colors"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <span className="text-accent mr-2 font-mono text-sm">
              0{i + 1}.
            </span>
            {link.label}
          </a>
        ))}
      </div>
    </header>
  )
}
