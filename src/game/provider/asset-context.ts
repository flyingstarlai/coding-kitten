import { createContext, useContext } from "react";
import type { BundleTextures } from "@/game/utils/asset-utils.ts";
import type { Spritesheet } from "pixi.js";

export interface AssetContextType {
  // parsed atlas → Spritesheet
  cat: Spritesheet;
  coin: Spritesheet;
  // generic bundles: JSON objects and Textures
  maps: BundleTextures<"maps">;
  chest: BundleTextures<"chest">;
  stars: BundleTextures<"stars">;
  // audio URLs
  audio: BundleTextures<"audio">;
  sequence: BundleTextures<"sequence">;
}

export const AssetContext = createContext<AssetContextType | null>(null);

export function useAssets(): AssetContextType {
  const context = useContext(AssetContext);
  if (context === null) {
    throw new Error(`useAssets must be used within AssetProvider.`);
  }
  return context;
}
