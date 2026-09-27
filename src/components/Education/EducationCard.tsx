import { useRef } from 'react'
import type { Education } from '../../data/education'

export default function EducationCard({
  education,
  index,
}: {
  education: Education
  index: number
}) {
  const isLeft = index % 2 === 0
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.transform = `perspective(1000px) rotateX(${y * -8}deg) rotateY(${x * 8}deg)`
  }

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = ''
  }

  return (
    <div
      className={`edu-card relative flex items-center gap-8 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Content */}
      <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="glass-card p-6 md:p-8 hover:glow-border transition-all duration-300 cursor-default"
        >
          <span className="text-accent font-mono text-xs tracking-wide">
            {education.period}
          </span>
          <h3 className="text-xl font-display font-bold text-white mt-2">
            {education.institution}
          </h3>
          <p className="text-accent/80 text-sm font-medium mt-1">
            {education.program}
          </p>
          <p className="text-white/50 text-sm mt-3 leading-relaxed">
            {education.description}
          </p>
        </div>
      </div>

      {/* Center dot */}
      <div className="hidden md:flex items-center justify-center flex-shrink-0">
        <div className="w-4 h-4 rounded-full bg-accent border-4 border-navy-900 z-10 shadow-[0_0_10px_rgba(79,195,247,0.4)]" />
      </div>

      {/* Spacer */}
      <div className="hidden md:block flex-1" />
    </div>
  )
}
