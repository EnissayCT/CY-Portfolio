import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'About', href: '#about', num: '01' },
  { label: 'Experience', href: '#experience', num: '02' },
  { label: 'Projects', href: '#projects', num: '03' },
  { label: 'Skills', href: '#skills', num: '04' },
  { label: 'Education', href: '#education', num: '05' },
  { label: 'Contact', href: '#contact', num: '06' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { threshold: 0.3, rootMargin: '-80px 0px -80px 0px' },
    )

    document.querySelectorAll('section[id]').forEach((s) => observer.observe(s))
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const mobileMenu = createPortal(
    <div
      className={`fixed inset-0 z-[9999] md:hidden transition-all duration-300 ${
        isMobileOpen
          ? 'visible opacity-100'
          : 'invisible opacity-0 pointer-events-none'
      }`}
      aria-hidden={!isMobileOpen}
    >
      <div
        className="absolute inset-0 bg-navy-900/98 backdrop-blur-xl"
        onClick={() => setIsMobileOpen(false)}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-6">
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-5 right-5 rounded-full p-2 text-white"
          aria-label="Close menu"
        >
          <X size={28} />
        </button>

        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => {
              e.preventDefault()
              handleNavClick(link.href)
            }}
            className={`text-2xl font-display font-semibold transition-colors ${
              activeSection === link.href.slice(1)
                ? 'text-accent'
                : 'text-white/80 hover:text-accent'
            }`}
          >
            <span className="mr-2 font-mono text-sm text-accent">{link.num}.</span>
            {link.label}
          </a>
        ))}

        <a
          href="/resume.pdf"
          download="Yassine_CHRITT_Resume.pdf"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-accent/30 px-5 py-2.5 text-sm font-medium text-accent"
          onClick={() => setIsMobileOpen(false)}
        >
          Resume
        </a>
      </div>
    </div>,
    document.body,
  )

  return (
    <>
      <header
        className={`fixed top-0 z-[1000] w-full transition-all duration-500 ${
          isScrolled || isMobileOpen
            ? 'border-b border-white/5 bg-navy-900/90 py-3 backdrop-blur-xl'
            : 'bg-transparent py-5 md:py-6'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setIsMobileOpen(false)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="text-xl font-display font-bold text-white md:text-2xl"
          >
            Y<span className="text-accent">.</span>C
          </a>

          <ul className="hidden items-center gap-8 md:flex">
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
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-[2px] bg-accent transition-all duration-300 ${
                      activeSection === link.href.slice(1) ? 'w-full' : 'w-0'
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <a
            href="/resume.pdf"
            download="Yassine_CHRITT_Resume.pdf"
            className="hidden items-center gap-2 rounded-lg border border-accent/30 px-4 py-2 text-sm font-medium text-accent transition-all hover:bg-accent/10 md:inline-flex"
          >
            Resume
          </a>

          <button
            onClick={() => setIsMobileOpen((open) => !open)}
            className="rounded-lg p-2 text-white md:hidden"
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {mobileMenu}
    </>
  )
}
