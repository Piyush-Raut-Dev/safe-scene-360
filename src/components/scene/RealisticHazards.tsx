import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { Hazard } from '@/types';

interface RealisticHazardProps {
  hazard: Hazard;
  identified: boolean;
  onIdentify: (id: string) => void;
  showHint: boolean;
}

const clampFloorY = (hazard: Hazard) => {
  // Some mock hazards can end up authored with y > 0 which makes them float.
  // Clamp ONLY hazards that must live on the slab.
  // NOTE: stacking hazards can be on upper racks; do not clamp those.
  const floorBased = new Set([
    'spill',
    'exit',
    'equipment',
    'ppe',
    'fire',
    'electrical',
    'chemical',
  ]);

  return floorBased.has(hazard.type) ? 0 : hazard.y;
};

const CEILING_Y = 6.7;
const WALL_INSET = 15.85;

const snapToWall = (hazard: Hazard) => {
  // Our room is built with walls at x/z = +/-16 and thickness ~0.3.
  // Snap items to the closest wall so they never appear floating in space.
  const dx = Math.min(Math.abs(hazard.x - 16), Math.abs(hazard.x + 16));
  const dz = Math.min(Math.abs(hazard.z - 16), Math.abs(hazard.z + 16));

  if (dx < dz) {
    // Snap to left/right wall
    const right = Math.abs(hazard.x - 16) < Math.abs(hazard.x + 16);
    return {
      position: [right ? WALL_INSET : -WALL_INSET, 0, hazard.z] as [number, number, number],
      rotationY: right ? -Math.PI / 2 : Math.PI / 2,
    };
  }

  // Snap to front/back wall
  const back = Math.abs(hazard.z - 16) < Math.abs(hazard.z + 16);
  return {
    position: [hazard.x, 0, back ? WALL_INSET : -WALL_INSET] as [number, number, number],
    rotationY: back ? Math.PI : 0,
  };
};

// Detailed Oil/Water Spill on floor
const SpillHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const size = hazard.size || 1.5;

  const isChemical = hazard.type === 'chemical';
  const color = isChemical
    ? '#22c55e'
    : hazard.description.toLowerCase().includes('water')
      ? '#60a5fa'
      : '#1e293b';

  // Irregular spill shape (looks less "toy" than a perfect circle)
  const spillGeometry = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const segments = 64;
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      const noise =
        0.78 +
        Math.sin(a * 3.2) * 0.08 +
        Math.sin(a * 7.7) * 0.05 +
        (Math.random() - 0.5) * 0.06;
      pts.push(new THREE.Vector2(Math.cos(a) * size * noise, Math.sin(a) * size * noise));
    }
    const shape = new THREE.Shape(pts);
    const geo = new THREE.ShapeGeometry(shape, 16);
    geo.computeVertexNormals();
    return geo;
  }, [size]);

  useFrame((state) => {
    if (meshRef.current && !identified && meshRef.current.material) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
  });

  const y = clampFloorY(hazard);

  return (
    <group position={[hazard.x, y, hazard.z]}>
      {/* Main puddle with irregular shape */}
      <mesh
        ref={meshRef}
        geometry={spillGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.002, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (!identified) onIdentify(hazard.id);
        }}
      >
        <meshStandardMaterial
          color={identified ? '#22c55e' : color}
          transparent
          opacity={0.72}
          metalness={0.95}
          roughness={0.06}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* Smaller secondary puddle for realism */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[size * 0.6, 0.0025, size * 0.3]}>
        <circleGeometry args={[size * 0.3, 24]} />
        <meshStandardMaterial
          color={identified ? '#22c55e' : color}
          transparent
          opacity={0.55}
          metalness={0.9}
          roughness={0.12}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* Drip trail */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-size * 0.4, 0.002, -size * 0.5]}>
        <circleGeometry args={[size * 0.15, 16]} />
        <meshStandardMaterial
          color={identified ? '#22c55e' : color}
          transparent
          opacity={0.45}
          metalness={0.9}
          roughness={0.12}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* Leaking container - overturned bucket */}
      <group position={[-size - 0.3, 0, 0.2]} rotation={[0.4, 0.2, 1.4]}>
        <Cylinder args={[0.2, 0.25, 0.4, 16, 1, true]}>
          <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.5} />
        </Cylinder>
        <Cylinder args={[0.23, 0.23, 0.02, 16]} position={[0, 0.19, 0]}>
          <meshStandardMaterial color="#475569" metalness={0.6} />
        </Cylinder>
      </group>

      {/* Warning cone */}
      {!identified && (
        <group position={[size + 0.5, 0, 0]}>
          <Cylinder args={[0.02, 0.18, 0.5, 8]} position={[0, 0.25, 0]}>
            <meshStandardMaterial color="#f97316" />
          </Cylinder>
          {/* Reflective stripe */}
          <Cylinder args={[0.08, 0.14, 0.08, 8]} position={[0, 0.35, 0]}>
            <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.3} />
          </Cylinder>
          <Cylinder args={[0.18, 0.2, 0.03, 8]} position={[0, 0.015, 0]}>
            <meshStandardMaterial color="#1f2937" />
          </Cylinder>
        </group>
      )}

      {/* Hazard indicator */}
      {!identified && showHint && <pointLight position={[0, 0.5, 0]} color="#ef4444" intensity={3} distance={4} />}
    </group>
  );
};

