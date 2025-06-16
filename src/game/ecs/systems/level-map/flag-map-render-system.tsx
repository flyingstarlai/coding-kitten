import React, { useRef, useState } from "react";
import type { TiledMap } from "@/game/types.ts";
import { useAssets } from "@/game/provider/asset-context.ts";
import {
  type Container,
  FederatedEvent,
  TextStyle,
  type Texture,
} from "pixi.js";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { playSound } from "@/game/utils/sound-utils.ts";
import { useTick } from "@pixi/react";
import { levelMapper } from "@/game/constans.ts";
import {
  type LessonProgress,
  type LevelProgress,
  useProgressStore,
} from "@/store/use-progress-store.ts";

export const FlagMapRenderSystem: React.FC = () => {
  const { sequence, stars } = useAssets();
  const progressRecord = useProgressStore((s) => s.progress);
  const { lesson } = useParams({ strict: false });
  const rawMap = sequence.mapSeq as unknown as TiledMap;
  const flagTex = sequence.mapFlag;
  const { page } = useSearch({ strict: false });
  const navigate = useNavigate({ from: "/lessons/$lesson" });

  if (!page || !lesson) return null;

  // get the LessonProgress, or fall back to all locked/zero-stars
  const lessonProgress: LessonProgress = progressRecord[lesson] ?? {
    name: lesson,
    levels: levelMapper.map((lvl, idx) => ({
      id: lvl.id,
      stars: 0,
      locked: idx !== 0,
    })),
  };

  // pick which marker layer to render
  const markerKey = [1, 2, 3].includes(page) ? `marker_${page}` : "marker_1";
  const markerLayer = rawMap.layers.find(
    (l) => l.type === "objectgroup" && l.name === markerKey,
  );
  if (!markerLayer) return null;

  return (
    <>
      {markerLayer.objects.map((obj) => {
        const label = obj.name.split("_")[1];
        const mapEntry = levelMapper.find((m) => m.layer === obj.name)!;
        const levelId = mapEntry.id;

        // find the persisted progress for that level
        const lvlProg: LevelProgress = lessonProgress.levels.find(
          (l) => l.id === levelId,
        ) ?? {
          id: levelId,
          stars: 0,
          locked: true,
        };

        const { stars: starCount, locked } = lvlProg;

        // choose a star texture only if unlocked
        let starTex: Texture | null = null;
        if (!locked) {
          if (starCount === 1) starTex = stars.star1of3;
          else if (starCount === 2) starTex = stars.star2of3;
          else if (starCount === 3) starTex = stars.star3of3;
          else starTex = stars.star0of3;
        }

        return (
          <HoverableFlag
            key={obj.id}
            label={label}
            x={Math.round(obj.x)}
            y={Math.round(obj.y)}
            texture={flagTex}
            starTex={starTex}
            disable={locked}
            onClick={async () => {
              if (locked) return;
              playSound("onSelect", 0.5);

              await navigate({
                to: "/lessons/$lesson/play",
                search: { level: levelId },
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
  starTex: Texture | null;
  onClick: () => void;
  disable: boolean;
}

const HoverableFlag: React.FC<HoverFlagProps> = ({
  x,
  y,
  label,
  texture,
  starTex,
  onClick,
  disable,
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
      cursor={!disable ? "pointer" : "default"}
      onPointerOver={(e: FederatedEvent) => {
        if (disable) return;
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
      {starTex && (
        <pixiSprite
          texture={starTex}
          roundPixels={true}
          anchor={0.5}
          scale={0.8}
          y={-offset.y - 7}
        />
      )}
    </pixiContainer>
  );
};
