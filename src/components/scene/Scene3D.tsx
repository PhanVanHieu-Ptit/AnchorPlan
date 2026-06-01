import { useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { BuildingLoader } from './BuildingLoader'
import PlacedDevices from './PlacedDevices'
import HeightLines from './HeightLines'
import { useSurfaceHover, usePlacement } from '../../hooks'
import type { HoverInfo } from '../../hooks'
import { useDevices, useUI } from '../../store'
import type { Floor } from '../../types'

interface SceneControllerProps {
  meshes: THREE.Mesh[]
  floors: Floor[]
  onHoverChange: (info: HoverInfo | null) => void
}

function SceneController({ meshes, floors, onHoverChange }: SceneControllerProps) {
  const { hoverInfo } = useSurfaceHover(meshes, floors)
  usePlacement(hoverInfo, floors)

  useEffect(() => {
    onHoverChange(hoverInfo)
  }, [hoverInfo, onHoverChange])

  return null
}

interface Scene3DProps {
  glbUrl: string | null
  onMeshesReady: (meshes: THREE.Mesh[]) => void
  meshes: THREE.Mesh[]
  floors: Floor[]
  onHoverChange: (info: HoverInfo | null) => void
}

export default function Scene3D({ glbUrl, onMeshesReady, meshes, floors, onHoverChange }: Scene3DProps) {
  const { placedDevices } = useDevices()
  const { showHeightLines } = useUI()

  return (
    <Canvas className="w-full h-full">
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1} />
      <gridHelper args={[100, 100, '#334155', '#334155']} />
      <axesHelper args={[5]} />
      <OrbitControls enableDamping />
      <BuildingLoader glbUrl={glbUrl} onMeshesReady={onMeshesReady} />
      <PlacedDevices />
      <HeightLines devices={placedDevices} visible={showHeightLines} />
      <SceneController meshes={meshes} floors={floors} onHoverChange={onHoverChange} />
    </Canvas>
  )
}
