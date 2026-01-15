import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Cylinder, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface WarehouseEnvironmentProps {
  sceneType: 'storage' | 'loading' | 'chemical';
}

// Industrial Shelving Unit with realistic details
const ShelvingUnit = ({ position, rotation = 0 }: { position: [number, number, number], rotation?: number }) => {
  const boxes = useMemo(() => {
    const boxConfigs: Array<{ pos: [number, number, number], size: [number, number, number], color: string }> = [];
    const colors = ['#b45309', '#1d4ed8', '#059669', '#7c3aed', '#dc2626', '#0891b2', '#a16207', '#4338ca'];
    
    for (let shelf = 0; shelf < 4; shelf++) {
      const numBoxes = 2 + Math.floor(Math.random() * 3);
      let xOffset = -1.2;
      for (let i = 0; i < numBoxes; i++) {
        const width = 0.35 + Math.random() * 0.35;
        const height = 0.3 + Math.random() * 0.35;
        const depth = 0.35 + Math.random() * 0.25;
        boxConfigs.push({
          pos: [xOffset + width / 2, shelf * 1.25 + 0.15 + height / 2, 0],
          size: [width, height, depth],
          color: colors[Math.floor(Math.random() * colors.length)]
        });
        xOffset += width + 0.08;
      }
    }
    return boxConfigs;
  }, []);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Vertical posts - Industrial blue racking */}
      {[-1.6, -0.53, 0.53, 1.6].map((x, i) => (
        <RoundedBox key={`post-${i}`} args={[0.1, 5.2, 0.1]} position={[x, 2.6, 0]} radius={0.01}>
          <meshStandardMaterial color="#1e40af" metalness={0.7} roughness={0.3} />
        </RoundedBox>
      ))}
      
      {/* Cross braces for realism */}
      {[-1.06, 1.06].map((x, xi) => 
        [1, 2.5, 4].map((y, yi) => (
          <Box key={`brace-${xi}-${yi}`} args={[0.02, 0.6, 0.04]} position={[x, y, 0]} rotation={[0, 0, xi === 0 ? 0.3 : -0.3]}>
            <meshStandardMaterial color="#1e40af" metalness={0.6} />
          </Box>
        ))
      )}
      
      {/* Horizontal beams with lip */}
      {[0.15, 1.4, 2.65, 3.9, 5.1].map((y, i) => (
        <group key={`beam-${i}`}>
          <Box args={[3.3, 0.08, 0.9]} position={[0, y, 0]}>
            <meshStandardMaterial color="#f97316" metalness={0.4} roughness={0.5} />
          </Box>
          {/* Front lip */}
          <Box args={[3.3, 0.1, 0.04]} position={[0, y + 0.04, 0.47]}>
            <meshStandardMaterial color="#ea580c" metalness={0.5} />
          </Box>
        </group>
      ))}
      
      {/* Boxes on shelves */}
      {boxes.map((box, i) => (
        <RoundedBox key={`box-${i}`} args={box.size} position={box.pos} radius={0.02}>
          <meshStandardMaterial color={box.color} roughness={0.8} />
        </RoundedBox>
      ))}
      
      {/* Pallet on bottom shelf */}
      <group position={[0, 0.08, 0]}>
        <Box args={[1.2, 0.1, 0.8]}>
          <meshStandardMaterial color="#a16207" />
        </Box>
      </group>
    </group>
  );
};

// Realistic pallet with wrapped goods
const Pallet = ({ position, hasWrap = false }: { position: [number, number, number], hasWrap?: boolean }) => (
  <group position={position}>
    {/* Pallet boards - top */}
    {[-0.4, -0.2, 0, 0.2, 0.4].map((x, i) => (
      <Box key={`top-${i}`} args={[0.18, 0.025, 1]} position={[x, 0.125, 0]}>
        <meshStandardMaterial color="#a16207" roughness={0.9} />
      </Box>
    ))}
    
    {/* Pallet stringers */}
    {[-0.35, 0, 0.35].map((x, i) => (
      <Box key={`stringer-${i}`} args={[0.1, 0.08, 1]} position={[x, 0.075, 0]}>
        <meshStandardMaterial color="#854d0e" roughness={0.85} />
      </Box>
    ))}
    
    {/* Bottom boards */}
    {[-0.4, 0, 0.4].map((x, i) => (
      <Box key={`bottom-${i}`} args={[0.18, 0.02, 1]} position={[x, 0.02, 0]}>
        <meshStandardMaterial color="#a16207" roughness={0.9} />
      </Box>
    ))}
    
    {/* Stacked goods */}
    <RoundedBox args={[0.9, 0.6, 0.9]} position={[0, 0.44, 0]} radius={0.02}>
      <meshStandardMaterial color={hasWrap ? "#e2e8f0" : "#b45309"} roughness={hasWrap ? 0.3 : 0.8} />
    </RoundedBox>
    
    {hasWrap && (
      <RoundedBox args={[0.85, 0.55, 0.85]} position={[0, 0.92, 0]} radius={0.02}>
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} transparent opacity={0.9} />
      </RoundedBox>
    )}
  </group>
);

