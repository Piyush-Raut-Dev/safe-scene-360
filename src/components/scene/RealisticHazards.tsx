import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { Hazard } from '@/types';

interface RealisticHazardProps {
  hazard: Hazard;
  identified: boolean;
  onIdentify: (id: string) => void;
  showHint: boolean;
}

// Oil/Water Spill on floor
const SpillHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const size = hazard.size || 1.5;
  
  const isChemical = hazard.type === 'chemical';
  const color = isChemical ? '#22c55e' : hazard.description.toLowerCase().includes('water') ? '#60a5fa' : '#1e293b';
  
  useFrame((state) => {
    if (meshRef.current && !identified && meshRef.current.material) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={[hazard.x, hazard.y, hazard.z]}>
      <mesh
        ref={meshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => { e.stopPropagation(); if (!identified) onIdentify(hazard.id); }}
      >
        <circleGeometry args={[size, 32]} />
        <meshStandardMaterial 
          color={identified ? '#22c55e' : color}
          transparent
          opacity={0.7}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Hazard glow indicator */}
      {!identified && showHint && (
        <pointLight position={[0, 0.5, 0]} color="#ef4444" intensity={2} distance={3} />
      )}
      {/* Warning cone nearby */}
      {!identified && (
        <group position={[size + 0.3, 0, 0]}>
          <Cylinder args={[0.02, 0.15, 0.4, 8]} position={[0, 0.2, 0]}>
            <meshStandardMaterial color="#f97316" />
          </Cylinder>
          <Cylinder args={[0.15, 0.18, 0.02, 8]} position={[0, 0.01, 0]}>
            <meshStandardMaterial color="#1f2937" />
          </Cylinder>
        </group>
      )}
    </group>
  );
};

// Unstable stacking / fallen boxes
const StackingHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current && !identified) {
      // Slight wobble effect
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[hazard.x, hazard.y, hazard.z]}>
      {/* Tilted/unstable boxes */}
      <Box args={[0.8, 0.6, 0.8]} position={[0, 0, 0]} rotation={[0.1, 0, 0.15]}
        onClick={(e) => { e.stopPropagation(); if (!identified) onIdentify(hazard.id); }}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#b45309'} />
      </Box>
      <Box args={[0.7, 0.5, 0.7]} position={[0.1, 0.6, 0.05]} rotation={[0, 0.2, 0.2]}
        onClick={(e) => { e.stopPropagation(); if (!identified) onIdentify(hazard.id); }}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#92400e'} />
      </Box>
      <Box args={[0.6, 0.4, 0.6]} position={[-0.15, 1.1, 0]} rotation={[-0.1, 0.1, -0.25]}
        onClick={(e) => { e.stopPropagation(); if (!identified) onIdentify(hazard.id); }}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#78350f'} />
      </Box>
      {/* Fallen box on ground */}
      <Box args={[0.5, 0.4, 0.5]} position={[1.2, 0.2, 0.3]} rotation={[0.3, 0.5, 1.2]}
        onClick={(e) => { e.stopPropagation(); if (!identified) onIdentify(hazard.id); }}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#a16207'} />
      </Box>
      {showHint && !identified && (
        <pointLight position={[0, 1.5, 0]} color="#ef4444" intensity={3} distance={4} />
      )}
    </group>
  );
};

