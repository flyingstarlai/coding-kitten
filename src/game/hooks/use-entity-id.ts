import { useContext } from "react";

import { EntityContext } from "@/game/provider/entity-context.ts";

export function useEntityId(): number {
  const id = useContext(EntityContext);
  if (id === null) {
    throw new Error("useEntityId must be inside an <EntityProvider>");
  }
  return id;
}
