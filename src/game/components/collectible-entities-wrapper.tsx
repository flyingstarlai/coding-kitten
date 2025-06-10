import React, { useMemo } from "react";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";
import { CoinEntity } from "@/game/ecs/entities/coin-entity.tsx";
import { useEntityQuery } from "@/game/hooks/use-entity-query.ts";

export const CollectibleEntitiesWrapper: React.FC = () => {
  const ecs = useEcsStore.getState();
  const [managerEid] = useEntityQuery(["session"]);
  const session = useEcsStore((s) =>
    managerEid != null ? s.getComponent(managerEid, "session") : null,
  );

  const collectibles = useMemo(() => {
    if (session) {
      return ecs.level.collectible;
    }
    return [];
  }, [ecs.level.collectible, session]);

  if (!session) return null;

  return (
    <>
      {collectibles.map(({ col, row }, idx) => (
        <CoinEntity
          key={`${session.session}_collectible_${idx}`}
          col={col}
          row={row}
        />
      ))}
    </>
  );
};
