import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { perfTier, prefersReducedMotion } from '../../utils/perfBudget'

/* ── shared mouse state (set from window listener, read inside Canvas) ── */
const mouse = { nx: 0, ny: 0 }

/* ── vertex: tiny dots that grow slightly near cursor ── */
const vertexShader = `
  attribute float aScale;
  varying float vScale;
  uniform float uPixelRatio;
  void main() {
    vScale = aScale;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aScale * uPixelRatio * (40.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

/* ── fragment: soft circular dot, brighter when scaled up ── */
const fragmentShader = `
  uniform vec3 uColor;
  varying float vScale;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float edge = smoothstep(0.5, 0.15, d);
    float brightness = 0.4 + smoothstep(1.0, 2.5, vScale) * 0.5;
    gl_FragColor = vec4(uColor, edge * brightness);
  }
`

/* ── Debris vertex/fragment (merged inline) ── */
const debrisVertexShader = `
  attribute float aSize;
  attribute float aOpacity;
  varying float vOpacity;
  uniform float uPixelRatio;
  void main() {
    vOpacity = aOpacity;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio * (50.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`
const debrisFragmentShader = `
  varying float vOpacity;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float edge = smoothstep(0.5, 0.1, d);
    gl_FragColor = vec4(0.31, 0.76, 0.97, edge * vOpacity);
  }
`

function Particles() {
  const meshRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()
  const count =
    typeof window !== 'undefined' && window.innerWidth < 768 ? 320 : 900

  /* velocityX/Y store per-particle momentum so they smoothly trail the cursor */
  const { positions, originalPositions, scales, velX, velY } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const orig = new Float32Array(count * 3)
    const sc = new Float32Array(count).fill(1.0)
    const vx = new Float32Array(count).fill(0)
    const vy = new Float32Array(count).fill(0)
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 12
      const y = (Math.random() - 0.5) * 10
      const z = (Math.random() - 0.5) * 8
      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z
      orig[i * 3] = x
      orig[i * 3 + 1] = y
      orig[i * 3 + 2] = z
    }
    return { positions: pos, originalPositions: orig, scales: sc, velX: vx, velY: vy }
  }, [count])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color('#4fc3f7') },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  )

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    return geo
  }, [positions, scales])

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime
    const posAttr = meshRef.current.geometry.attributes.position
    const scaleAttr = meshRef.current.geometry.attributes.aScale
    const posArr = posAttr.array as Float32Array
    const scArr = scaleAttr.array as Float32Array

    // Convert normalised mouse (-1..1) to world units
    const mx = mouse.nx * (viewport.width / 2)
    const my = mouse.ny * (viewport.height / 2)
    const radius = 2.5
    const friction = 0.92

    for (let i = 0; i < count; i++) {
      const i3 = i * 3

      // --- rest position: original + gentle wave ---
      const rx = originalPositions[i3] + Math.sin(time * 0.3 + i * 0.1) * 0.1
      const ry = originalPositions[i3 + 1] + Math.cos(time * 0.2 + i * 0.05) * 0.12
      const rz = originalPositions[i3 + 2] + Math.sin(time * 0.1 + i * 0.02) * 0.05

      // --- spring force back to rest ---
      const sprX = (rx - posArr[i3]) * 0.04
      const sprY = (ry - posArr[i3 + 1]) * 0.04
      velX[i] += sprX
      velY[i] += sprY

      // --- cursor attraction ---
      const dx = mx - posArr[i3]
      const dy = my - posArr[i3 + 1]
      const dist = Math.sqrt(dx * dx + dy * dy)

      let targetScale = 1.0
      if (dist < radius) {
        const t = 1 - dist / radius           // 0 at edge → 1 at center
        const pull = t * t * 0.06             // gentle quadratic pull
        velX[i] += dx * pull
        velY[i] += dy * pull

        // tiny swirl
        velX[i] += -dy * t * 0.008
        velY[i] += dx * t * 0.008

        targetScale = 1.0 + t * 1.5           // max 2.5× — subtle, not a blob
      }

      // --- apply velocity with friction ---
      velX[i] *= friction
      velY[i] *= friction
      posArr[i3] += velX[i]
      posArr[i3 + 1] += velY[i]
      posArr[i3 + 2] += (rz - posArr[i3 + 2]) * 0.03

      // --- smooth scale ---
      scArr[i] += (targetScale - scArr[i]) * 0.08
    }

    posAttr.needsUpdate = true
    ;(scaleAttr as THREE.BufferAttribute).needsUpdate = true
    meshRef.current.rotation.y = time * 0.015
  })

  return <points ref={meshRef} geometry={geometry} material={material} />
}

/* ── Debris: slow-drifting jellyfish-like particles (merged into same Canvas) ── */
function Debris() {
  const meshRef = useRef<THREE.Points>(null)
  const count = perfTier === 'high' ? 30 : 15

  const { positions, sizes, opacities, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    const op = new Float32Array(count)
    const sp = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2
      sz[i] = 0.3 + Math.random() * 0.8
      op[i] = 0.08 + Math.random() * 0.2
      sp[i] = 0.1 + Math.random() * 0.3
    }
    return { positions: pos, sizes: sz, opacities: op, speeds: sp }
  }, [count])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        },
        vertexShader: debrisVertexShader,
        fragmentShader: debrisFragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  )

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1))
    return geo
  }, [positions, sizes, opacities])

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime
    const posArr = meshRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      posArr[i3] += Math.sin(time * 0.2 + i * 1.7) * 0.002
      posArr[i3 + 1] += speeds[i] * 0.005
      posArr[i3 + 2] += Math.cos(time * 0.15 + i * 2.3) * 0.001
      if (posArr[i3 + 1] > 6) {
        posArr[i3 + 1] = -6
        posArr[i3] = (Math.random() - 0.5) * 14
      }
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true
    meshRef.current.rotation.y = time * 0.005
  })

  return <points ref={meshRef} geometry={geometry} material={material} />
}

export default function ParticleField() {
  const showDebris = !prefersReducedMotion && !(perfTier === 'low' && typeof window !== 'undefined' && window.innerWidth < 768)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      // Normalise to -1..1 (same as Three.js pointer convention)
      mouse.nx = (e.clientX / window.innerWidth) * 2 - 1
      mouse.ny = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.2]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <Particles />
        {showDebris && <Debris />}
      </Canvas>
    </div>
  )
}
