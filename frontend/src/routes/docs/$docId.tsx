import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/docs/$docId")({
  component: RouteComponent,
  loader: async ({ params }) => {
    return {
      ...params,
    };
  },
});

function RouteComponent() {
  const { docId } = Route.useLoaderData();
  return <div>Hello "/documents/{docId}"!</div>;
}
