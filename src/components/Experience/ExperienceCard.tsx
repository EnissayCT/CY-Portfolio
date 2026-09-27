import { useEffect, useRef } from 'react'
import gsap from 'gsap'
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
}: {
  experience: Experience
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  // Subtle breathing pulse
  useEffect(() => {
    if (!cardRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(cardRef.current, {
        scale: 1.002,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 2,
      })
    }, cardRef)
    return () => ctx.revert()
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.transform = `perspective(1000px) rotateX(${y * -6}deg) rotateY(${x * 6}deg)`
  }

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = ''
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`glass-card p-6 min-w-[300px] md:min-w-[360px] max-w-[400px] flex-shrink-0 cursor-default border-l-2 ${typeColors[experience.type]} hover:bg-white/[0.08] transition-all duration-300`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="text-accent">{typeIcons[experience.type]}</div>
        <span className="text-accent font-mono text-xs">
          {experience.period}
        </span>
      </div>

      <h3 className="text-lg font-display font-bold text-white mb-1">
        {experience.role}
      </h3>
      <p className="text-accent/80 text-sm font-medium mb-3">
        {experience.company}
      </p>

      <ul className="space-y-1.5">
        {experience.description.map((desc, i) => (
          <li
            key={i}
            className="text-white/60 text-[13px] leading-snug flex items-start gap-2"
          >
            <span className="text-accent mt-1.5 text-[6px]">●</span>
            {desc}
          </li>
        ))}
      </ul>
    </div>
  )
}
