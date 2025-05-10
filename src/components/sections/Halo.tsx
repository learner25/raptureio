import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useAnimations,
  useFBX,
} from "@react-three/drei";
import FBXModel from "./FBXModel";
import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import GlitchText from "../GlitchText";
import BlobBackground from "../BlobBackground";
import SubsectionScroll from "../SubsectionScroll";

function TripoModel({ position = [-2, -0.5, 0], visible = true }) {
  const group = useRef();
  const { scene, animations } = useGLTF(
    "/src/models/t-1/tripo_convert_bb9794ad-fd9a-4879-84c1-be11c58f9704_idle_embedded.gltf",
  );
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    // Apply materials and shadows
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.emissive = new THREE.Color(0.2, 0.2, 0.3);
        child.material.emissiveIntensity = 0.5;
      }
    });

    // Play animation if available
    if (animations.length > 0) {
      const action = actions[Object.keys(actions)[0]];
      if (action) action.play();
    }

    // Position and scale the model to match the reference image
    scene.scale.set(0.038, 0.038, 0.038);
    scene.position.set(...position);
    scene.rotation.y = Math.PI / 4;
  }, [scene, animations, actions, position]);

  return <primitive ref={group} object={scene} visible={visible} />;
}

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

function Fox({ visible = true }) {
  const group = useRef();
  const fbx = useFBX("/src/models/t-1/tripo_convert_char.fbx");

  useEffect(() => {
    // Apply materials and shadows
    fbx.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.emissive = new THREE.Color(0.2, 0.4, 0.3);
        child.material.emissiveIntensity = 0.18;
      }
    });

    // Position and scale the model
    fbx.scale.set(0.03, 0.03, 0.03);
    fbx.position.set(-0.5, -1.5, -0.113);
    fbx.rotation.y = -Math.PI / 3;
  }, [fbx]);

  // Add subtle animation
  useFrame((state, delta) => {
    if (group.current) {
      const t = state.clock.getElapsedTime();
      group.current.rotation.y = Math.sin(t * 0.2) * 0.1 - Math.PI / 3;
      group.current.position.y = -1.5 + Math.sin(t * 0.5) * 0.1;
    }
  });

  return <primitive ref={group} object={fbx} visible={visible} />;
}

function TripoModelT1() {
  const group = useRef();
  const { scene, animations } = useGLTF(
    "/src/models/t-1/tripo_convert_bb9794ad-fd9a-4879-84c1-be11c58f9704_idle_embedded.gltf",
  );
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    // Apply materials and shadows
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.emissive = new THREE.Color(0.3, 0.2, 0.4);
        child.material.emissiveIntensity = 0.6;
      }
    });

    // Play animation if available but with a slight delay for variation
    if (animations.length > 0) {
      setTimeout(() => {
        const action = actions[Object.keys(actions)[0]];
        if (action) action.play();
      }, 500);
    }

    // Position and scale the model to match the reference image
    scene.scale.set(0.038, 0.038, 0.038);
    scene.position.set(2, -0.5, 0);
    scene.rotation.y = -Math.PI / 4;
  }, [scene, animations, actions]);

  // Add subtle animation
  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime();
      group.current.position.y = Math.sin(t * 0.5) * 0.1;
    }
  });

  return <primitive ref={group} object={scene} />;
}

const subsections = [
  {
    title: "Model",
    description:
      "Our cutting-edge 3D models are meticulously crafted with precision and artistry. Each polygon is carefully placed to create stunning visual experiences while maintaining optimal performance. We utilize advanced modeling techniques to ensure every detail is captured, from the subtle curves to the intricate textures that bring digital worlds to life.",
  },
  {
    title: "Texture",
    description:
      "PBR workflow with high-resolution maps for realistic surfaces that respond naturally to light.",
  },
  {
    title: "Rig",
    description:
      "Sophisticated skeletal framework with IK/FK switching for natural character movement and animation.",
  },
];

export default function Halo() {
  const [activeSubsection, setActiveSubsection] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isHaloSectionVisible, setIsHaloSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Check if Halo section is visible
        const isVisible =
          sectionTop < windowHeight && sectionTop > -sectionHeight;
        setIsHaloSectionVisible(isVisible);

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
      id="section-halo"
    >
      {/* Blob background behind subsections - only visible when Halo section is in view */}
      {isHaloSectionVisible && (
        <div className="absolute left-20 z-0">
          <BlobBackground
            color="#4ecdc4"
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
        <color attach="background" args={["#4ecdc4"]} />
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
        <TripoModel position={[-2, -0.5, 0]} visible={true} />
        <FBXModel visible={true} />
        <Fox visible={true} />
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
          <GlitchText text="Halo" className="text-8xl font-bold" />
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
