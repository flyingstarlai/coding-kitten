import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MobileAlertDialog } from "@/components/mobile-alert-dialog.tsx";
import { AssetProvider } from "@/game/provider/asset-provider.tsx";
import { useProgressStore } from "@/store/use-progress-store.ts";
import { useEffect } from "react";
import { nanoid } from "nanoid";

export const Route = createFileRoute("/_site/lessons/_game")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userId, setUserId } = useProgressStore();

  useEffect(() => {
    if (!userId) {
      setUserId(nanoid());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <AssetProvider>
      <MobileAlertDialog />
      <Outlet />
    </AssetProvider>
  );
}
