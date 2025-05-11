import { useRef,useState, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function GlassyBlob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({
        x: (event.clientX / window.innerWidth) * 2 - 1, // Normalize between -1 and 1
        y: -(event.clientY / window.innerHeight) * 2 + 1, // Normalize between -1 and 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Add subtle movement
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
    meshRef.current.rotation.y = Math.sin(time * 0.2) * 0.3 + time * 0.1;

    // Subtle shape morphing
    const geometry = meshRef.current.geometry as THREE.SphereGeometry;
    const positions = geometry.attributes.position.array;

    const noiseAmplitude = Math.abs(mousePos.x) * 0.05 + 0.1; // Use mouse X position to change noise amplitude

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      // Calculate normalized direction from center
      const length = Math.sqrt(x * x + y * y + z * z);
      const nx = x / length;
      const ny = y / length;
      const nz = z / length;

      // Apply noise-based displacement with variable amplitude based on mouse position
      const noise =
        Math.sin(nx * 5 + time) *
        Math.cos(ny * 5 + time) *
        Math.sin(nz * 5 + time) *
        noiseAmplitude;

      positions[i] = nx * (1 + noise);
      positions[i + 1] = ny * (1 + noise);
      positions[i + 2] = nz * (1 + noise);
    }

    geometry.attributes.position.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhysicalMaterial
        color="#7fbfb6"
        roughness={0.05}
        metalness={0.9}
        transparent
        opacity={0.1}
      />
    </mesh>
  );
}

export default function Fomosphere() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-transparent">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <GlassyBlob />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      <div className="flex items-center gap-2 mt-20 z-10">
        <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white" />
        </div>
        <p className="text-white text-sm uppercase tracking-wider">
         Developed by Saimon Islam
        </p>
      </div>
    </div>
  );
}
