import { createFileRoute } from "@tanstack/react-router";
import { LessonList } from "@/components/lessons/lesson-list.tsx";

export const Route = createFileRoute("/_site/lessons/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col px-6">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <LessonList />
      </div>
    </div>
  );
}
