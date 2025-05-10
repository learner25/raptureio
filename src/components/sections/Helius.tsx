import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader } from "three";
import { useState, useEffect, useRef } from "react";
import GlitchText from "../GlitchText";
import BlobBackground from "../BlobBackground";
import SubsectionScroll from "../SubsectionScroll";

// Load the animated GLB model
function AnimatedModel() {
  const { scene, animations } = useGLTF("/t-5/grab.glb");
  const ref = useRef();

  useEffect(() => {
    if (animations.length > 0) {
      const mixer = new THREE.AnimationMixer(scene);
      animations.forEach((clip) => {
        mixer.clipAction(clip).play();
      });
      ref.current = mixer;
    }
  }, [animations, scene]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.update(delta);
  });

  return <primitive object={scene} scale={0.5} position={[0, -1, 0]} />;
}

// Fog and scene controller
function SceneController({ activeSubsection }) {
  const { scene, camera } = useThree();

  // Apply fog to the scene
  useEffect(() => {
   
  scene.fog = new THREE.Fog("#45b7d1", 25, 30); // Color, near, far
  }, [scene]);

  const viewConfigs = [
    { cameraPos:  [-1.90, -0.14, 2.28], sceneRotation: 0 },
    { cameraPos: [1.6, -0.64, -0.013], sceneRotation: Math.PI / 8 },
    { cameraPos: [-1.73, -1.0, 2.3], sceneRotation: -Math.PI / 8 },
  ];

  useFrame(() => {
    const config = viewConfigs[activeSubsection];
    camera.position.lerp(new THREE.Vector3(...config.cameraPos), 0.05);
    scene.rotation.y += (config.sceneRotation - scene.rotation.y) * 0.05;
    
  });
  

  return null;
}

// Smoke Effect
function SmokeEffect() {
  const smokeTexture = useLoader(TextureLoader, "/smoke.png");
  const smokeRefs = useRef([]);

  useFrame(({ clock }) => {
    smokeRefs.current.forEach((smoke, index) => {
      if (smoke) {
        const time = clock.getElapsedTime();
        smoke.rotation.z = Math.sin(time * 0.3 + index) * 0.5;
        smoke.position.y += Math.sin(time * 0.1) * 0.01; // Slight vertical movement
      }
    });
  });

  return (
    <>
      {[...Array(10)].map((_, i) => {
        // Spread smoke to both sides with mirrored positions
        const side = i % 2 === 0 ? 1 : -1; // Alternate between left and right
        return (
          <mesh
            key={i}
            ref={(el) => (smokeRefs.current[i] = el)}
            position={[
              side * (2 + Math.random() * 3), // Spread out on X-axis (left/right)
              Math.random() * 4 - 2, // Random Y position (-2 to 2)
              Math.random() * 10 - 5, // Spread depth (-5 to 5)
            ]}
          >
            <planeGeometry args={[5, 5]} />
            <meshBasicMaterial
              map={smokeTexture}
              transparent
              opacity={0.2}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </>
  );
}


// Subsections Data
const subsections = [
  {
    title: "Celestial Systems",
    description:
      "Helius brings the power of celestial bodies to your digital experience. Our cloud-based systems create dynamic, ever-changing environments that respond to user interaction and time-based events.",
  },
  {
    title: "Atmospheric Effects",
    description:
      "Create stunning atmospheric effects with our volumetric cloud and lighting system. Perfect for immersive environments and weather simulations.",
  },
  {
    title: "Particle Systems",
    description:
      "Our advanced particle systems allow for complex visual effects from gentle mist to dramatic storms, all optimized for real-time performance.",
  },
];

export default function Helius() {
  const [activeSubsection, setActiveSubsection] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isVisible =
          rect.top < window.innerHeight && rect.top > -rect.height;
        setIsSectionVisible(isVisible);

        const relativeScroll = -rect.top;
        setScrollY(relativeScroll);

        if (isVisible) {
          const subsectionHeight = rect.height / subsections.length;
          const currentSubsection = Math.floor(relativeScroll / subsectionHeight);
          setActiveSubsection(Math.min(currentSubsection, subsections.length - 1));
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={sectionRef}
      className="h-screen w-full bg-transparent relative overflow-hidden"
      id="section-helius"
    >
      {isSectionVisible && (
        <div className="absolute inset-0 z-0">
          <BlobBackground
            color="#45b7d1"
            scrollPosition={scrollY}
            key={`blob-${Math.floor(scrollY)}`}
          />
        </div>
      )}

      <Canvas camera={{ position: [-1.90, -0.14, 2.28], fov: 50 }}>
        <SceneController activeSubsection={activeSubsection} />
        <color attach="background" args={["#1a1a1a"]} />
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <AnimatedModel />
        <SmokeEffect />
        <OrbitControls enableZoom={true} enableRotate={true} autoRotate={false} autoRotateSpeed={0.2} />
      </Canvas>

      <div className="absolute top-1/4 right-10 transform -translate-y-1/2 text-white z-10">
        <h1 className="text-8xl font-bold mb-20">
          <GlitchText text="Helius" className="text-8xl font-bold" />
        </h1>
      </div>

      <div className="absolute bottom-20 right-10 w-1/3 text-white z-10">
        <SubsectionScroll
          sections={subsections}
          activeIndex={activeSubsection}
          onSectionChange={setActiveSubsection}
          className="h-64"
        />
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-white z-10">
        <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
          <div className="w-3 h-3 bg-white" />
        </div>
        <p className="text-white text-sm uppercase tracking-wider">SCROLL TO EXPLORE</p>
      </div>
    </div>
  );
}
