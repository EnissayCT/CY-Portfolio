import { useScrollProgress } from '../../hooks/useScrollProgress'

export default function ScrollProgress() {
  const progress = useScrollProgress()

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[9998] bg-transparent">
      <div
        className="h-full bg-accent shadow-[0_0_10px_rgba(18,214,64,0.5)]"
        style={{
          width: `${progress * 100}%`,
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  )
}
