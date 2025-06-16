import { useEntityQuery } from "@/game/hooks/use-entity-query.ts";
import { useTick } from "@pixi/react";
import { getCenteredTilePosition } from "@/game/utils/tile-utils.ts";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";
import { useMovementStore } from "@/game/store/use-movement-store.ts";
import { playSound } from "@/game/utils/sound-utils.ts";

export const MovementSystem: React.FC = () => {
  const entities = useEntityQuery(["playerTag"]);
  const ecs = useEcsStore.getState();
  const mover = useMovementStore.getState();
  const [managerEid] = useEntityQuery(["session"]);

  useTick((ticker) => {
    const deltaSeconds = ticker.deltaTime / (ticker.FPS || 60);

    for (const eid of entities) {
      const moving = mover.getComponent(eid, "movement");
      const gridMoving = ecs.getComponent(eid, "gridMovement");
      if (!gridMoving || !moving) return;

      // If entity is already at its destination and fully progressed, skip
      if (
        gridMoving.startCol === gridMoving.destCol &&
        gridMoving.startRow === gridMoving.destRow &&
        moving.progress >= 1
      ) {
        return;
      }

      let newProgress = moving.progress + deltaSeconds / moving.duration;
      if (newProgress > 1) newProgress = 1;

      const startPos = getCenteredTilePosition(
        gridMoving.startCol,
        gridMoving.startRow,
      );
      const endPos = getCenteredTilePosition(
        gridMoving.destCol,
        gridMoving.destRow,
      );

      const newX = startPos.x + (endPos.x - startPos.x) * newProgress;
      const newY = startPos.y + (endPos.y - startPos.y) * newProgress;

      mover.addComponent(eid, "position", { x: newX, y: newY });
      mover.addComponent(eid, "movement", {
        progress: newProgress,
        duration: moving.duration,
      });

      if (newProgress === 1) {
        ecs.addComponent(eid, "gridPosition", {
          col: gridMoving.destCol,
          row: gridMoving.destRow,
        });
        ecs.addComponent(eid, "gridMovement", {
          startCol: gridMoving.destCol,
          startRow: gridMoving.destRow,
          destCol: gridMoving.destCol,
          destRow: gridMoving.destRow,
        });

        const queue = ecs.getComponent(eid, "queue");
        const progressFacet = ecs.getComponent(managerEid, "progress");
        if (progressFacet?.isOver) {
          playSound("onFailed", 0.5);

          ecs.addComponent(managerEid, "score", {
            stars: 0,
          });

          ecs.addComponent(eid, "spriteAnimation", {
            name: "whacked",
            fps: 20,
            isPlaying: true,
          });
        } else if (queue === undefined || queue.commands.length === 0) {
          ecs.addComponent(eid, "spriteAnimation", {
            name: "idle",
            fps: 20,
            isPlaying: true,
          });
        }
        // ecs.setCurrentCommand(null);
      }
    }
  });

  return null;
};
