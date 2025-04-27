import { createFileRoute } from "@tanstack/react-router";
import { Container } from "../components/Container";
import { ColorBlock } from "../components/ColorBlock";
import { LinkButton } from "../components/LinkButton";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <Container>
      <ColorBlock className="col-span-12 min-h-[50vh] bg-emerald-100">
        <div className="col-span-12 flex flex-col items-center justify-center gap-4">
          <h2 className="p-4 text-5xl font-bold text-black sm:p-6 sm:text-6xl">
            Get co-authoring!
          </h2>

          <LinkButton to="/signup" variant="black">
            Create a New Document
          </LinkButton>
          <LinkButton to="/login" variant="white">
            Upload a Markdown File
          </LinkButton>
        </div>
      </ColorBlock>

      <div className="col-span-12 flex min-h-[50vh] flex-col items-center justify-center gap-4 p-6 sm:flex-row">
        <h3 className="text-5xl font-bold">Collaborate with Ease</h3>
        <p className="prose text-lg">
          Et Alia is an easy-to-use version control system for authors and
          collaborators to write their best work. Bring together ideas and mark
          up, add on, and revise documents effortlessly.
        </p>
      </div>

      <ColorBlock className="col-span-12 min-h-[50vh] bg-sky-200">
        <div className="col-span-12 flex flex-col items-center justify-center gap-4">
          <h2 className="p-4 text-5xl font-bold text-black sm:p-6 sm:text-6xl">
            Who are we?
          </h2>

          <p className="prose text-lg">
            In 2025, our founders created Et Alia with the vision to make
            collaboration and co-authoring textbooks as simple as a software
            engineer’s workflow in GitHub.
          </p>
          <LinkButton to="/about" variant="white">
            About Us
          </LinkButton>
        </div>
      </ColorBlock>
    </Container>
  );
}
