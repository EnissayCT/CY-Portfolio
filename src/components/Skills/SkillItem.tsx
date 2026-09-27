export default function SkillItem({ name }: { name: string }) {
  return (
    <div className="skill-item group relative px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-accent/25 hover:bg-accent/[0.04] transition-all duration-300 cursor-default">
      <span className="text-white/60 text-sm font-medium group-hover:text-accent/90 transition-colors duration-300">
        {name}
      </span>
    </div>
  )
}
