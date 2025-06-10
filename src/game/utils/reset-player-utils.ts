// src/game/utils/reset-player.ts
import { useEcsStore } from "@/game/store/use-ecs-store";
import { useMovementStore } from "@/game/store/use-movement-store";
import { getCenteredTilePosition } from "@/game/utils/tile-utils";
import type { GameLevel } from "@/game/types";
import { GameConstants } from "@/game/constans.ts";
import { nanoid } from "nanoid";

/**
 * Reset a player entity to the level’s first “start” tile,
 * then show a popup saying “You died! Resetting to start.”
 */
export function resetPlayerToStart(
  playerEid: number,
  managerEid: number,
  level: GameLevel,
) {
  const ecs = useEcsStore.getState();
  const mover = useMovementStore.getState();

  const collectibleIds = Object.keys(ecs.components.collectibleTag).map((k) =>
    Number(k),
  );
  collectibleIds.forEach((id) => {
    ecs.removeEntity(id);
  });

  // Pick the level’s first start tile (fallback to (0,0) if none)
  const [st] = level.start.length > 0 ? level.start : [{ col: 0, row: 0 }];
  const sc = st.col,
    sr = st.row;

  // 1) Reset ECS  gridPosition & gridMovement
  ecs.addComponent(playerEid, "gridPosition", { col: sc, row: sr });
  ecs.addComponent(playerEid, "gridMovement", {
    startCol: sc,
    startRow: sr,
    destCol: sc,
    destRow: sr,
  });

  // 2) Reset the pixel position & progress in MovementStore
  const { x: px, y: py } = getCenteredTilePosition(sc, sr);
  mover.addComponent(playerEid, "position", { x: px, y: py });
  mover.addComponent(playerEid, "movement", {
    progress: 1,
    duration: GameConstants.DURATION,
  });

  // 3) Switch sprite back to “idle” and clear any currentCommand
  ecs.addComponent(playerEid, "spriteAnimation", {
    name: "idle",
    fps: 20,
    isPlaying: true,
  });
  ecs.setCurrentCommand(null);

  ecs.addComponent(playerEid, "facing", { direction: level.facing });

  ecs.addComponent(managerEid, "progress", {
    isOver: false,
  });

  ecs.addComponent(managerEid, "session", {
    session: nanoid(6),
  });

  ecs.removeComponent(playerEid, "queue");

  ecs.addComponent(playerEid, "bag", { coins: 0 });
}
