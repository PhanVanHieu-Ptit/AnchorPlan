import { useState, useCallback } from 'react'
import * as THREE from 'three'
import AppLayout from './components/ui/AppLayout'
import { DropZone } from './components/ui/DropZone'
import { DeviceCatalogue } from './components/ui/DeviceCatalogue'
import { HoverTooltip } from './components/ui/HoverTooltip'
import Toolbar from './components/ui/Toolbar'
import Scene3D from './components/scene/Scene3D'
import { useModelLoader, useFloorAnalyser } from './hooks'
import type { HoverInfo } from './hooks'
import type { HoverInfo as TooltipHoverInfo } from './types'

export default function App() {
  const [file, setFile] = useState<File | null>(null)
  const [meshes, setMeshes] = useState<THREE.Mesh[]>([])
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null)

  const { glbUrl } = useModelLoader(file)
  const floors = useFloorAnalyser(meshes)

  const handleMeshesReady = useCallback((m: THREE.Mesh[]) => setMeshes(m), [])
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMouse({ x: e.clientX, y: e.clientY })
  }, [])

  return (
    <AppLayout catalogue={<DeviceCatalogue />} toolbar={<Toolbar />}>
      <div className="relative w-full h-full" onMouseMove={handleMouseMove}>
        <Scene3D
          glbUrl={glbUrl}
          onMeshesReady={handleMeshesReady}
          meshes={meshes}
          floors={floors}
          onHoverChange={setHoverInfo}
        />
        <HoverTooltip
          hoverInfo={hoverInfo as TooltipHoverInfo | null}
          mouseX={mouse.x}
          mouseY={mouse.y}
        />
        <DropZone onFile={setFile} />
      </div>
    </AppLayout>
  )
}
