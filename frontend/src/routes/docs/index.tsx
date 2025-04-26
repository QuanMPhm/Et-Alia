import { createFileRoute, Link } from "@tanstack/react-router";
import { type } from "arktype";

type LoaderData = {
  docIds: string[];
};

const SearchParams = type({
  "q?": "string | undefined",
});
type SearchParams = typeof SearchParams.infer;

export const Route = createFileRoute("/docs/")({
  component: RouteComponent,
  validateSearch: (search): SearchParams => {
    const out = SearchParams({ q: search.q });

    if (out instanceof type.errors) {
      throw new Error(out.summary);
    } else {
      return out;
    }
  },
  loaderDeps: ({ search }) => {
    return { q: search.q };
  },
  loader: async ({ deps: { q } }): Promise<LoaderData> => {
    const docIds = ["doc1", "doc2", "doc3"];
    if (!q) {
      return { docIds };
    } else {
      return { docIds: docIds.filter((docId) => docId === q) };
    }
  },
});

function RouteComponent() {
  const { docIds } = Route.useLoaderData();
  return docIds.map((docId) => (
    <div key={docId}>
      <Link to="/docs/$docId" params={{ docId }}>
        {docId}
      </Link>
    </div>
  ));
}
