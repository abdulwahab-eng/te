'use client';
import { useEffect, useState } from 'react';


import LoadingState from '@/app/components/LoadingState';
import ErrorState from '@/app/components/ErrorState';

export default function Home() {
  const [initialized, setInitialized] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Import TWA SDK dynamically to avoid SSR issues
    const initTelegram = async () => {
      try {
        // Dynamic import of the TWA SDK
        const WebApp = (await import('@twa-dev/sdk')).default;
        
        // Check if running within Telegram
        const isTelegram = WebApp.isExpanded !== undefined;
        
        if (isTelegram) {
          // Initialize Telegram Web App
          WebApp.ready();
          WebApp.expand();
          
          // Get user ID from initData
          if (WebApp.initDataUnsafe && WebApp.initDataUnsafe.user) {
            // Access user data directly from the WebApp object
            const user = WebApp.initDataUnsafe.user;
            setUserId(user.id?.toString() || '');
          } else {
            setError('No user data available from Telegram');
            setIsLoading(false);
          }
        } else {
          // Not in Telegram, set an error message
          setError('This application can only be accessed from within Telegram');
          setIsLoading(false);
        }

        setInitialized(true);
      } catch (e) {
        console.error('Failed to initialize Telegram Web App:', e);
        setError('Failed to initialize Telegram Web App');
        setInitialized(true);
        setIsLoading(false);
      }
    };

    initTelegram();
  }, []);


  // Handle retry on error
  const handleRetry = () => {
    window.location.reload();
  };



  // Loading state
  if (!initialized || isLoading) {
    return <LoadingState />;
  }

  // Error state (including not in Telegram)
  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >

            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >

          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >

          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
