import { useEntityQuery } from "@/game/hooks/use-entity-query.ts";
import React from "react";
import { CoinSprite } from "@/game/components/coin-sprite.tsx";

export const CoinsRenderSystem: React.FC = () => {
  const entities = useEntityQuery(["collectibleTag"]);
  return (
    <>
      {entities.map((eid) => (
        <CoinSprite key={eid} eid={eid} />
      ))}
    </>
  );
};
