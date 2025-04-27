import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/faq"!</div>;
}
