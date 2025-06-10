import type { PositionFacet } from "@/game/types.ts";
import { useEntityId } from "@/game/hooks/use-entity-id.ts";
import { useEffect } from "react";
import { useMovementStore } from "@/game/store/use-movement-store.ts";

export const Position: React.FC<PositionFacet> = ({ x, y }) => {
  const eid = useEntityId();
  const addComponent = useMovementStore((s) => s.addComponent);
  const removeComponent = useMovementStore((s) => s.removeComponent);

  useEffect(() => {
    addComponent(eid, "position", { x, y });
    return () => {
      removeComponent(eid, "position");
    };
  }, [addComponent, eid, removeComponent, x, y]);

  return null;
};
