import UndoRedoIndicator from './UndoRedoIndicator'
import { useUI, useBuilding, useDevices } from '../../store'

export default function Toolbar() {
  const { showHeightLines, toggleHeightLines, activeFloorFilter, setFloorFilter } = useUI()
  const { floors } = useBuilding()
  const { placedDevices } = useDevices()

  return (
    <div className="h-12 shrink-0 flex items-center px-4 gap-4 border-b border-slate-700 bg-slate-900">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-white">DevMount</span>
        <UndoRedoIndicator />
      </div>

      <div className="flex-1 flex items-center justify-center gap-3">
        <button
          onClick={toggleHeightLines}
          className={`px-3 py-1 text-xs rounded border transition-colors ${
            showHeightLines
              ? 'bg-blue-600 border-blue-500 text-white'
              : 'border-slate-600 text-slate-300 hover:border-slate-400 hover:text-slate-100'
          }`}
        >
          Height lines
        </button>
        <select
          value={activeFloorFilter ?? ''}
          onChange={(e) => setFloorFilter(e.target.value || null)}
          className="px-2 py-1 text-xs rounded border border-slate-600 bg-slate-800 text-slate-200 cursor-pointer"
        >
          <option value="">All floors</option>
          {floors.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <span className="px-2 py-1 text-xs rounded border border-slate-700 bg-slate-800 text-slate-400">
          {placedDevices.length} devices placed
        </span>
        <button className="px-3 py-1 text-xs rounded border border-slate-500 text-slate-200 hover:border-slate-300 hover:text-white transition-colors">
          Export
        </button>
      </div>
    </div>
  )
}
