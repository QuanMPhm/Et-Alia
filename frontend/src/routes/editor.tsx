import { createFileRoute } from "@tanstack/react-router";
import { MEdit } from "../components/MEdit";

export const Route = createFileRoute("/editor")({
  component: RouteComponent,
});

function RouteComponent() {
  return <MEdit type="edit" />;
}
