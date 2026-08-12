import type {
    InputHTMLAttributes,
  } from "react";
  
  interface FormFieldProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    required?: boolean;
  }
  
  export default function FormField({
    label,
    error,
    required = false,
    id,
    ...props
  }: FormFieldProps) {
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
  
        <input
          id={id}
          className={`
            w-full rounded-xl border bg-white
            px-3.5 py-2.5 text-sm text-slate-800
            outline-none transition
            placeholder:text-slate-400
            ${
              error
                ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                : "border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            }
          `}
          {...props}
        />
  
        {error && (
          <p className="mt-1.5 text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }