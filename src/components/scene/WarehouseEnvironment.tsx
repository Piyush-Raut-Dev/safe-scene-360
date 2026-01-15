import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface WarehouseEnvironmentProps {
  sceneType: 'storage' | 'loading' | 'chemical';
}

// Industrial Shelving Unit
const ShelvingUnit = ({ position, rotation = 0 }: { position: [number, number, number], rotation?: number }) => {
  const boxes = useMemo(() => {
    const boxConfigs: Array<{ pos: [number, number, number], size: [number, number, number], color: string }> = [];
    const colors = ['#b45309', '#1d4ed8', '#059669', '#7c3aed', '#dc2626', '#0891b2'];
    
    for (let shelf = 0; shelf < 4; shelf++) {
      const numBoxes = 2 + Math.floor(Math.random() * 3);
      let xOffset = -1;
      for (let i = 0; i < numBoxes; i++) {
        const width = 0.3 + Math.random() * 0.4;
        const height = 0.3 + Math.random() * 0.4;
        const depth = 0.3 + Math.random() * 0.3;
        boxConfigs.push({
          pos: [xOffset + width / 2, shelf * 1.2 + height / 2, 0],
          size: [width, height, depth],
          color: colors[Math.floor(Math.random() * colors.length)]
        });
        xOffset += width + 0.1;
      }
    }
    return boxConfigs;
  }, []);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Vertical posts */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <Box key={`post-${i}`} args={[0.08, 5, 0.08]} position={[x, 2.5, 0]}>
          <meshStandardMaterial color="#1e40af" metalness={0.6} roughness={0.4} />
        </Box>
      ))}
      {/* Horizontal beams */}
      {[0, 1.2, 2.4, 3.6, 4.8].map((y, i) => (
        <Box key={`beam-${i}`} args={[3.08, 0.06, 0.8]} position={[0, y, 0]}>
          <meshStandardMaterial color="#374151" metalness={0.3} roughness={0.6} />
        </Box>
      ))}
      {/* Boxes on shelves */}
      {boxes.map((box, i) => (
        <Box key={`box-${i}`} args={box.size} position={box.pos}>
          <meshStandardMaterial color={box.color} />
        </Box>
      ))}
    </group>
  );
};

// Pallet with boxes
const Pallet = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Pallet base */}
    <Box args={[1.2, 0.12, 1.2]} position={[0, 0.06, 0]}>
      <meshStandardMaterial color="#a16207" />
    </Box>
    {/* Slats */}
    {[-0.4, 0, 0.4].map((x, i) => (
      <Box key={i} args={[0.1, 0.08, 1.2]} position={[x, -0.02, 0]}>
        <meshStandardMaterial color="#854d0e" />
      </Box>
    ))}
    {/* Stacked boxes */}
    <Box args={[1, 0.5, 1]} position={[0, 0.37, 0]}>
      <meshStandardMaterial color="#b45309" />
    </Box>
    <Box args={[0.9, 0.4, 0.9]} position={[0.05, 0.82, 0.05]}>
      <meshStandardMaterial color="#92400e" />
    </Box>
  </group>
);

// Concrete pillar
const Pillar = ({ position }: { position: [number, number, number] }) => (
  <Box args={[0.6, 6, 0.6]} position={[position[0], 3, position[2]]}>
    <meshStandardMaterial color="#6b7280" roughness={0.9} />
  </Box>
);

// Industrial light fixture
const CeilingLight = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <Box args={[1.5, 0.1, 0.4]} position={[0, 0, 0]}>
      <meshStandardMaterial color="#374151" metalness={0.5} />
    </Box>
    <Box args={[1.2, 0.05, 0.3]} position={[0, -0.08, 0]}>
      <meshStandardMaterial 
        color="#fef9c3" 
        emissive="#fef9c3" 
        emissiveIntensity={0.5}
        transparent
        opacity={0.9}
      />
    </Box>
    <pointLight position={[0, -0.5, 0]} color="#fff7ed" intensity={15} distance={12} decay={2} />
  </group>
);

// Loading dock door
const DockDoor = ({ position, open = false }: { position: [number, number, number], open?: boolean }) => (
  <group position={position}>
    {/* Door frame */}
    <Box args={[0.15, 4, 4]} position={[-2, 2, 0]}>
      <meshStandardMaterial color="#374151" />
    </Box>
    <Box args={[0.15, 4, 4]} position={[2, 2, 0]}>
      <meshStandardMaterial color="#374151" />
    </Box>
    <Box args={[4.15, 0.2, 4]} position={[0, 4.1, 0]}>
      <meshStandardMaterial color="#374151" />
    </Box>
    {/* Door panels */}
    {!open && (
      <Box args={[3.8, 3.8, 0.1]} position={[0, 1.95, 0]}>
        <meshStandardMaterial color="#64748b" metalness={0.4} />
      </Box>
    )}
    {open && (
      <Box args={[3.8, 0.5, 0.1]} position={[0, 3.75, 0]}>
        <meshStandardMaterial color="#64748b" metalness={0.4} />
      </Box>
    )}
  </group>
);

// Chemical barrel
const ChemicalBarrel = ({ position, color = '#dc2626' }: { position: [number, number, number], color?: string }) => (
  <group position={position}>
    <Cylinder args={[0.35, 0.35, 0.9, 16]} position={[0, 0.45, 0]}>
      <meshStandardMaterial color={color} />
    </Cylinder>
    {/* Hazmat label */}
    <Box args={[0.2, 0.2, 0.01]} position={[0, 0.5, 0.36]}>
      <meshStandardMaterial color="#fbbf24" />
    </Box>
  </group>
);

