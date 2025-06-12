import React, { useEffect, useState } from "react";
import { useEntityQuery } from "@/game/hooks/use-entity-query";
import { useEcsStore } from "@/game/store/use-ecs-store";
import { useDialogStore } from "@/game/store/use-dialog-store";
import { resetPlayerToStart } from "@/game/utils/reset-player-utils";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Dialog,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import starFull from "@/assets/star_full.png";
import starEmpty from "@/assets/star_empty.png";
import { useNavigate } from "@tanstack/react-router";
import { useDragDropStore } from "@/store/use-drag-drop-store.ts";

export const ResultDialog: React.FC = () => {
  const message = useDialogStore((s) => s.message);
  const closeDialog = useDialogStore((s) => s.closeDialog);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate({ from: "/lessons/$lesson/play" });
  const { setWorkspaceItems } = useDragDropStore();

  const [playerEid] = useEntityQuery(["playerTag"]);
  const [managerEid] = useEntityQuery(["session"]);
  const level = useEcsStore((s) => s.level);

  const progressFacet = useEcsStore((s) =>
    managerEid !== undefined
      ? s.getComponent(managerEid, "progress")
      : undefined,
  );

  const scoreFacet = useEcsStore((s) =>
    managerEid != null ? s.getComponent(managerEid, "score") : undefined,
  );

  const earnedStars = scoreFacet?.stars ?? 0;

  useEffect(() => {
    if (progressFacet?.isOver) {
      const t = setTimeout(() => setOpen(true), 500);
      return () => clearTimeout(t);
    } else {
      setOpen(false);
    }
  }, [progressFacet]);

  // Dummy: number of stars earned out of 3. Replace with actual logic as needed.ß

  const handleContinue = async () => {
    const nextLevel = level.next;
    if (nextLevel) {
      await navigate({
        to: "/lessons/$lesson/play",
        search: { level: nextLevel },
      });
      setWorkspaceItems([]);
    }
  };

  const handleRestart = () => {
    if (playerEid !== undefined) {
      resetPlayerToStart(playerEid, managerEid, level);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && closeDialog()}>
      <DialogContent className="max-w-sm mx-auto dark:bg-zinc-500">
        <DialogHeader className="flex flex-col items-center space-y-2">
          <DialogTitle className="text-center text-2xl font-semibold">
            {progressFacet?.onGoal ? "Level Completed" : "Level Failed"}
          </DialogTitle>
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2].map((i) => (
              <img
                key={i}
                src={i < earnedStars ? starFull : starEmpty}
                alt={i < earnedStars ? "star" : "empty star"}
                className="w-12 h-12"
              />
            ))}
          </div>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <div className="flex w-full justify-center gap-x-8 mt-4">
            <Button
              variant={progressFacet?.onGoal ? "outline" : "default"}
              onClick={handleRestart}
            >
              Restart
            </Button>
            {progressFacet?.onGoal && (
              <Button variant="default" onClick={handleContinue}>
                Continue
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
