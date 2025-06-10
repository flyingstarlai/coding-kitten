import { useEffect } from "react";
import { useEntityId } from "@/game/hooks/use-entity-id.ts";
import useAddComponent from "@/game/hooks/use-add-component.ts";
import useRemoveComponent from "@/game/hooks/use-remove-component.ts";

export const Bag: React.FC<{ coins: number }> = ({ coins }) => {
  const eid = useEntityId();
  const addComponent = useAddComponent();
  const removeComponent = useRemoveComponent();
  useEffect(() => {
    addComponent(eid, "bag", { coins });
    return () => {
      removeComponent(eid, "bag");
    };
  }, [eid, addComponent, coins, removeComponent]);
  return null;
};
