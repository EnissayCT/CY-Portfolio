import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

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

function Particles() {
  const meshRef = useRef<THREE.Points>(null)
  const { viewport } = useThree()
  const count =
    typeof window !== 'undefined' && window.innerWidth < 768 ? 600 : 1600

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
          uColor: { value: new THREE.Color('#12d640') },
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

export default function ParticleField() {
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
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
      >
        <Particles />
      </Canvas>
    </div>
  )
}
