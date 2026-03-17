import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'
import { ArrowUp } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-white/40 text-sm font-mono">
          &copy; {new Date().getFullYear()} Yassine CHRITT. Built with React
          &amp; Three.js
        </p>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/enissayct"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-accent transition-colors"
            data-cursor-hover
            aria-label="GitHub"
          >
            <FaGithub size={20} />
          </a>
          <a
            href="https://linkedin.com/in/chritt-yassine"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/40 hover:text-accent transition-colors"
            data-cursor-hover
            aria-label="LinkedIn"
          >
            <FaLinkedin size={20} />
          </a>
          <a
            href="mailto:chrittyassine@gmail.com"
            className="text-white/40 hover:text-accent transition-colors"
            data-cursor-hover
            aria-label="Email"
          >
            <HiOutlineMail size={20} />
          </a>
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center gap-2 text-white/40 hover:text-accent text-sm transition-colors"
          data-cursor-hover
        >
          Back to top
          <ArrowUp
            size={16}
            className="group-hover:-translate-y-1 transition-transform"
          />
        </button>
      </div>
    </footer>
  )
}
