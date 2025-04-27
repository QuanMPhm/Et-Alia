import { createFileRoute, Link } from "@tanstack/react-router";
import { AnyFieldApi, createFormHook } from "@tanstack/react-form";
import { type } from "arktype";
import TextField from "../components/TextField";
import NumberField from "../components/NumberField";
import SubmitButton from "../components/SubmitButton";
import { fieldContext, formContext } from "../hooks/form-context.tsx";
import { Container } from "../components/Container.tsx";

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
    onSubmit: ({ value }) => {
      // Do something with form data
      console.log(JSON.stringify(value, null, 2));
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
        <form.SubmitButton label="Sign Up" />
      </form.AppForm>
      <span>
        Already have an account?{" "}
        <Link to="/login" className="underline">
          Log In
        </Link>
      </span>
    </form>
  );
};

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Container>
      <LogInForm />
    </Container>
  );
}
