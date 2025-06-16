import React, { useRef } from "react";
import { useTick } from "@pixi/react";
import { type IMediaInstance } from "@pixi/sound";
import { useEntityQuery } from "@/game/hooks/use-entity-query.ts";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";
import { useMovementStore } from "@/game/store/use-movement-store.ts";
import { playSound } from "@/game/utils/sound-utils.ts";

export const MovementSoundSystem: React.FC = () => {
  // 1) Who’s the player?
  const [playerEid] = useEntityQuery(["playerTag"]);
  // 2) And the global play‐session so we know when to shut off
  const [managerEid] = useEntityQuery(["managerTag"]);

  const ecs = useEcsStore.getState();
  const mover = useMovementStore.getState();

  const isFocus = () => document.hasFocus();

  // Tracks the current looping SoundInstance
  const instanceRef = useRef<IMediaInstance | null>(null);

  useTick(() => {
    if (playerEid == null || managerEid == null) {
      return;
    }
    if (!isFocus()) return;

    const moving = mover.getComponent(playerEid, "movement");

    // a) If the session is over, stop any running sound and bail
    const progressFacet = ecs.getComponent(managerEid, "progress");
    if (progressFacet?.isOver && moving && moving.progress === 1) {
      instanceRef.current?.stop();
      instanceRef.current = null;
      return;
    }

    // b) Check if the player is mid‐move
    const moveFacet = mover.getComponent(playerEid, "movement");
    const gridMov = ecs.getComponent(playerEid, "gridMovement");
    const isMoving =
      moveFacet !== undefined &&
      gridMov !== undefined &&
      (gridMov.destCol !== gridMov.startCol ||
        gridMov.destRow !== gridMov.startRow) &&
      moveFacet.progress < 1;

    if (isMoving) {
      // if not already playing, start the loop
      if (!instanceRef.current) {
        instanceRef.current = playSound("onMoving", 0.8, 0.5) as IMediaInstance;
      }
    } else {
      // no longer moving → stop the loop
      instanceRef.current?.stop();
      instanceRef.current = null;
    }
  });

  return null;
};
