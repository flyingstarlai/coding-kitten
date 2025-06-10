import React, { useEffect } from "react";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";
import type { GridPositionFacet } from "@/game/types.ts";
import { useEntityId } from "@/game/hooks/use-entity-id.ts";

/**
 * <GridPosition col={number} row={number} />
 *  - Attaches a { gridPosition: { col, row } } component to the current entity
 */
export const GridPosition: React.FC<GridPositionFacet> = ({ col, row }) => {
  const eid = useEntityId();
  const addComponent = useEcsStore((s) => s.addComponent);
  const removeComponent = useEcsStore((s) => s.removeComponent);

  useEffect(() => {
    addComponent(eid, "gridPosition", { col, row });

    return () => {
      removeComponent(eid, "gridPosition");
    };
  }, [eid, addComponent, removeComponent, col, row]);

  return null;
};
