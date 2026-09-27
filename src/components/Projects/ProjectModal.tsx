import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Project } from '../../data/projects'
import { X, ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react'

interface ProjectModalProps {
  project: Project
  onClose: () => void
}

export default function ProjectModal({
  project,
  onClose,
}: ProjectModalProps) {
  const allImages = project.images && project.images.length > 0
    ? project.images
    : [project.image]
  const hasMultiple = allImages.length > 1
  const isMobileProject = project.category === 'mobile'
  const [currentIndex, setCurrentIndex] = useState(0)

  const goNext = () => setCurrentIndex((i) => (i + 1) % allImages.length)
  const goPrev = () => setCurrentIndex((i) => (i - 1 + allImages.length) % allImages.length)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#060e1a]/90 backdrop-blur-xl" />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.85, y: 40, filter: 'blur(12px)' }}
        animate={{ scale: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ scale: 0.85, y: 40, filter: 'blur(12px)' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
        className={`relative glass-card w-full max-h-[85vh] overflow-y-auto overscroll-contain z-10 ${
          isMobileProject ? 'max-w-5xl' : 'max-w-3xl'
        }`}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white z-20 p-2"
          data-cursor-hover
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className={isMobileProject ? 'lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-stretch' : ''}>
          {/* Image Carousel */}
          <div className={`relative overflow-hidden group ${
            isMobileProject
              ? 'h-[50vh] lg:h-full lg:min-h-[28rem] lg:rounded-l-2xl lg:rounded-tr-none rounded-t-2xl bg-navy-950/70'
              : 'h-64 md:h-80 rounded-t-2xl'
          }`}>
            <img
              src={allImages[currentIndex]}
              alt={`${project.title} screenshot ${currentIndex + 1}`}
              className={`w-full h-full transition-opacity duration-300 ${
                isMobileProject ? 'object-contain p-4 lg:p-4' : 'object-cover'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent" />

            {hasMultiple && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-navy-900/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-navy-900/80 transition-all opacity-0 group-hover:opacity-100"
                  data-cursor-hover
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-navy-900/60 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-navy-900/80 transition-all opacity-0 group-hover:opacity-100"
                  data-cursor-hover
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentIndex
                          ? 'bg-accent w-5'
                          : 'bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Content */}
          <div className="p-8 lg:p-10">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-3xl font-display font-bold text-white">
                  {project.title}
                </h3>
                <p className="text-accent text-sm font-medium mt-1">
                  {project.subtitle}
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-md bg-accent/20 text-accent border border-accent/30 flex-shrink-0">
                {project.category}
              </span>
            </div>

            <p className="text-white/70 leading-relaxed mb-6">
              {project.longDescription}
            </p>

            <div className="mb-6">
              <h4 className="text-sm font-mono text-accent mb-3">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono text-white/70 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/70 border border-white/10 rounded-lg hover:border-accent/30 hover:text-accent transition-all"
                  data-cursor-hover
                >
                  <Github size={16} /> Source Code
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-navy-900 bg-accent rounded-lg hover:bg-accent-light transition-all"
                  data-cursor-hover
                >
                  <ExternalLink size={16} /> Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
