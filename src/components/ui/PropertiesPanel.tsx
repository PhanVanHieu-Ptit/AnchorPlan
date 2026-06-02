import { useEffect, useRef } from 'react'
import { useBuilding, useDevices } from '../../store'
import { DEVICE_CATALOGUE } from '../../assets/deviceCatalogue'
import type { Floor, PlacedDevice } from '../../types'

const INPUT_CLS =
  'w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500'

interface DetailProps {
  device: PlacedDevice
  floors: Floor[]
  updateDevice: (id: string, patch: Partial<PlacedDevice>) => void
  removeDevice: (id: string) => void
  selectDevice: (id: string | null) => void
}

function DeviceDetail({ device, floors, updateDevice, removeDevice, selectDevice }: DetailProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const meta = DEVICE_CATALOGUE[device.deviceType]
  const floor = floors.find((f) => f.id === device.floorId)
  const rotDeg = ((device.rotation[1] * 180) / Math.PI).toFixed(0)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const debounce = (fn: () => void) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(fn, 150)
  }

  const handlePos = (axis: 0 | 1 | 2, raw: string) => {
    const val = parseFloat(raw)
    if (isNaN(val)) return
    debounce(() => {
      const p = [...device.position] as [number, number, number]
      p[axis] = val
      updateDevice(device.id, { position: p })
    })
  }

  const handleRot = (raw: string) => {
    const deg = parseFloat(raw)
    if (isNaN(deg)) return
    debounce(() => {
      const r = [...device.rotation] as [number, number, number]
      r[1] = (deg * Math.PI) / 180
      updateDevice(device.id, { rotation: r })
    })
  }

  const handleDelete = () => {
    removeDevice(device.id)
    selectDevice(null)
  }

  return (
    <div className="flex flex-col gap-6 p-4 overflow-y-auto h-full">
      {/* Section 1 — Identity */}
      <div>
        <p className="text-sm font-semibold text-white mb-2">{meta.name}</p>
        <div className="flex gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
            {meta.category}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              device.mountType === 'exterior'
                ? 'bg-blue-900 text-blue-300'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            {device.mountType === 'exterior' ? 'Exterior' : 'Interior'}
          </span>
        </div>
      </div>

      {/* Section 2 — Position */}
      <div>
        <p className="text-xs text-slate-400 mb-2">Position (m)</p>
        <div className="grid grid-cols-3 gap-2">
          {(['X', 'Y', 'Z'] as const).map((label, i) => (
            <div key={label}>
              <p className="text-xs text-slate-500 mb-1">{label}</p>
              <input
                type="number"
                step="0.1"
                defaultValue={device.position[i].toFixed(2)}
                onChange={(e) => handlePos(i as 0 | 1 | 2, e.target.value)}
                className={INPUT_CLS}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section 3 — Rotation */}
      <div>
        <p className="text-xs text-slate-400 mb-2">Spin (°)</p>
        <input
          type="number"
          min={0}
          max={360}
          step={1}
          defaultValue={rotDeg}
          onChange={(e) => handleRot(e.target.value)}
          className={INPUT_CLS}
        />
      </div>

      {/* Section 4 — Info */}
      <div>
        <p className="text-xs text-slate-400 mb-2">Info</p>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Floor</span>
            <span className="text-white">{floor?.name ?? '—'}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Height</span>
            <span className="text-white">{device.heightM} m</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Surface normal</span>
            <span className="text-white font-mono">
              {device.surfaceNormal.map((v) => v.toFixed(2)).join(' / ')}
            </span>
          </div>
        </div>
      </div>

      {/* Section 5 — Delete */}
      <button
        onClick={handleDelete}
        className="w-full bg-red-600 hover:bg-red-700 text-white text-sm rounded py-2 transition-colors"
      >
        Delete device
      </button>
    </div>
  )
}

export function PropertiesPanel() {
  const { selectedId, placedDevices, updateDevice, removeDevice, selectDevice } = useDevices()
  const { floors } = useBuilding()

  const device = selectedId ? placedDevices.find((d) => d.id === selectedId) : null

  if (!device) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400 text-sm">
        Select a device to inspect
      </div>
    )
  }

  return (
    <DeviceDetail
      key={device.id}
      device={device}
      floors={floors}
      updateDevice={updateDevice}
      removeDevice={removeDevice}
      selectDevice={selectDevice}
    />
  )
}
