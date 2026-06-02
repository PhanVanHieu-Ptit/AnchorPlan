import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { TransformControls } from '@react-three/drei'
import * as THREE from 'three'
import { useDevices } from '../../store'

export interface DeviceGizmoProps {
  deviceId: string | null
  setOrbitEnabled: (v: boolean) => void
}

export default function DeviceGizmo({ deviceId, setOrbitEnabled }: DeviceGizmoProps) {
  const { placedDevices, updateDevice, removeDevice, selectDevice } = useDevices()
  const [mode, setMode] = useState<'translate' | 'rotate'>('translate')

  const dummyRef = useRef(new THREE.Object3D())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null)
  const dragOriginPos = useRef(new THREE.Vector3())
  const dragOriginQuat = useRef(new THREE.Quaternion())
  const prevDeviceId = useRef<string | null | undefined>(undefined)

  const device = deviceId ? (placedDevices.find((d) => d.id === deviceId) ?? null) : null

  // Always-current snapshot so imperative listeners never close over stale values
  const snap = useRef({ device, deviceId, mode, updateDevice, setOrbitEnabled })
  useLayoutEffect(() => {
    snap.current = { device, deviceId, mode, updateDevice, setOrbitEnabled }
  })

  // Sync dummy transform when a different device is selected; skip during drag
  // (updateDevice changes device reference without changing deviceId, so the
  // prevDeviceId guard prevents re-syncing while TransformControls is active)
  useEffect(() => {
    if (deviceId === prevDeviceId.current) return
    prevDeviceId.current = deviceId
    if (!device) return
    dummyRef.current.position.set(...device.position)
    dummyRef.current.rotation.set(...device.rotation)
    dummyRef.current.updateMatrixWorld()
  }, [deviceId, device])

  // w → translate, e → rotate, Delete/Backspace → remove selected device
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'w') setMode('translate')
      else if (e.key === 'e') setMode('rotate')
      else if ((e.key === 'Delete' || e.key === 'Backspace') && deviceId) {
        removeDevice(deviceId)
        selectDevice(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [deviceId, removeDevice, selectDevice])

  // Attach imperative THREE.TransformControls event listeners
  useEffect(() => {
    if (!deviceId) return
    const controls = controlsRef.current
    if (!controls) return

    const onMouseDown = () => {
      dragOriginPos.current.copy(dummyRef.current.position)
      dragOriginQuat.current.copy(dummyRef.current.quaternion)
      snap.current.setOrbitEnabled(false)
    }

    const onMouseUp = () => {
      snap.current.setOrbitEnabled(true)
    }

    const onObjectChange = () => {
      const { device: dev, deviceId: did, mode: m, updateDevice: upd } = snap.current
      if (!dev || !did) return

      const n = new THREE.Vector3(...dev.surfaceNormal).normalize()
      const dummy = dummyRef.current

      if (m === 'translate') {
        const origin = dragOriginPos.current
        const disp = dummy.position.clone().sub(origin)
        // Remove component along surface normal to keep device on the plane
        disp.addScaledVector(n, -disp.dot(n))
        if (disp.length() > 2) disp.setLength(2)
        const constrained = origin.clone().add(disp)
        dummy.position.copy(constrained)
        upd(did, { position: [constrained.x, constrained.y, constrained.z] })
      } else {
        // Twist-swing decomposition: extract only the rotation around surfaceNormal
        const qCurrent = dummy.quaternion.clone()
        const qOrigin = dragOriginQuat.current
        const qDelta = qCurrent.multiply(qOrigin.clone().invert())
        // Ensure we take the shorter arc
        if (qDelta.w < 0) qDelta.negate()
        const proj = new THREE.Vector3(qDelta.x, qDelta.y, qDelta.z).dot(n)
        const twist = new THREE.Quaternion(n.x * proj, n.y * proj, n.z * proj, qDelta.w).normalize()
        const qConstrained = twist.multiply(qOrigin)
        dummy.quaternion.copy(qConstrained)
        dummy.updateMatrixWorld()
        const euler = new THREE.Euler().setFromQuaternion(qConstrained)
        upd(did, { rotation: [euler.x, euler.y, euler.z] })
      }
    }

    controls.addEventListener('mouseDown', onMouseDown)
    controls.addEventListener('mouseUp', onMouseUp)
    controls.addEventListener('objectChange', onObjectChange)

    return () => {
      controls.removeEventListener('mouseDown', onMouseDown)
      controls.removeEventListener('mouseUp', onMouseUp)
      controls.removeEventListener('objectChange', onObjectChange)
    }
  }, [deviceId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!device) return null

  return (
    <>
      <primitive object={dummyRef.current} />
      <TransformControls ref={controlsRef} object={dummyRef.current} mode={mode} />
    </>
  )
}