// Blocked exit with boxes/equipment
const BlockedExitHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  return (
    <group position={[hazard.x, hazard.y, hazard.z]}>
      {/* Exit door frame */}
      <Box args={[0.1, 2.5, 1.2]} position={[-0.6, 1.25, 0]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      <Box args={[0.1, 2.5, 1.2]} position={[0.6, 1.25, 0]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      <Box args={[1.3, 0.1, 1.2]} position={[0, 2.5, 0]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      {/* EXIT sign */}
      <Box args={[0.6, 0.2, 0.05]} position={[0, 2.3, 0.6]}>
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.5} />
      </Box>
      {/* Blocking boxes */}
      <Box args={[0.6, 0.5, 0.5]} position={[0, 0.25, 0.4]}
        onClick={(e) => { e.stopPropagation(); if (!identified) onIdentify(hazard.id); }}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#b45309'} />
      </Box>
      <Box args={[0.5, 0.6, 0.5]} position={[0.3, 0.55, 0.3]}
        onClick={(e) => { e.stopPropagation(); if (!identified) onIdentify(hazard.id); }}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#92400e'} />
      </Box>
      <Box args={[0.4, 0.4, 0.4]} position={[-0.25, 0.7, 0.5]}
        onClick={(e) => { e.stopPropagation(); if (!identified) onIdentify(hazard.id); }}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#a16207'} />
      </Box>
      {showHint && !identified && (
        <pointLight position={[0, 1, 0.5]} color="#ef4444" intensity={3} distance={4} />
      )}
    </group>
  );
};

// Damaged forklift
const EquipmentHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  return (
    <group position={[hazard.x, hazard.y, hazard.z]}
      onClick={(e) => { e.stopPropagation(); if (!identified) onIdentify(hazard.id); }}>
      {/* Forklift body */}
      <Box args={[1.2, 0.8, 1.8]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#fbbf24'} />
      </Box>
      {/* Cab */}
      <Box args={[1.1, 1, 0.8]} position={[0, 1.3, -0.4]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#fbbf24'} />
      </Box>
      {/* Mast */}
      <Box args={[0.1, 2, 0.1]} position={[-0.4, 1, 0.7]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      <Box args={[0.1, 2, 0.1]} position={[0.4, 1, 0.7]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      {/* Forks */}
      <Box args={[0.08, 0.05, 1]} position={[-0.3, 0.1, 1.2]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      <Box args={[0.08, 0.05, 1]} position={[0.3, 0.1, 1.2]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      {/* Good wheels */}
      <Cylinder args={[0.2, 0.2, 0.15, 16]} rotation={[0, 0, Math.PI / 2]} position={[-0.6, 0.2, 0.6]}>
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      <Cylinder args={[0.2, 0.2, 0.15, 16]} rotation={[0, 0, Math.PI / 2]} position={[0.6, 0.2, 0.6]}>
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      <Cylinder args={[0.2, 0.2, 0.15, 16]} rotation={[0, 0, Math.PI / 2]} position={[-0.6, 0.2, -0.6]}>
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      {/* FLAT/Damaged wheel - visibly deflated */}
      <Cylinder args={[0.2, 0.2, 0.15, 16]} rotation={[0, 0, Math.PI / 2]} position={[0.6, 0.1, -0.6]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#dc2626'} />
      </Cylinder>
      <Sphere args={[0.12, 8, 8]} position={[0.6, 0.05, -0.6]}>
        <meshStandardMaterial color="#1f2937" />
      </Sphere>
      {showHint && !identified && (
        <pointLight position={[0.6, 0.5, -0.6]} color="#ef4444" intensity={3} distance={3} />
      )}
    </group>
  );
};

// Broken/flickering light
const LightingHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (lightRef.current && !identified) {
      // Flickering effect
      lightRef.current.intensity = Math.random() > 0.7 ? 0 : 1 + Math.random() * 0.5;
    }
  });

  return (
    <group position={[hazard.x, hazard.y, hazard.z]}
      onClick={(e) => { e.stopPropagation(); if (!identified) onIdentify(hazard.id); }}>
      {/* Light fixture */}
      <Box args={[0.8, 0.1, 0.3]} position={[0, 0, 0]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#6b7280'} />
      </Box>
      <Cylinder args={[0.1, 0.15, 0.2, 8]} position={[0, -0.15, 0]}>
        <meshStandardMaterial 
          color={identified ? '#22c55e' : '#fef3c7'} 
          emissive={identified ? '#22c55e' : '#fef3c7'}
          emissiveIntensity={identified ? 0.3 : 0.8}
        />
      </Cylinder>
      {!identified && (
        <pointLight 
          ref={lightRef}
          position={[0, -0.3, 0]} 
          color="#fef3c7" 
          intensity={1} 
          distance={8} 
        />
      )}
      {showHint && !identified && (
        <pointLight position={[0, -0.5, 0]} color="#ef4444" intensity={2} distance={3} />
      )}
    </group>
  );
};

// Missing PPE / Safety signage
const PPEHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  return (
    <group position={[hazard.x, hazard.y, hazard.z]}
      onClick={(e) => { e.stopPropagation(); if (!identified) onIdentify(hazard.id); }}>
      {/* Empty sign post */}
      <Cylinder args={[0.05, 0.05, 2, 8]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#6b7280" />
      </Cylinder>
      {/* Empty sign bracket - sign is missing */}
      <Box args={[0.6, 0.4, 0.02]} position={[0, 1.8, 0.05]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#374151'} transparent opacity={0.3} />
      </Box>
      {/* Fallen sign on ground */}
      <Box args={[0.5, 0.35, 0.02]} position={[0.4, 0.02, 0.3]} rotation={[-Math.PI / 2, 0, 0.3]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#fbbf24'} />
      </Box>
      {showHint && !identified && (
        <pointLight position={[0, 1, 0]} color="#ef4444" intensity={2} distance={3} />
      )}
    </group>
  );
};

// Fire extinguisher blocked
const FireHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  return (
    <group position={[hazard.x, hazard.y, hazard.z]}
      onClick={(e) => { e.stopPropagation(); if (!identified) onIdentify(hazard.id); }}>
      {/* Fire extinguisher on wall */}
      <Cylinder args={[0.1, 0.1, 0.5, 16]} position={[0, 0.5, -0.15]}>
        <meshStandardMaterial color="#dc2626" />
      </Cylinder>
      <Cylinder args={[0.03, 0.03, 0.15, 8]} position={[0, 0.8, -0.1]} rotation={[0.3, 0, 0]}>
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>
      {/* Wall mount */}
      <Box args={[0.3, 0.4, 0.05]} position={[0, 0.5, -0.2]}>
        <meshStandardMaterial color="#dc2626" />
      </Box>
      {/* Blocking barrels */}
      <Cylinder args={[0.3, 0.3, 0.8, 16]} position={[-0.4, 0.4, 0.4]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#3b82f6'} />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 0.8, 16]} position={[0.4, 0.4, 0.5]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#3b82f6'} />
      </Cylinder>
      {showHint && !identified && (
        <pointLight position={[0, 1, 0.3]} color="#ef4444" intensity={3} distance={4} />
      )}
    </group>
  );
};

// Exposed electrical wiring
const ElectricalHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  const sparkRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (sparkRef.current && !identified) {
      sparkRef.current.intensity = Math.random() > 0.8 ? 5 : 0;
    }
  });

  return (
    <group position={[hazard.x, hazard.y, hazard.z]}
      onClick={(e) => { e.stopPropagation(); if (!identified) onIdentify(hazard.id); }}>
      {/* Electrical panel */}
      <Box args={[0.6, 0.8, 0.15]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      {/* Exposed wires */}
      <Cylinder args={[0.02, 0.02, 0.4, 8]} position={[0.1, 0.1, 0.1]} rotation={[0.5, 0, 0.3]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#f97316'} />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 0.35, 8]} position={[-0.1, 0.15, 0.12]} rotation={[0.3, 0, -0.4]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#3b82f6'} />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 0.3, 8]} position={[0, 0.05, 0.1]} rotation={[0.7, 0, 0]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#22c55e'} />
      </Cylinder>
      {/* Spark effect */}
      {!identified && (
        <pointLight ref={sparkRef} position={[0, 0.1, 0.15]} color="#60a5fa" intensity={0} distance={2} />
      )}
      {showHint && !identified && (
        <pointLight position={[0, 0.4, 0.2]} color="#ef4444" intensity={3} distance={3} />
      )}
    </group>
  );
};

// Chemical leak from drum
const ChemicalHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  return (
    <group position={[hazard.x, hazard.y, hazard.z]}
      onClick={(e) => { e.stopPropagation(); if (!identified) onIdentify(hazard.id); }}>
      {/* Chemical drum tilted */}
      <Cylinder args={[0.35, 0.35, 0.9, 16]} position={[0, 0.45, 0]} rotation={[0.15, 0, 0.1]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#dc2626'} />
      </Cylinder>
      {/* Hazmat symbol */}
      <Box args={[0.15, 0.15, 0.01]} position={[0, 0.5, 0.36]} rotation={[0.15, 0, 0.1]}>
        <meshStandardMaterial color="#fbbf24" />
      </Box>
      {/* Chemical spill */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.5, 0.01, 0.5]}>
        <circleGeometry args={[hazard.size || 1.2, 32]} />
        <meshStandardMaterial 
          color={identified ? '#22c55e' : '#22c55e'} 
          transparent 
          opacity={0.6}
          emissive={identified ? '#22c55e' : '#22c55e'}
          emissiveIntensity={0.3}
        />
      </mesh>
      {showHint && !identified && (
        <pointLight position={[0.3, 0.3, 0.3]} color="#ef4444" intensity={3} distance={4} />
      )}
    </group>
  );
};

export const RealisticHazard = (props: RealisticHazardProps) => {
  const { hazard } = props;
  
  switch (hazard.type) {
    case 'spill':
      return <SpillHazard {...props} />;
    case 'stacking':
      return <StackingHazard {...props} />;
    case 'exit':
      return <BlockedExitHazard {...props} />;
    case 'equipment':
      return <EquipmentHazard {...props} />;
    case 'lighting':
      return <LightingHazard {...props} />;
    case 'ppe':
      return <PPEHazard {...props} />;
    case 'fire':
      return <FireHazard {...props} />;
    case 'electrical':
      return <ElectricalHazard {...props} />;
    case 'chemical':
      return <ChemicalHazard {...props} />;
    default:
      return <SpillHazard {...props} />;
  }
};
