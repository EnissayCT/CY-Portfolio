import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'
import { ArrowUp } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative py-16 px-6 border-t border-white/[0.06]">
      {/* Subtle gradient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(79,195,247,0.3), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Top row — branding + back to top */}
        <div className="flex items-center justify-between mb-10">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="text-2xl font-display font-bold text-white hover:text-accent transition-colors"
          >
            Y<span className="text-accent">.</span>C
          </a>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 text-white/40 hover:text-accent text-sm font-medium transition-colors"
            data-cursor-hover
          >
            Back to top
            <span className="w-8 h-8 rounded-full border border-white/10 group-hover:border-accent/30 flex items-center justify-center transition-all group-hover:-translate-y-0.5">
              <ArrowUp size={14} className="transition-transform" />
            </span>
          </button>
        </div>

        {/* Bottom row — copyright + socials */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.04]">
          <p className="text-white/30 text-sm">
            &copy; {new Date().getFullYear()} Yassine CHRITT. Designed &amp; built with care.
          </p>

          <div className="flex items-center gap-5">
            {[
              { icon: <FaGithub size={18} />, href: 'https://github.com/enissayct', label: 'GitHub' },
              { icon: <FaLinkedin size={18} />, href: 'https://linkedin.com/in/chritt-yassine', label: 'LinkedIn' },
              { icon: <HiOutlineMail size={18} />, href: 'mailto:chrittyassine@gmail.com', label: 'Email' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-accent transition-colors duration-300"
                data-cursor-hover
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
