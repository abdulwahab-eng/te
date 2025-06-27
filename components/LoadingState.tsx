'use client';

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-lg">Loading Telegram Mini App...</p>
      <p className="tg-hint mt-2">Please wait while we initialize</p>
    </div>
  );
}