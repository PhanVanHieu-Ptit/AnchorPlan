import { HoverInfo } from '../../types'

interface HoverTooltipProps {
  hoverInfo: HoverInfo | null
  mouseX: number
  mouseY: number
}

export function HoverTooltip({ hoverInfo, mouseX, mouseY }: HoverTooltipProps) {
  if (!hoverInfo) return null

  const badgeClass =
    hoverInfo.mountType === 'exterior'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-slate-100 text-slate-600'

  const badgeLabel = hoverInfo.mountType === 'exterior' ? 'Exterior' : 'Interior'

  return (
    <div
      className="absolute bg-white dark:bg-slate-800 border rounded-lg shadow-sm px-3 py-2 pointer-events-none transition-opacity duration-100 opacity-100"
      style={{ left: mouseX + 12, top: mouseY - 8 }}
    >
      <p className="text-[13px] font-semibold leading-tight">{hoverInfo.floorName}</p>
      <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
        ↑ {hoverInfo.heightM} m
      </p>
      <span
        className={`mt-1 inline-block text-[11px] font-medium px-1.5 py-0.5 rounded ${badgeClass}`}
      >
        {badgeLabel}
      </span>
    </div>
  )
}
