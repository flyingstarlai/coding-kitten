import { type PropsWithChildren, useEffect, useState } from "react";
import {
  AssetContext,
  type AssetContextType,
} from "@/game/provider/asset-context.ts";
import {
  loadBundle,
  loadBundleAtlas,
  registerSpriteBundles,
} from "@/game/utils/asset-utils.ts";

export const AssetProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [assets, setAssets] = useState<AssetContextType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    registerSpriteBundles();

    Promise.all([
      loadBundleAtlas("cat"), // Spritesheet
      loadBundleAtlas("coin"), // Spritesheet
      loadBundle("maps"), // JSON + Texture bundle
      loadBundle("chest"), // Texture bundle
      loadBundle("audio"), // string URLs
    ])
      .then(([cat, coin, maps, chest, audio]) => {
        setAssets({ cat, coin, maps, chest, audio });
      })
      .catch((err) => {
        console.error("Failed to load assets", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      });
  }, []);

  if (error) {
    return (
      <div className="text-red-500">Error loading assets: {error.message}</div>
    );
  }
  if (!assets) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading assets…
      </div>
    );
  }

  return (
    <AssetContext.Provider value={assets}>{children}</AssetContext.Provider>
  );
};
