import { createFileRoute } from "@tanstack/react-router";
import { LinkButton } from "../components/LinkButton"; // Assuming this exists
import { type } from "arktype";
import { useQuery } from "@tanstack/react-query";

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
export const Route = createFileRoute("/auth-buttons")({
  component: AuthButtonsComponent,
});

function AuthButtonsComponent() {
  const { data, isLoading } = useQuery<CheckSession>({
    queryKey: ["session"],
    queryFn: checkSession,
  });
  // Access loader data
  if (isLoading) {
    return <>...</>;
  }
  if (data?.is_authenticated) {
    return (
      <div>
        {data.user_email} ({data.user_role})
      </div>
    );
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
