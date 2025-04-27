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
      className="flex flex-col gap-4 col-span-12 bg-emerald-100 px-6 py-12 rounded-3xl items-center justify-center h-min max-w-[500px] mx-auto w-full">
      <h1 className="text-2xl">Sign Up</h1>
      <form.Field
        name="email"
        children={(field) => {
          return (
            <div className="flex flex-col max-w-[300px]">
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
                className="bg-white w-[300px] text-lg h-10 px-2"
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
            <div className="flex flex-col max-w-[300px]">
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
                className="bg-white w-[300px] text-lg h-10 px-2"
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
