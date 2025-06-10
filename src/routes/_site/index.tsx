import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_site/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Coding Kitten.</h1>
      </div>
    </div>
  );
}
