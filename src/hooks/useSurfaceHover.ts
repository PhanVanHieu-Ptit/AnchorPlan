import { useEffect, useMemo, useRef, useState } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { Floor, MountType } from '../types'

export interface HoverInfo {
  point: THREE.Vector3
  normal: THREE.Vector3
  faceIndex: number
  floorName: string
  heightM: number
  mountType: MountType
}

function getStandardMaterial(mesh: THREE.Mesh): THREE.MeshStandardMaterial | null {
  const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
  if (mat && 'emissive' in mat) return mat as THREE.MeshStandardMaterial
  return null
}

export function useSurfaceHover(
  meshes: THREE.Mesh[],
  floors: Floor[],
): { hoverInfo: HoverInfo | null } {
  const { camera, raycaster, gl } = useThree()
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null)
  const prevMeshRef = useRef<THREE.Mesh | null>(null)
  const prevEmissiveRef = useRef<{ color: THREE.Color; intensity: number } | null>(null)

  const modelCenter = useMemo(() => {
    if (meshes.length === 0) return new THREE.Vector3()
    const box = new THREE.Box3()
    for (const mesh of meshes) box.expandByObject(mesh)
    return box.getCenter(new THREE.Vector3())
  }, [meshes])

  useEffect(() => {
    const canvas = gl.domElement

    function restorePrev() {
      if (prevMeshRef.current && prevEmissiveRef.current) {
        const mat = getStandardMaterial(prevMeshRef.current)
        if (mat) {
          mat.emissive.copy(prevEmissiveRef.current.color)
          mat.emissiveIntensity = prevEmissiveRef.current.intensity
        }
        prevMeshRef.current = null
        prevEmissiveRef.current = null
      }
    }

    function onPointerMove(event: PointerEvent) {
      const rect = canvas.getBoundingClientRect()
      const ndc = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      )

      raycaster.setFromCamera(ndc, camera)
      const hits = raycaster.intersectObjects(meshes, false)

      if (hits.length === 0) {
        restorePrev()
        setHoverInfo(null)
        return
      }

      const hit = hits[0]
      const mesh = hit.object as THREE.Mesh
      const face = hit.face
      if (!face) return

      const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld)
      const worldNormal = face.normal.clone().applyMatrix3(normalMatrix).normalize()

      const floor = floors.find(f => hit.point.y >= f.minY && hit.point.y <= f.maxY)
      const floorName = floor?.name ?? 'Unknown'

      const toPoint = hit.point.clone().sub(modelCenter)
      const mountType: MountType = worldNormal.dot(toPoint) > 0 ? 'exterior' : 'interior'

      if (mesh !== prevMeshRef.current) {
        restorePrev()
        const mat = getStandardMaterial(mesh)
        if (mat) {
          prevEmissiveRef.current = { color: mat.emissive.clone(), intensity: mat.emissiveIntensity }
          mat.emissive.set('#1e40af')
          mat.emissiveIntensity = 0.15
        }
        prevMeshRef.current = mesh
      }

      setHoverInfo({
        point: hit.point.clone(),
        normal: worldNormal,
        faceIndex: hit.faceIndex ?? 0,
        floorName,
        heightM: Math.round(hit.point.y * 10) / 10,
        mountType,
      })
    }

    canvas.addEventListener('pointermove', onPointerMove)
    return () => {
      canvas.removeEventListener('pointermove', onPointerMove)
      restorePrev()
    }
  }, [camera, raycaster, gl, meshes, floors, modelCenter])

  return { hoverInfo }
}
