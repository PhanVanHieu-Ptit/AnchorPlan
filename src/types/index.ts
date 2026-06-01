export type DeviceId = 'camera' | 'antenna' | 'aircon' | 'smoke-sensor' | 'led-panel'

export type MountType = 'exterior' | 'interior'

export interface Floor {
  id: string
  name: string
  minY: number
  maxY: number
  midY: number
}

export interface PlacedDevice {
  id: string
  deviceType: DeviceId
  position: [number, number, number]
  rotation: [number, number, number]
  surfaceNormal: [number, number, number]
  mountType: MountType
  floorId: string
  heightM: number
}

export interface DeviceMeta {
  id: DeviceId
  name: string
  category: string
  dimensions: { w: number; h: number; d: number }
  defaultRotation: [number, number, number]
  mountHint: MountType[]
}