// Concrete pillar with industrial details
const Pillar = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <RoundedBox args={[0.6, 6.5, 0.6]} position={[0, 3.25, 0]} radius={0.02}>
      <meshStandardMaterial color="#78716c" roughness={0.95} />
    </RoundedBox>
    {/* Yellow safety stripes at base */}
    <Box args={[0.62, 0.8, 0.62]} position={[0, 0.4, 0]}>
      <meshStandardMaterial color="#fbbf24" />
    </Box>
    <Box args={[0.63, 0.15, 0.63]} position={[0, 0.6, 0]}>
      <meshStandardMaterial color="#1f2937" />
    </Box>
    <Box args={[0.63, 0.15, 0.63]} position={[0, 0.3, 0]}>
      <meshStandardMaterial color="#1f2937" />
    </Box>
  </group>
);

// Industrial high-bay light fixture
const CeilingLight = ({ position, on = true }: { position: [number, number, number], on?: boolean }) => (
  <group position={position}>
    {/* Mounting bar */}
    <Box args={[0.1, 0.3, 0.1]} position={[0, 0.15, 0]}>
      <meshStandardMaterial color="#374151" metalness={0.6} />
    </Box>
    
    {/* Housing */}
    <Cylinder args={[0.25, 0.35, 0.2, 16]} position={[0, -0.1, 0]}>
      <meshStandardMaterial color="#4b5563" metalness={0.5} roughness={0.4} />
    </Cylinder>
    
    {/* Lens */}
    <Cylinder args={[0.3, 0.3, 0.05, 16]} position={[0, -0.22, 0]}>
      <meshStandardMaterial 
        color="#fef9c3" 
        emissive={on ? "#fef9c3" : "#000000"}
        emissiveIntensity={on ? 0.5 : 0}
        transparent
        opacity={0.95}
      />
    </Cylinder>
    
    {on && <pointLight position={[0, -0.5, 0]} color="#fff7ed" intensity={20} distance={14} decay={2} />}
  </group>
);

