import playIcon from "@/assets/play-button.png";
import stopIcon from "@/assets/stop-button.png";
import React from "react";
import { clsx } from "clsx";
import { useEntityQuery } from "@/game/hooks/use-entity-query.ts";
import { useEcsStore } from "@/game/store/use-ecs-store.ts";

interface CommandControlsProps {
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
  disabled: boolean;
}

export const CommandControls: React.FC<CommandControlsProps> = ({
  onRun,
  onStop,
  disabled,
}) => {
  const [playerEid] = useEntityQuery(["playerTag"]);
  const queue = useEcsStore((s) => s.getComponent(playerEid, "queue"));
  return (
    <div>
      {queue ? (
        <div onClick={onStop} className="opacity-70">
          <img src={stopIcon} alt="stop" />
        </div>
      ) : (
        <div
          onClick={() => {
            if (!disabled) {
              onRun();
            }
          }}
          className={clsx(
            disabled
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer opacity-70",
          )}
        >
          <img src={playIcon} alt="play" />
        </div>
      )}
    </div>
  );
};
