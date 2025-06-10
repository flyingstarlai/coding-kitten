import { useCreateEntity } from "@/game/hooks/use-create-entity.ts";
import { EntityProvider } from "@/game/provider/entity-provider.tsx";
import { SpriteAnimation } from "@/game/ecs/components/sprite-animation.tsx";
import { CollectibleTag } from "@/game/ecs/components/collectible-tag.tsx";
import { GridPosition } from "@/game/ecs/components/grid-position.tsx";

export const CoinEntity: React.FC<{ col: number; row: number }> = ({
  col,
  row,
}) => {
  const eid = useCreateEntity();

  if (eid === null) {
    return null;
  }

  return (
    <EntityProvider eid={eid}>
      <CollectibleTag />
      <GridPosition col={col} row={row} />
      <SpriteAnimation name="rotate" fps={8} isPlaying={true} />
    </EntityProvider>
  );
};