// Realistic unstable stacking with cardboard boxes (supports upper-rack placement)
const StackingHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && !identified) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.025;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.015;
    }
  });

  const desc = hazard.description?.toLowerCase?.() || '';
  const isChemicalContainers = desc.includes('chemical containers');

  // If this scenario is "chemical containers", it should feel like an upper-rack hazard.
  const y = isChemicalContainers ? 3.95 : Math.max(hazard.y ?? 0, 0);
  const scale = isChemicalContainers ? 1.45 : 1;

  const boxColor = identified ? '#22c55e' : '#92400e';
  const boxColorLight = identified ? '#22c55e' : '#b45309';
  const boxColorDark = identified ? '#22c55e' : '#78350f';

  return (
    <group ref={groupRef} position={[hazard.x, y, hazard.z]} scale={[scale, scale, scale]}>
      {/* Pallet base */}
      <Box args={[1.4, 0.12, 1.4]} position={[0, 0.06, 0]}>
        <meshStandardMaterial color="#854d0e" />
      </Box>
      {[[-0.5, 0, 0.5].map((x, i) => (
        <Box key={i} args={[0.12, 0.1, 1.4]} position={[x, -0.01, 0]}>
          <meshStandardMaterial color="#78350f" />
        </Box>
      ))]}

      {/* First layer - stable */}
      <RoundedBox
        args={[0.6, 0.45, 0.6]}
        position={[-0.3, 0.35, -0.3]}
        radius={0.02}
        onClick={(e) => {
          e.stopPropagation();
          if (!identified) onIdentify(hazard.id);
        }}
      >
        <meshStandardMaterial color={boxColorLight} />
      </RoundedBox>
      <RoundedBox
        args={[0.55, 0.4, 0.6]}
        position={[0.3, 0.32, -0.25]}
        radius={0.02}
        onClick={(e) => {
          e.stopPropagation();
          if (!identified) onIdentify(hazard.id);
        }}
      >
        <meshStandardMaterial color={boxColor} />
      </RoundedBox>
      <RoundedBox
        args={[0.5, 0.5, 0.55]}
        position={[0, 0.37, 0.35]}
        radius={0.02}
        onClick={(e) => {
          e.stopPropagation();
          if (!identified) onIdentify(hazard.id);
        }}
      >
        <meshStandardMaterial color={boxColorDark} />
      </RoundedBox>

      {/* Second layer - starting to lean */}
      <RoundedBox
        args={[0.55, 0.4, 0.55]}
        position={[-0.15, 0.8, 0]}
        rotation={[0.05, 0.1, 0.08]}
        onClick={(e) => {
          e.stopPropagation();
          if (!identified) onIdentify(hazard.id);
        }}
      >
        <meshStandardMaterial color={boxColorLight} />
      </RoundedBox>
      <RoundedBox
        args={[0.45, 0.35, 0.5]}
        position={[0.35, 0.75, -0.1]}
        rotation={[0.03, -0.05, 0.12]}
        onClick={(e) => {
          e.stopPropagation();
          if (!identified) onIdentify(hazard.id);
        }}
      >
        <meshStandardMaterial color={boxColor} />
      </RoundedBox>

      {/* Third layer - very unstable */}
      <RoundedBox
        args={[0.5, 0.38, 0.5]}
        position={[0.1, 1.2, 0.05]}
        rotation={[-0.08, 0.15, -0.18]}
        onClick={(e) => {
          e.stopPropagation();
          if (!identified) onIdentify(hazard.id);
        }}
      >
        <meshStandardMaterial color={boxColorDark} />
      </RoundedBox>

      {/* Top box - about to fall */}
      <RoundedBox
        args={[0.4, 0.3, 0.4]}
        position={[0.2, 1.55, 0.1]}
        rotation={[0.1, 0.2, -0.25]}
        onClick={(e) => {
          e.stopPropagation();
          if (!identified) onIdentify(hazard.id);
        }}
      >
        <meshStandardMaterial color={boxColorLight} />
      </RoundedBox>

      {/* Fallen box on ground */}
      <RoundedBox
        args={[0.45, 0.35, 0.45]}
        position={[1.3, 0.18, 0.4]}
        rotation={[0.4, 0.6, 1.3]}
        radius={0.02}
        onClick={(e) => {
          e.stopPropagation();
          if (!identified) onIdentify(hazard.id);
        }}
      >
        <meshStandardMaterial color={boxColor} />
      </RoundedBox>

      {/* Scattered items from fallen box */}
      <Sphere args={[0.06, 8, 8]} position={[1.6, 0.06, 0.2]}>
        <meshStandardMaterial color="#3b82f6" />
      </Sphere>
      <Box args={[0.08, 0.08, 0.08]} position={[1.4, 0.04, 0.7]} rotation={[0.3, 0.5, 0.2]}>
        <meshStandardMaterial color="#dc2626" />
      </Box>

      {showHint && !identified && <pointLight position={[0, 1.8, 0]} color="#ef4444" intensity={4} distance={5} />}
    </group>
  );
};

