import type {
    SelectHTMLAttributes,
  } from "react";
  
  interface SelectOption {
    label: string;
    value: string;
  }
  
  interface SelectFieldProps
    extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: SelectOption[];
    required?: boolean;
  }
  
  export default function SelectField({
    label,
    options,
    required = false,
    id,
    ...props
  }: SelectFieldProps) {
    return (
      <div>
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          {label}
  
          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>
  
        <select
          id={id}
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }