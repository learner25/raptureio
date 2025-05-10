import { useState, useEffect } from "react";
import { useAssetLoader } from "../hooks/useAssetLoader";

interface LoaderProps {
  onLoadComplete: () => void;
}

export default function Loader({ onLoadComplete }: LoaderProps) {
  const [isComplete, setIsComplete] = useState(false);

  // Define assets to preload
  const assets = [
    // Removed problematic model references to prevent loading errors
    // Add any other assets here if needed
  ];

  const { progress, isLoaded } = useAssetLoader(assets);

  useEffect(() => {
    if (isLoaded) {
      // Add a small delay before completing
      const timeout = setTimeout(() => {
        setIsComplete(true);
        setTimeout(onLoadComplete, 1000); // Fade out transition time
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoaded, onLoadComplete]);

  return (
    <div
      className={`fixed inset-0 bg-black z-50 flex flex-col items-center justify-center transition-opacity duration-1000 ${isComplete ? "opacity-0" : "opacity-100"}`}
    >
      <div className="w-64 h-0.5 bg-gray-800 mb-4 relative">
        <div
          className="h-full bg-white absolute left-0 top-0 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-white text-lg font-mono">
        {Math.round(progress)}%
      </div>
    </div>
  );
}
