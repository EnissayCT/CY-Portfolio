import { useRef, useCallback } from 'react'
import type { Project } from '../../data/projects'

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const waveRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !innerRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const tiltX = (y - 0.5) * -10
    const tiltY = (x - 0.5) * 10

    // Direct DOM updates — no React state, no re-render
    innerRef.current.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
    if (waveRef.current) {
      waveRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(79,195,247,0.08) 0%, transparent 60%)`
    }
    if (glareRef.current) {
      const angle = Math.atan2(y * 100 - 50, x * 100 - 50)
      const mix = (Math.sin(angle) + 1) / 2
      const r = Math.round(79 + (127 - 79) * mix)
      const g = Math.round(195 + (255 - 195) * mix)
      const b = Math.round(247 + (212 - 247) * mix)
      glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(${r},${g},${b},0.35), transparent 50%)`
    }
  }

  const handleMouseLeave = () => {
    if (innerRef.current) innerRef.current.style.transform = ''
    if (waveRef.current) waveRef.current.style.background = ''
    if (glareRef.current) glareRef.current.style.background = ''
  }

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Spawn click ripple
    const ripple = document.createElement('div')
    ripple.style.cssText = `
      position:absolute;left:${x}px;top:${y}px;width:0;height:0;
      border-radius:50%;background:rgba(79,195,247,0.2);
      transform:translate(-50%,-50%);pointer-events:none;z-index:20;
    `
    cardRef.current.querySelector('.card-inner')?.appendChild(ripple)
    ripple.animate(
      [
        { width: '0px', height: '0px', opacity: 0.4 },
        { width: '400px', height: '400px', opacity: 0 },
      ],
      { duration: 500, easing: 'cubic-bezier(0.22,1,0.36,1)' },
    ).onfinish = () => {
      ripple.remove()
      onClick()
    }
  }, [onClick])

  // Bioluminescent glare — computed via ref now, not state
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className="perspective-1000 cursor-pointer group project-card"
      data-cursor-hover
    >
      <div
        ref={innerRef}
        className="card-inner glass-card overflow-hidden preserve-3d transition-transform duration-300 ease-out relative"
      >
        {/* Wave ripple hover effect */}
        <div
          ref={waveRef}
          className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />

          {/* Bioluminescent glare */}
          <div
            ref={glareRef}
            className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-300"
          />

          {/* Category badge */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {project.featured && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                Featured
              </span>
            )}
            <span className="text-xs font-mono px-2 py-1 rounded-md bg-accent/20 text-accent border border-accent/30">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-display font-bold text-white mb-1 group-hover:text-accent transition-colors">
            {project.title}
          </h3>
          <p className="text-accent/70 text-sm font-medium mb-3">
            {project.subtitle}
          </p>
          <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
            {project.description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tech.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-[11px] font-mono text-accent/70 px-2 py-0.5 rounded-full bg-accent/5 border border-accent/10"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
