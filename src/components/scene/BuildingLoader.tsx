import { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface BuildingLoaderProps {
  glbUrl: string | null
  onMeshesReady: (meshes: THREE.Mesh[]) => void
}

interface BuildingModelProps {
  glbUrl: string
  onMeshesReady: (meshes: THREE.Mesh[]) => void
}

function BuildingModel({ glbUrl, onMeshesReady }: BuildingModelProps) {
  const { scene } = useGLTF(glbUrl)
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    const group = groupRef.current
    if (!group) return

    // Reset so re-mounts don't double-apply the offset (useGLTF caches the scene object)
    scene.position.set(0, 0, 0)

    const meshes: THREE.Mesh[] = []
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
        meshes.push(mesh)
      }
    })

    group.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(group)
    const center = new THREE.Vector3()
    const size = new THREE.Vector3()
    box.getCenter(center)
    box.getSize(size)

    scene.position.sub(center)

    const longest = Math.max(size.x, size.y, size.z)
    if (longest > 0) {
      group.scale.setScalar(20 / longest)
    }

    onMeshesReady(meshes)
  }, [scene, onMeshesReady])

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

export function BuildingLoader({ glbUrl, onMeshesReady }: BuildingLoaderProps) {
  if (glbUrl === null) return null
  return <BuildingModel glbUrl={glbUrl} onMeshesReady={onMeshesReady} />
}
