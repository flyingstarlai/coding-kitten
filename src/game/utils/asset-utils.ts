import { Assets, Spritesheet, Texture } from "pixi.js";

// Import URLs via Vite
import catAtlasJsonUrl from "@/game/assets/cat_atlas.json?url";
import catSheetPngUrl from "@/game/assets/cat_sheet.png?url";
import coinAtlasJsonUrl from "@/game/assets/coin_atlas.json?url";
import coinSheetPngUrl from "@/game/assets/coin_sheet.png?url";
import mapArenaJsonUrl from "@/game/assets/map_arena.json?url";
import mapArenaPngUrl from "@/game/assets/map_arena.png?url";
import levelsJsonUrl from "@/game/assets/levels.json?url";
import chestClosedPngUrl from "@/game/assets/chest_closed.png?url";
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
 * Maps each bundle entry key to the appropriate type:
 * - keys containing 'atlas' → Spritesheet
 * - audio bundle → string URL
 * - else → PIXI.Texture
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
 * Register all bundles with Pixi's global Assets system.
 * Uses `bundleName-entryKey` as the cache key to avoid collisions.
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
    if (Object.keys(toRegister).length) {
      Assets.addBundle(bundleName, toRegister);
    }
  }
}

/**
 * Load a generic bundle: returns raw entries (Textures, strings, or parsed JSON).
 * Does NOT parse atlas JSON into Spritesheet.
 */
export async function loadBundle<B extends BundleName>(
  name: B,
): Promise<BundleTextures<B>> {
  const entries = await Assets.loadBundle(name);
  return entries as BundleTextures<B>;
}

/**
 * Load *and* parse a Tiled‐style atlas bundle into a Spritesheet.
 * It finds the JSON entry (has `frames` + `meta`) and its matching Texture,
 * then runs `Spritesheet.parse()` before returning.
 */
export async function loadBundleAtlas<B extends BundleName>(
  name: B,
): Promise<Spritesheet> {
  // Load raw entries
  const entries = (await Assets.loadBundle(name)) as Record<
    string,
    Spritesheet | Texture
  >;

  // Find the atlas JSON object
  const atlasKey = Object.keys(entries).find((k) => /atlas$/i.test(k));
  if (!atlasKey) {
    throw new Error(`No atlas JSON found in bundle "${name}"`);
  }

  console.log("AtlasKey", atlasKey);
  const atlasJson = entries[atlasKey] as Spritesheet;

  console.log("AtlasJson", atlasJson);

  // Find a Texture entry to use as the sheet image
  const sheetKey = Object.keys(entries).find(
    (k) => k !== atlasKey && entries[k] instanceof Texture,
  );
  if (!sheetKey) {
    throw new Error(`No sheet Texture found in "${name}" bundle`);
  }
  const sheetTexture = entries[sheetKey] as Texture;

  // Construct and parse the Spritesheet
  const sheet = new Spritesheet(sheetTexture, atlasJson.data);
  await sheet.parse();

  return sheet;
}
