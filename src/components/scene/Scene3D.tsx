import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface Scene3DProps {
  sceneRef?: React.RefObject<THREE.Group>;
}

export default function Scene3D({ sceneRef }: Scene3DProps) {
  return (
    <Canvas className="w-full h-full">
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1} />
      <gridHelper args={[100, 100, '#334155', '#334155']} />
      <axesHelper args={[5]} />
      <OrbitControls enableDamping />
      <group ref={sceneRef} />
    </Canvas>
  );
}