// Blocked emergency exit with detailed door (snapped to floor)
const BlockedExitHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  const y = clampFloorY(hazard);
  const snapped = snapToWall(hazard);

  return (
    <group position={[snapped.position[0], y, snapped.position[2]]} rotation={[0, snapped.rotationY, 0]}>
      {/* Floor threshold */}
      <Box args={[1.4, 0.04, 0.45]} position={[0, 0.02, 0.05]}>
        <meshStandardMaterial color="#111827" roughness={0.6} />
      </Box>

      {/* Door frame */}
      <Box args={[0.12, 2.6, 0.15]} position={[-0.55, 1.3, 0]}>
        <meshStandardMaterial color="#374151" metalness={0.3} />
      </Box>
      <Box args={[0.12, 2.6, 0.15]} position={[0.55, 1.3, 0]}>
        <meshStandardMaterial color="#374151" metalness={0.3} />
      </Box>
      <Box args={[1.22, 0.12, 0.15]} position={[0, 2.6, 0]}>
        <meshStandardMaterial color="#374151" metalness={0.3} />
      </Box>

      {/* Door */}
      <Box args={[1, 2.4, 0.08]} position={[0, 1.25, 0]}>
        <meshStandardMaterial color="#64748b" metalness={0.2} />
      </Box>

      {/* Door handle / push bar */}
      <Box args={[0.7, 0.08, 0.1]} position={[0, 1.1, 0.08]}>
        <meshStandardMaterial color="#9ca3af" metalness={0.6} />
      </Box>

      {/* EXIT sign with glow */}
      <Box args={[0.5, 0.15, 0.03]} position={[0, 2.4, 0.1]}>
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.8} />
      </Box>
      <pointLight position={[0, 2.4, 0.3]} color="#dc2626" intensity={2} distance={2} />

      {/* Running man icon */}
      <Box args={[0.12, 0.12, 0.01]} position={[0, 2.4, 0.12]}>
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </Box>

      {/* Blocking equipment - stacked boxes */}
      <RoundedBox
        args={[0.6, 0.5, 0.5]}
        position={[0, 0.25, 0.45]}
        radius={0.02}
        onClick={(e) => {
          e.stopPropagation();
          if (!identified) onIdentify(hazard.id);
        }}
      >
        <meshStandardMaterial color={identified ? '#22c55e' : '#b45309'} />
      </RoundedBox>
      <RoundedBox
        args={[0.55, 0.55, 0.5]}
        position={[0.25, 0.55, 0.35]}
        radius={0.02}
        onClick={(e) => {
          e.stopPropagation();
          if (!identified) onIdentify(hazard.id);
        }}
      >
        <meshStandardMaterial color={identified ? '#22c55e' : '#92400e'} />
      </RoundedBox>
      <RoundedBox
        args={[0.5, 0.4, 0.45]}
        position={[-0.2, 0.7, 0.5]}
        radius={0.02}
        onClick={(e) => {
          e.stopPropagation();
          if (!identified) onIdentify(hazard.id);
        }}
      >
        <meshStandardMaterial color={identified ? '#22c55e' : '#a16207'} />
      </RoundedBox>

      {/* Ladder leaning against door */}
      <group position={[0.6, 0, 0.3]} rotation={[0.25, 0.1, 0]}>
        <Box args={[0.04, 2, 0.04]} position={[-0.15, 1, 0]}>
          <meshStandardMaterial color="#a1a1aa" metalness={0.5} />
        </Box>
        <Box args={[0.04, 2, 0.04]} position={[0.15, 1, 0]}>
          <meshStandardMaterial color="#a1a1aa" metalness={0.5} />
        </Box>
        {[0.3, 0.6, 0.9, 1.2, 1.5, 1.8].map((y2, i) => (
          <Box key={i} args={[0.34, 0.03, 0.04]} position={[0, y2, 0]}>
            <meshStandardMaterial color="#a1a1aa" metalness={0.5} />
          </Box>
        ))}
      </group>

      {showHint && !identified && <pointLight position={[0, 1.2, 0.6]} color="#ef4444" intensity={4} distance={5} />}
    </group>
  );
};

