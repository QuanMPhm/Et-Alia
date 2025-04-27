import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnyFieldApi, createFormHook } from "@tanstack/react-form";
import { type } from "arktype";
import TextField from "../components/TextField";
import NumberField from "../components/NumberField";
import SubmitButton from "../components/SubmitButton";
import { fieldContext, formContext } from "../hooks/form-context.tsx";
import { Container } from "../components/Container.tsx";
import { useQueryClient } from "@tanstack/react-query";

// Allow us to bind components to the form to keep type safety but reduce production boilerplate
// Define this once to have a generator of consistent form instances throughout your app
const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    NumberField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched &&
      field.state.meta.isBlurred &&
      field.state.meta.errors.length ? (
        <em className="text-bold text-red-700">
          {field.state.meta.errors.map((err) => err.message).join(",")}
        </em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

// avoid logging "was xxx" for password
const Password = type("string >= 8").configure({ actual: () => "" });

const LogInForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: type({
        email: "string.email",
        password: Password,
      }),
    },
    onSubmit: async ({ value }) => {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      }).then((response) => response.json());
      await queryClient.invalidateQueries({ queryKey: ["checkSession"] });

      if ("error" in response) {
        throw new Error(response.error);
      }
      if ("message" in response && response.message === "Signup successful!") {
        // auto log-in
        const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: value.email,
            password: value.password,
          }),
        }).then((response) => response.json());
        if ("error" in response) {
          throw new Error(response.error);
        }
        if ("message" in response && response.message === "Login successful!") {
          // how to redirect with tanstack router here?
          // go to /editor
          navigate({ to: "/editor", replace: true });

          return;
        }
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }

        return;
      }
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return;
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="col-span-12 mx-auto flex h-min w-full max-w-[500px] flex-col items-center justify-center gap-4 rounded-3xl bg-emerald-100 px-6 py-12">
      <h1 className="text-2xl">Sign Up</h1>
      <form.Field
        name="email"
        children={(field) => {
          return (
            <div className="flex max-w-[300px] flex-col">
              <label htmlFor={field.name} className="w-full">
                Email
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="email"
                className="h-10 w-[300px] bg-white px-2 text-lg"
              />
              <FieldInfo field={field} />
            </div>
          );
        }}
      />
      <form.Field
        name="password"
        children={(field) => {
          return (
            <div className="flex max-w-[300px] flex-col">
              <label htmlFor={field.name} className="w-full">
                Password
              </label>
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="password"
                className="h-10 w-[300px] bg-white px-2 text-lg"
              />
              <FieldInfo field={field} />
            </div>
          );
        }}
      />
      <form.AppForm>
        <form.SubmitButton label="Log In" />
      </form.AppForm>
      <span>
        Don't have an account?{" "}
        <Link to="/signup" className="underline">
          Sign Up
        </Link>
      </span>
    </form>
  );
};

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container>
      <LogInForm />
    </Container>
  );
}
