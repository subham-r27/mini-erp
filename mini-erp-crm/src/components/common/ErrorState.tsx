import {
    AlertTriangle,
    RefreshCw,
  } from "lucide-react";
  
  interface ErrorStateProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
  }
  
  export default function ErrorState({
    title = "Something went wrong",
    description = "We couldn't load this information. Please try again.",
    onRetry,
  }: ErrorStateProps) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
          <AlertTriangle className="h-5 w-5" />
        </div>
  
        <h3 className="mt-4 text-sm font-semibold text-slate-800">
          {title}
        </h3>
  
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          {description}
        </p>
  
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        )}
      </div>
    );
  }