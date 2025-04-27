import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "../hooks/form-context.tsx";

export default function NumberField({
  label,
  min,
  max,
  step = "1",
}: {
  label: string;
  min?: number;
  max?: number;
  step?: string | number;
}) {
  const field = useFieldContext<number>();

  const errors = useStore(field.store, (state) => state.meta.errors);

  const handleChange = (value: string) => {
    // Convert to number and handle empty string case
    const numValue = value === "" ? 0 : Number(value);
    field.handleChange(numValue);
  };

  return (
    <div>
      <label>
        <div>{label}</div>
        <input
          type="number"
          value={field.state.value ?? ""}
          onChange={(e) => handleChange(e.target.value)}
          min={min}
          max={max}
          step={step}
        />
      </label>
      {errors.map((error: string) => (
        <div key={error} style={{ color: "red" }}>
          {error}
        </div>
      ))}
    </div>
  );
}
