import React, { useEffect } from "react";
import type { TileFacet } from "@/game/types.ts";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";
import { useEntityId } from "@/game/hooks/use-entity-id.ts";

export const Tile: React.FC<TileFacet> = ({ col, row, kind }) => {
  const eid = useEntityId();
  const addComponent = useEcsStore((s) => s.addComponent);
  const removeComponent = useEcsStore((s) => s.removeComponent);

  useEffect(() => {
    addComponent(eid, "tile", { col, row, kind });
    return () => {
      removeComponent(eid, "tile");
    };
  }, [eid, col, row, kind, addComponent, removeComponent]);

  return null;
};
