import { sound } from "@pixi/sound";
import type { BundleTextures } from "./asset-utils";

/**
 * Play a named sound effect.
 */
export function playSound(
  key: keyof BundleTextures<"audio">,
  volume: number = 1,
  speed: number = 1,
) {
  if (document.hasFocus()) {
    return sound.play(key as string, { start: 0, volume, speed });
  }
}
