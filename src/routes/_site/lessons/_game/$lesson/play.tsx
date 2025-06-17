import { createFileRoute } from "@tanstack/react-router";
import GameContainer from "@/game/page/play-level-page.tsx";
import { useEffect, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { ResultDialog } from "@/game/components/result-dialog.tsx";
import { Command } from "@/components/command";

type LevelLoad = {
  level: string;
};

export const Route = createFileRoute("/_site/lessons/_game/$lesson/play")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): LevelLoad => {
    return {
      level: search.level as string,
    };
  },
});

function RouteComponent() {
  const sidebar = useSidebar();
  const [showCommand, setShowCommand] = useState(false);

  useEffect(() => {
    let cleanedUp = false;
    const sidebarEl = document.querySelector<HTMLElement>(".sidebar-root");

    const revealCommand = () => {
      if (!cleanedUp) setShowCommand(true);
    };

    const onTransitionEnd = () => {
      revealCommand();
      // remove the listener once it's fired
      (sidebarEl as EventTarget).removeEventListener(
        "transitionend",
        onTransitionEnd as EventListener,
      );
    };

    const collapseThenShow = () => {
      if (window.innerWidth < 1200 && sidebar.state === "expanded") {
        sidebar.toggleSidebar();
        if (sidebarEl) {
          // cast to EventTarget so TS lets us use "transitionend"
          (sidebarEl as EventTarget).addEventListener(
            "transitionend",
            onTransitionEnd as EventListener,
          );
        } else {
          // fallback after 300ms if the element isn't found
          setTimeout(revealCommand, 300);
        }
      } else {
        // already collapsed or wide viewport
        revealCommand();
      }
    };

    collapseThenShow();

    return () => {
      cleanedUp = true;
      if (sidebarEl) {
        (sidebarEl as EventTarget).removeEventListener(
          "transitionend",
          onTransitionEnd as EventListener,
        );
      }
    };
  }, []);

  return (
    <div
      id="game-container"
      className="flex flex-1 min-h-0 flex-col p-2 space-y-2"
    >
      <ResultDialog />
      <GameContainer />
      {showCommand && <Command />}
    </div>
  );
}
