import { useState, useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import GlitchText from "../GlitchText";
import BlobBackground from "../BlobBackground";
import SubsectionScroll from "../SubsectionScroll";
import GLTFModel from "../Console";

function SceneController({ activeSubsection }) {
  const { scene, camera } = useThree();

  const viewConfigs = [
    { cameraPos: [0, 0, 5], sceneRotation: 0 },
    { cameraPos: [2, 0, 4], sceneRotation: Math.PI / 6 },
    { cameraPos: [-2, 0.5, 4], sceneRotation: -Math.PI / 6 },
  ];

  useFrame(() => {
    const config = viewConfigs[activeSubsection];

    //camera.position.x += (config.cameraPos[0] - camera.position.x) * 0.05;
   // camera.position.y += (config.cameraPos[1] - camera.position.y) * 0.05;
   // camera.position.z += (config.cameraPos[2] - camera.position.z) * 0.05;
   // scene.rotation.y += (config.sceneRotation - scene.rotation.y) * 0.05;
  });

  return null;
}

const subsections = [
  { title: "Golden Touch", description: "Midus transforms ordinary objects..." },
  { title: "Precious Materials", description: "Explore our library of materials..." },
  { title: "Luxury Finish", description: "Apply our signature luxury finishes..." },
];

export default function Midus() {
  const [activeSubsection, setActiveSubsection] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.scrollHeight;

      const relativeScroll = section.scrollTop;
      setScrollY(relativeScroll);

      const subsectionHeight = sectionHeight / subsections.length;
      const currentSubsection = Math.floor(relativeScroll / subsectionHeight);
      setActiveSubsection(Math.min(currentSubsection, subsections.length - 1));
    };

    section.addEventListener("scroll", handleScroll);

    return () => section.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={sectionRef}
      className="h-screen w-full bg-transparent relative overflow-y-auto" // Make it scrollable
      id="section-midus"
    >
      <div className="absolute inset-0 z-0">
        {/* <BlobBackground color="#96ceb4" scrollPosition={scrollY} /> */}
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} shadows>
        <SceneController activeSubsection={activeSubsection} />
        <color attach="background" args={["#96ceb4"]} />
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
        <directionalLight position={[-5, 5, 5]} intensity={1} castShadow />

        {/* GLTF Model */}
        <GLTFModel url="./models/t-4/expld.glb" />

        <OrbitControls enableZoom={false} autoRotate={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
      </Canvas>

      <div className="absolute top-1/4 right-10 transform -translate-y-1/2 text-white z-10">
        <h1 className="text-8xl font-bold mb-20">
          <GlitchText text="Midus" className="text-8xl font-bold" />
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
        <p className="text-white text-sm uppercase tracking-wider">
          SCROLL TO EXPLORE
        </p>
      </div>
    </div>
  );
}
