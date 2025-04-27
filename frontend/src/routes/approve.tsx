import { createFileRoute } from "@tanstack/react-router";
import { MEdit } from "../components/MEdit";
import { Container } from "../components/Container";

export const Route = createFileRoute("/approve")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <MEdit type="approve" />
      <Container>
        <p>Approve here</p>
      </Container>
    </div>
  );
  return <div>Hello "/approve"!</div>;
}
