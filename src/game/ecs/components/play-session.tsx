import type { PlaySessionFacet } from "@/game/types.ts";
import { useEntityId } from "@/game/hooks/use-entity-id.ts";
import useAddComponent from "@/game/hooks/use-add-component.ts";
import useRemoveComponent from "@/game/hooks/use-remove-component.ts";
import { useEffect } from "react";

export const PlaySession: React.FC<PlaySessionFacet> = ({ session }) => {
  const eid = useEntityId();
  const addComponent = useAddComponent();
  const removeComponent = useRemoveComponent();

  useEffect(() => {
    addComponent(eid, "session", { session });
    return () => {
      removeComponent(eid, "session");
    };
  }, [addComponent, eid, removeComponent, session]);

  return null;
};
