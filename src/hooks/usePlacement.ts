import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useUI, useDevices } from '../store'
import { DEVICE_CATALOGUE } from '../assets/deviceCatalogue'
import type { HoverInfo } from './useSurfaceHover'
import type { Floor, PlacedDevice } from '../types'

export function usePlacement(
  hoverInfo: HoverInfo | null,
  floors: Floor[],
): { isArmed: boolean } {
  const { activeDeviceType } = useUI()
  const { addDevice } = useDevices()
  const { gl } = useThree()

  const hoverRef = useRef(hoverInfo)
  const activeRef = useRef(activeDeviceType)
  const floorsRef = useRef(floors)
  const addDeviceRef = useRef(addDevice)

  hoverRef.current = hoverInfo
  activeRef.current = activeDeviceType
  floorsRef.current = floors
  addDeviceRef.current = addDevice

  useEffect(() => {
    const canvas = gl.domElement

    function onPointerDown() {
      const hov = hoverRef.current
      const deviceType = activeRef.current

      if (!deviceType || !hov) return

      const deviceDepth = DEVICE_CATALOGUE[deviceType].dimensions.d
      const pos = hov.point.clone().addScaledVector(hov.normal, deviceDepth / 2)

      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        hov.normal.clone().normalize(),
      )
      const euler = new THREE.Euler().setFromQuaternion(quat)

      const floor = floorsRef.current.find(f => pos.y >= f.minY && pos.y <= f.maxY)

      const device: PlacedDevice = {
        id: crypto.randomUUID(),
        deviceType,
        position: [pos.x, pos.y, pos.z],
        rotation: [euler.x, euler.y, euler.z],
        surfaceNormal: [hov.normal.x, hov.normal.y, hov.normal.z],
        mountType: hov.mountType,
        floorId: floor?.id ?? '',
        heightM: Math.round(pos.y * 10) / 10,
      }

      addDeviceRef.current(device)
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    return () => canvas.removeEventListener('pointerdown', onPointerDown)
  }, [gl])

  return { isArmed: activeDeviceType !== null }
}