// Safety equipment station
const SafetyStation = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Cabinet */}
    <Box args={[1, 1.5, 0.3]} position={[0, 1.25, 0]}>
      <meshStandardMaterial color="#dc2626" />
    </Box>
    {/* Cross symbol */}
    <Box args={[0.4, 0.1, 0.02]} position={[0, 1.3, 0.16]}>
      <meshStandardMaterial color="#ffffff" />
    </Box>
    <Box args={[0.1, 0.4, 0.02]} position={[0, 1.3, 0.16]}>
      <meshStandardMaterial color="#ffffff" />
    </Box>
  </group>
);

export const WarehouseEnvironment = ({ sceneType }: WarehouseEnvironmentProps) => {
  const wallColor = sceneType === 'chemical' ? '#1e293b' : '#e2e8f0';
  const floorColor = sceneType === 'chemical' ? '#1e3a5f' : '#64748b';
  
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color={floorColor} roughness={0.8} />
      </mesh>
      
      {/* Floor markings - safety lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[8, 8.2, 64]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      
      {/* Walls */}
      <Box args={[30, 7, 0.3]} position={[0, 3.5, -15]}>
        <meshStandardMaterial color={wallColor} />
      </Box>
      <Box args={[30, 7, 0.3]} position={[0, 3.5, 15]}>
        <meshStandardMaterial color={wallColor} />
      </Box>
      <Box args={[0.3, 7, 30]} position={[-15, 3.5, 0]}>
        <meshStandardMaterial color={wallColor} />
      </Box>
      <Box args={[0.3, 7, 30]} position={[15, 3.5, 0]}>
        <meshStandardMaterial color={wallColor} />
      </Box>
      
      {/* Ceiling with industrial look */}
      <Box args={[30, 0.2, 30]} position={[0, 6.9, 0]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      
      {/* Ceiling beams */}
      {[-10, -5, 0, 5, 10].map((x, i) => (
        <Box key={`beam-x-${i}`} args={[0.3, 0.5, 30]} position={[x, 6.6, 0]}>
          <meshStandardMaterial color="#1f2937" metalness={0.3} />
        </Box>
      ))}
      {[-10, -5, 0, 5, 10].map((z, i) => (
        <Box key={`beam-z-${i}`} args={[30, 0.3, 0.2]} position={[0, 6.4, z]}>
          <meshStandardMaterial color="#1f2937" metalness={0.3} />
        </Box>
      ))}
      
      {/* Ceiling lights */}
      {[-8, 0, 8].map((x) =>
        [-8, 0, 8].map((z) => (
          <CeilingLight key={`light-${x}-${z}`} position={[x, 6.3, z]} />
        ))
      )}
      
      {/* Pillars */}
      {[-7, 7].map((x) =>
        [-7, 7].map((z) => (
          <Pillar key={`pillar-${x}-${z}`} position={[x, 0, z]} />
        ))
      )}
      
      {/* Scene-specific elements */}
      {sceneType === 'storage' && (
        <>
          {/* Shelving rows */}
          <ShelvingUnit position={[-10, 0, -10]} rotation={0} />
          <ShelvingUnit position={[-10, 0, -5]} rotation={0} />
          <ShelvingUnit position={[-10, 0, 0]} rotation={0} />
          <ShelvingUnit position={[10, 0, -10]} rotation={Math.PI} />
          <ShelvingUnit position={[10, 0, -5]} rotation={Math.PI} />
          <ShelvingUnit position={[10, 0, 0]} rotation={Math.PI} />
          
          {/* Pallets */}
          <Pallet position={[0, 0, -8]} />
          <Pallet position={[3, 0, -8]} />
          <Pallet position={[-3, 0, 8]} />
          
          {/* Safety station */}
          <SafetyStation position={[-14.5, 0, 5]} />
        </>
      )}
      
      {sceneType === 'loading' && (
        <>
          {/* Dock doors */}
          <DockDoor position={[0, 0, -14.7]} open />
          <DockDoor position={[-8, 0, -14.7]} />
          <DockDoor position={[8, 0, -14.7]} open />
          
          {/* Pallets near docks */}
          <Pallet position={[-2, 0, -8]} />
          <Pallet position={[2, 0, -8]} />
          <Pallet position={[5, 0, -6]} />
          <Pallet position={[-8, 0, 5]} />
          
          {/* Some shelving */}
          <ShelvingUnit position={[-12, 0, 8]} />
          <ShelvingUnit position={[12, 0, 8]} rotation={Math.PI} />
        </>
      )}
      
      {sceneType === 'chemical' && (
        <>
          {/* Chemical storage racks */}
          <ShelvingUnit position={[-10, 0, -8]} />
          <ShelvingUnit position={[10, 0, -8]} rotation={Math.PI} />
          
          {/* Chemical barrels */}
          <ChemicalBarrel position={[-5, 0, -5]} color="#dc2626" />
          <ChemicalBarrel position={[-4, 0, -5]} color="#dc2626" />
          <ChemicalBarrel position={[-4.5, 0, -4]} color="#eab308" />
          <ChemicalBarrel position={[5, 0, -5]} color="#22c55e" />
          <ChemicalBarrel position={[6, 0, -5]} color="#22c55e" />
          <ChemicalBarrel position={[5.5, 0, -4]} color="#3b82f6" />
          
          {/* Safety equipment */}
          <SafetyStation position={[-14.5, 0, 0]} />
          <SafetyStation position={[14.5, 0, 0]} />
          
          {/* Warning stripes on floor */}
          {[-6, 6].map((x) => (
            <mesh key={`stripe-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, -5]}>
              <planeGeometry args={[4, 4]} />
              <meshStandardMaterial color="#fbbf24" transparent opacity={0.3} />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
};
