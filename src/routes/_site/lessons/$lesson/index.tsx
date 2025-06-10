import { createFileRoute } from "@tanstack/react-router";
import { Levels } from "@/components/lessons/levels.tsx";

export const Route = createFileRoute("/_site/lessons/$lesson/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col px-6">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <Levels />
      </div>
    </div>
  );
}
