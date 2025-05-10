import * as THREE from "three";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, shaderMaterial } from "@react-three/drei";
import { useRef } from "react";

// Custom Shader Material
const MyShaderMaterial = shaderMaterial(
  {
    iTime: 0,
    iResolution: new THREE.Vector3(),
  },
  /* Vertex Shader */
  `varying vec2 vUv;
   void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }`,
  /* Fragment Shader */
  `#define PI 3.14159265359

   uniform float iTime;
   uniform vec3 iResolution;
   varying vec2 vUv;

   void main() {
       vec2 uv = vUv * 2.0 - 1.0;
       uv.x *= iResolution.x / iResolution.y;

       float r = length(uv);
       float wave = sin(r * 10.0 - iTime * 2.0) * 0.5 + 0.5;
       
       vec3 color = mix(vec3(0.2, 0.3, 0.6), vec3(1.0, 0.42, 0.42), wave);
       gl_FragColor = vec4(color, 1.0);
   }`
);

// Register shader material
extend({ MyShaderMaterial });

function BackgroundShader() {
  const material = useRef<any>();

  useFrame(({ clock, size }) => {
    if (material.current) {
      material.current.uniforms.iTime.value = clock.getElapsedTime();
      material.current.uniforms.iResolution.value.set(size.width, size.height, 1);
    }
  });

  return (
    <mesh scale={[5, 5, 1]}>
      <planeGeometry args={[2, 2]} />
      <myShaderMaterial ref={material} />
    </mesh>
  );
}

export default function Cuboid() {
  return (
    <Canvas camera={{ position: [0, 0, 3] }}>
      {/* <BackgroundShader /> */}
      <OrbitControls enableDamping />
      {/* <mesh position={[0, 0, 1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="white" />
      </mesh> */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
    </Canvas>
  );
}
