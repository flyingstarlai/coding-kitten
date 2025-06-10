import React from "react";
import { getCenteredTilePosition } from "@/game/utils/tile-utils";
import { useCreateEntity } from "@/game/hooks/use-create-entity";
import { EntityProvider } from "@/game/provider/entity-provider";
import type { TileKind } from "@/game/types";
import { GridPosition } from "@/game/ecs/components/grid-position.tsx";
import { Position } from "@/game/ecs/components/position.tsx";
import { Display } from "@/game/ecs/components/display.tsx";
import { GameConstants } from "@/game/constans.ts";
import { Tile } from "@/game/ecs/components/tile.tsx";

// Adjust these imports / names to match your Tile component’s implementation
// If you already have a <Tile> facet that adds components, you can call that instead.
// Here is one possible implementation:

export interface TileEntityProps {
  col: number;
  row: number;
  kind: TileKind;
}

export const TileEntity: React.FC<TileEntityProps> = ({ col, row, kind }) => {
  // 1) Get a unique eid for this tile
  const eid = useCreateEntity();

  // 2) Until `eid` is non-null, render nothing
  if (eid === null) {
    return null;
  }

  // 3) Compute the pixel position (center of the tile)
  const { x: pixelX, y: pixelY } = getCenteredTilePosition(col, row);

  // 4) Render facets under EntityProvider
  return (
    <EntityProvider eid={eid}>
      <GridPosition col={col} row={row} />
      <Position x={pixelX} y={pixelY} />
      {kind !== "empty" && (
        <Display color={COLOR_MAP[kind]} size={GameConstants.TILE_SIZE} />
      )}
      <Tile col={col} row={row} kind={kind} />
    </EntityProvider>
  );
};

const COLOR_MAP: Record<Exclude<TileKind, "empty">, number> = {
  path: 0xffffff,
  start: 0xe7bfff,
  collectible: 0x00ff00,
  obstacle: 0xe03131,
  goal: 0x698dff,
};
