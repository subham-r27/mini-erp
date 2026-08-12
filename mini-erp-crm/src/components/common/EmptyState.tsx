import {
    Inbox,
  } from "lucide-react";
  
  interface EmptyStateProps {
    title: string;
    description?: string;
  }
  
  export default function EmptyState({
    title,
    description,
  }: EmptyStateProps) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          <Inbox className="h-5 w-5" />
        </div>
  
        <h3 className="mt-4 text-sm font-semibold text-slate-800">
          {title}
        </h3>
  
        {description && (
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>
    );
  }