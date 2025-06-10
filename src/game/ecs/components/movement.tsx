import { useEntityId } from "@/game/hooks/use-entity-id.ts";
import { useEffect } from "react";
import { useMovementStore } from "@/game/store/use-movement-store.ts";
import type { MovementFacet } from "@/game/types.ts";

export const Movement: React.FC<MovementFacet> = ({ progress, duration }) => {
  const eid = useEntityId();
  const addComponent = useMovementStore((s) => s.addComponent);
  const removeComponent = useMovementStore((s) => s.removeComponent);
  useEffect(() => {
    addComponent(eid, "movement", { progress, duration });
    return () => {
      removeComponent(eid, "movement");
    };
  }, [addComponent, duration, eid, progress, removeComponent]);

  return null;
};
