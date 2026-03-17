export default function SkillItem({ name }: { name: string }) {
  return (
    <div className="skill-item group relative px-4 py-3 glass-card hover:glow-border transition-all duration-300 cursor-default">
      <span className="text-white/70 text-sm font-medium group-hover:text-accent transition-colors">
        {name}
      </span>
    </div>
  )
}
