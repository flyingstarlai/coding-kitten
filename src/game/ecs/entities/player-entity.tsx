import { EntityProvider } from "@/game/provider/entity-provider.tsx";
import { GridPosition } from "@/game/ecs/components/grid-position.tsx";
import { Position } from "@/game/ecs/components/position.tsx";
import { GridMovement } from "@/game/ecs/components/grid-movement.tsx";
import { getCenteredTilePosition } from "@/game/utils/tile-utils.ts";
import { SpriteAnimation } from "@/game/ecs/components/sprite-animation.tsx";
import { GameConstants } from "@/game/constans.ts";
import { PlayerTag } from "@/game/ecs/components/player-tag.tsx";
import { Movement } from "@/game/ecs/components/movement.tsx";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";
import { useMemo } from "react";
import { useCreateEntity } from "@/game/hooks/use-create-entity.ts";
import { Facing } from "@/game/ecs/components/facing.tsx";
import { Bag } from "@/game/ecs/components/bag.tsx";

interface PlayerProps {
  size?: number;
}

export const PlayerEntity: React.FC<PlayerProps> = () => {
  const eid = useCreateEntity();

  // 1) Subscribe to `level` so that when it changes, this component re-renders
  const level = useEcsStore((s) => s.level);

  // 2) useMemo to extract [col,row] from the first start tile and compute pixel
  const { col, row, pixelX, pixelY } = useMemo(() => {
    const [startTile] =
      level.start.length > 0 ? level.start : [{ col: 0, row: 0 }];
    const sc = startTile.col;
    const sr = startTile.row;
    const { x: px, y: py } = getCenteredTilePosition(sc, sr);
    return { col: sc, row: sr, pixelX: px, pixelY: py };
  }, [level.start]);

  console.log("spawning player at grid", col, row, "→ pixels", pixelX, pixelY);
  // 3) If there’s no start tile at all, render nothing
  if (eid === null || level.start.length === 0) {
    return null;
  }

  // 4) Wrap everything in <EntityProvider> so that all child facets can register themselves:
  return (
    <EntityProvider eid={eid}>
      <PlayerTag />

      <GridPosition col={col} row={row} />

      <Position x={pixelX} y={pixelY} />

      <Movement progress={1} duration={GameConstants.DURATION} />

      <GridMovement startCol={col} startRow={row} destCol={col} destRow={row} />

      <SpriteAnimation name="idle" fps={20} isPlaying={true} />

      <Facing direction={level.facing} />
      <Bag coins={0} />
    </EntityProvider>
  );
};
