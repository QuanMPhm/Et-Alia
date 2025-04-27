import { createFileRoute } from "@tanstack/react-router";
import { Container } from "../components/Container";

export const Route = createFileRoute("/approved")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container>
      <h1 className="col-span-12 text-3xl">
        Congratulations, you have approved the changes 🎉
      </h1>
    </Container>
  );
}
