import { useTick } from "@pixi/react";
import { useEntityQuery } from "@/game/hooks/use-entity-query.ts";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";
import { useMovementStore } from "@/game/store/use-movement-store.ts";
import { useAssets } from "@/game/provider/asset-context.ts";

export const MovementSoundSystem: React.FC = () => {
  const { audio } = useAssets();
  // 1) Who’s the player?
  const [playerEid] = useEntityQuery(["playerTag"]);
  // 2) And the global play‐session so we know when to shut off
  const [managerEid] = useEntityQuery(["managerTag"]);

  const ecs = useEcsStore.getState();
  const mover = useMovementStore.getState();

  const isFocus = () => document.hasFocus();

  useTick(() => {
    if (playerEid == null || managerEid == null) {
      return;
    }
    if (!isFocus()) return;

    const moving = mover.getComponent(playerEid, "movement");

    // a) If the session is over, stop any running sound and bail
    const progressFacet = ecs.getComponent(managerEid, "progress");
    if (progressFacet?.isOver && moving && moving.progress === 1) {
      // instanceRef.current?.stop();
      // instanceRef.current = null;
      audio.onMoving.stop();
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

    if (isMoving && !audio.onMoving.isPlaying) {
      audio.onMoving.play({ volume: 0.8, speed: 0.5, loop: true });
    }
  });

  return null;
};
