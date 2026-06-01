import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { Floor } from '../types'
import { useBuilding } from '../store'

const FLOOR_HEIGHT = 3.5

export function useFloorAnalyser(meshes: THREE.Mesh[]): Floor[] {
  const setBuilding = useBuilding((s) => s.setBuilding)

  const floors = useMemo<Floor[]>(() => {
    if (meshes.length === 0) return []

    const ys: number[] = []
    const v = new THREE.Vector3()

    for (const mesh of meshes) {
      mesh.updateWorldMatrix(true, false)
      const pos = mesh.geometry.attributes.position
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld)
        ys.push(v.y)
      }
    }

    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)
    const floorCount = Math.max(1, Math.ceil((maxY - minY) / FLOOR_HEIGHT))

    return Array.from({ length: floorCount }, (_, i) => {
      const floorMinY = minY + i * FLOOR_HEIGHT
      const floorMaxY = i === floorCount - 1 ? maxY : minY + (i + 1) * FLOOR_HEIGHT
      return {
        id: `floor-${i + 1}`,
        name: `Floor ${i + 1}`,
        minY: floorMinY,
        maxY: floorMaxY,
        midY: (floorMinY + floorMaxY) / 2,
      }
    })
  }, [meshes])

  useEffect(() => {
    setBuilding(floors)
  }, [floors, setBuilding])

  return floors
}