// Dock edge missing safety signage (more realistic edge marking + fallen sign)
const DockEdgeSignageHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  const y = clampFloorY(hazard);

  return (
    <group
      position={[hazard.x, y, hazard.z]}
      onClick={(e) => {
        e.stopPropagation();
        if (!identified) onIdentify(hazard.id);
      }}
    >
      {/* Painted dock-edge warning band (diagonal stripes) */}
      <group position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <planeGeometry args={[3.0, 0.32]} />
          <meshStandardMaterial color={identified ? '#22c55e' : '#fbbf24'} roughness={0.75} />
        </mesh>
        {Array.from({ length: 10 }).map((_, i) => (
          <mesh key={i} position={[-1.35 + i * 0.3, 0.001, 0]} rotation={[0, 0, -0.6]}>
            <planeGeometry args={[0.14, 0.42]} />
            <meshStandardMaterial color="#111827" roughness={0.9} transparent opacity={identified ? 0.25 : 0.55} />
          </mesh>
        ))}
      </group>

      {/* Wall-mounted sign bracket (empty) */}
      <group position={[-0.9, 1.55, -0.35]}>
        <Box args={[0.55, 0.35, 0.02]}>
          <meshStandardMaterial color={identified ? '#22c55e' : '#374151'} transparent opacity={0.45} />
        </Box>
        <Cylinder args={[0.015, 0.015, 0.26, 10]} position={[-0.24, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.35} />
        </Cylinder>
        <Cylinder args={[0.015, 0.015, 0.26, 10]} position={[0.24, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.35} />
        </Cylinder>
      </group>

      {/* Fallen warning sign panel near the edge */}
      <group position={[0.55, 0.02, 0.35]} rotation={[-Math.PI / 2, 0, 0.35]}>
        <Box args={[0.62, 0.46, 0.03]}>
          <meshStandardMaterial color={identified ? '#22c55e' : '#fbbf24'} roughness={0.6} />
        </Box>
        {/* black border */}
        <Box args={[0.54, 0.38, 0.031]} position={[0, 0, 0.01]}>
          <meshStandardMaterial color="#111827" roughness={0.9} />
        </Box>
        {/* pictogram */}
        <Box args={[0.2, 0.2, 0.032]} position={[0, 0.02, 0.02]} rotation={[0, 0, Math.PI / 4]}>
          <meshStandardMaterial color={identified ? '#22c55e' : '#fbbf24'} />
        </Box>
      </group>

      {showHint && !identified && <pointLight position={[0.2, 0.7, 0.2]} color="#ef4444" intensity={4} distance={5} />}
    </group>
  );
};

// Detailed damaged forklift
const EquipmentHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  const bodyColor = identified ? '#22c55e' : '#fbbf24';
  const y = clampFloorY(hazard);

  return (
    <group
      position={[hazard.x, y, hazard.z]}
      onClick={(e) => {
        e.stopPropagation();
        if (!identified) onIdentify(hazard.id);
      }}
    >
      {/* Counterweight */}
      <RoundedBox args={[1.1, 0.5, 0.6]} position={[0, 0.35, -0.7]} radius={0.05}>
        <meshStandardMaterial color={bodyColor} metalness={0.3} roughness={0.7} />
      </RoundedBox>

      {/* Main body */}
      <RoundedBox args={[1.2, 0.6, 1.6]} position={[0, 0.5, 0]} radius={0.05}>
        <meshStandardMaterial color={bodyColor} metalness={0.3} roughness={0.7} />
      </RoundedBox>

      {/* Engine hood */}
      <RoundedBox args={[1.0, 0.3, 0.8]} position={[0, 0.95, -0.3]} radius={0.03}>
        <meshStandardMaterial color={bodyColor} metalness={0.4} />
      </RoundedBox>

      {/* Cab frame */}
      <Box args={[1.1, 0.08, 0.08]} position={[0, 1.8, -0.4]}>
        <meshStandardMaterial color="#1f2937" metalness={0.5} />
      </Box>
      <Box args={[0.08, 0.9, 0.08]} position={[-0.5, 1.35, -0.4]}>
        <meshStandardMaterial color="#1f2937" metalness={0.5} />
      </Box>
      <Box args={[0.08, 0.9, 0.08]} position={[0.5, 1.35, -0.4]}>
        <meshStandardMaterial color="#1f2937" metalness={0.5} />
      </Box>

      {/* Cab roof */}
      <Box args={[1.15, 0.05, 1]} position={[0, 1.83, -0.1]}>
        <meshStandardMaterial color="#374151" metalness={0.4} />
      </Box>

      {/* Seat */}
      <RoundedBox args={[0.5, 0.15, 0.5]} position={[0, 0.95, -0.1]} radius={0.03}>
        <meshStandardMaterial color="#1f2937" />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.5, 0.12]} position={[0, 1.25, -0.32]} radius={0.03}>
        <meshStandardMaterial color="#1f2937" />
      </RoundedBox>

      {/* Steering wheel */}
      <Cylinder args={[0.15, 0.15, 0.02, 16]} position={[0, 1.2, 0.25]} rotation={[-0.5, 0, 0]}>
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>

      {/* Mast - vertical rails */}
      <Box args={[0.1, 2.2, 0.08]} position={[-0.4, 1.1, 0.85]}>
        <meshStandardMaterial color="#4b5563" metalness={0.6} />
      </Box>
      <Box args={[0.1, 2.2, 0.08]} position={[0.4, 1.1, 0.85]}>
        <meshStandardMaterial color="#4b5563" metalness={0.6} />
      </Box>

      {/* Mast crossbars */}
      <Box args={[0.9, 0.08, 0.06]} position={[0, 0.5, 0.85]}>
        <meshStandardMaterial color="#4b5563" metalness={0.6} />
      </Box>
      <Box args={[0.9, 0.08, 0.06]} position={[0, 1.5, 0.85]}>
        <meshStandardMaterial color="#4b5563" metalness={0.6} />
      </Box>

      {/* Forks */}
      <Box args={[0.1, 0.06, 1.1]} position={[-0.25, 0.15, 1.4]}>
        <meshStandardMaterial color="#374151" metalness={0.5} />
      </Box>
      <Box args={[0.1, 0.06, 1.1]} position={[0.25, 0.15, 1.4]}>
        <meshStandardMaterial color="#374151" metalness={0.5} />
      </Box>

      {/* Good front wheels */}
      <group position={[-0.55, 0.2, 0.5]}>
        <Cylinder args={[0.2, 0.2, 0.15, 24]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#1f2937" roughness={0.8} />
        </Cylinder>
        <Cylinder args={[0.08, 0.08, 0.16, 12]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#4b5563" metalness={0.7} />
        </Cylinder>
      </group>
      <group position={[0.55, 0.2, 0.5]}>
        <Cylinder args={[0.2, 0.2, 0.15, 24]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#1f2937" roughness={0.8} />
        </Cylinder>
        <Cylinder args={[0.08, 0.08, 0.16, 12]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#4b5563" metalness={0.7} />
        </Cylinder>
      </group>

      {/* Good rear wheel */}
      <group position={[-0.45, 0.2, -0.6]}>
        <Cylinder args={[0.22, 0.22, 0.2, 24]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#1f2937" roughness={0.8} />
        </Cylinder>
      </group>

      {/* DAMAGED rear wheel - flat and leaking */}
      <group position={[0.45, 0.08, -0.6]}>
        <Cylinder
          args={[0.22, 0.22, 0.2, 24]}
          rotation={[0, 0, Math.PI / 2]}
          scale={[0.5, 1, 1]}
        >
          <meshStandardMaterial color={identified ? '#22c55e' : '#dc2626'} roughness={0.8} />
        </Cylinder>
        {/* Deflated rubber */}
        <Sphere args={[0.15, 8, 8]} position={[0, -0.05, 0]} scale={[0.5, 1, 1]}>
          <meshStandardMaterial color="#1f2937" />
        </Sphere>
        {/* Oil leak puddle */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.3, -0.07, 0]}>
          <circleGeometry args={[0.25, 16]} />
          <meshStandardMaterial
            color="#1e293b"
            transparent
            opacity={0.7}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* Warning light on top */}
      <Cylinder args={[0.08, 0.08, 0.08, 12]} position={[0, 1.9, -0.1]}>
        <meshStandardMaterial
          color={identified ? '#22c55e' : '#f97316'}
          emissive={identified ? '#22c55e' : '#f97316'}
          emissiveIntensity={0.5}
        />
      </Cylinder>

      {showHint && !identified && <pointLight position={[0.5, 0.5, -0.6]} color="#ef4444" intensity={4} distance={4} />}
    </group>
  );
};

// Flickering/broken industrial light (now properly mounted to ceiling)
const LightingHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const bulbRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!identified) {
      const flicker = Math.random() > 0.7 ? 0 : 1 + Math.random() * 0.5;
      if (lightRef.current) lightRef.current.intensity = flicker;
      if (bulbRef.current && bulbRef.current.material) {
        (bulbRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = flicker * 0.8;
      }
    }
  });

  const baseY = CEILING_Y;

  return (
    <group
      position={[hazard.x, baseY, hazard.z]}
      onClick={(e) => {
        e.stopPropagation();
        if (!identified) onIdentify(hazard.id);
      }}
    >
      {/* Suspension stem to ceiling */}
      <Cylinder args={[0.03, 0.03, 0.7, 10]} position={[0, 0.35, 0]}>
        <meshStandardMaterial color="#4b5563" metalness={0.6} roughness={0.35} />
      </Cylinder>
      {/* Ceiling junction box */}
      <Box args={[0.22, 0.08, 0.22]} position={[0, 0.74, 0]}>
        <meshStandardMaterial color="#374151" metalness={0.6} roughness={0.35} />
      </Box>

      {/* Light fixture housing */}
      <Box args={[1, 0.12, 0.35]} position={[0, -0.02, 0]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#6b7280'} metalness={0.4} />
      </Box>

      {/* Reflector */}
      <Box args={[0.9, 0.08, 0.3]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.3} />
      </Box>

      {/* Fluorescent tube - bulb */}
      <Cylinder
        ref={bulbRef}
        args={[0.04, 0.04, 0.85, 16]}
        rotation={[0, 0, Math.PI / 2]}
        position={[0, -0.18, 0]}
      >
        <meshStandardMaterial
          color={identified ? '#22c55e' : '#fef3c7'}
          emissive={identified ? '#22c55e' : '#fef3c7'}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </Cylinder>

      {/* End caps */}
      <Cylinder args={[0.05, 0.05, 0.03, 12]} rotation={[0, 0, Math.PI / 2]} position={[-0.44, -0.18, 0]}>
        <meshStandardMaterial color="#6b7280" />
      </Cylinder>
      <Cylinder args={[0.05, 0.05, 0.03, 12]} rotation={[0, 0, Math.PI / 2]} position={[0.44, -0.18, 0]}>
        <meshStandardMaterial color="#6b7280" />
      </Cylinder>

      {/* Exposed wiring hanging down */}
      <Cylinder args={[0.01, 0.01, 0.3, 8]} position={[0.3, -0.35, 0.1]} rotation={[0.3, 0, 0.2]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#1f2937'} />
      </Cylinder>

      {!identified && (
        <pointLight ref={lightRef} position={[0, -0.4, 0]} color="#fef3c7" intensity={1} distance={10} />
      )}

      {showHint && !identified && <pointLight position={[0, -0.6, 0]} color="#ef4444" intensity={3} distance={4} />}
    </group>
  );
};

// Missing PPE / Safety sign station (and other PPE-type set pieces)
const PPEHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  const y = clampFloorY(hazard);

  return (
    <group
      position={[hazard.x, y, hazard.z]}
      onClick={(e) => {
        e.stopPropagation();
        if (!identified) onIdentify(hazard.id);
      }}
    >
      {/* Sign post */}
      <Cylinder args={[0.04, 0.04, 1.8, 12]} position={[0, 0.9, 0]}>
        <meshStandardMaterial color="#6b7280" metalness={0.5} roughness={0.45} />
      </Cylinder>

      {/* Post base */}
      <Cylinder args={[0.15, 0.18, 0.05, 16]} position={[0, 0.025, 0]}>
        <meshStandardMaterial color="#4b5563" metalness={0.6} roughness={0.35} />
      </Cylinder>

      {/* Empty sign bracket */}
      <Box args={[0.55, 0.45, 0.04]} position={[0, 1.7, 0.05]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#374151'} transparent opacity={0.42} />
      </Box>

      {/* Screw holes visible */}
      {[[-0.2, 1.85], [0.2, 1.85], [-0.2, 1.55], [0.2, 1.55]].map(([x, y2], i) => (
        <Cylinder key={i} args={[0.02, 0.02, 0.06, 8]} position={[x, y2, 0.06]}>
          <meshStandardMaterial color="#111827" roughness={0.9} />
        </Cylinder>
      ))}

      {/* Fallen/damaged sign on ground */}
      <group position={[0.5, 0.03, 0.4]} rotation={[-Math.PI / 2, 0, 0.4]}>
        <Box args={[0.5, 0.4, 0.03]}>
          <meshStandardMaterial color={identified ? '#22c55e' : '#fbbf24'} roughness={0.6} />
        </Box>
        {/* PPE icons on sign */}
        <Cylinder args={[0.08, 0.08, 0.01, 12]} position={[-0.1, 0.05, 0.02]}>
          <meshStandardMaterial color="#111827" roughness={0.9} />
        </Cylinder>
        <Box args={[0.1, 0.1, 0.01]} position={[0.12, 0.05, 0.02]}>
          <meshStandardMaterial color="#111827" roughness={0.9} />
        </Box>
      </group>

      {/* Broken mounting hardware on ground */}
      <Box args={[0.08, 0.02, 0.04]} position={[0.3, 0.01, 0.2]} rotation={[0, 0.5, 0]}>
        <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.35} />
      </Box>

      {showHint && !identified && <pointLight position={[0, 1.5, 0.3]} color="#ef4444" intensity={3} distance={4} />}
    </group>
  );
};

