import { useEffect } from 'react'
import { DEVICE_CATALOGUE } from '../../assets/deviceCatalogue'
import { useUI } from '../../store'

const CATEGORY_BADGE: Record<string, string> = {
  Security: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Network: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  HVAC: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  Safety: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  Lighting: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
}

const FALLBACK_BADGE = 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300'

export function DeviceCatalogue() {
  const { activeDeviceType, setActiveDeviceType } = useUI()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveDeviceType(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setActiveDeviceType])

  const devices = Object.values(DEVICE_CATALOGUE)

  return (
    <div>
      {activeDeviceType !== null && (
        <p className="mb-2 text-xs text-blue-600 dark:text-blue-400">
          Click a surface to place · Esc to cancel
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {devices.map((device) => {
          const isActive = activeDeviceType === device.id
          const { w, h, d } = device.dimensions

          return (
            <button
              key={device.id}
              type="button"
              onClick={() => setActiveDeviceType(isActive ? null : device.id)}
              className={[
                'rounded-lg border p-2 text-left transition-colors cursor-pointer',
                isActive
                  ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700'
                  : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-750',
              ].join(' ')}
            >
              <p className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
                {device.name}
              </p>

              <span
                className={`mt-1 inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full ${CATEGORY_BADGE[device.category] ?? FALLBACK_BADGE}`}
              >
                {device.category}
              </span>

              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">
                {w}×{h}×{d} m
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
