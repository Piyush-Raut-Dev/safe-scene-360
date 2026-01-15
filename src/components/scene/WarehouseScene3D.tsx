import { useRef, useState, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Text, 
  Html,
  Box,
  Cylinder,
  Sphere,
  useTexture,
  MeshDistortMaterial
} from '@react-three/drei';
import * as THREE from 'three';
import { Hazard } from '@/types';

interface HazardMarkerProps {
  hazard: Hazard;
  identified: boolean;
  onIdentify: (id: string) => void;
  showHint: boolean;
}

const HazardMarker = ({ hazard, identified, onIdentify, showHint }: HazardMarkerProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Convert 2D percentage positions to 3D spherical coordinates
  const phi = (hazard.y / 100) * Math.PI;
  const theta = ((hazard.x / 100) * 2 - 1) * Math.PI;
  const radius = 8;
  
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  useFrame((state) => {
    if (meshRef.current && !identified) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1);
    }
  });

  const getSeverityColor = () => {
    if (identified) return '#22c55e';
    switch (hazard.severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#3b82f6';
      default: return '#9ca3af';
    }
  };

  return (
    <group position={[x, y, z]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          if (!identified) onIdentify(hazard.id);
        }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial 
          color={getSeverityColor()}
          emissive={getSeverityColor()}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          transparent
          opacity={identified ? 0.7 : 1}
        />
      </mesh>
      
      {/* Glow effect */}
      {!identified && showHint && (
        <Sphere args={[0.6, 16, 16]}>
          <meshBasicMaterial 
            color={getSeverityColor()} 
            transparent 
            opacity={0.2}
          />
        </Sphere>
      )}

      {/* Info popup on hover */}
      {(hovered || identified) && (
        <Html distanceFactor={10} position={[0, 0.8, 0]}>
          <div className={`px-3 py-2 rounded-lg shadow-xl backdrop-blur-md text-sm whitespace-nowrap ${
            identified 
              ? 'bg-success/90 text-success-foreground' 
              : 'bg-card/90 text-card-foreground border border-accent'
          }`}>
            <div className="font-bold">{identified ? '✓ ' : '⚠️ '}{hazard.type.toUpperCase()}</div>
            {identified && <div className="text-xs opacity-80">{hazard.description}</div>}
            {!identified && <div className="text-xs opacity-80">Click to identify</div>}
          </div>
        </Html>
      )}
    </group>
  );
};

// Warehouse environment components
const WarehouseFloor = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
    <planeGeometry args={[50, 50]} />
    <meshStandardMaterial color="#374151" />
  </mesh>
);

const Shelving = ({ position }: { position: [number, number, number] }) => {
  const shelfColor = '#4b5563';
  return (
    <group position={position}>
      {/* Vertical posts */}
      {[-1.5, 1.5].map((x, i) => (
        <Box key={i} args={[0.1, 4, 0.1]} position={[x, 0, 0]}>
          <meshStandardMaterial color="#1f2937" />
        </Box>
      ))}
      {/* Shelves */}
      {[-1, 0, 1, 2].map((y, i) => (
        <Box key={`shelf-${i}`} args={[3.2, 0.1, 1]} position={[0, y, 0]}>
          <meshStandardMaterial color={shelfColor} />
        </Box>
      ))}
      {/* Boxes on shelves */}
      <Box args={[0.6, 0.5, 0.6]} position={[-0.8, -0.7, 0]}>
        <meshStandardMaterial color="#b45309" />
      </Box>
      <Box args={[0.8, 0.4, 0.5]} position={[0.5, 0.3, 0]}>
        <meshStandardMaterial color="#1d4ed8" />
      </Box>
      <Box args={[0.5, 0.6, 0.5]} position={[-0.3, 1.3, 0]}>
        <meshStandardMaterial color="#059669" />
      </Box>
    </group>
  );
};

const Forklift = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Body */}
    <Box args={[1.5, 1, 2]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#fbbf24" />
    </Box>
    {/* Cab */}
    <Box args={[1.4, 1.2, 1]} position={[0, 1.1, -0.3]}>
      <meshStandardMaterial color="#fbbf24" />
    </Box>
    {/* Forks */}
    <Box args={[0.1, 0.08, 1.5]} position={[-0.4, -0.4, 1.5]}>
      <meshStandardMaterial color="#374151" />
    </Box>
    <Box args={[0.1, 0.08, 1.5]} position={[0.4, -0.4, 1.5]}>
      <meshStandardMaterial color="#374151" />
    </Box>
    {/* Mast */}
    <Box args={[0.15, 2.5, 0.15]} position={[-0.5, 0.8, 0.8]}>
      <meshStandardMaterial color="#1f2937" />
    </Box>
    <Box args={[0.15, 2.5, 0.15]} position={[0.5, 0.8, 0.8]}>
      <meshStandardMaterial color="#1f2937" />
    </Box>
    {/* Wheels */}
    {[[-0.6, -0.5, 0.7], [0.6, -0.5, 0.7], [-0.6, -0.5, -0.7], [0.6, -0.5, -0.7]].map((pos, i) => (
      <Cylinder key={i} args={[0.25, 0.25, 0.2, 16]} rotation={[0, 0, Math.PI / 2]} position={pos as [number, number, number]}>
        <meshStandardMaterial color="#111827" />
      </Cylinder>
    ))}
  </group>
);

