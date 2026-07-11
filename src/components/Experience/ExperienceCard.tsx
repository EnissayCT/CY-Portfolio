import { useRef, useState } from 'react'
import type { Experience } from '../../data/experience'
import { Briefcase, Zap, Trophy } from 'lucide-react'

const typeIcons = {
  work: <Briefcase size={20} />,
  freelance: <Zap size={20} />,
  competition: <Trophy size={20} />,
}

const typeColors = {
  work: 'border-l-accent',
  freelance: 'border-l-purple-400',
  competition: 'border-l-yellow-400',
}

export default function ExperienceCard({
  experience,
  stacked = false,
}: {
  experience: Experience
  stacked?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (stacked) return
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -10, y: x * 10 })
  }

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 })

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`glass-card flex-shrink-0 cursor-default border-l-2 p-6 sm:p-8 ${typeColors[experience.type]} transition-colors duration-300 hover:bg-white/[0.08] ${
        stacked
          ? 'w-full max-w-none min-w-0'
          : 'min-w-[320px] max-w-[450px] md:min-w-[400px]'
      }`}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.3s ease-out',
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="text-accent">{typeIcons[experience.type]}</div>
        <span className="text-accent font-mono text-xs">
          {experience.period}
        </span>
      </div>

      <h3 className="text-xl font-display font-bold text-white mb-1">
        {experience.role}
      </h3>
      <p className="text-accent/80 text-sm font-medium mb-4">
        {experience.company}
      </p>

      <ul className="space-y-2">
        {experience.description.map((desc, i) => (
          <li
            key={i}
            className="text-white/60 text-sm flex items-start gap-2"
          >
            <span className="text-accent mt-1.5 text-[6px]">●</span>
            {desc}
          </li>
        ))}
      </ul>
    </div>
  )
}
