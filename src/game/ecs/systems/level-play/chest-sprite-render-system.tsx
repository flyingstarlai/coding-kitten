import { useEcsStore } from "@/game/store/use-ecs-store.ts";
import { useEntityQuery } from "@/game/hooks/use-entity-query.ts";
import { useAssets } from "@/game/provider/asset-context.ts";
import { getCenteredTilePosition } from "@/game/utils/tile-utils.ts";
import { useRef } from "react";
import type { Sprite } from "pixi.js";
import { useTick } from "@pixi/react";

export const ChestSpriteRenderSystem: React.FC = () => {
  const [eid] = useEntityQuery(["goalTag"]);
  const [manEid] = useEntityQuery(["session"]);
  const ecs = useEcsStore.getState();
  const { chest } = useAssets();

  const gridFacet = ecs.getComponent(eid, "gridPosition");

  const spriteRef = useRef<Sprite>(null);

  const elapsed = useRef(0);

  // Configuration:
  const WIGGLE_DURATION = 0.5; // seconds of active wiggle
  const PAUSE_DURATION = 1.5; // seconds of rest
  const CYCLE_LENGTH = WIGGLE_DURATION + PAUSE_DURATION;
  const FREQUENCY = 4; // wiggles per second during wiggle-phase
  const AMPLITUDE = 5 * (Math.PI / 180); // ±5°

  useTick((ticker) => {
    const spr = spriteRef.current;
    if (!spr) return;

    const progressFacet = ecs.getComponent(manEid, "progress");

    if (progressFacet?.isOver) {
      spr.rotation = 0;
      return;
    }

    // advance our clock
    const dt = ticker.deltaTime / (ticker.FPS || 60);
    elapsed.current += dt;

    // figure out where we are in the cycle [0 … CYCLE_LENGTH)
    const t = elapsed.current % CYCLE_LENGTH;

    if (t < WIGGLE_DURATION) {
      // map t∈[0…WIGGLE_DURATION) into a sine wave
      // we want FREQUENCY wiggles per second, so:
      const phase = (t / WIGGLE_DURATION) * FREQUENCY * 2 * Math.PI;
      spr.rotation = Math.sin(phase) * AMPLITUDE;
    } else {
      // in the pause phase → reset rotation to 0
      spr.rotation = 0;
    }
  });

  if (!gridFacet) return null;

  const { x, y } = getCenteredTilePosition(gridFacet.col, gridFacet.row);

  return (
    <pixiSprite
      ref={spriteRef}
      texture={chest.chestClosed}
      anchor={0.5}
      scale={0.6}
      x={x}
      y={y}
    />
  );
};
