'use client';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  retryable?: boolean;
}

export default function ErrorState({ 
  error, 
  onRetry, 
  retryable = true 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="text-red-500 text-5xl mb-4">⚠️</div>
      <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
      <p className="mb-6 tg-hint max-w-md mx-auto">{error}</p>
      {retryable && (
        <button 
          onClick={onRetry}
          className="tg-button px-6 py-3 rounded-lg"
        >
          Retry
        </button>
      )}
    </div>
  );
}