import { useEffect } from "react";
import { useEntityId } from "@/game/hooks/use-entity-id.ts";
import useAddComponent from "@/game/hooks/use-add-component.ts";
import useRemoveComponent from "@/game/hooks/use-remove-component.ts";

export const Score: React.FC<{ stars: number }> = ({ stars }) => {
  const eid = useEntityId();
  const addComponent = useAddComponent();
  const removeComponent = useRemoveComponent();
  useEffect(() => {
    addComponent(eid, "score", { stars });
    return () => {
      removeComponent(eid, "score");
    };
  }, [eid, addComponent, removeComponent, stars]);
  return null;
};
