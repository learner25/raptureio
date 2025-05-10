import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useAnimations,
  useFBX,
} from "@react-three/drei";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import GlitchText from "../GlitchText";
import BlobBackground from "../BlobBackground";
import SubsectionScroll from "../SubsectionScroll";

// Scene controller to handle camera and scene rotation based on active subsection
function SceneController({ activeSubsection }) {
  const { scene, camera } = useThree();

  // Define different camera positions and rotations for each subsection
  const viewConfigs = [
    { cameraPos: [0, 0, 5], sceneRotation: 0 },
    { cameraPos: [2, 0, 4], sceneRotation: Math.PI / 6 },
    { cameraPos: [-2, 0.5, 4], sceneRotation: -Math.PI / 6 },
  ];

  useFrame(() => {
    const config = viewConfigs[activeSubsection];

    // Smoothly tween camera position
    camera.position.x += (config.cameraPos[0] - camera.position.x) * 0.05;
    camera.position.y += (config.cameraPos[1] - camera.position.y) * 0.05;
    camera.position.z += (config.cameraPos[2] - camera.position.z) * 0.05;

    // Smoothly tween scene rotation
    scene.rotation.y += (config.sceneRotation - scene.rotation.y) * 0.05;
  });

  return null;
}

// Floating objects for Pompus section
function FloatingObjects() {
  const group = useRef();

  // Create multiple objects with different geometries
  const objects = [
    {
      geometry: new THREE.TorusGeometry(1, 0.4, 16, 32),
      position: [0, 0, 0],
      color: "#ff9999",
    },
    {
      geometry: new THREE.OctahedronGeometry(0.8),
      position: [-2, 1, -1],
      color: "#ffcccc",
    },
    {
      geometry: new THREE.DodecahedronGeometry(0.7),
      position: [2, -1, 1],
      color: "#ff7777",
    },
  ];

  useFrame((state) => {
    if (!group.current) return;

    const t = state.clock.getElapsedTime();

    // Animate each child with different patterns
    group.current.children.forEach((child, i) => {
      child.position.y = objects[i].position[1] + Math.sin(t * 0.5 + i) * 0.5;
      child.rotation.x = t * 0.3 * (i % 2 ? 1 : -1);
      child.rotation.z = t * 0.2 * (i % 2 ? -1 : 1);
      child.scale.x = 1 + Math.sin(t * 0.5 + i * 2) * 0.1;
      child.scale.y = 1 + Math.sin(t * 0.7 + i * 3) * 0.1;
      child.scale.z = 1 + Math.sin(t * 0.3 + i) * 0.1;
    });

    // Rotate the entire group slowly
    group.current.rotation.y = t * 0.1;
  });

  return (
    <group ref={group}>
      {objects.map((obj, i) => (
        <mesh key={i} position={obj.position} castShadow>
          <primitive object={obj.geometry} attach="geometry" />
          <meshStandardMaterial
            color={obj.color}
            roughness={0.3}
            metalness={0.7}
            emissive={obj.color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

const subsections = [
  {
    title: "Grandeur",
    description:
      "Pompus delivers unparalleled grandeur to your digital experiences. Our suite of tools creates visually stunning and emotionally impactful moments that leave lasting impressions on your audience.",
  },
  {
    title: "Elegance",
    description:
      "Refined aesthetics meet functional design in our elegance collection. Create sophisticated interfaces and experiences with our premium components and animations.",
  },
  {
    title: "Opulence",
    description:
      "No expense spared in our opulence package. Access our most exclusive visual effects, materials, and interaction patterns for truly luxurious digital experiences.",
  },
];

export default function Pompus() {
  const [activeSubsection, setActiveSubsection] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Check if section is visible
        const isVisible =
          sectionTop < windowHeight && sectionTop > -sectionHeight;
        setIsSectionVisible(isVisible);

        // Calculate scroll position relative to this section
        const relativeScroll = -sectionTop;
        setScrollY(relativeScroll);

        // Only update active subsection if the section is visible
        if (isVisible) {
          // Show subsections one by one as user scrolls
          const subsectionHeight = sectionHeight / subsections.length;
          const currentSubsection = Math.floor(
            relativeScroll / subsectionHeight,
          );
          setActiveSubsection(
            Math.min(currentSubsection, subsections.length - 1),
          );
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check on mount
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={sectionRef}
      className="h-screen w-full bg-transparent relative overflow-hidden"
      id="section-pompus"
    >
      {/* Blob background behind subsections - only visible when section is in view */}
      {isSectionVisible && (
        <div className="absolute inset-0 z-0">
          <BlobBackground
            color="#ff9999"
            scrollPosition={scrollY}
            key={`blob-${Math.floor(scrollY)}`}
          />
        </div>
      )}

      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 50,
        }}
        shadows
      >
        <SceneController activeSubsection={activeSubsection} />
        <color attach="background" args={["#ff9999"]} />
        <ambientLight intensity={1.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1.5}
          castShadow
        />
        <directionalLight
          position={[-5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <FloatingObjects />

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.5, 0]}
          receiveShadow
        >
          <planeGeometry args={[30, 30]} />
          <shadowMaterial opacity={0.2} />
        </mesh>
        <OrbitControls
          enableZoom={false}
          autoRotate={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
          enabled={false}
        />
      </Canvas>

      {/* Main title with glitch effect */}
      <div className="absolute top-1/4 right-10 transform -translate-y-1/2 text-white z-10">
        <h1 className="text-8xl font-bold mb-20">
          <GlitchText text="Pompus" className="text-8xl font-bold" />
        </h1>
      </div>

      {/* Scrollable Subsections */}
      <div className="absolute bottom-20 right-10 w-1/3 text-white z-10">
        <SubsectionScroll
          sections={subsections}
          activeIndex={activeSubsection}
          onSectionChange={setActiveSubsection}
          className="h-64"
        />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-white z-10">
        <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white" />
        </div>
        <p className="text-white text-sm uppercase tracking-wider">
          SCROLL TO EXPLORE
        </p>
      </div>
    </div>
  );
}
