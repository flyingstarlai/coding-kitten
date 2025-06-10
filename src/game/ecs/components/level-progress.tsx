import type { LevelProgressFacet } from "@/game/types.ts";
import { useEntityId } from "@/game/hooks/use-entity-id.ts";
import useAddComponent from "@/game/hooks/use-add-component.ts";
import useRemoveComponent from "@/game/hooks/use-remove-component.ts";
import { useEffect } from "react";

export const LevelProgress: React.FC<LevelProgressFacet> = ({
  isOver,
  onGoal,
}) => {
  const eid = useEntityId();
  const addComponent = useAddComponent();
  const removeComponent = useRemoveComponent();

  useEffect(() => {
    addComponent(eid, "progress", { isOver, onGoal });
    return () => {
      removeComponent(eid, "session");
    };
  }, [addComponent, eid, isOver, onGoal, removeComponent]);

  return null;
};
