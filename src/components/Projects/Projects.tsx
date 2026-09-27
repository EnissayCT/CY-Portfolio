import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects, type Project } from '../../data/projects'
import ProjectCard from './ProjectCard'
import ProjectModal from './ProjectModal'

gsap.registerPlugin(ScrollTrigger)

const categories = ['All', 'Web', 'Mobile', 'AI'] as const
type Category = (typeof categories)[number]

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter(
          (p) => p.category === activeCategory.toLowerCase(),
        )

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
          clearProps: 'transform',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
          },
        },
      )

      gsap.fromTo(
        '.project-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
      document.body.style.overscrollBehavior = 'none'
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.overscrollBehavior = 'none'
      window.dispatchEvent(
        new CustomEvent('portfolio:scroll-lock', {
          detail: { locked: true },
        }),
      )
    } else {
      document.body.style.overflow = ''
      document.body.style.overscrollBehavior = ''
      document.documentElement.style.overflow = ''
      document.documentElement.style.overscrollBehavior = ''
      window.dispatchEvent(
        new CustomEvent('portfolio:scroll-lock', {
          detail: { locked: false },
        }),
      )
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.overscrollBehavior = ''
      document.documentElement.style.overflow = ''
      document.documentElement.style.overscrollBehavior = ''
      window.dispatchEvent(
        new CustomEvent('portfolio:scroll-lock', {
          detail: { locked: false },
        }),
      )
    }
  }, [selectedProject])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-padding relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-accent font-mono text-sm">03.</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
            Things I've Built
          </h2>
          <div className="flex-1 h-px bg-white/10 ml-4" />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-5 py-2.5 text-sm font-mono rounded-lg transition-all duration-300 ${
                activeCategory === cat
                  ? 'text-accent bg-accent/10 border border-accent/20'
                  : 'text-white/50 hover:text-white/80 border border-transparent hover:border-white/10'
              }`}
              data-cursor-hover
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Project Modal — portaled to body so parent transforms don't break fixed positioning */}
      {createPortal(
        <AnimatePresence>
          {selectedProject && (
            <ProjectModal
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  )
}
