import type {
    TextareaHTMLAttributes,
  } from "react";
  
  interface TextAreaFieldProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    required?: boolean;
  }
  
  export default function TextAreaField({
    label,
    required = false,
    id,
    ...props
  }: TextAreaFieldProps) {
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
  
        <textarea
          id={id}
          className="min-h-[100px] w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          {...props}
        />
      </div>
    );
  }