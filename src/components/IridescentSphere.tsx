import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";

interface Props {
  color?: string;
}

export default function IridescentSphere({ color = "#FF00FF" }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;

    // Add wobble effect
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = Math.sin(time) * 0.1;
    meshRef.current.scale.set(
      1 + Math.sin(time * 2) * 0.05,
      1 + Math.sin(time * 2) * 0.05,
      1 + Math.sin(time * 2) * 0.05,
    );
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.6}
        speed={5}
        roughness={0}
        metalness={1}
        iridescence={1}
        iridescenceIOR={1}
        iridescenceThicknessRange={[100, 700]}
      />
    </Sphere>
  );
}
