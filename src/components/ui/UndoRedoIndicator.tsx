import { useUndoRedo } from '../../hooks'
import { useTemporalStore } from '../../store'

export default function UndoRedoIndicator() {
  const { canUndo, canRedo, undoCount } = useUndoRedo()
  const undo = useTemporalStore((s) => s.undo)
  const redo = useTemporalStore((s) => s.redo)

  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs select-none">
      <button
        onClick={() => undo()}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors ${
          canUndo
            ? 'text-slate-200 hover:bg-slate-700 cursor-pointer'
            : 'text-slate-600 cursor-default'
        }`}
      >
        <span>↩</span>
        <span>{undoCount}</span>
      </button>
      <button
        onClick={() => redo()}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
        className={`px-1.5 py-0.5 rounded transition-colors ${
          canRedo
            ? 'text-slate-200 hover:bg-slate-700 cursor-pointer'
            : 'text-slate-600 cursor-default'
        }`}
      >
        ↪
      </button>
    </div>
  )
}
