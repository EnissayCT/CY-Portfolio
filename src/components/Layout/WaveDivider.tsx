interface WaveDividerProps {
  flip?: boolean
  className?: string
}

export default function WaveDivider({ flip = false, className = '' }: WaveDividerProps) {
  return (
    <div
      className={`w-full pointer-events-none select-none py-8 ${className}`}
      style={{ transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <div className="max-w-5xl mx-auto flex items-center gap-6 px-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="w-1.5 h-1.5 rounded-full bg-accent/30" />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>
    </div>
  )
}
