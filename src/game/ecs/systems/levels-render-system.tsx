import React from "react";
import { useAssets } from "@/game/provider/asset-context.ts";
import type { TiledMap } from "@/game/types.ts";
import { useSearch } from "@tanstack/react-router";
import {
  getTileRenderInfo,
  sliceSpritesheet,
} from "@/game/utils/tilemap-utils.ts";
import { levelMapper } from "@/game/constans.ts";

export const LevelsRenderSystem: React.FC = () => {
  const { maps } = useAssets();
  const rawMap = maps.levelsJson as unknown as TiledMap;
  const sheetTex = maps.mapAreaPng;

  const { level } = useSearch({ strict: false });

  const frames = React.useMemo(() => {
    return sliceSpritesheet(sheetTex, rawMap.tilesets[0]);
  }, [sheetTex, rawMap.tilesets]);

  const levelData = levelMapper.find((lvl) => lvl.id === level);
  console.log("levelData", levelData);

  const layer = rawMap.layers.find(
    (L) => L.type === "tilelayer" && L.name === levelData?.layer,
  );

  if (!layer) {
    console.warn(`[LevelRenderSystem] no layer named "${level}"`);
    return null;
  }

  return (
    <>
      {layer.data.map((gid, i) => {
        const info = getTileRenderInfo(gid, i, rawMap, frames);
        if (!info) return null;
        return (
          <pixiSprite
            key={`${layer.name}-${i}`}
            texture={info.texture}
            x={info.x}
            y={info.y}
            anchor={0.5}
            roundPixels={true}
          />
        );
      })}
    </>
  );
};
