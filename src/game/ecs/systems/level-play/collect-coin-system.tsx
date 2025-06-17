import { useTick } from "@pixi/react";
import { useEntityQuery } from "@/game/hooks/use-entity-query.ts";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";
import { useAssets } from "@/game/provider/asset-context.ts";

export const CollectCoinSystem: React.FC = () => {
  const { audio } = useAssets();
  const [pid] = useEntityQuery(["playerTag", "gridPosition"]);
  const coins = useEntityQuery(["collectibleTag", "gridPosition"]);
  const ecs = useEcsStore.getState();

  useTick(() => {
    const pGrid = ecs.getComponent(pid, "gridPosition");
    if (!pGrid) return;

    for (const cid of coins) {
      const cGrid = ecs.getComponent(cid, "gridPosition");
      if (!cGrid) continue;

      if (pGrid.col === cGrid.col && pGrid.row === cGrid.row) {
        audio.collectCoin.play();
        ecs.removeEntity(cid);

        const bag = ecs.getComponent(pid, "bag") ?? { coins: 0 };
        ecs.addComponent(pid, "bag", { coins: bag.coins + 1 });
      }
    }
  });

  return null;
};
