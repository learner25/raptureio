import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useFBX } from "@react-three/drei";
import * as THREE from "three";

export default function FBXModel({ visible = true }) {
  const group = useRef();
  const fbx = useFBX("./models/t-1/tripo_convert_char.fbx");

  useEffect(() => {
    // Apply materials and shadows
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.emissive = new THREE.Color(0.4, 0.2, 0.2);
        child.material.emissiveIntensity = 0.0917;
        child.rotation.y = Math.PI /2;
      }
    });

    // Position and scale the model
    fbx.scale.set(0.04, 0.04, 0.04);
    fbx.position.set(-0.39, -0.5, 0.12);
    fbx.rotation.y += Math.PI /3;

    // Play animation if available
    if (fbx.animations && fbx.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(fbx);
      const action = mixer.clipAction(fbx.animations[0]);
      action.play();

      // Store mixer on the ref for animation updates
      group.current.mixer = mixer;
    }
  }, [fbx]);

  // Update animation mixer and add subtle movement
  useFrame((state, delta) => {
    if (group.current) {
      // Update animation mixer if it exists
      if (group.current.mixer) {
        group.current.mixer.update(delta);
      }

      // Add subtle movement
      const t = state.clock.getElapsedTime();
      group.current.rotation.y = Math.sin(t * 0.3) * 0.2 + Math.PI / 6;
    }
  });

  return <primitive ref={group} object={fbx} visible={visible} />;
}
