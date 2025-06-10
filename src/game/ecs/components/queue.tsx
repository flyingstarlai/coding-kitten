import type { QueueFacet } from "@/game/types.ts";
import { useEntityId } from "@/game/hooks/use-entity-id.ts";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";
import { useEffect } from "react";

export const Queue: React.FC<QueueFacet> = ({ commands }) => {
  const eid = useEntityId();
  const addComponent = useEcsStore((s) => s.addComponent);
  const removeComponent = useEcsStore((s) => s.removeComponent);

  useEffect(() => {
    // Register the queue on mount
    addComponent(eid, "queue", { commands: [...commands] });

    // Clean up on unmount
    return () => {
      removeComponent(eid, "queue");
    };
    // We only want to run this once on mount/unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
