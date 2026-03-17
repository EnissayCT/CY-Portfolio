import type { Education } from '../../data/education'

export default function EducationCard({
  education,
  index,
}: {
  education: Education
  index: number
}) {
  const isLeft = index % 2 === 0

  return (
    <div
      className={`edu-card relative flex items-center gap-8 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Content */}
      <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
        <div className="glass-card p-6 hover:glow-border transition-all duration-300">
          <span className="text-accent font-mono text-xs">
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
        <div className="w-4 h-4 rounded-full bg-accent border-4 border-navy-900 z-10 shadow-[0_0_10px_rgba(18,214,64,0.5)]" />
      </div>

      {/* Spacer */}
      <div className="hidden md:block flex-1" />
    </div>
  )
}
