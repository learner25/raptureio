import { useState, useEffect } from "react";

interface Asset {
  type: "image" | "model" | "texture";
  url: string;
}

export function useAssetLoader(assets: Asset[]) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assets.length) {
      setIsLoaded(true);
      setProgress(100);
      return;
    }

    let loadedCount = 0;
    const totalAssets = assets.length;

    const updateProgress = () => {
      loadedCount++;
      const newProgress = Math.round((loadedCount / totalAssets) * 100);
      setProgress(newProgress);

      if (loadedCount === totalAssets) {
        setIsLoaded(true);
      }
    };

    const loadImage = (url: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          updateProgress();
          resolve();
        };
        img.onerror = () => {
          reject(new Error(`Failed to load image: ${url}`));
        };
      });
    };

    const loadModel = (url: string) => {
      // For models, we'll just simulate loading since actual loading happens in Three.js
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          updateProgress();
          resolve();
        }, 500);
      });
    };

    const loadTexture = (url: string) => {
      return loadImage(url);
    };

    const loadAssets = async () => {
      try {
        const promises = assets.map((asset) => {
          switch (asset.type) {
            case "image":
              return loadImage(asset.url);
            case "model":
              return loadModel(asset.url);
            case "texture":
              return loadTexture(asset.url);
            default:
              return Promise.resolve();
          }
        });

        await Promise.all(promises);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Unknown error loading assets",
        );
      }
    };

    loadAssets();
  }, [assets]);

  return { progress, isLoaded, error };
}
