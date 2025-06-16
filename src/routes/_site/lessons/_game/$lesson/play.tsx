import { createFileRoute } from "@tanstack/react-router";
import { GameContainer } from "@/game/page/play-level-page.tsx";
import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar.tsx";

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
  useEffect(() => {
    // check on mount
    if (typeof window !== "undefined" && window.innerWidth < 1200) {
      if (sidebar.state === "expanded") sidebar.toggleSidebar();
    }

    // optional: re-check on resize
    const onResize = () => {
      if (window.innerWidth < 1200) {
      }
      if (sidebar.state === "expanded") sidebar.toggleSidebar();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <GameContainer />
    </>
  );
}
