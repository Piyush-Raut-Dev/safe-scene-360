import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Hazard } from '@/types';
import { WarehouseEnvironment } from './WarehouseEnvironment';
import { RealisticHazard } from './RealisticHazards';
import { FirstPersonController } from './FirstPersonControls';

interface WarehouseScene3DProps {
  hazards: Hazard[];
  identifiedHazards: string[];
  onIdentifyHazard: (id: string) => void;
  showHints: boolean;
  sceneType: 'storage' | 'loading' | 'chemical';
}

const SceneContent = ({ hazards, identifiedHazards, onIdentifyHazard, showHints, sceneType }: WarehouseScene3DProps) => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <hemisphereLight args={['#87ceeb', '#362907', 0.5]} />
      <WarehouseEnvironment sceneType={sceneType} />
      {hazards.map((hazard) => (
        <RealisticHazard
          key={hazard.id}
          hazard={hazard}
          identified={identifiedHazards.includes(hazard.id)}
          onIdentify={onIdentifyHazard}
          showHint={showHints}
        />
      ))}
      <FirstPersonController speed={4} />
    </>
  );
};

const LoadingFallback = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center gap-3 text-white">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      <span className="text-sm font-medium">Loading 3D Warehouse...</span>
    </div>
  </Html>
);

export const WarehouseScene3D = (props: WarehouseScene3DProps) => {
  return (
    <div className="w-full h-full min-h-[400px] bg-slate-900 rounded-lg overflow-hidden cursor-crosshair">
      <Canvas
        camera={{ fov: 70, near: 0.1, far: 100, position: [0, 1.7, 8] }}
        shadows
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <SceneContent {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
};
