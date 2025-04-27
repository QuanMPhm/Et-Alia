import {
  createRootRoute,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
// @ts-expect-error: Cannot find module
import LogoWithText from "../assets/EtAliaLogoWithText.svg?react";
import { Container } from "../components/Container";
import { LinkButton } from "../components/LinkButton";
import {
  QueryClient,
  QueryClientProvider,
  // useMutation,
  useQuery,
  useQueryClient,
  // useQueryClient,
} from "@tanstack/react-query";
import { type } from "arktype";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const PendingCommits = type({
  filename: "string",
  content: "string",
  message: "string",
})
  .array()
  .or({ error: "string" });

type PendingCommits = typeof PendingCommits.infer;

// Fetch pending commits function
const getPendingCommits = async (): Promise<PendingCommits> => {
  const response = await fetch("http://localhost:5000/pending_commits", {
    credentials: "include",
  });
  const data = await response.json();
  const result = PendingCommits(data);

  if (result instanceof type.errors) {
    throw new Error(result.summary);
  }
  return result;
};

function PendingCommitsTable() {
  const { data, isLoading, error } = useQuery<PendingCommits>({
    queryKey: ["pending-commits"],
    queryFn: getPendingCommits,
  });

  if (isLoading) {
    return <div className="p-4">Loading pending commits...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  if (!data || "error" in data) {
    return <div className="p-4">Not authenticated or no pending commits</div>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Pending Commits</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b px-4 py-2 text-left">Filename</th>
              <th className="border-b px-4 py-2 text-left">Preview</th>
              <th className="border-b px-4 py-2 text-left">Commit Message</th>
            </tr>
          </thead>
          <tbody>
            {data.map((commit, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="border-b px-4 py-2 font-mono text-sm">
                  {commit.filename}
                </td>
                <td className="border-b px-4 py-2">
                  <div className="max-h-20 overflow-y-auto rounded bg-gray-100 p-2 font-mono text-xs">
                    {commit.content.length > 100
                      ? `${commit.content.substring(0, 100)}...`
                      : commit.content}
                  </div>
                </td>
                <td className="border-b px-4 py-2">
                  <div className="rounded bg-blue-50 px-2 py-1 text-sm text-blue-800">
                    {commit.message}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const Users = type({
  email: "string",
  role: "'author' | 'editor'",
})
  .array()
  .or({ error: "string" });

type Users = typeof Users.infer;

const getUsers = async () => {
  const response = await fetch("http://localhost:5000/users", {
    credentials: "include",
  }).then((response) => response.json());
  const out = Users(response);
  if (out instanceof type.errors) {
    throw new Error(out.summary);
  }
  return out;
};

function UsersEl() {
  const { data, isLoading, error } = useQuery<Users>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  if (isLoading) {
    return <div className="p-4">Loading users...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  if (!data || "error" in data) {
    return <div className="p-4">Not authenticated</div>;
  }

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b px-4 py-2 text-left">Email</th>
              <th className="border-b px-4 py-2 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                <td className="border-b px-4 py-2">{user.email}</td>
                <td className="border-b px-4 py-2">
                  <span
                    className={`inline-block rounded px-2 py-1 text-xs ${
                      user.role === "author"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// <button
//   onClick={() => {
//     mutation.mutate({
//       id: Date.now(),
//       title: "Do Laundry",
//     });
//   }}>
//   Add Todo
// </button>

const CheckSession = type({
  is_authenticated: "false",
}).or({
  is_authenticated: "true",
  user_email: "string",
  user_role: "string",
});
type CheckSession = typeof CheckSession.infer;
const checkSession = async () => {
  // Fetch session status
  const response = await fetch("http://localhost:5000/check-session", {
    credentials: "include",
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
      return { is_authenticated: false };
    });
  console.log("Raw response", response);
  const out = CheckSession(response);
  if (out instanceof type.errors) {
    console.error(out.summary);
    throw new Error(out.summary);
  }
  return out;
};
const logout = () => {
  document.cookie = "session = ''";
  fetch("http://localhost:5000/logout", {
    method: "POST",
    credentials: "include",
  });
};

// const tryGetSession = () => {
//   try {
//     return document.cookie
//       .split(";")
//       .filter((s) => s.includes("session"))[0]
//       .split("=")[1];
//   } catch {
//     return undefined;
//   }
// };

function LogInSignUp() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loggedOut, setLoggedOut] = useState(false);
  const { data, isLoading, error } = useQuery<CheckSession>({
    queryKey: ["checkSession"],
    queryFn: checkSession,
    refetchInterval: 1000,
  });
  useEffect(() => {
    if (loggedOut) {
      logout();
      navigate({ to: "/" });
      queryClient.invalidateQueries({ queryKey: ["checkSession"] });
    }
  }, [navigate, loggedOut, queryClient]);
  // Access loader data
  if (isLoading) {
    return <>...</>;
  }

  if (data?.is_authenticated) {
    return (
      <div className="flex flex-col content-end items-end">
        <span>
          {data.user_email} ({data.user_role})
        </span>
        <button
          onClick={() => setLoggedOut(true)}
          className="w-fit cursor-pointer rounded bg-emerald-100 p-2 text-right text-black hover:bg-emerald-300">
          Log Out
        </button>
      </div>
    );
  }

  if (error) {
    return <>{error}</>;
  }

  // Log in component (optional)
  return (
    <div className="flex gap-4">
      <LinkButton
        to="/login"
        size="normal"
        variant="white"
        className="text-gray-500 hover:text-gray-700 [&.active]:underline">
        Log In
      </LinkButton>
      <LinkButton
        to="/signup"
        size="normal"
        variant="black"
        className="text-gray-500 hover:text-gray-700 [&.active]:underline">
        Sign Up
      </LinkButton>
    </div>
  );
}
// const LogInSignUp = () => {
//   return (
//     <>
//       <LinkButton
//         to="/login"
//         size="normal"
//         variant="white"
//         className="text-gray-500 hover:text-gray-700 [&.active]:underline">
//         Log In
//       </LinkButton>
//       <LinkButton
//         to="/signup"
//         size="normal"
//         variant="black"
//         className="text-gray-500 hover:text-gray-700 [&.active]:underline">
//         Sign Up
//       </LinkButton>
//     </>
//   );
// };

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <header className="flex gap-2 p-2">
        <Container>
          <div className="col-span-3 col-start-10 flex flex-row items-end justify-end gap-4 lg:hidden">
            <LogInSignUp />
          </div>
          <Link
            to="/"
            className="col-span-12 flex max-w-[250px] items-end sm:col-span-4 lg:col-span-3">
            <LogoWithText />
          </Link>
          <div className="col-span-7 col-start-6 flex flex-row items-end justify-end gap-6 lg:col-span-3 lg:col-start-5 lg:justify-between">
            <Link
              to="/editor"
              className="text-gray-500 transition-all hover:text-gray-700 active:translate-y-[2px] active:text-emerald-900 [&.active]:underline">
              Editor
            </Link>
            <Link
              to="/approve"
              className="text-gray-500 transition-all hover:text-gray-700 active:translate-y-[2px] active:text-emerald-900 [&.active]:underline">
              Approve
            </Link>
            <Link
              to="/about"
              className="text-gray-500 transition-all hover:text-gray-700 active:translate-y-[2px] active:text-emerald-900 [&.active]:underline">
              About
            </Link>
          </div>
          <div className="col-span-3 col-start-10 hidden flex-row items-end justify-end gap-4 lg:flex">
            <LogInSignUp />
          </div>
        </Container>
      </header>

      <main className="h-full w-full">
        <Outlet />
      </main>
      <UsersEl />
      <PendingCommitsTable />

      <footer>Copyright 2025</footer>

      <TanStackRouterDevtools />
    </QueryClientProvider>
  ),
});
// <Link
//   to="/docs"
//   search={{ q: "doc1" }}
//   className="[&.active]:font-bold">
//   Docs search
// </Link>
