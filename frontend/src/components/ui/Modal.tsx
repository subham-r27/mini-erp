import {
    X,
  } from "lucide-react";
  
  import type {
    ReactNode,
  } from "react";
  
  interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
  }
  
  export default function Modal({
    open,
    onClose,
    title,
    description,
    children,
    size = "lg",
  }: ModalProps) {
    if (!open) {
      return null;
    }
  
    const sizes = {
      sm: "max-w-md",
      md: "max-w-xl",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
    };
  
    return (
      <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
        <button
          className="absolute inset-0 cursor-default"
          onClick={onClose}
          aria-label="Close modal"
        />
  
        <div
          className={`
            relative z-10
            flex max-h-[92vh] w-full
            flex-col overflow-hidden
            bg-white shadow-2xl
            sm:rounded-2xl
            ${sizes[size]}
          `}
        >
          {/* Header */}
  
          <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {title}
              </h2>
  
              {description && (
                <p className="mt-1 text-sm text-slate-500">
                  {description}
                </p>
              )}
            </div>
  
            <button
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
  
          {/* Body */}
  
          <div className="overflow-y-auto p-5 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    );
  }