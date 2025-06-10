import type { GridMovementFacet } from "@/game/types.ts";
import { useEntityId } from "@/game/hooks/use-entity-id.ts";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";
import { useEffect } from "react";

export const GridMovement: React.FC<GridMovementFacet> = ({
  startCol,
  startRow,
  destCol,
  destRow,
}) => {
  const eid = useEntityId();
  const addComponent = useEcsStore((s) => s.addComponent);
  const removeComponent = useEcsStore((s) => s.removeComponent);

  useEffect(() => {
    addComponent(eid, "gridMovement", {
      startCol,
      startRow,
      destCol,
      destRow,
    });
    return () => {
      removeComponent(eid, "gridMovement");
    };
  }, [
    eid,
    startCol,
    startRow,
    destCol,
    destRow,
    addComponent,
    removeComponent,
  ]);

  return null;
};
