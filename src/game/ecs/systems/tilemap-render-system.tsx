import React from "react";
import { useAssets } from "@/game/provider/asset-context.ts";
import type { TiledMap } from "@/game/types.ts";
import {
  getTileRenderInfo,
  sliceSpritesheet,
} from "@/game/utils/tilemap-utils.ts";

export const TilemapRenderSystem: React.FC = () => {
  const { maps } = useAssets();
  const rawMap = maps.bgArenaJson as unknown as TiledMap;

  console.log("raw map", rawMap);
  const sheetTex = maps.mapAreaPng;

  const frames = React.useMemo(() => {
    return sliceSpritesheet(sheetTex, rawMap.tilesets[0]);
  }, [sheetTex, rawMap.tilesets]);

  return (
    <>
      <>
        {rawMap.layers
          .filter((L) => L.type === "tilelayer" && L.visible)
          .flatMap((layer) =>
            layer.data.map((gid, i) => {
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
            }),
          )}
      </>
    </>
  );
};