// Safety shower / eyewash station obstructed (chemical zone)
const SafetyShowerHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  const y = clampFloorY(hazard);

  return (
    <group
      position={[hazard.x, y, hazard.z]}
      onClick={(e) => {
        e.stopPropagation();
        if (!identified) onIdentify(hazard.id);
      }}
    >
      {/* Backboard to imply wall mounting */}
      <Box args={[1.1, 2.4, 0.08]} position={[0, 1.2, -0.35]}>
        <meshStandardMaterial color="#374151" roughness={0.8} />
      </Box>

      {/* Vertical pipe */}
      <Cylinder args={[0.06, 0.06, 2.4, 16]} position={[-0.3, 1.2, -0.28]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#22c55e'} metalness={0.2} roughness={0.35} />
      </Cylinder>

      {/* Shower head */}
      <Cylinder args={[0.18, 0.18, 0.06, 20]} position={[-0.3, 2.35, -0.28]}>
        <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.25} />
      </Cylinder>
      <Cylinder args={[0.2, 0.06, 0.12, 20]} position={[-0.3, 2.26, -0.28]} rotation={[Math.PI, 0, 0]}>
        <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.25} />
      </Cylinder>

      {/* Eyewash bowl */}
      <Cylinder args={[0.28, 0.34, 0.18, 24]} position={[-0.3, 1.05, -0.22]}>
        <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.3} />
      </Cylinder>
      <Box args={[0.55, 0.06, 0.25]} position={[-0.3, 1.18, -0.12]}>
        <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.3} />
      </Box>

      {/* Pull rod */}
      <Cylinder args={[0.012, 0.012, 0.75, 10]} position={[-0.3, 1.95, -0.12]}>
        <meshStandardMaterial color="#fbbf24" metalness={0.2} roughness={0.55} />
      </Cylinder>
      <Box args={[0.12, 0.12, 0.12]} position={[-0.3, 1.57, -0.12]}>
        <meshStandardMaterial color="#fbbf24" roughness={0.6} />
      </Box>

      {/* Green safety sign */}
      <Box args={[0.55, 0.35, 0.02]} position={[0.4, 2.1, -0.3]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#22c55e'} emissive={identified ? '#22c55e' : '#16a34a'} emissiveIntensity={0.2} />
      </Box>
      <Box args={[0.18, 0.18, 0.021]} position={[0.4, 2.1, -0.28]} rotation={[0, 0, Math.PI / 4]}>
        <meshStandardMaterial color="#f8fafc" />
      </Box>

      {/* Obstruction: pallet + boxes blocking access */}
      <Box args={[1.1, 0.1, 0.8]} position={[0.2, 0.05, 0.2]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#a16207'} roughness={0.9} />
      </Box>
      <RoundedBox args={[0.55, 0.55, 0.55]} position={[0.2, 0.38, 0.2]} radius={0.03}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#b45309'} roughness={0.85} />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.4, 0.5]} position={[0.55, 0.75, 0.25]} radius={0.03} rotation={[0.05, 0.2, 0.08]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#92400e'} roughness={0.85} />
      </RoundedBox>

      {/* Larger invisible click target so it is easy to select */}
      <Box args={[2.2, 2.6, 1.8]} position={[0.1, 1.25, 0]} visible={false} />

      {showHint && !identified && <pointLight position={[0, 2.0, 0.2]} color="#ef4444" intensity={4} distance={5} />}
    </group>
  );
};

