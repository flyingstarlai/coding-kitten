import React, { useEffect, useRef } from "react";
import { Application, extend } from "@pixi/react";
import { AnimatedSprite, Container, Graphics, Sprite, Text } from "pixi.js";
import { Command } from "@/components/command";
import { ResponsiveSystem } from "@/game/ecs/systems/level-play/responsive-system.tsx";
import { LoadLevelSystem } from "@/game/ecs/systems/level-play/load-level-system.tsx";
import { BoardRenderSystem } from "@/game/ecs/systems/level-play/board-render-system.tsx";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { PlayerEntity } from "@/game/ecs/entities/player-entity.tsx";
import { WorldContainer } from "@/game/components/world-container.tsx";
import { BoardContainer } from "@/game/components/board-container.tsx";
import { MovementSystem } from "@/game/ecs/systems/level-play/movement-system.tsx";
import { AnimatedSpriteRenderSystem } from "@/game/ecs/systems/level-play/animated-sprite-render-system.tsx";
import { GraphicRenderSystem } from "@/game/ecs/systems/level-play/graphic-render-system.tsx";
import { CommandSystem } from "@/game/ecs/systems/level-play/command-system.tsx";
import { TileEntitiesWrapper } from "@/game/components/tile-entities-wrapper.tsx";
import { ResultDialog } from "@/game/components/result-dialog.tsx";
import { GameManagerEntity } from "@/game/ecs/entities/game-manager-entity.tsx";
import { TilemapRenderSystem } from "@/game/ecs/systems/level-play/tilemap-render-system.tsx";
import { LevelsRenderSystem } from "@/game/ecs/systems/level-play/levels-render-system.tsx";
import { CollectibleEntitiesWrapper } from "@/game/components/collectible-entities-wrapper.tsx";
import { CoinsRenderSystem } from "@/game/ecs/systems/level-play/coins-render-system.tsx";
import { ChestSpriteRenderSystem } from "@/game/ecs/systems/level-play/chest-sprite-render-system.tsx";
import { ChestEntity } from "@/game/ecs/entities/chest-entity.tsx";
import { CollectCoinSystem } from "@/game/ecs/systems/level-play/collect-coin-system.tsx";
import { useSearch } from "@tanstack/react-router";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";
import { MovementSoundSystem } from "@/game/ecs/systems/level-play/movement-sound-system.tsx";
import { useWindowSoundMute } from "@/game/hooks/use-window-sound-mute.ts";
import { ScoreRenderSystem } from "@/game/ecs/systems/level-play/score-render-system.tsx";
import { TransitionSystem } from "@/game/ecs/systems/transition-system.tsx";

export const GameContainer: React.FC = () => {
  return (
    <div
      id="game-container"
      className="flex flex-1 min-h-0 flex-col p-2 space-y-2"
    >
      <ResultDialog />
      <Game />
      <Command />
    </div>
  );
};

const screenColor = 0x2a8431;

const Game: React.FC = () => {
  extend({
    Container,
    Sprite,
    AnimatedSprite,
    Graphics,
    Text,
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const sidebar = useSidebar();
  const { level } = useSearch({ strict: false });
  const resetEntityId = useEcsStore((s) => s.resetNextId);

  useEffect(() => {
    resetEntityId();
  }, [level, resetEntityId]);

  // triggering the ResizeObserver inside ResponsiveSystem.
  useEffect(() => {}, [sidebar.state]);
  useWindowSoundMute();

  return (
    <div
      id="canvas-wrapper"
      ref={wrapperRef}
      className="flex-1 min-h-0 overflow-hidden lg:rounded-lg lg:shadow-xs"
    >
      <Application
        key={`game-${level}`}
        resolution={Math.max(window.devicePixelRatio, 2)}
        backgroundColor={screenColor}
        className="w-full h-full lg:rounded-lg overflow-hidden"
      >
        <GameManagerEntity />
        <PlayerEntity />
        <CollectibleEntitiesWrapper />
        <TileEntitiesWrapper />
        <ChestEntity />

        <ResponsiveSystem resizeRef={wrapperRef} />
        <LoadLevelSystem />
        <WorldContainer>
          <TilemapRenderSystem />

          <BoardContainer>
            <ScoreRenderSystem />
            <BoardRenderSystem />
            <LevelsRenderSystem />

            <GraphicRenderSystem />
            <CoinsRenderSystem />
            <ChestSpriteRenderSystem />

            <AnimatedSpriteRenderSystem />
          </BoardContainer>
        </WorldContainer>

        <CommandSystem />
        <CollectCoinSystem />
        <MovementSystem />
        <MovementSoundSystem />
        <TransitionSystem
          onComplete={() => console.log("start game")}
          color={screenColor}
        />
      </Application>
    </div>
  );
};
