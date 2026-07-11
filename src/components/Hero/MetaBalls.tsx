import { useEffect, useRef } from 'react'
import { Camera, Mesh, Program, Renderer, Transform, Triangle, Vec3 } from 'ogl'

interface MetaBallsProps {
  className?: string
  baseColor?: string
  highlightColor?: string
  speed?: number
  enableMouseInteraction?: boolean
  animationSize?: number
  ballCount?: number
  clumpFactor?: number
  paused?: boolean
  maxPull?: number
  followSpeed?: number
  returnSpeed?: number
  mouseRadius?: number
  glassBlur?: number
  fieldThreshold?: number
}

function parseHexColor(hex: string): [number, number, number] {
  const c = hex.replace('#', '')
  return [
    parseInt(c.substring(0, 2), 16) / 255,
    parseInt(c.substring(2, 4), 16) / 255,
    parseInt(c.substring(4, 6), 16) / 255,
  ]
}

function fract(x: number) {
  return x - Math.floor(x)
}

function hash31(p: number) {
  const r = [p * 0.1031, p * 0.103, p * 0.0973].map(fract)
  const dotVal = r[0] * (r[1] + 33.33) + r[1] * (r[2] + 33.33) + r[2] * (r[0] + 33.33)
  return r.map((v) => fract(v + dotVal))
}

function hash33(v: number[]) {
  const p = [v[0] * 0.1031, v[1] * 0.103, v[2] * 0.0973].map(fract)
  const dotVal = p[0] * (p[1] + 33.33) + p[1] * (p[0] + 33.33) + p[2] * (p[1] + 33.33)
  const mixed = p.map((val) => fract(val + dotVal))
  return [
    fract((mixed[0] + mixed[0]) * mixed[2]),
    fract((mixed[0] + mixed[1]) * mixed[1]),
    fract((mixed[1] + mixed[0]) * mixed[0]),
  ]
}

const vertex = `#version 300 es
precision highp float;
layout(location = 0) in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform float iAnimationSize;
uniform int iBallCount;
uniform vec3 iMetaBalls[16];
uniform vec3 iBaseColor;
uniform vec3 iHighlightColor;
uniform float iGlassBlur;
uniform float iFieldThreshold;
out vec4 outColor;

float ballField(vec2 p, vec2 c, float r) {
  vec2 d = p - c;
  float dist2 = max(dot(d, d), r * r * 0.14);
  return (r * r) / dist2;
}

float metaField(vec2 p) {
  float total = 0.0;
  for (int i = 0; i < 16; i++) {
    if (i >= iBallCount) break;
    total += ballField(p, iMetaBalls[i].xy, iMetaBalls[i].z);
  }
  return total;
}

void main() {
  vec2 fc = gl_FragCoord.xy;
  float scale = iAnimationSize / iResolution.y;
  vec2 coord = (fc - iResolution.xy * 0.5) * scale;

  float field = metaField(coord);
  float edge = smoothstep(
    -1.0,
    1.0,
    (field - iFieldThreshold) / max(fwidth(field) * (1.5 + iGlassBlur), 0.001)
  );
  if (edge < 0.001) {
    outColor = vec4(0.0);
    return;
  }

  float eps = 0.014;
  vec2 grad = vec2(
    metaField(coord + vec2(eps, 0.0)) - metaField(coord - vec2(eps, 0.0)),
    metaField(coord + vec2(0.0, eps)) - metaField(coord - vec2(0.0, eps))
  );
  float gMag = length(grad);
  vec3 n = normalize(vec3(-grad, max(gMag, 0.02)));

  vec3 lightDir = normalize(vec3(-0.38, 0.52, 0.75));
  float fresnel = pow(1.0 - max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0), 2.2);
  fresnel *= smoothstep(0.015, 0.12, gMag);

  float shade = 0.84 + coord.y * 0.004 + coord.x * -0.003;
  shade = clamp(shade, 0.8, 0.97);
  vec3 albedo = mix(iBaseColor, iHighlightColor, shade);

  vec3 glassTint = vec3(0.78, 0.98, 0.9);
  float rimBand = smoothstep(0.2, 0.72, edge) * (1.0 - smoothstep(0.72, 1.0, edge));
  vec3 col = mix(albedo, glassTint, rimBand * 0.65);
  col += glassTint * fresnel * 0.42;
  col *= 0.92 + edge * 0.08;

  float alpha = edge * 0.55;
  outColor = vec4(col, alpha);
}
`

const MAX_BALLS = 16

