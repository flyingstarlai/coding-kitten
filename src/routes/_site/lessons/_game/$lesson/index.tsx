import { createFileRoute } from "@tanstack/react-router";
import MapContainer from "@/game/page/level-map-page.tsx";

type PageLoad = {
  page: number;
};

export const Route = createFileRoute("/_site/lessons/_game/$lesson/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): PageLoad => {
    const raw = search.page as number | undefined;
    return {
      page: raw ? raw : 1,
    };
  },
});

function RouteComponent() {
  return (
    <>
      <MapContainer />
    </>
  );
}