// Blocked fire extinguisher
const FireHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  const y = clampFloorY(hazard);

  return (
    <group
      position={[hazard.x, y, hazard.z]}
      onClick={(e) => {
        e.stopPropagation();
        if (!identified) onIdentify(hazard.id);
      }}
    >
      {/* Wall mount bracket */}
      <Box args={[0.35, 0.5, 0.06]} position={[0, 0.6, -0.17]}>
        <meshStandardMaterial color="#dc2626" />
      </Box>

      {/* Fire extinguisher body */}
      <Cylinder args={[0.1, 0.1, 0.55, 20]} position={[0, 0.55, -0.08]}>
        <meshStandardMaterial color="#dc2626" metalness={0.4} roughness={0.6} />
      </Cylinder>

      {/* Top valve */}
      <Cylinder args={[0.04, 0.04, 0.1, 12]} position={[0, 0.87, -0.08]}>
        <meshStandardMaterial color="#1f2937" metalness={0.6} />
      </Cylinder>

      {/* Hose */}
      <Cylinder args={[0.015, 0.015, 0.2, 8]} position={[0.08, 0.8, 0]} rotation={[0.5, 0, 0.5]}>
        <meshStandardMaterial color="#1f2937" />
      </Cylinder>

      {/* Pressure gauge */}
      <Cylinder args={[0.03, 0.03, 0.015, 12]} position={[0, 0.75, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#fef3c7" />
      </Cylinder>

      {/* Label */}
      <Box args={[0.12, 0.18, 0.005]} position={[0, 0.5, 0.02]}>
        <meshStandardMaterial color="#fef3c7" />
      </Box>

      {/* Blocking barrel 1 */}
      <Cylinder args={[0.32, 0.32, 0.85, 20]} position={[-0.4, 0.42, 0.45]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#3b82f6'} metalness={0.3} />
      </Cylinder>
      <Cylinder args={[0.28, 0.28, 0.02, 20]} position={[-0.4, 0.85, 0.45]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#1e40af'} metalness={0.5} />
      </Cylinder>

      {/* Blocking barrel 2 */}
      <Cylinder args={[0.32, 0.32, 0.85, 20]} position={[0.4, 0.42, 0.5]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#3b82f6'} metalness={0.3} />
      </Cylinder>
      <Cylinder args={[0.28, 0.28, 0.02, 20]} position={[0.4, 0.85, 0.5]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#1e40af'} metalness={0.5} />
      </Cylinder>

      {/* Box on top of barrels */}
      <RoundedBox args={[0.5, 0.35, 0.4]} position={[0, 1.1, 0.48]} radius={0.02}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#92400e'} />
      </RoundedBox>

      {showHint && !identified && <pointLight position={[0, 1.2, 0.4]} color="#ef4444" intensity={4} distance={5} />}
    </group>
  );
};

// Exposed electrical panel with sparking wires (snapped to a wall)
const ElectricalHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  const sparkRef = useRef<THREE.PointLight>(null);
  const sparkMeshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!identified) {
      const spark = Math.random() > 0.85 ? 5 : 0;
      if (sparkRef.current) sparkRef.current.intensity = spark;
      if (sparkMeshRef.current) {
        sparkMeshRef.current.scale.setScalar(spark > 0 ? 1 + Math.random() : 0);
      }
    }
  });

  const y = clampFloorY(hazard);
  const snapped = snapToWall(hazard);

  return (
    <group
      position={[snapped.position[0], y, snapped.position[2]]}
      rotation={[0, snapped.rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        if (!identified) onIdentify(hazard.id);
      }}
    >
      {/* Backplate to visually "stick" to the wall */}
      <Box args={[0.78, 1.0, 0.02]} position={[0, 0.55, -0.11]}>
        <meshStandardMaterial color="#111827" roughness={0.8} />
      </Box>
      {/* Electrical panel box */}
      <RoundedBox args={[0.7, 0.9, 0.2]} position={[0, 0.5, 0]} radius={0.02}>
        <meshStandardMaterial color="#374151" metalness={0.4} roughness={0.6} />
      </RoundedBox>

      {/* Panel door - open */}
      <RoundedBox
        args={[0.65, 0.85, 0.03]}
        position={[-0.35, 0.5, 0.15]}
        rotation={[0, -0.8, 0]}
        radius={0.02}
      >
        <meshStandardMaterial color="#4b5563" metalness={0.5} />
      </RoundedBox>

      {/* Door handle */}
      <Box args={[0.03, 0.1, 0.03]} position={[-0.6, 0.5, 0.25]}>
        <meshStandardMaterial color="#6b7280" metalness={0.7} />
      </Box>

      {/* Interior - circuit breakers */}
      {[0.2, 0.35, 0.5, 0.65, 0.8].map((y2, i) => (
        <Box key={i} args={[0.5, 0.08, 0.02]} position={[0, y2, 0.06]}>
          <meshStandardMaterial color="#1f2937" />
        </Box>
      ))}

      {/* Exposed wires - DANGER */}
      <Cylinder args={[0.02, 0.02, 0.45, 8]} position={[0.15, 0.25, 0.15]} rotation={[0.6, 0, 0.4]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#f97316'} />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 0.4, 8]} position={[-0.1, 0.2, 0.18]} rotation={[0.4, 0, -0.5]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#3b82f6'} />
      </Cylinder>
      <Cylinder args={[0.02, 0.02, 0.35, 8]} position={[0.05, 0.15, 0.12]} rotation={[0.8, 0, 0.1]}>
        <meshStandardMaterial color={identified ? '#22c55e' : '#22c55e'} />
      </Cylinder>

      {/* Spark point */}
      <Sphere ref={sparkMeshRef} args={[0.05, 8, 8]} position={[0.1, 0.15, 0.25]}>
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#60a5fa"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Warning label */}
      <Box args={[0.25, 0.25, 0.005]} position={[0, 1.05, 0.02]}>
        <meshStandardMaterial color="#fbbf24" />
      </Box>
      <Box args={[0.15, 0.08, 0.006]} position={[0, 1.05, 0.025]}>
        <meshStandardMaterial color="#1f2937" />
      </Box>

      {/* Conduit coming from panel */}
      <Cylinder args={[0.03, 0.03, 0.6, 8]} position={[0.25, 1.2, 0]} rotation={[0, 0, 0.2]}>
        <meshStandardMaterial color="#6b7280" metalness={0.5} />
      </Cylinder>

      {!identified && <pointLight ref={sparkRef} position={[0.1, 0.2, 0.2]} color="#60a5fa" intensity={0} distance={3} />}

      {showHint && !identified && <pointLight position={[0, 0.5, 0.3]} color="#ef4444" intensity={4} distance={4} />}
    </group>
  );
};

// Chemical leak from drum with vapor
const ChemicalHazard = ({ hazard, identified, onIdentify, showHint }: RealisticHazardProps) => {
  const vaporRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (vaporRef.current && !identified) {
      vaporRef.current.children.forEach((child, i) => {
        child.position.y = 0.2 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.1;

        const mesh = child as THREE.Mesh;
        const material = Array.isArray(mesh.material)
          ? (mesh.material[0] as THREE.MeshStandardMaterial | undefined)
          : (mesh.material as THREE.MeshStandardMaterial | undefined);

        if (material) {
          material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3 + i * 0.5) * 0.15;
        }
      });
    }
  });

  const y = clampFloorY(hazard);

  return (
    <group
      position={[hazard.x, y, hazard.z]}
      onClick={(e) => {
        e.stopPropagation();
        if (!identified) onIdentify(hazard.id);
      }}
    >
      {/* Tilted chemical drum */}
      <group rotation={[0.18, 0, 0.12]}>
        <Cylinder args={[0.35, 0.35, 0.95, 24]} position={[0, 0.48, 0]}>
          <meshStandardMaterial color={identified ? '#22c55e' : '#dc2626'} metalness={0.4} roughness={0.6} />
        </Cylinder>

        {/* Drum ridges */}
        <Cylinder args={[0.36, 0.36, 0.04, 24]} position={[0, 0.1, 0]}>
          <meshStandardMaterial color={identified ? '#22c55e' : '#b91c1c'} metalness={0.5} />
        </Cylinder>
        <Cylinder args={[0.36, 0.36, 0.04, 24]} position={[0, 0.85, 0]}>
          <meshStandardMaterial color={identified ? '#22c55e' : '#b91c1c'} metalness={0.5} />
        </Cylinder>

        {/* Top lid */}
        <Cylinder args={[0.33, 0.33, 0.03, 24]} position={[0, 0.97, 0]}>
          <meshStandardMaterial color={identified ? '#22c55e' : '#991b1b'} metalness={0.6} />
        </Cylinder>

        {/* Hazmat diamond label */}
        <Box args={[0.2, 0.2, 0.01]} position={[0, 0.5, 0.36]} rotation={[0, 0, Math.PI / 4]}>
          <meshStandardMaterial color="#fbbf24" />
        </Box>
        <Box args={[0.1, 0.1, 0.011]} position={[0, 0.5, 0.365]} rotation={[0, 0, Math.PI / 4]}>
          <meshStandardMaterial color="#dc2626" />
        </Box>

        {/* Leak point */}
        <Sphere args={[0.04, 8, 8]} position={[0.25, 0.2, 0.2]}>
          <meshStandardMaterial color="#22c55e" transparent opacity={0.8} />
        </Sphere>
      </group>

      {/* Chemical spill on floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.6, 0.01, 0.6]}>
        <circleGeometry args={[hazard.size || 1.3, 48]} />
        <meshStandardMaterial
          color={identified ? '#22c55e' : '#22c55e'}
          transparent
          opacity={0.65}
          emissive={identified ? '#22c55e' : '#22c55e'}
          emissiveIntensity={0.2}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Trail from drum to puddle */}
      <mesh rotation={[-Math.PI / 2, 0, 0.5]} position={[0.3, 0.008, 0.3]}>
        <planeGeometry args={[0.15, 0.5]} />
        <meshStandardMaterial color="#22c55e" transparent opacity={0.5} />
      </mesh>

      {/* Vapor effect */}
      {!identified && (
        <group ref={vaporRef} position={[0.5, 0.2, 0.5]}>
          {[0, 1, 2].map((i) => (
            <Sphere key={i} args={[0.15, 8, 8]} position={[i * 0.2 - 0.2, 0, i * 0.1]}>
              <meshStandardMaterial color="#22c55e" transparent opacity={0.3} />
            </Sphere>
          ))}
        </group>
      )}

      {showHint && !identified && <pointLight position={[0.4, 0.4, 0.4]} color="#ef4444" intensity={4} distance={5} />}
    </group>
  );
};

export const RealisticHazard = (props: RealisticHazardProps) => {
  const { hazard } = props;
  const desc = hazard.description?.toLowerCase?.() || '';

  switch (hazard.type) {
    case 'spill':
      return <SpillHazard {...props} />;
    case 'stacking':
      // Chemical scene: place the "chemical containers" stack on an upper rack.
      return <StackingHazard {...props} />;
    case 'exit':
      return <BlockedExitHazard {...props} />;
    case 'equipment':
      return <EquipmentHazard {...props} />;
    case 'lighting':
      return <LightingHazard {...props} />;
    case 'ppe':
      // In loading bays, some scenarios are about missing dock-edge warning signage.
      if (desc.includes('dock') || desc.includes('dock edge') || desc.includes('edge')) {
        return <DockEdgeSignageHazard {...props} />;
      }
      if (desc.includes('safety shower') || desc.includes('shower') || desc.includes('eyewash')) {
        return <SafetyShowerHazard {...props} />;
      }
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

