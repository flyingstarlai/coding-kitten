// src/game/systems/load-level-system.tsx
import { useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { useApplication } from "@pixi/react";

import level1Json from "@/game/assets/levels/level1.json";
import level2Json from "@/game/assets/levels/level2.json";
import level3Json from "@/game/assets/levels/level3.json";
import level4Json from "@/game/assets/levels/level4.json";
import level5Json from "@/game/assets/levels/level5.json";
import level6Json from "@/game/assets/levels/level6.json";
import level7Json from "@/game/assets/levels/level7.json";
import level8Json from "@/game/assets/levels/level8.json";
import level9Json from "@/game/assets/levels/level9.json";
import level10Json from "@/game/assets/levels/level10.json";
import level11Json from "@/game/assets/levels/level11.json";
import level12Json from "@/game/assets/levels/level12.json";
import level13Json from "@/game/assets/levels/level13.json";
import level14Json from "@/game/assets/levels/level14.json";
import level15Json from "@/game/assets/levels/level15.json";
// … up through level15.json

import type { GameLevel } from "@/game/types";
import { useEcsStore } from "@/game/store/use-ecs-store";
import { levelMapper } from "@/game/constans.ts";

const levelJsonMap: Record<string, GameLevel> = {
  "level1.json": level1Json as GameLevel,
  "level2.json": level2Json as GameLevel,
  "level3.json": level3Json as GameLevel,
  "level4.json": level4Json as GameLevel,
  "level5.json": level5Json as GameLevel,
  "level6.json": level6Json as GameLevel,
  "level7.json": level7Json as GameLevel,
  "level8.json": level8Json as GameLevel,
  "level9.json": level9Json as GameLevel,
  "level10.json": level10Json as GameLevel,
  "level11.json": level11Json as GameLevel,
  "level12.json": level12Json as GameLevel,
  "level13.json": level13Json as GameLevel,
  "level14.json": level14Json as GameLevel,
  "level15.json": level15Json as GameLevel,
  // … add entries up to level15 …
};

export const LoadLevelSystem: React.FC = () => {
  const pixi = useApplication();
  const { level } = useSearch({ strict: false }); // e.g. "?level=2Eo-J5C71ngUck9cjz2yC"
  const { lesson } = useParams({ strict: false });

  const setLevel = useEcsStore((s) => s.setLevel);
  const resetNextId = useEcsStore((s) => s.resetNextId);

  useEffect(() => {
    if (!pixi) return;

    // 1) Find the mapping entry for this scrambled ID
    const entry = levelMapper.find((m) => m.id === level);
    if (!entry) {
      console.warn(`[LoadLevel] no mapping found for level id="${level}"`);
      return;
    }

    // 2) Grab the JSON by filename
    const json = levelJsonMap[entry.data];
    if (!json) {
      console.error(
        `[LoadLevel] no JSON import found for filename="${entry.data}"`,
      );
      return;
    }

    setLevel({ ...json, current: entry.id });
  }, [pixi, level, lesson, resetNextId, setLevel]);

  return null;
};
