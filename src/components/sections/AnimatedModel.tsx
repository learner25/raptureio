import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function Model({ scrollProgress = 0 }) {
  const group = useRef();
  const scene = new THREE.Group();
  const animations = [];

  // Create a simple placeholder model
  useEffect(() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: "#4ecdc4" });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add some additional elements to make it more interesting
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 32),
      new THREE.MeshStandardMaterial({ color: "#ff9999", metalness: 0.5 }),
    );
    sphere.position.set(0, 1.2, 0);
    scene.add(sphere);

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.1, 16, 32),
      new THREE.MeshStandardMaterial({ color: "#ffcc00", metalness: 0.8 }),
    );
    torus.position.set(0, -1.2, 0);
    scene.add(torus);
  }, []);
  const { actions, mixer } = useAnimations(animations, group);

  // Animation segments
  const segments = [
    { start: 0, end: 0.33 },
    { start: 0.33, end: 0.66 },
    { start: 0.66, end: 1 },
  ];

  // Determine which segment we're in
  const segmentIndex = Math.min(Math.floor(scrollProgress * 3), 2);
  const segment = segments[segmentIndex];

  // Calculate progress within the current segment
  const segmentLength = segment.end - segment.start;
  const segmentProgress =
    (scrollProgress - segment.start * 3) / (segmentLength * 3);
  const clampedSegmentProgress = Math.max(0, Math.min(1, segmentProgress));

  useEffect(() => {
    // Apply materials and shadows
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Set up the model
    scene.position.set(0, -1, 0);
    scene.scale.set(1, 1, 1);

    // Get the main animation
    if (animations.length > 0) {
      const action = actions[Object.keys(actions)[0]];
      if (action) {
        // Set animation to play but paused
        action.play();
        action.paused = true;
      }
    }
  }, [scene, animations, actions]);

  useFrame(() => {
    if (!group.current) return;

    // Animate the placeholder model based on scroll progress
    // Part 1: Rotation
    if (segmentIndex === 0) {
      group.current.rotation.y = clampedSegmentProgress * Math.PI * 2;
    }
    // Part 2: Scale
    else if (segmentIndex === 1) {
      const scale = 1 + clampedSegmentProgress * 0.5;
      group.current.scale.set(scale, scale, scale);
    }
    // Part 3: Position
    else if (segmentIndex === 2) {
      group.current.position.y = clampedSegmentProgress * 1.5;
    }

    // Apply continuous rotation for all parts
    scene.children.forEach((child, i) => {
      if (child.isObject3D) {
        child.rotation.x += 0.01 * (i % 2 ? 1 : -1);
        child.rotation.z += 0.005 * (i % 2 ? -1 : 1);
      }
    });
  });

  return <primitive ref={group} object={scene} />;
}

export default function AnimatedModel() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollPosition = window.scrollY;
        const containerTop = scrollPosition + rect.top;
        const containerHeight = rect.height;
        const windowHeight = window.innerHeight;

        // Calculate how far we've scrolled through the container
        const scrollThrough =
          (scrollPosition - containerTop + windowHeight) /
          (containerHeight + windowHeight);
        setScrollProgress(Math.max(0, Math.min(1, scrollThrough)));
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full bg-[#1a1a2e] relative overflow-hidden"
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} shadows>
        <color attach="background" args={["#1a1a2e"]} />
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <Model scrollProgress={scrollProgress} />
        <OrbitControls enableZoom={false} enablePan={false} />
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -1.5, 0]}
          receiveShadow
        >
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.2} />
        </mesh>
      </Canvas>

      {/* Progress indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-4 text-white z-10">
        <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-100"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="flex justify-between w-64 text-xs">
          <span>Part 1</span>
          <span>Part 2</span>
          <span>Part 3</span>
        </div>
        <p className="text-white text-sm uppercase tracking-wider mt-4">
          SCROLL TO ANIMATE
        </p>
      </div>

      {/* Section titles */}
      <div className="absolute top-10 left-10 text-white z-10">
        <h1 className="text-4xl font-bold mb-4">Animated Timeline</h1>
        <p className="text-lg opacity-70">
          Scroll to control the animation in three distinct parts
        </p>
      </div>
    </div>
  );
}
