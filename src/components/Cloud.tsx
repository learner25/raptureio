import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Cloud() {
  const points = useRef<THREE.Points>(null);
  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 5000;

  // Create particles in a cloud-like formation
  const positions = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    // Create a spherical cloud shape
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = 2 + Math.random() * 2; // Radius between 2 and 4

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] =
      r * Math.sin(phi) * Math.sin(theta) + Math.random() * 0.5;
    positions[i * 3 + 2] = r * Math.cos(phi);

    scales[i] = Math.random() * 2.5;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3),
  );
  particlesGeometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.getElapsedTime() * 0.05;

    // Add subtle movement to particles
    const positions = points.current.geometry.attributes.position
      .array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(state.clock.getElapsedTime() + i) * 0.001;
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry {...particlesGeometry} />
      <pointsMaterial
        size={0.1}
        transparent
        opacity={0.6}
        color="white"
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
