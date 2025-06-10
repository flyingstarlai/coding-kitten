import { type PropsWithChildren, useEffect, useState } from "react";
import {
  AssetContext,
  type AssetContextType,
} from "@/game/provider/asset-context.ts";
import { loadBundle, registerSpriteBundles } from "@/game/utils/asset-utils.ts";

export const AssetProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [assets, setAssets] = useState<AssetContextType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    registerSpriteBundles();
    Promise.all([
      loadBundle("cat"),
      loadBundle("coin"),
      loadBundle("chest"),
      loadBundle("maps"),
      loadBundle("audio"),
    ])
      .then(([cat, coin, chest, maps, audio]) => {
        setAssets({ cat, coin, chest, maps, audio });
      })
      .catch((err) => {
        console.error("Failed to load assets", err);
        setError(err);
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
