/**
 * Time-of-Day color cycling — smoothly interpolates between 3 palettes
 * (Midday → Golden Hour → Dusk) over a ~4-minute cycle.
 *
 * Exposes:
 *  - CSS custom properties on <html> for CSS consumers
 *  - getCurrentPalette() for shader uniform consumers (WaterShader)
 */

interface Palette {
  seaBase: [number, number, number]
  seaWater: [number, number, number]
  skyTint: [number, number, number]
  accentShift: string // hex for CSS
}

const PALETTES: Palette[] = [
  {
    // Midday — bright cyan / turquoise
    seaBase: [0.0, 0.09, 0.18],
    seaWater: [0.48, 0.54, 0.36],
    skyTint: [0.31, 0.76, 0.97],
    accentShift: '#4fc3f7',
  },
  {
    // Golden Hour — amber / teal
    seaBase: [0.08, 0.06, 0.12],
    seaWater: [0.55, 0.42, 0.25],
    skyTint: [0.95, 0.65, 0.35],
    accentShift: '#f0a858',
  },
  {
    // Dusk — deep violet / navy
    seaBase: [0.04, 0.03, 0.1],
    seaWater: [0.3, 0.28, 0.5],
    skyTint: [0.35, 0.2, 0.55],
    accentShift: '#8b7cf7',
  },
]

const CYCLE_DURATION = 4 * 60 * 1000 // 4 minutes full cycle

function lerpVec3(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]
}

function vec3ToCss(v: [number, number, number]): string {
  return `${(v[0] * 255) | 0}, ${(v[1] * 255) | 0}, ${(v[2] * 255) | 0}`
}

/** Current interpolated palette (call every frame) */
export function getCurrentPalette() {
  const t = (Date.now() % CYCLE_DURATION) / CYCLE_DURATION
  // Smooth triangle wave through 3 palettes
  const phase = t * 3 // 0→3
  const idx = Math.floor(phase) % 3
  const next = (idx + 1) % 3
  // Smoothstep for easing
  let frac = phase - Math.floor(phase)
  frac = frac * frac * (3 - 2 * frac)

  return {
    seaBase: lerpVec3(PALETTES[idx].seaBase, PALETTES[next].seaBase, frac),
    seaWater: lerpVec3(PALETTES[idx].seaWater, PALETTES[next].seaWater, frac),
    skyTint: lerpVec3(PALETTES[idx].skyTint, PALETTES[next].skyTint, frac),
  }
}

let intervalId: ReturnType<typeof setInterval> | null = null

/** Start the CSS variable pump — call once in App mount */
export function startTimeOfDay() {
  const root = document.documentElement

  function tick() {
    const p = getCurrentPalette()
    root.style.setProperty('--tod-sea-base', vec3ToCss(p.seaBase))
    root.style.setProperty('--tod-sea-water', vec3ToCss(p.seaWater))
    root.style.setProperty('--tod-sky-tint', vec3ToCss(p.skyTint))
  }

  tick() // initial set
  intervalId = setInterval(tick, 2000) // update every 2s (4min cycle = imperceptible)
}

export function stopTimeOfDay() {
  if (intervalId !== null) clearInterval(intervalId)
}
