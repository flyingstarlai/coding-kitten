import { useEcsStore } from "@/game/store/use-ecs-store.ts";
import { useEntityQuery } from "@/game/hooks/use-entity-query.ts";
import { useTick } from "@pixi/react";
import type {
  LevelProgressFacet,
  GridPositionFacet,
  TileKind,
} from "@/game/types.ts";
import { useRef } from "react";

export const CollisionSystem: React.FC = () => {
  const level = useEcsStore((s) => s.level);
  const ecs = useEcsStore.getState();
  const [playerEid] = useEntityQuery(["playerTag"]);
  const [managerEid] = useEntityQuery(["session"]);

  const prevGridPosRef = useRef<GridPositionFacet | null>(null);
  const prevGameOverRef = useRef<LevelProgressFacet | null>(null);

  /**
   * Whenever you’re inside a fast loop like useTick, you really want to avoid React subscriptions (useEcsStore(selector)) and usePrevious (which only updates on React renders), because:
   *    •	Subscriptions will cause your component to re‐render every time that slice changes (potentially dozens of times per second).
   *    •	usePrevious only tracks values between React renders, not between your 60Hz tick callbacks.
   *
   **/
  useTick(() => {
    if (playerEid === undefined || managerEid === undefined) return;
    const curGrid = ecs.getComponent(playerEid, "gridPosition");
    const curProgress = ecs.getComponent(managerEid, "progress");

    if (!curGrid || !curProgress) return;

    const prevGameOver = prevGameOverRef.current;
    if (prevGameOver && !prevGameOver.isOver && curProgress.isOver) {
      prevGameOverRef.current = curProgress;
      prevGridPosRef.current = curGrid;
      return;
    }

    if (curProgress.isOver) {
      prevGameOverRef.current = curProgress;
      prevGridPosRef.current = curGrid;
      return;
    }

    const previousGrid = prevGridPosRef.current;
    if (
      previousGrid &&
      previousGrid.col === curGrid.col &&
      previousGrid.row === curGrid.row
    ) {
      return;
    }

    const { col, row } = curGrid;

    // Helper to check if (col,row) is in a given array
    const isInList = (
      list: Array<{ col: number; row: number }>,
      c: number,
      r: number,
    ) => list.some((p) => p.col === c && p.row === r);

    const isObstacle = isInList(level.obstacle, col, row);
    const isStart = isInList(level.start, col, row);
    const isPath = isInList(level.path, col, row);
    const isCollect = isInList(level.collectible, col, row);
    const isGoal = isInList(level.goal, col, row);
    const kind: TileKind = isObstacle
      ? "obstacle"
      : isPath
        ? "path"
        : isStart
          ? "start"
          : isCollect
            ? "collectible"
            : isGoal
              ? "goal"
              : "empty";

    // 8) If "empty" or "obstacle", reset the player
    if (kind === "empty" || kind === "obstacle") {
      ecs.addComponent(managerEid, "progress", { isOver: true });
      ecs.addComponent(playerEid, "spriteAnimation", {
        name: "whacked",
        fps: 20,
        isPlaying: true,
      });
      // ecs.removeComponent(playerEid, "queue");
    }

    prevGameOverRef.current = curProgress;
    prevGridPosRef.current = curGrid;
  });

  return null;
};
