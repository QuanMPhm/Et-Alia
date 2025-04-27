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
      <ColorBlock className="col-span-12 bg-emerald-100 min-h-[50vh]">
        <div className="flex col-span-12 flex-col gap-4 items-center justify-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-black p-4 sm:p-6">
            Get co-authoring!
          </h2>

          <LinkButton to="/docs" variant="black">
            Create a New Document
          </LinkButton>
          <LinkButton to="/docs" variant="white">
            Upload a Markdown File
          </LinkButton>
        </div>
      </ColorBlock>

      <div className="col-span-12 p-6 flex items-center justify-center">
        <h3>Some stuff</h3>
      </div>

      <ColorBlock className="col-span-12 bg-emerald-100">
        <div className="flex col-span-12 flex-col gap-4 items-center justify-center">
          <h2 className="text-5xl sm:text-6xl font-bold text-black p-4 sm:p-6">
            Get co-authoring!
          </h2>

          <LinkButton to="/docs" variant="black">
            Create a New Document
          </LinkButton>
          <LinkButton to="/docs" variant="white">
            Upload a Markdown File
          </LinkButton>
        </div>
      </ColorBlock>
    </Container>
  );
}
