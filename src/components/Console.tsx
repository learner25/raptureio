import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";

interface GLTFModelProps {
  url: string;
}

const GLTFModel: React.FC<GLTFModelProps> = ({ url }) => {
  const modelRef = useRef<THREE.Group | null>(null);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isMidusActive, setIsMidusActive] = useState(false);
  const { camera } = useThree();
  const gltf = useLoader(GLTFLoader, url);

  // ✅ Detect if Midus section is in view
  useEffect(() => {
    const midusSection = document.getElementById("section-midus");

    if (!midusSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsMidusActive(entry.isIntersecting),
      { threshold: 0.3 }
    );

    observer.observe(midusSection);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (gltf) {
      const newMixer = new THREE.AnimationMixer(gltf.scene);
      gltf.animations.forEach((clip) => {
        const action = newMixer.clipAction(clip);
        action.play();
        action.paused = true;
      });
      setMixer(newMixer);
    }
  }, [gltf]);

  useEffect(() => {
    camera.position.set(-5.1668, 1.6339, 1.0577);
    camera.lookAt(1, 1, 1);

    const handleScroll = (event: WheelEvent) => {
      if (!isMidusActive) return; // 🛑 Prevent scroll events outside Midus

      setCurrentFrame((prevFrame) => {
        const newFrame = event.deltaY > 0 ? prevFrame + 1 : prevFrame - 1;
        return Math.min(Math.max(newFrame, 0), mixer?._actions[0]?.getClip().duration + 60 || 0);
      });

      gsap.to(camera.position, {
        x: event.deltaY > 0 ? 0.0629 : -5.1668,
        y: event.deltaY > 0 ? 2.8900 : 1.6339,
        z: event.deltaY > 0 ? 6.5833 : 1.0577,
        duration: 1,
        ease: "power2.out",
      });
    };

    if (isMidusActive) {
      window.addEventListener("wheel", handleScroll);
    } else {
      window.removeEventListener("wheel", handleScroll);
    }

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [mixer, camera, isMidusActive]);

  useFrame(() => {
  
    if (mixer) {
      mixer.update(0.016);
      mixer._actions.forEach((action) => {
        action.paused = true;
        action.time = currentFrame;
      });
    }
  });

  return (
    <primitive
      object={gltf.scene}
      ref={modelRef}
      scale={[1, 1, 1]}
      position={[0, -0.9313, 0]}
    />
  );
};

export default GLTFModel;