const SpillPuddle = ({ position, color = '#3b82f6' }: { position: [number, number, number], color?: string }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
    <circleGeometry args={[1.2, 32]} />
    <meshStandardMaterial 
      color={color} 
      transparent 
      opacity={0.7}
      metalness={0.8}
      roughness={0.2}
    />
  </mesh>
);

const WarningSign = ({ position, text = 'CAUTION' }: { position: [number, number, number], text?: string }) => (
  <group position={position}>
    <Box args={[1, 1.2, 0.05]}>
      <meshStandardMaterial color="#fbbf24" />
    </Box>
    <Text
      position={[0, 0, 0.03]}
      fontSize={0.15}
      color="#000"
      font="/fonts/inter-bold.woff"
      anchorX="center"
      anchorY="middle"
    >
      {text}
    </Text>
  </group>
);

const Barrel = ({ position, color = '#ef4444' }: { position: [number, number, number], color?: string }) => (
  <Cylinder args={[0.4, 0.4, 1, 16]} position={position}>
    <meshStandardMaterial color={color} />
  </Cylinder>
);

// Animated scene elements
const FloatingParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200;
  
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 30;
    positions[i + 1] = Math.random() * 10 - 2;
    positions[i + 2] = (Math.random() - 0.5) * 30;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#6b7280" transparent opacity={0.4} />
    </points>
  );
};

const CameraController = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 0.1);
  }, [camera]);

  return (
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      rotateSpeed={-0.3}
      minPolarAngle={Math.PI * 0.2}
      maxPolarAngle={Math.PI * 0.8}
    />
  );
};

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
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#fcd34d" />
      <spotLight position={[0, 15, 0]} angle={0.5} intensity={0.8} castShadow />

      {/* 360 Environment sphere (inside-out view) */}
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[15, 64, 64]} />
        <meshStandardMaterial 
          color={sceneType === 'chemical' ? '#1a1a2e' : sceneType === 'loading' ? '#1e293b' : '#111827'}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Warehouse structures based on scene type */}
      {sceneType === 'storage' && (
        <>
          <Shelving position={[-6, -1, -8]} />
          <Shelving position={[-2, -1, -8]} />
          <Shelving position={[2, -1, -8]} />
          <Shelving position={[6, -1, -8]} />
          <Forklift position={[0, -2.5, 0]} />
          <SpillPuddle position={[-3, -2.9, 2]} color="#3b82f6" />
        </>
      )}
      
      {sceneType === 'loading' && (
        <>
          <Box args={[8, 3, 0.5]} position={[0, -1, -10]}>
            <meshStandardMaterial color="#4b5563" />
          </Box>
          <Forklift position={[-4, -2.5, -2]} />
          <Forklift position={[3, -2.5, 2]} />
          {/* Pallets */}
          {[[-5, -2.8, 4], [5, -2.8, -3], [0, -2.8, 5]].map((pos, i) => (
            <Box key={i} args={[1.2, 0.15, 1.2]} position={pos as [number, number, number]}>
              <meshStandardMaterial color="#a16207" />
            </Box>
          ))}
        </>
      )}
      
      {sceneType === 'chemical' && (
        <>
          <Barrel position={[-4, -2.3, -5]} color="#ef4444" />
          <Barrel position={[-3, -2.3, -5]} color="#ef4444" />
          <Barrel position={[-3.5, -2.3, -4]} color="#eab308" />
          <Barrel position={[4, -2.3, -4]} color="#22c55e" />
          <Barrel position={[5, -2.3, -4]} color="#22c55e" />
          <SpillPuddle position={[-2, -2.9, -3]} color="#22c55e" />
          <WarningSign position={[0, 0, -8]} text="⚠️ HAZMAT" />
        </>
      )}

      {/* Floor grid lines */}
      <gridHelper args={[40, 40, '#4b5563', '#374151']} position={[0, -2.95, 0]} />

      {/* Floating dust particles */}
      <FloatingParticles />

      {/* Hazard markers */}
      {hazards.map((hazard) => (
        <HazardMarker
          key={hazard.id}
          hazard={hazard}
          identified={identifiedHazards.includes(hazard.id)}
          onIdentify={onIdentifyHazard}
          showHint={showHints}
        />
      ))}

      {/* Camera controls */}
      <CameraController />
    </>
  );
};

const LoadingFallback = () => (
  <Html center>
    <div className="flex flex-col items-center justify-center gap-3 text-white">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      <span className="text-sm font-medium">Loading 3D Scene...</span>
    </div>
  </Html>
);

export const WarehouseScene3D = (props: WarehouseScene3DProps) => {
  return (
    <div className="w-full h-full min-h-[400px] bg-slate-900 rounded-lg overflow-hidden">
      <Canvas
        camera={{ fov: 75, near: 0.1, far: 100, position: [0, 0, 0.1] }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <SceneContent {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
};
