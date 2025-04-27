import clsx from "clsx";
import { useFormContext } from "../hooks/form-context";

export default function SubmitButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button
          disabled={isSubmitting}
          className={clsx(
            "cursor-pointer rounded-full bg-black px-6 py-2 text-white",
            isSubmitting && "bg-gray-700",
          )}>
          {isSubmitting ? "..." : label}
        </button>
      )}
    </form.Subscribe>
  );
}