export default function MetaBalls({
  className = '',
  baseColor = '#6ecfb0',
  highlightColor = '#9ef0d4',
  speed = 0.14,
  enableMouseInteraction = true,
  animationSize = 24,
  ballCount = 8,
  clumpFactor = 1.02,
  paused = false,
  maxPull = 2.0,
  followSpeed = 0.05,
  returnSpeed = 0.08,
  mouseRadius = 10,
  glassBlur = 1.2,
  fieldThreshold = 0.92,
}: MetaBallsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const renderer = new Renderer({ dpr, alpha: true, premultipliedAlpha: false })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    container.appendChild(gl.canvas)

    const camera = new Camera(gl, {
      left: -1,
      right: 1,
      top: 1,
      bottom: -1,
      near: 0.1,
      far: 10,
    })
    camera.position.z = 1

    const geometry = new Triangle(gl)
    const [br, bg, bb] = parseHexColor(baseColor)
    const [hr, hg, hb] = parseHexColor(highlightColor)

    const metaBallsUniform: Vec3[] = []
    for (let i = 0; i < MAX_BALLS; i++) {
      metaBallsUniform.push(new Vec3(0, 0, 0))
    }

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iResolution: { value: new Vec3(0, 0, 0) },
        iAnimationSize: { value: animationSize },
        iBallCount: { value: ballCount },
        iMetaBalls: { value: metaBallsUniform },
        iBaseColor: { value: new Vec3(br, bg, bb) },
        iHighlightColor: { value: new Vec3(hr, hg, hb) },
        iGlassBlur: { value: glassBlur },
        iFieldThreshold: { value: fieldThreshold },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })
    const scene = new Transform()
    mesh.setParent(scene)

    const effectiveBallCount = Math.min(ballCount, MAX_BALLS)
    const ballParams = Array.from({ length: effectiveBallCount }, (_, i) => {
      const idx = i + 1
      const h1 = hash31(idx)
      const st = h1[0] * (2 * Math.PI)
      const dtFactor = 0.1 * Math.PI + h1[1] * (0.4 * Math.PI - 0.1 * Math.PI)
      const baseScale = 9 + h1[1] * 7
      const h2 = hash33(h1)
      const toggle = Math.floor(h2[0] * 2)
      const sizeRoll = h2[2]
      const radiusVal =
        sizeRoll > 0.52
          ? 2.1 + h2[1] * 1.5
          : 0.6 + h2[1] * 0.55
      return { st, dtFactor, baseScale, toggle, radius: radiusVal }
    })

    const ballOffsets = ballParams.map(() => ({ x: 0, y: 0 }))

    let pointerInside = false
    let pointerX = 0
    let pointerY = 0

    const resize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      if (width === 0 || height === 0) return
      renderer.setSize(width, height)
      gl.canvas.style.width = `${width}px`
      gl.canvas.style.height = `${height}px`
      program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, 0)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!enableMouseInteraction) return
      const rect = container.getBoundingClientRect()
      pointerInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      if (!pointerInside) return
      pointerX = ((e.clientX - rect.left) / rect.width) * gl.canvas.width
      pointerY = (1 - (e.clientY - rect.top) / rect.height) * gl.canvas.height
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    const startTime = performance.now()
    let animationFrameId = 0

    const update = (t: number) => {
      animationFrameId = requestAnimationFrame(update)
      if (pausedRef.current) return

      const elapsed = (t - startTime) * 0.001
      const coordScale = animationSize / gl.canvas.height
      const mouseActive = pointerInside && enableMouseInteraction
      let mouseWx = 0
      let mouseWy = 0
      if (mouseActive) {
        mouseWx = (pointerX - gl.canvas.width * 0.5) * coordScale
        mouseWy = (pointerY - gl.canvas.height * 0.5) * coordScale
      }

      for (let i = 0; i < effectiveBallCount; i++) {
        const p = ballParams[i]
        const dt = elapsed * speed * p.dtFactor
        const th = p.st + dt
        const px = Math.cos(th) * p.baseScale * clumpFactor
        const py = Math.sin(th + dt * p.toggle) * p.baseScale * clumpFactor

        const offset = ballOffsets[i]
        let targetOx = 0
        let targetOy = 0
        let influenced = false

        if (mouseActive) {
          const dx = mouseWx - px
          const dy = mouseWy - py
          const dist = Math.hypot(dx, dy)
          if (dist < mouseRadius) {
            influenced = true
            const safeDist = Math.max(dist, 0.001)
            const falloff = (1 - dist / mouseRadius) ** 2
            const pull = falloff * maxPull
            targetOx = (dx / safeDist) * pull
            targetOy = (dy / safeDist) * pull
          }
        }

        const ease = influenced ? followSpeed : returnSpeed
        offset.x += (targetOx - offset.x) * ease
        offset.y += (targetOy - offset.y) * ease

        metaBallsUniform[i].set(px + offset.x, py + offset.y, p.radius)
      }

      renderer.render({ scene, camera })
    }

    resize()
    animationFrameId = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      container.removeChild(gl.canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [
    animationSize,
    baseColor,
    highlightColor,
    ballCount,
    clumpFactor,
    enableMouseInteraction,
    mouseRadius,
    maxPull,
    followSpeed,
    returnSpeed,
    glassBlur,
    fieldThreshold,
    speed,
  ])

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full ${className}`}
      aria-hidden="true"
    />
  )
}
