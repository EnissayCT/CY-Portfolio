import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { perfTier, prefersReducedMotion } from '../../utils/perfBudget'

const vertexShader = `
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

const fragmentShader = `
  varying float vOpacity;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float edge = smoothstep(0.5, 0.1, d);
    gl_FragColor = vec4(0.31, 0.76, 0.97, edge * vOpacity);
  }
`

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
      // Slow upward drift with sine oscillation
      posArr[i3] += Math.sin(time * 0.2 + i * 1.7) * 0.002
      posArr[i3 + 1] += speeds[i] * 0.005
      posArr[i3 + 2] += Math.cos(time * 0.15 + i * 2.3) * 0.001

      // Wrap around when going off top
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

export default function FloatingDebris() {
  if (prefersReducedMotion) return null
  if (perfTier === 'low' && window.innerWidth < 768) return null

  return (
    <div className="absolute inset-0 z-[1] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1]}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
      >
        <Debris />
      </Canvas>
    </div>
  )
}
