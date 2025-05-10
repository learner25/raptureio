import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import IridescentSphere from "./IridescentSphere";
import ScrollMenu from "./ScrollMenu";
import * as Sections from "./sections";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import AnimatedModel from "./sections/AnimatedModel";

const sectionColors = {
  fomosphere: "#7fbfb6",
  cuboid: "#ff6b6b",
  halo: "#4ecdc4",
  helius: "#45b7d1",
  midus: "#96ceb4",
  pompus: "#ff9999",
  animated: "#1a1a2e",
};

export default function Scene() {
  const [showMenu, setShowMenu] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      setShowMenu(scrollPosition < windowHeight * 0.5);
      setCurrentSection(Math.floor(scrollPosition / windowHeight));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuClick = () => {
    const firstSection = document.querySelector("#section-fomosphere");
    firstSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full h-screen bg-[#7fbfb6] overflow-hidden">
      {/* Fixed background with sphere */}
      <div className="fixed top-0 left-0 w-full h-screen">
        <Canvas camera={{ position: [0, 0, 3] }}>
          <color attach="background" args={["#7fbfb6"]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <IridescentSphere color="#7fbfb6" />
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* Fixed header */}
      <div className="fixed top-0 left-0 w-full z-20">
        <div className="container mx-auto px-4 py-8">
          <nav className="flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">Rapture.io</h1>
            <div className="flex gap-6">
              <button className="text-white">Try in VR</button>
              <button className="text-white">About</button>
            </div>
          </nav>

          {showMenu ? (
            <>
              <div className={`${currentSection === 0 ? "mt-32" : "mt-8"}`}>
                <ScrollMenu />
              </div>
              <div
                className={`${currentSection === 0 ? "mt-20" : "mt-4"} flex items-center gap-2 justify-center`}
              >
                <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white" />
                </div>
                <p className="text-white text-sm uppercase tracking-wider">
                  Scroll to explore
                </p>
              </div>
            </>
          ) : (
            <button
              onClick={handleMenuClick}
              className="fixed top-8 right-8 z-50 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
            >
              <Menu className="text-white" size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable sections */}
      <div className="relative mt-screen">
        <section id="section-fomosphere" className="h-screen w-full">
          <Sections.Fomosphere />
        </section>
        <section id="section-cuboid" className="h-screen w-full bg-[#ff6b6b]">
          <Sections.Cuboid />
        </section>
        <section id="section-halo" className="h-screen w-full bg-[#4ecdc4]">
          <Sections.Halo />
        </section>
        <section id="section-helius" className="h-screen w-full bg-[#45b7d1]">
          <Sections.Helius />
        </section>
        <section id="section-midus" className="h-screen w-full bg-[#96ceb4]">
          <Sections.Midus />
        </section>
        <section id="section-pompus" className="h-screen w-full bg-[#ff9999]">
          <Sections.Pompus />
        </section>
        <section id="section-animated" className="h-screen w-full bg-[#1a1a2e]">
          <AnimatedModel />
        </section>
      </div>
    </div>
  );
}
