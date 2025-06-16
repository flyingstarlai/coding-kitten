import React, { useRef, useState } from "react";
import type { TiledMap } from "@/game/types.ts";
import { useAssets } from "@/game/provider/asset-context.ts";
import {
  type Container,
  FederatedEvent,
  TextStyle,
  type Texture,
} from "pixi.js";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { playSound } from "@/game/utils/sound-utils.ts";
import { useTick } from "@pixi/react";
import { levelMapper } from "@/game/constans.ts";

export const FlagMapRenderSystem: React.FC = () => {
  const { sequence } = useAssets();
  const rawMap = sequence.mapSeq as unknown as TiledMap;
  const flagTex = sequence.mapFlag;

  const { page } = useSearch({ strict: false });

  const navigate = useNavigate({ from: "/lessons/$lesson" });

  if (!page) return null;

  const marker = [1, 2, 3].includes(page) ? `marker_${page}` : "marker_1";

  // find the object‐layer named “marker”
  const markerLayer = rawMap.layers.find(
    (l) => l.type === "objectgroup" && l.name === marker,
  );

  if (!markerLayer) return null;

  return (
    <>
      {markerLayer.objects.map((obj) => {
        // Tiled’s y is the *bottom* of the object,

        const label = obj.name.split("_")[1];
        return (
          <HoverableFlag
            key={obj.id}
            label={label}
            x={Math.round(obj.x)}
            y={Math.round(obj.y)}
            texture={flagTex}
            starTex={sequence.starLevel}
            onClick={async () => {
              playSound("onSelect", 0.5);
              const level = levelMapper.find((m) => m.layer === obj.name);
              await navigate({
                to: "/lessons/$lesson/play",
                search: { level: level?.id ?? levelMapper[0].id },
              });
            }}
          />
        );
      })}
    </>
  );
};

interface HoverFlagProps {
  x: number;
  y: number;
  label: string;
  texture: Texture;
  starTex: Texture;
  onClick: () => void;
}

const HoverableFlag: React.FC<HoverFlagProps> = ({
  x,
  y,
  label,
  texture,
  starTex,
  onClick,
}) => {
  const containerRef = useRef<Container>(null);
  const offset = {
    x: 71 / 2,
    y: 128 / 2,
  };

  const [targetScale] = useState({ hover: 1.1, normal: 1 });
  const [scaleState, setScaleState] = useState<number>(1);
  const [wantHover, setWantHover] = useState(false);
  useTick(() => {
    if (!containerRef.current) return;

    // choose where we want to go
    const goal = wantHover ? targetScale.hover : targetScale.normal;

    const next = scaleState + (goal - scaleState) * 0.15;
    setScaleState(next);
    containerRef.current.scale.set(next);
  });

  const textStyle = new TextStyle({
    fill: "#fffefe",
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Fredoka One",
    stroke: { color: "#4a1850", width: 4, join: "round" },
  });

  return (
    <pixiContainer
      ref={containerRef}
      eventMode="static"
      interactive={true}
      cursor="pointer"
      onPointerOver={(e: FederatedEvent) => {
        playSound("onHover", 0.3);
        const s = e.currentTarget;
        s.tint = 0xf0fdfa;
        setWantHover(true);
      }}
      onPointerOut={(e: FederatedEvent) => {
        const s = e.currentTarget;
        s.tint = 0xffffff;
        setWantHover(false);
      }}
      onPointerTap={onClick}
      x={x + offset.x}
      y={y - offset.y}
    >
      <pixiSprite texture={texture} roundPixels={true} anchor={0.5} />
      <pixiText text={label} style={textStyle} anchor={0.5} y={-4} />
      <pixiSprite
        texture={starTex}
        roundPixels={true}
        anchor={0.5}
        scale={0.8}
        y={-offset.y - 7}
      />
    </pixiContainer>
  );
};
