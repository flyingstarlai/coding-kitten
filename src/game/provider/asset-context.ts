import { createContext, useContext } from "react";
import type { BundleTextures } from "@/game/utils/asset-utils.ts";

export type CatTex = BundleTextures<"cat">;
export type CoinTex = BundleTextures<"coin">;
export type ChestTex = BundleTextures<"chest">;
export type MapsTex = BundleTextures<"maps">;
export type AudioTex = BundleTextures<"audio">;

export interface AssetContextType {
  cat: CatTex;
  coin: CoinTex;
  chest: ChestTex;
  maps: MapsTex;
  audio: AudioTex;
}

export const AssetContext = createContext<AssetContextType | null>(null);

export function useAssets(): AssetContextType {
  const context = useContext(AssetContext);
  if (context === null) {
    throw new Error(`useAssets must be used within AssetProvider.`);
  }
  return context;
}
