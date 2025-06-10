import type { GoalTagFacet } from "@/game/types.ts";
import { useEntityId } from "@/game/hooks/use-entity-id.ts";
import useAddComponent from "@/game/hooks/use-add-component.ts";
import useRemoveComponent from "@/game/hooks/use-remove-component.ts";
import { useEffect } from "react";

export const GoalTag: React.FC<GoalTagFacet> = () => {
  const eid = useEntityId();
  const addComponent = useAddComponent();
  const removeComponent = useRemoveComponent();

  useEffect(() => {
    addComponent(eid, "goalTag", { id: eid });
    return () => {
      removeComponent(eid, "goalTag");
    };
  }, [addComponent, eid, removeComponent]);

  return null;
};
