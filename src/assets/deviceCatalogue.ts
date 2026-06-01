import type { DeviceId, DeviceMeta } from '../types'

export const DEVICE_CATALOGUE: Record<DeviceId, DeviceMeta> = {
    camera: {
        id: 'camera',
        name: 'Dome Camera',
        category: 'Security',
        dimensions: { w: 0.3, h: 0.2, d: 0.3 },
        defaultRotation: [0, 0, 0],
        mountHint: ['exterior', 'interior'],
    },
    antenna: {
        id: 'antenna',
        name: 'WiFi Antenna',
        category: 'Network',
        dimensions: { w: 0.1, h: 0.6, d: 0.1 },
        defaultRotation: [0, 0, 0],
        mountHint: ['exterior'],
    },
    aircon: {
        id: 'aircon',
        name: 'Wall AC Unit',
        category: 'HVAC',
        dimensions: { w: 1.2, h: 0.4, d: 0.3 },
        defaultRotation: [0, 0, 0],
        mountHint: ['exterior', 'interior'],
    },
    'smoke-sensor': {
        id: 'smoke-sensor',
        name: 'Smoke Detector',
        category: 'Safety',
        dimensions: { w: 0.15, h: 0.05, d: 0.15 },
        defaultRotation: [0, 0, 0],
        mountHint: ['interior'],
    },
    'led-panel': {
        id: 'led-panel',
        name: 'LED Light Panel',
        category: 'Lighting',
        dimensions: { w: 0.6, h: 0.05, d: 0.6 },
        defaultRotation: [0, 0, 0],
        mountHint: ['interior'],
    },
}
