import React, { useEffect } from "react";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";
import type { FacingFacet } from "@/game/types.ts";
import { useEntityId } from "@/game/hooks/use-entity-id.ts";

export const Facing: React.FC<FacingFacet> = ({ direction }) => {
  const eid = useEntityId();
  const addComponent = useEcsStore((s) => s.addComponent);
  const removeComponent = useEcsStore((s) => s.removeComponent);

  useEffect(() => {
    addComponent(eid, "facing", { direction });
    return () => {
      removeComponent(eid, "facing");
    };
  }, [eid, direction, addComponent, removeComponent]);

  return null;
};
