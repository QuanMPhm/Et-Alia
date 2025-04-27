import { useFormContext } from "../hooks/form-context";

export default function SubmitButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button
          disabled={isSubmitting}
          className="text-white rounded-full px-6 py-2 bg-black">
          {label}
        </button>
      )}
    </form.Subscribe>
  );
}
