import { Application, extend } from "@pixi/react";
import React, { useRef } from "react";
import { Link, useParams, useSearch } from "@tanstack/react-router";
import { ResponsiveSystem } from "@/game/ecs/systems/level-play/responsive-system.tsx";
import { LevelTileMapRenderSystem } from "@/game/ecs/systems/level-map/level-tile-map-render-system.tsx";
import { AnimatedSprite, Container, Graphics, Sprite, Text } from "pixi.js";
import { FlagMapRenderSystem } from "@/game/ecs/systems/level-map/flag-map-render-system.tsx";
import { WorldContainer } from "@/game/components/world-container.tsx";
import { useWindowSoundMute } from "@/game/hooks/use-window-sound-mute.ts";
import { Button } from "@/components/ui/button.tsx";
import { TransitionSystem } from "@/game/ecs/systems/transition-system.tsx";

const screenColor = 0xc9d308;
const LevelMapPage: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { lesson } = useParams({ strict: false });
  const { page } = useSearch({ strict: false }) as { page: number };
  extend({
    Container,
    Sprite,
    AnimatedSprite,
    Graphics,
    Text,
  });
  useWindowSoundMute();

  return (
    <div
      id="canvas-wrapper"
      ref={wrapperRef}
      className="relative   flex-1 min-h-0 overflow-hidden lg:rounded-lg lg:shadow-xs"
    >
      <div className="absolute top-2 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
        {[1, 2, 3].map((n) => (
          <Link key={n} to="." search={() => ({ page: n })} replace>
            <Button
              className="opacity-70"
              variant={page === n ? "default" : "outline"}
            >
              {n}
            </Button>
          </Link>
        ))}
      </div>
      <Application
        key={`map-${lesson}`}
        resolution={Math.max(window.devicePixelRatio, 2)}
        backgroundColor={screenColor}
        className="w-full h-full lg:rounded-lg overflow-hidden"
      >
        <ResponsiveSystem resizeRef={wrapperRef} />
        <WorldContainer>
          <LevelTileMapRenderSystem />
          <FlagMapRenderSystem />
        </WorldContainer>
        <TransitionSystem onComplete={() => {}} color={screenColor} />
      </Application>
    </div>
  );
};

export default LevelMapPage;
