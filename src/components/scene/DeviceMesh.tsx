import type { DeviceId } from '../../types'

interface DeviceMeshProps {
    deviceType: DeviceId
    opacity?: number
}

export default function DeviceMesh({ deviceType, opacity = 1 }: DeviceMeshProps) {
    const transparent = opacity < 1

    if (deviceType === 'camera') {
        return (
            <group>
                {/* Body cylinder */}
                <mesh>
                    <cylinderGeometry args={[0.12, 0.15, 0.2]} />
                    <meshStandardMaterial color="#4a90d9" transparent={transparent} opacity={opacity} />
                </mesh>
                {/* Lens sphere offset forward */}
                <mesh position={[0, 0, 0.14]}>
                    <sphereGeometry args={[0.08]} />
                    <meshStandardMaterial color="#2c5f8a" transparent={transparent} opacity={opacity} />
                </mesh>
            </group>
        )
    }

    if (deviceType === 'antenna') {
        return (
            <group>
                {/* Mast */}
                <mesh>
                    <cylinderGeometry args={[0.03, 0.03, 0.6]} />
                    <meshStandardMaterial color="#6aaa6a" transparent={transparent} opacity={opacity} />
                </mesh>
                {/* Ring at top */}
                <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.06, 0.015]} />
                    <meshStandardMaterial color="#4a8a4a" transparent={transparent} opacity={opacity} />
                </mesh>
            </group>
        )
    }

    if (deviceType === 'aircon') {
        return (
            <group>
                {/* Main body */}
                <mesh>
                    <boxGeometry args={[1.2, 0.4, 0.3]} />
                    <meshStandardMaterial color="#7fa8c0" transparent={transparent} opacity={opacity} />
                </mesh>
                {/* Front face detail strip */}
                <mesh position={[0, -0.12, 0.18]}>
                    <boxGeometry args={[1.0, 0.06, 0.05]} />
                    <meshStandardMaterial color="#5a8aaa" transparent={transparent} opacity={opacity} />
                </mesh>
            </group>
        )
    }

    if (deviceType === 'smoke-sensor') {
        return (
            <group>
                {/* Flat disc */}
                <mesh>
                    <cylinderGeometry args={[0.12, 0.12, 0.05]} />
                    <meshStandardMaterial color="#d8d0c8" transparent={transparent} opacity={opacity} />
                </mesh>
                {/* Indicator dome on top */}
                <mesh position={[0, 0.045, 0]}>
                    <sphereGeometry args={[0.04]} />
                    <meshStandardMaterial color="#c04040" transparent={transparent} opacity={opacity} />
                </mesh>
            </group>
        )
    }

    // led-panel
    return (
        <group>
            <mesh>
                <boxGeometry args={[0.6, 0.04, 0.6]} />
                <meshStandardMaterial
                    color="#f0f0f0"
                    emissive="#ffffff"
                    emissiveIntensity={0.4}
                    transparent={transparent}
                    opacity={opacity}
                />
            </mesh>
        </group>
    )
}
