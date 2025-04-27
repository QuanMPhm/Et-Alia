import { useFormContext } from "../hooks/form-context";

export default function SubmitButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button
          disabled={isSubmitting}
          className="rounded-full bg-black px-6 py-2 text-white">
          {label}
        </button>
      )}
    </form.Subscribe>
  );
}
