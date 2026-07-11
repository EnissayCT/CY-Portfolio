import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import type { Project } from '../../data/projects'
import { X, ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProjectModalProps {
  project: Project
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const allImages =
    project.images && project.images.length > 0 ? project.images : [project.image]
  const hasMultiple = allImages.length > 1
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const goNext = () => setCurrentIndex((i) => (i + 1) % allImages.length)
  const goPrev = () =>
    setCurrentIndex((i) => (i - 1 + allImages.length) % allImages.length)

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div className="absolute inset-0 bg-navy-900/90 backdrop-blur-xl" />

      <motion.div
        initial={{ scale: 0.95, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 24 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 mx-auto w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl glass-card"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-20 rounded-full bg-navy-900/70 p-2 text-white/70 hover:text-white sm:right-4 sm:top-4"
          aria-label="Close modal"
        >
          <X size={22} />
        </button>

        <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden rounded-t-2xl group">
          <img
            src={allImages[currentIndex]}
            alt={`${project.title} screenshot ${currentIndex + 1}`}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent" />

          {hasMultiple && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-navy-900/70 text-white/80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={goNext}
                className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-navy-900/70 text-white/80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentIndex ? 'w-5 bg-accent' : 'w-2 bg-white/40'
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-5 sm:p-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3
                id="project-modal-title"
                className="text-2xl sm:text-3xl font-display font-bold text-white"
              >
                {project.title}
              </h3>
              <p className="mt-1 text-sm font-medium text-accent">{project.subtitle}</p>
            </div>
            <span className="w-fit flex-shrink-0 rounded-md border border-accent/30 bg-accent/20 px-3 py-1 font-mono text-xs text-accent">
              {project.category}
            </span>
          </div>

          <p className="mb-6 text-sm sm:text-base leading-relaxed text-white/70">
            {project.longDescription}
          </p>

          <div className="mb-6">
            <h4 className="mb-3 font-mono text-sm text-accent">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white/70 transition-all hover:border-accent/30 hover:text-accent"
              >
                <Github size={16} /> Source Code
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-navy-900 transition-all hover:bg-accent-light"
              >
                <ExternalLink size={16} /> Live Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
