import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { useCountries } from "@/lib/stores/useCountries";

// Country positions on a simplified world map
const COUNTRY_POSITIONS = {
  "USA": { position: [-8, 0, 5] as [number, number, number], color: "#4a90e2" },
  "Brazil": { position: [-5, 0, -3] as [number, number, number], color: "#7ed321" },
  "Norway": { position: [2, 0, 8] as [number, number, number], color: "#50e3c2" },
  "Japan": { position: [12, 0, 5] as [number, number, number], color: "#f5a623" },
  "Kenya": { position: [6, 0, -2] as [number, number, number], color: "#e94b3c" },
};

interface CountryBlockProps {
  name: string;
  position: [number, number, number];
  color: string;
  onClick: () => void;
  isSelected: boolean;
}

function CountryBlock({ name, position, color, onClick, isSelected }: CountryBlockProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      
      // Hover effect
      if (hovered) {
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2, 0.5, 2]} />
        <meshStandardMaterial 
          color={isSelected ? "#ffffff" : color}
          emissive={hovered ? color : "#000000"}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>
      
      {/* Country label */}
      <Text
        position={[position[0], position[1] + 1.5, position[2]]}
        fontSize={0.5}
        color={isSelected ? "#ffffff" : "#cccccc"}
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
}

export default function WorldMap() {
  const { selectedCountry, selectCountry } = useCountries();

  return (
    <>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        maxPolarAngle={Math.PI / 2}
        minDistance={10}
        maxDistance={50}
      />

      {/* Ocean/Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a4870" />
      </mesh>

      {/* Countries */}
      {Object.entries(COUNTRY_POSITIONS).map(([countryName, data]) => (
        <CountryBlock
          key={countryName}
          name={countryName}
          position={data.position}
          color={data.color}
          onClick={() => selectCountry(countryName)}
          isSelected={selectedCountry === countryName}
        />
      ))}

      {/* Title */}
      <Text
        position={[0, 12, 0]}
        fontSize={2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Ecosystem Balance
      </Text>

      <Text
        position={[0, 10, 0]}
        fontSize={0.8}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
      >
        Click on a country to start
      </Text>
    </>
  );
}
