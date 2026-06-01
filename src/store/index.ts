import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { useShallow } from 'zustand/react/shallow'
import type { Floor, PlacedDevice, DeviceId } from '../types'

// ── Slices ────────────────────────────────────────────────────────────────────

interface BuildingSlice {
  buildingLoaded: boolean
  floors: Floor[]
  setBuilding(floors: Floor[]): void
  clearBuilding(): void
}

interface DeviceSlice {
  placedDevices: PlacedDevice[]
  selectedId: string | null
  addDevice(d: PlacedDevice): void
  updateDevice(id: string, patch: Partial<PlacedDevice>): void
  removeDevice(id: string): void
  selectDevice(id: string | null): void
}

interface UISlice {
  activeDeviceType: DeviceId | null
  showHeightLines: boolean
  setActiveDeviceType(t: DeviceId | null): void
  toggleHeightLines(): void
}

type Store = BuildingSlice & DeviceSlice & UISlice

// ── Store ─────────────────────────────────────────────────────────────────────

export const useStore = create<Store>()(
  immer((set) => ({
    // building
    buildingLoaded: false,
    floors: [],
    setBuilding: (floors) =>
      set((s) => {
        s.floors = floors
        s.buildingLoaded = true
      }),
    clearBuilding: () =>
      set((s) => {
        s.floors = []
        s.buildingLoaded = false
      }),

    // devices
    placedDevices: [],
    selectedId: null,
    addDevice: (d) =>
      set((s) => {
        s.placedDevices.push(d)
      }),
    updateDevice: (id, patch) =>
      set((s) => {
        const idx = s.placedDevices.findIndex((d) => d.id === id)
        if (idx !== -1) Object.assign(s.placedDevices[idx], patch)
      }),
    removeDevice: (id) =>
      set((s) => {
        s.placedDevices = s.placedDevices.filter((d) => d.id !== id)
        if (s.selectedId === id) s.selectedId = null
      }),
    selectDevice: (id) =>
      set((s) => {
        s.selectedId = id
      }),

    // ui
    activeDeviceType: null,
    showHeightLines: false,
    setActiveDeviceType: (t) =>
      set((s) => {
        s.activeDeviceType = t
      }),
    toggleHeightLines: () =>
      set((s) => {
        s.showHeightLines = !s.showHeightLines
      }),
  }))
)

// ── Selectors ─────────────────────────────────────────────────────────────────

export const useBuilding = () =>
  useStore(useShallow((s) => ({
    buildingLoaded: s.buildingLoaded,
    floors: s.floors,
    setBuilding: s.setBuilding,
    clearBuilding: s.clearBuilding,
  })))

export const useDevices = () =>
  useStore(useShallow((s) => ({
    placedDevices: s.placedDevices,
    selectedId: s.selectedId,
    addDevice: s.addDevice,
    updateDevice: s.updateDevice,
    removeDevice: s.removeDevice,
    selectDevice: s.selectDevice,
  })))

export const useUI = () =>
  useStore(useShallow((s) => ({
    activeDeviceType: s.activeDeviceType,
    showHeightLines: s.showHeightLines,
    setActiveDeviceType: s.setActiveDeviceType,
    toggleHeightLines: s.toggleHeightLines,
  })))