// Industrial loading dock door
const DockDoor = ({ position, open = false }: { position: [number, number, number], open?: boolean }) => (
  <group position={position}>
    {/* Door frame */}
    <Box args={[0.2, 4.2, 0.3]} position={[-2.1, 2.1, 0]}>
      <meshStandardMaterial color="#374151" metalness={0.4} />
    </Box>
    <Box args={[0.2, 4.2, 0.3]} position={[2.1, 2.1, 0]}>
      <meshStandardMaterial color="#374151" metalness={0.4} />
    </Box>
    <Box args={[4.4, 0.25, 0.3]} position={[0, 4.25, 0]}>
      <meshStandardMaterial color="#374151" metalness={0.4} />
    </Box>
    
    {/* Door panels - sectional */}
    {!open && [0.5, 1.5, 2.5, 3.5].map((y, i) => (
      <Box key={i} args={[3.9, 0.95, 0.1]} position={[0, y, 0]}>
        <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.6} />
      </Box>
    ))}
    
    {open && (
      <>
        <Box args={[3.9, 0.6, 0.1]} position={[0, 3.9, 0]}>
          <meshStandardMaterial color="#64748b" metalness={0.5} />
        </Box>
        {/* Daylight coming in */}
        <pointLight position={[0, 2, -2]} color="#87ceeb" intensity={15} distance={10} />
      </>
    )}
    
    {/* Yellow safety bumpers */}
    <Cylinder args={[0.1, 0.1, 0.8, 12]} position={[-1.8, 0.4, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="#fbbf24" />
    </Cylinder>
    <Cylinder args={[0.1, 0.1, 0.8, 12]} position={[1.8, 0.4, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="#fbbf24" />
    </Cylinder>
  </group>
);

// Chemical barrel with proper labeling
const ChemicalBarrel = ({ position, color = '#dc2626' }: { position: [number, number, number], color?: string }) => (
  <group position={position}>
    <Cylinder args={[0.32, 0.32, 0.9, 20]} position={[0, 0.45, 0]}>
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.6} />
    </Cylinder>
    {/* Ridges */}
    <Cylinder args={[0.34, 0.34, 0.04, 20]} position={[0, 0.1, 0]}>
      <meshStandardMaterial color={color} metalness={0.4} />
    </Cylinder>
    <Cylinder args={[0.34, 0.34, 0.04, 20]} position={[0, 0.8, 0]}>
      <meshStandardMaterial color={color} metalness={0.4} />
    </Cylinder>
    {/* Hazmat label */}
    <Box args={[0.2, 0.2, 0.01]} position={[0, 0.5, 0.33]} rotation={[0, 0, Math.PI / 4]}>
      <meshStandardMaterial color="#fbbf24" />
    </Box>
    {/* Lid */}
    <Cylinder args={[0.3, 0.3, 0.03, 20]} position={[0, 0.92, 0]}>
      <meshStandardMaterial color={color} metalness={0.5} />
    </Cylinder>
  </group>
);

// First aid / Safety equipment station
const SafetyStation = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    {/* Cabinet */}
    <RoundedBox args={[0.6, 0.8, 0.2]} position={[0, 1.4, 0]} radius={0.02}>
      <meshStandardMaterial color="#dc2626" />
    </RoundedBox>
    {/* White cross */}
    <Box args={[0.3, 0.08, 0.02]} position={[0, 1.4, 0.11]}>
      <meshStandardMaterial color="#ffffff" />
    </Box>
    <Box args={[0.08, 0.3, 0.02]} position={[0, 1.4, 0.11]}>
      <meshStandardMaterial color="#ffffff" />
    </Box>
    {/* Door handle */}
    <Cylinder args={[0.02, 0.02, 0.15, 8]} position={[0.2, 1.4, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial color="#fef3c7" metalness={0.7} />
    </Cylinder>
  </group>
);

// Forklift - parked/static
const Forklift = ({ position, rotation = 0 }: { position: [number, number, number], rotation?: number }) => (
  <group position={position} rotation={[0, rotation, 0]}>
    {/* Body */}
    <RoundedBox args={[1.1, 0.5, 1.5]} position={[0, 0.4, 0]} radius={0.05}>
      <meshStandardMaterial color="#fbbf24" metalness={0.3} roughness={0.7} />
    </RoundedBox>
    {/* Counterweight */}
    <RoundedBox args={[1, 0.4, 0.5]} position={[0, 0.35, -0.65]} radius={0.03}>
      <meshStandardMaterial color="#fbbf24" metalness={0.3} />
    </RoundedBox>
    {/* Cab */}
    <Box args={[0.95, 0.9, 0.7]} position={[0, 1.1, -0.2]}>
      <meshStandardMaterial color="#fbbf24" metalness={0.2} />
    </Box>
    {/* Roof */}
    <Box args={[1.05, 0.05, 0.9]} position={[0, 1.6, -0.1]}>
      <meshStandardMaterial color="#374151" />
    </Box>
    {/* Mast */}
    <Box args={[0.08, 1.8, 0.06]} position={[-0.35, 0.9, 0.7]}>
      <meshStandardMaterial color="#4b5563" metalness={0.6} />
    </Box>
    <Box args={[0.08, 1.8, 0.06]} position={[0.35, 0.9, 0.7]}>
      <meshStandardMaterial color="#4b5563" metalness={0.6} />
    </Box>
    {/* Forks */}
    <Box args={[0.08, 0.05, 0.9]} position={[-0.2, 0.12, 1.1]}>
      <meshStandardMaterial color="#374151" metalness={0.5} />
    </Box>
    <Box args={[0.08, 0.05, 0.9]} position={[0.2, 0.12, 1.1]}>
      <meshStandardMaterial color="#374151" metalness={0.5} />
    </Box>
    {/* Wheels */}
    {[[-0.5, 0.6], [0.5, 0.6], [-0.4, -0.5], [0.4, -0.5]].map(([x, z], i) => (
      <Cylinder key={i} args={[0.18, 0.18, 0.12, 16]} position={[x, 0.18, z]} rotation={[0, 0, Math.PI / 2]}>
        <meshStandardMaterial color="#1f2937" roughness={0.9} />
      </Cylinder>
    ))}
  </group>
);

export const WarehouseEnvironment = ({ sceneType }: WarehouseEnvironmentProps) => {
  const wallColor = sceneType === 'chemical' ? '#1e293b' : '#cbd5e1';
  const floorColor = sceneType === 'chemical' ? '#1e3a5f' : '#64748b';
  
  return (
    <group>
      {/* Concrete Floor with markings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[32, 32]} />
        <meshStandardMaterial color={floorColor} roughness={0.85} />
      </mesh>
      
      {/* Floor safety lines - walkway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[7, 7.15, 64]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      
      {/* Yellow pedestrian walkway lines */}
      {[-12, 12].map((x) => (
        <Box key={`line-${x}`} args={[0.15, 0.01, 28]} position={[x, 0.005, 0]}>
          <meshStandardMaterial color="#fbbf24" />
        </Box>
      ))}
      
      {/* Walls with industrial paneling */}
      {[
        { pos: [0, 3.5, -16] as [number, number, number], size: [32, 7.5, 0.3] as [number, number, number] },
        { pos: [0, 3.5, 16] as [number, number, number], size: [32, 7.5, 0.3] as [number, number, number] },
        { pos: [-16, 3.5, 0] as [number, number, number], size: [0.3, 7.5, 32] as [number, number, number] },
        { pos: [16, 3.5, 0] as [number, number, number], size: [0.3, 7.5, 32] as [number, number, number] },
      ].map((wall, i) => (
        <Box key={`wall-${i}`} args={wall.size} position={wall.pos}>
          <meshStandardMaterial color={wallColor} roughness={0.8} />
        </Box>
      ))}
      
      {/* Ceiling structure */}
      <Box args={[32, 0.25, 32]} position={[0, 7.4, 0]}>
        <meshStandardMaterial color="#374151" roughness={0.7} />
      </Box>
      
      {/* I-Beam rafters */}
      {[-12, -6, 0, 6, 12].map((x, i) => (
        <group key={`rafter-${i}`}>
          <Box args={[0.15, 0.6, 32]} position={[x, 7.0, 0]}>
            <meshStandardMaterial color="#1f2937" metalness={0.5} />
          </Box>
          <Box args={[0.4, 0.08, 32]} position={[x, 7.25, 0]}>
            <meshStandardMaterial color="#1f2937" metalness={0.5} />
          </Box>
          <Box args={[0.4, 0.08, 32]} position={[x, 6.75, 0]}>
            <meshStandardMaterial color="#1f2937" metalness={0.5} />
          </Box>
        </group>
      ))}
      
      {/* Cross beams */}
      {[-12, -6, 0, 6, 12].map((z, i) => (
        <Box key={`cross-${i}`} args={[32, 0.25, 0.15]} position={[0, 6.9, z]}>
          <meshStandardMaterial color="#1f2937" metalness={0.4} />
        </Box>
      ))}
      
      {/* Ceiling lights */}
      {[-9, -3, 3, 9].map((x) =>
        [-9, -3, 3, 9].map((z) => (
          <CeilingLight key={`light-${x}-${z}`} position={[x, 6.7, z]} />
        ))
      )}
      
      {/* Concrete pillars */}
      {[
        [-8, 0, -8], [8, 0, -8], [-8, 0, 8], [8, 0, 8],
        [-8, 0, 0], [8, 0, 0]
      ].map(([x, y, z], i) => (
        <Pillar key={`pillar-${i}`} position={[x, y, z]} />
      ))}
      
      {/* Scene-specific elements */}
      {sceneType === 'storage' && (
        <>
          {/* Main storage racks */}
          <ShelvingUnit position={[-11, 0, -10]} rotation={0} />
          <ShelvingUnit position={[-11, 0, -4]} rotation={0} />
          <ShelvingUnit position={[-11, 0, 2]} rotation={0} />
          <ShelvingUnit position={[11, 0, -10]} rotation={Math.PI} />
          <ShelvingUnit position={[11, 0, -4]} rotation={Math.PI} />
          <ShelvingUnit position={[11, 0, 2]} rotation={Math.PI} />
          
          {/* Center aisle pallets */}
          <Pallet position={[-3, 0, -6]} hasWrap />
          <Pallet position={[0, 0, -6]} />
          <Pallet position={[3, 0, -6]} hasWrap />
          <Pallet position={[-2, 0, 10]} />
          <Pallet position={[2, 0, 10]} hasWrap />
          
          {/* Parked forklift */}
          <Forklift position={[5, 0, 0]} rotation={-0.3} />
          
          {/* Safety station */}
          <SafetyStation position={[-15.5, 0, 5]} />
          <SafetyStation position={[15.5, 0, -5]} />
        </>
      )}
      
      {sceneType === 'loading' && (
        <>
          {/* Dock doors */}
          <DockDoor position={[0, 0, -15.5]} open />
          <DockDoor position={[-8, 0, -15.5]} />
          <DockDoor position={[8, 0, -15.5]} open />

          {/* Dock edge safety markings (yellow/black band) */}
          {[-10, 0, 10].map((x) => (
            <group key={`dock-edge-${x}`} position={[x, 0, -13.6]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
                <planeGeometry args={[6, 0.25]} />
                <meshStandardMaterial color="#fbbf24" roughness={0.7} />
              </mesh>
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.007, 0.12]}>
                <planeGeometry args={[6, 0.12]} />
                <meshStandardMaterial color="#1f2937" roughness={0.8} />
              </mesh>
            </group>
          ))}

          {/* Guard rail posts along dock edge */}
          {[-12, -8, -4, 0, 4, 8, 12].map((x) => (
            <group key={`rail-${x}`} position={[x, 0, -12.8]}>
              <Cylinder args={[0.06, 0.06, 1.1, 12]} position={[0, 0.55, 0]}>
                <meshStandardMaterial color="#f97316" metalness={0.2} roughness={0.6} />
              </Cylinder>
              <Cylinder args={[0.08, 0.08, 0.06, 12]} position={[0, 0.03, 0]}>
                <meshStandardMaterial color="#111827" roughness={0.7} />
              </Cylinder>
            </group>
          ))}
          <Box args={[28, 0.08, 0.08]} position={[0, 1.05, -12.8]}>
            <meshStandardMaterial color="#f97316" metalness={0.2} roughness={0.6} />
          </Box>

          {/* Staging area pallets */}
          <Pallet position={[-3, 0, -10]} hasWrap />
          <Pallet position={[0, 0, -10]} hasWrap />
          <Pallet position={[3, 0, -10]} />
          <Pallet position={[-5, 0, -7]} />
          <Pallet position={[6, 0, -7]} hasWrap />

          {/* Inbound staging */}
          <Pallet position={[-10, 0, 5]} />
          <Pallet position={[-8, 0, 5]} hasWrap />
          <Pallet position={[8, 0, 6]} />

          {/* Forklifts */}
          <Forklift position={[-4, 0, 2]} rotation={Math.PI / 2} />
          <Forklift position={[6, 0, 3]} rotation={-Math.PI / 4} />

          {/* More shelving to make the bay feel real */}
          <ShelvingUnit position={[-13, 0, 10]} />
          <ShelvingUnit position={[13, 0, 10]} rotation={Math.PI} />
          <ShelvingUnit position={[-13, 0, 4]} />
          <ShelvingUnit position={[13, 0, 4]} rotation={Math.PI} />
          <ShelvingUnit position={[-13, 0, -2]} />
          <ShelvingUnit position={[13, 0, -2]} rotation={Math.PI} />
        </>
      )}
      
      {sceneType === 'chemical' && (
        <>
          {/* Chemical storage racks */}
          <ShelvingUnit position={[-11, 0, -8]} />
          <ShelvingUnit position={[11, 0, -8]} rotation={Math.PI} />
          
          {/* Barrel storage areas */}
          <group position={[-6, 0, -4]}>
            {[0, 1, 2].map((x) => [0, 1].map((z) => (
              <ChemicalBarrel key={`red-${x}-${z}`} position={[x * 0.8, 0, z * 0.8]} color="#dc2626" />
            )))}
          </group>
          
          <group position={[4, 0, -4]}>
            {[0, 1, 2].map((x) => [0, 1].map((z) => (
              <ChemicalBarrel key={`green-${x}-${z}`} position={[x * 0.8, 0, z * 0.8]} color="#22c55e" />
            )))}
          </group>
          
          <group position={[0, 0, 6]}>
            {[0, 1].map((x) => [0, 1].map((z) => (
              <ChemicalBarrel key={`blue-${x}-${z}`} position={[x * 0.8, 0, z * 0.8]} color="#3b82f6" />
            )))}
          </group>
          
          {/* Safety equipment */}
          <SafetyStation position={[-15.5, 0, 0]} />
          <SafetyStation position={[15.5, 0, 0]} />
          <SafetyStation position={[0, 0, -15.5]} />
          
          {/* Eye wash station */}
          <group position={[-15.5, 0, 8]}>
            <Box args={[0.5, 1.2, 0.3]} position={[0, 0.9, 0]}>
              <meshStandardMaterial color="#22c55e" />
            </Box>
            <Box args={[0.4, 0.08, 0.25]} position={[0, 1.55, 0.05]}>
              <meshStandardMaterial color="#9ca3af" metalness={0.6} />
            </Box>
          </group>
          
          {/* Hazmat containment zones - floor markings */}
          {[[-6, -4], [4, -4], [0, 6]].map(([x, z], i) => (
            <mesh key={`zone-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x + 0.8, 0.01, z + 0.4]}>
              <planeGeometry args={[3.5, 2.5]} />
              <meshStandardMaterial color="#fbbf24" transparent opacity={0.25} />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
};
