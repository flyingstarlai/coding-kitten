// src/game/utils/asset-utils.ts

import { Assets, Spritesheet, Texture } from "pixi.js";

// IMPORTANT: always import JSON/PNG/MP3 as a URL string, not a parsed object
import catAtlasJsonUrl from "@/game/assets/cat_atlas.json?url";
import catSheetPngUrl from "@/game/assets/cat_sheet.png?url";
import coinAtlasJsonUrl from "@/game/assets/coin_atlas.json?url";
import coinSheetPngUrl from "@/game/assets/coin_sheet.png?url";
import mapArenaJsonUrl from "@/game/assets/map_arena.json?url";
import mapArenaPngUrl from "@/game/assets/map_arena.png?url";
import levelsJsonUrl from "@/game/assets/levels.json?url";
import chestClosedPngUrl from "@/game/assets/chest_closed.png?url";

// AUDIO
import collectCoinMp3Url from "@/game/assets/sounds/collect_coin.mp3?url";
import onGoalMp3Url from "@/game/assets/sounds/on_goal.mp3?url";
import failedMp3Url from "@/game/assets/sounds/failed.mp3?url";
import bgMusicMp3Url from "@/game/assets/sounds/bg_sound.mp3?url";
import runningMp3Url from "@/game/assets/sounds/running_in_grass.mp3?url";

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

/**
 * For each bundle, any key containing "atlas" (case-insensitive) maps to Spritesheet,
 * keys in the "audio" bundle map to string (URL),
 * everything else is a PIXI.Texture.
 */
export type BundleTextures<B extends BundleName> = {
  readonly [K in keyof (typeof spriteBundles)[B]]: Lowercase<
    Extract<K, string>
  > extends `${string}atlas${string}`
    ? Spritesheet
    : B extends "audio"
      ? string
      : Texture;
};

let hasRegistered = false;

/**
 * Register all sprite and JSON URLs with Pixi Assets,
 * prefixing cache keys by bundleName-entryKey to avoid collisions.
 */
export function registerSpriteBundles(): void {
  if (hasRegistered) return;
  hasRegistered = true;

  for (const [bundleName, urlMap] of Object.entries(spriteBundles) as [
    BundleName,
    Record<string, string>,
  ][]) {
    const toRegister: Record<string, string> = {};
    for (const [entryKey, url] of Object.entries(urlMap)) {
      const cacheKey = `${bundleName}-${entryKey}`;
      if (!Assets.cache.has(cacheKey)) {
        toRegister[entryKey] = url;
      }
    }
    if (Object.keys(toRegister).length > 0) {
      Assets.addBundle(bundleName, toRegister);
    }
  }
}

/**
 * Load one bundle from Pixi's Assets system.
 * Automatically parses any Tiled‐style JSON atlas into a Spritesheet.
 */
export async function loadBundle<B extends BundleName>(
  name: B,
): Promise<BundleTextures<B>> {
  // Load all entries in the bundle: URLs → Texture for images, raw objects for JSON
  const entries = (await Assets.loadBundle(name)) as Record<string, any>;

  // Detect any JSON atlas (it will be an object with `frames` and `meta`)
  for (const key of Object.keys(entries)) {
    const val = entries[key];
    if (val && typeof val === "object" && val.frames && val.meta) {
      // Find the matching image Texture in this bundle
      const sheetKey = Object.keys(entries).find(
        (k) => k !== key && entries[k] instanceof Texture,
      );
      if (sheetKey) {
        const sheetTex = entries[sheetKey] as Texture;
        // Create and parse the Spritesheet
        const sheet = new Spritesheet(sheetTex, val);
        await sheet.parse();
        // Replace the JSON entry with the parsed Spritesheet
        entries[key] = sheet;
      }
      break;
    }
  }

  return entries as unknown as BundleTextures<B>;
}
