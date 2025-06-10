import { Assets, type Spritesheet, Texture } from "pixi.js";

// IMPORTANT: always import JSON/PNG as a URL string, not a parsed object,
import catAtlasJsonUrl from "@/game/assets/cat_atlas.json?url";
import catSheetPngUrl from "@/game/assets/cat_sheet.png?url";
import coinSheetPngUrl from "@/game/assets/coin_sheet.png?url";
import coinAtlasJsonUrl from "@/game/assets/coin_atlas.json?url";
import mapArenaPngUrl from "@/game/assets/map_arena.png?url";
import mapArenaJsonUrl from "@/game/assets/map_arena.json?url";
import levelsJsonUrl from "@/game/assets/levels.json?url";
import chestClosedPngUrl from "@/game/assets/chest_closed.png?url";

// AUDIO
import collectCoinMp3Url from "@/game/assets/sounds/collect_coin.mp3?url";
import onGoalMp3Url from "@/game/assets/sounds/on_goal.mp3?url";
import failedMp3Url from "@/game/assets/sounds/failed.mp3?url";
import bgMusicMp3Url from "@/game/assets/sounds/bg_sound.mp3?url";
import runningMp3Url from "@/game/assets/sounds/running_in_grass.mp3?url";

// ────────────────────────────────────────────────────────────────────────────────
// Pixi will register under keys:  `${bundleName}-${entryKey}`
// ────────────────────────────────────────────────────────────────────────────────
export const spriteBundles = {
  cat: {
    catAtlas: catAtlasJsonUrl,
    catSheet: catSheetPngUrl,
  },
  coin: {
    coinAtlas: coinAtlasJsonUrl,
    coinSheet: coinSheetPngUrl,
  },
  maps: {
    bgArenaJson: mapArenaJsonUrl,
    mapAreaPng: mapArenaPngUrl,
    levelsJson: levelsJsonUrl,
  },
  chest: {
    chestClosed: chestClosedPngUrl,
  },
  audio: {
    collectCoin: collectCoinMp3Url,
    onGoal: onGoalMp3Url,
    onFailed: failedMp3Url,
    bgMusic: bgMusicMp3Url,
    onMoving: runningMp3Url,
  },
} as const;

export type BundleName = keyof typeof spriteBundles;
export type BundleTextures<B extends BundleName> = {
  readonly [K in keyof (typeof spriteBundles)[B]]: Lowercase<
    Extract<K, string>
  > extends `${string}atlas${string}`
    ? Spritesheet
    : B extends "audio"
      ? string
      : Texture;
};

// ────────────────────────────────────────────────────────────────────────────────
// We track at module‐level whether we’ve already called addBundle() once.
// ────────────────────────────────────────────────────────────────────────────────
let hasRegistered = false;

export function registerSpriteBundles(): void {
  if (hasRegistered) return;
  hasRegistered = true;

  for (const [bundleName, urlMap] of Object.entries(spriteBundles) as [
    string,
    Record<string, string>,
  ][]) {
    const toRegister: Record<string, string> = {};

    for (const [entryKey, url] of Object.entries(urlMap)) {
      const fullCacheKey = `${bundleName}-${entryKey}`;

      if (!Assets.cache.has(fullCacheKey)) {
        toRegister[entryKey] = url;
      }
    }

    if (Object.keys(toRegister).length > 0) {
      Assets.addBundle(bundleName, toRegister);
    }
  }
}

export async function loadBundle<B extends BundleName>(
  name: B,
): Promise<BundleTextures<B>> {
  const raw = await Assets.loadBundle(name);
  return raw as unknown as BundleTextures<B>;
}
