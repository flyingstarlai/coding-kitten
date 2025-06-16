import { useEntityQuery } from "@/game/hooks/use-entity-query.ts";
import { useTick } from "@pixi/react";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";
import { DIRECTION_DELTAS, GameConstants } from "@/game/constans.ts";
import { useMovementStore } from "@/game/store/use-movement-store.ts";
import { useDragDropStore } from "@/store/use-drag-drop-store.ts";
import { computeStars } from "@/game/utils/score-utils.ts";
import { playSound } from "@/game/utils/sound-utils.ts";

export const CommandSystem: React.FC = () => {
  const [pid] = useEntityQuery(["playerTag"]);
  const [managerEid] = useEntityQuery(["session"]);
  const mover = useMovementStore.getState();
  const ecs = useEcsStore.getState();
  const level = ecs.level;
  const initialCommands = useDragDropStore((s) => s.workspaceItems);

  useTick(() => {
    const progressFacet = ecs.getComponent(managerEid, "progress");
    if (progressFacet?.isOver) {
      return;
    }

    const gridPos = ecs.getComponent(pid, "gridPosition");
    const queue = ecs.getComponent(pid, "queue");
    const gridMoving = ecs.getComponent(pid, "gridMovement");
    const moving = mover.getComponent(pid, "movement");

    if (!queue || !gridPos || !gridMoving || !moving || !progressFacet) return;

    if (
      moving.progress < 1 ||
      gridMoving.destCol !== gridMoving.startCol ||
      gridMoving.destRow !== gridMoving.startRow
    ) {
      return;
    }

    const { commands } = queue;

    // ── END OF SEQUENCE?
    if (commands.length === 0) {
      const onGoal = level.goal.some(
        (p) => p.col === gridPos.col && p.row === gridPos.row,
      );

      const bag = ecs.getComponent(pid, "bag") || { coins: 0 };
      const collected = bag.coins;
      const totalCoins = level.collectible.length;
      const commandCount = initialCommands.length;
      const maxStep = level.maxStep;

      const stars = computeStars(
        onGoal,
        collected,
        totalCoins,
        commandCount,
        maxStep,
      );

      ecs.addComponent(managerEid, "score", { stars });

      if (onGoal) {
        playSound("onGoal");

        ecs.addComponent(managerEid, "progress", {
          isOver: true,
          onGoal: true,
        });
      } else {
        playSound("onFailed", 0.8);
        ecs.addComponent(managerEid, "progress", {
          isOver: true,
        });
        ecs.addComponent(pid, "spriteAnimation", {
          name: "whacked",
          fps: 20,
          isPlaying: false,
        });
      }

      ecs.removeComponent(pid, "queue");

      return;
    }

    //  PULL NEXT COMMAND
    const [nextCmd, ...remaining] = commands;
    const [dx, dy] = DIRECTION_DELTAS[nextCmd.command] ?? [0, 0];
    const startCol = gridPos.col,
      startRow = gridPos.row;
    const rawCol = startCol + dx;
    const rawRow = startRow + dy;

    // OUT-OF-BOUNDS pre-check
    const isOOB =
      rawCol < 0 ||
      rawCol >= GameConstants.GRID_COLS ||
      rawRow < 0 ||
      rawRow >= GameConstants.GRID_ROWS;

    // pre-check: is that target an obstacle or off-path?
    const isObstacle = level.obstacle.some(
      (p) => p.col === rawCol && p.row === rawRow,
    );
    const isValidPath =
      level.path.some((p) => p.col === rawCol && p.row === rawRow) ||
      level.start.some((p) => p.col === rawCol && p.row === rawRow) ||
      level.collectible.some((p) => p.col === rawCol && p.row === rawRow) ||
      level.goal.some((p) => p.col === rawCol && p.row === rawRow);

    ecs.setCurrentCommand(nextCmd);
    ecs.addComponent(pid, "queue", { commands: remaining });

    if (isOOB || isObstacle || !isValidPath) {
      mover.addComponent(pid, "movement", {
        progress: 0,
        duration: GameConstants.DURATION * 0.5,
      });
      ecs.addComponent(pid, "gridMovement", {
        startCol,
        startRow,
        destCol: startCol + dx * 0.5,
        destRow: startRow + dy * 0.5,
      });
      ecs.addComponent(managerEid, "progress", { isOver: true });
      ecs.removeComponent(pid, "queue");

      return;
    }

    const destCol = Math.max(0, Math.min(rawCol, GameConstants.GRID_COLS - 1));
    const destRow = Math.max(0, Math.min(rawRow, GameConstants.GRID_ROWS - 1));

    mover.addComponent(pid, "movement", {
      progress: 0,
      duration: GameConstants.DURATION,
    });
    ecs.addComponent(pid, "gridMovement", {
      startCol,
      startRow,
      destCol,
      destRow,
    });

    if (nextCmd.command !== "scratch") {
      ecs.addComponent(pid, "facing", { direction: nextCmd.command });
    }

    ecs.addComponent(pid, "spriteAnimation", {
      name: "walk",
      fps: 8,
      isPlaying: true,
    });
  });

  return null;
};
