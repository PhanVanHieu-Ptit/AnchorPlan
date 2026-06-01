import { useEffect } from 'react'
import { useBuilding } from '../../store'

interface DropZoneProps {
  onFile: (file: File) => void
}

export function DropZone({ onFile }: DropZoneProps) {
  const { buildingLoaded } = useBuilding()

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => e.preventDefault()

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer?.files[0]
      if (file) onFile(file)
    }

    document.body.addEventListener('dragover', handleDragOver)
    document.body.addEventListener('drop', handleDrop)

    return () => {
      document.body.removeEventListener('dragover', handleDragOver)
      document.body.removeEventListener('drop', handleDrop)
    }
  }, [onFile])

  if (buildingLoaded) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-white/40 bg-slate-900/80 p-12 text-white pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-white/60"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16.5V9.75m0 0-3 3m3-3 3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.338-2.32 3.75 3.75 0 0 1 3.88 5.417"
          />
        </svg>
        <p className="text-lg font-medium tracking-wide text-white/80">
          Drop a .glb file to start
        </p>
      </div>
    </div>
  )
}
