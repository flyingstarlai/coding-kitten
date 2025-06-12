import { createFileRoute } from "@tanstack/react-router";
import { GameContainer } from "@/game";
import { AssetProvider } from "@/game/provider/asset-provider.tsx";
import { MobileAlertDialog } from "@/components/mobile-alert-dialog.tsx";
import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar.tsx";

type LevelLoad = {
  level: string;
};

export const Route = createFileRoute("/_site/lessons/$lesson/play")({
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
    <AssetProvider>
      <MobileAlertDialog />
      <GameContainer />
    </AssetProvider>
  );
}
