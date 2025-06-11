import { useCreateEntity } from "@/game/hooks/use-create-entity.ts";
import { EntityProvider } from "@/game/provider/entity-provider.tsx";
import { PlaySession } from "@/game/ecs/components/play-session.tsx";
import { nanoid } from "nanoid";
import { LevelProgress } from "@/game/ecs/components/level-progress.tsx";
import { Score } from "@/game/ecs/components/score.tsx";
import { ManagerTag } from "@/game/ecs/components/manager-tag.tsx";

export const GameManagerEntity: React.FC = () => {
  const eid = useCreateEntity();

  if (eid == null) {
    return null;
  }

  return (
    <EntityProvider eid={eid}>
      <ManagerTag />
      <PlaySession session={nanoid(6)} />
      <LevelProgress isOver={false} onGoal={false} />
      <Score stars={0} />
    </EntityProvider>
  );
};
