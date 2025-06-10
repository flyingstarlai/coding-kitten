import React, { useEffect } from "react";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";
import type { SpriteAnimationFacet } from "@/game/types.ts";
import { useEntityId } from "@/game/hooks/use-entity-id.ts";

/**
 * <SpriteAnimation name="idle" fps={8} isPlaying={true} />
 *  - Attaches { spriteAnimation: { name, fps, isPlaying } } to the current entity.
 */
export const SpriteAnimation: React.FC<SpriteAnimationFacet> = ({
  name,
  fps,
  isPlaying,
}) => {
  const eid = useEntityId();
  const addComponent = useEcsStore((s) => s.addComponent);
  const removeComponent = useEcsStore((s) => s.removeComponent);

  useEffect(() => {
    addComponent(eid, "spriteAnimation", { name, fps, isPlaying });
    return () => {
      removeComponent(eid, "spriteAnimation");
    };
  }, [eid, name, fps, isPlaying, addComponent, removeComponent]);

  return null;
};
