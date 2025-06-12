import { createFileRoute } from "@tanstack/react-router";
import { GameContainer } from "@/game";
import { AssetProvider } from "@/game/provider/asset-provider.tsx";
import { MobileAlertDialog } from "@/components/mobile-alert-dialog.tsx";

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
  return (
    <AssetProvider>
      <MobileAlertDialog />
      <GameContainer />
    </AssetProvider>
  );
}
