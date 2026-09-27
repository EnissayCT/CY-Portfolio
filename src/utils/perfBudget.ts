/**
 * Performance budget system — detects device capability and provides
 * a tier ('high' | 'low') that components use to scale effects.
 */

export type PerfTier = 'high' | 'low'

function detectTier(): PerfTier {
  // Respect reduced-motion preference
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return 'low'
  }

  // Low core count
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
    return 'low'
  }

  // Low memory (Chrome/Edge only)
  if ((navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4) {
    return 'low'
  }

  // Mobile / touch device heuristic
  if (
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches)
  ) {
    return 'low'
  }

  // Quick WebGL renderer string check
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') || canvas.getContext('webgl') as any
    if (gl) {
      const dbg = gl.getExtension('WEBGL_debug_renderer_info')
      if (dbg) {
        const renderer = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) as string
        const lowEnd = /swiftshader|llvmpipe|mesa|intel.*hd|intel.*uhd/i
        if (lowEnd.test(renderer)) return 'low'
      }
      // Lose context explicitly
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  } catch {
    /* ignore */
  }

  return 'high'
}

/** Singleton — evaluated once on import */
export const perfTier: PerfTier = detectTier()

/** Whether the user prefers reduced motion */
export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
