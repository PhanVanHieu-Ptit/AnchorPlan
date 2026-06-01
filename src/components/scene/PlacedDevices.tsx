import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { useDevices } from '../../store'
import type { DeviceId } from '../../types'
import DeviceMesh from './DeviceMesh'

const MIN_DISTANCE = 0.4

function WhiteOverlay({ deviceType }: { deviceType: DeviceId }) {
  const ref = useRef<THREE.Group>(null!)

  useEffect(() => {
    const mat = new THREE.MeshBasicMaterial({ color: 'white', transparent: true, opacity: 0.25 })
    ref.current.traverse((o) => {
      if (o instanceof THREE.Mesh) o.material = mat
    })
    return () => mat.dispose()
  }, [deviceType])

  return (
    <group ref={ref} scale={1.06}>
      <DeviceMesh deviceType={deviceType} />
    </group>
  )
}

function CollisionOverlay({ deviceType }: { deviceType: DeviceId }) {
  const ref = useRef<THREE.Group>(null!)

  useEffect(() => {
    const clones: THREE.MeshStandardMaterial[] = []
    ref.current.traverse((o) => {
      if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial) {
        const m = o.material.clone()
        m.emissive.setStyle('#ef4444')
        m.emissiveIntensity = 0.4
        m.polygonOffset = true
        m.polygonOffsetFactor = -1
        o.material = m
        clones.push(m)
      }
    })
    return () => clones.forEach((m) => m.dispose())
  }, [deviceType])

  return (
    <group ref={ref}>
      <DeviceMesh deviceType={deviceType} />
    </group>
  )
}

export default function PlacedDevices() {
  const { placedDevices, selectedId, selectDevice } = useDevices()

  const colliding = useMemo(() => {
    const set = new Set<string>()
    for (let i = 0; i < placedDevices.length; i++) {
      for (let j = i + 1; j < placedDevices.length; j++) {
        const a = placedDevices[i]
        const b = placedDevices[j]
        const dx = a.position[0] - b.position[0]
        const dy = a.position[1] - b.position[1]
        const dz = a.position[2] - b.position[2]
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) < MIN_DISTANCE) {
          set.add(a.id)
          set.add(b.id)
        }
      }
    }
    return set
  }, [placedDevices])

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); selectDevice(null) }}
      >
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {placedDevices.map((d) => (
        <group
          key={d.id}
          position={d.position}
          rotation={d.rotation}
          onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); selectDevice(d.id) }}
        >
          <DeviceMesh deviceType={d.deviceType} />
          {d.id === selectedId && <WhiteOverlay deviceType={d.deviceType} />}
          {colliding.has(d.id) && <CollisionOverlay deviceType={d.deviceType} />}
        </group>
      ))}
    </group>
  )
}
