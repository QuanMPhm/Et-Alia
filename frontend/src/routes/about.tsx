import { createFileRoute } from "@tanstack/react-router";
import { Container } from "../components/Container";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <Container>
      <h2>About Page...</h2>
    </Container>
  );
}
