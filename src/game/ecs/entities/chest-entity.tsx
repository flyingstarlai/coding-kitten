import { useCreateEntity } from "@/game/hooks/use-create-entity.ts";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";
import { useMemo } from "react";
import { EntityProvider } from "@/game/provider/entity-provider.tsx";
import { GridPosition } from "@/game/ecs/components/grid-position.tsx";
import { GoalTag } from "@/game/ecs/components/goal-tag.tsx";

export const ChestEntity: React.FC = () => {
  const eid = useCreateEntity();
  const level = useEcsStore((s) => s.level);

  const { col, row } = useMemo(() => {
    const [goal] = level.goal.length > 0 ? level.goal : [{ col: 0, row: 0 }];
    return goal;
  }, [level.goal]);

  if (eid === null) {
    return null;
  }

  return (
    <EntityProvider eid={eid}>
      <GoalTag />
      <GridPosition col={col} row={row} />
    </EntityProvider>
  );
};
