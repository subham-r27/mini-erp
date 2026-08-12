interface LoadingStateProps {
    message?: string;
  }
  
  export default function LoadingState({
    message = "Loading...",
  }: LoadingStateProps) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
  
          <p className="mt-3 text-sm text-slate-500">
            {message}
          </p>
        </div>
      </div>
    );
  }