import { Line, Html } from '@react-three/drei'
import type { PlacedDevice } from '../../types'

interface HeightLinesProps {
  devices: PlacedDevice[]
  visible: boolean
}

export default function HeightLines({ devices, visible }: HeightLinesProps) {
  if (!visible) return null

  return (
    <>
      {devices.map((device) => {
        const [x, y, z] = device.position
        return (
          <group key={device.id}>
            <Line
              points={[[x, 0, z], [x, y, z]]}
              color="#facc15"
              lineWidth={1}
              dashed
              dashScale={3}
            />
            <Html position={[x + 0.3, y / 2, z]} occlude={false}>
              <div className="bg-yellow-400/90 text-yellow-900 text-[10px] font-semibold px-1.5 py-0.5 rounded-full whitespace-nowrap">
                {device.heightM} m
              </div>
            </Html>
          </group>
        )
      })}
    </>
  )
}
