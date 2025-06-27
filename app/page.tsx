'use client';

import { useEffect, useState } from 'react';
import LoadingState from '@/app/components/LoadingState';
import ErrorState from '@/app/components/ErrorState';

export default function Home() {
  const [initialized, setInitialized] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Telegram WebApp
  useEffect(() => {
    const initTelegram = async () => {
      try {
        // 1. Dynamically import TWA SDK
        const { default: WebApp } = await import('@twa-dev/sdk');
        console.log('Telegram WebApp SDK loaded:', WebApp);

        // 2. Check if running in Telegram environment
        const isTelegram = typeof WebApp.initData !== 'undefined';
        console.log('Running in Telegram:', isTelegram);

        if (!isTelegram) {
          setError('Please open this app within Telegram');
          setIsLoading(false);
          setInitialized(true);
          return;
        }

        // 3. Initialize Telegram WebApp
        WebApp.ready();
        WebApp.expand();
        console.log('Telegram WebApp initialized');

        // 4. Get user data
        const user = WebApp.initDataUnsafe?.user;
        console.log('Telegram user data:', user);

        if (!user?.id) {
          setError('No user data available');
        } else {
          setUserId(user.id.toString());
          // Here you would typically fetch user-specific data
        }

        // 5. Set up back button handler if needed
        WebApp.BackButton.onClick(() => {
          WebApp.close();
        });

        setInitialized(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Initialization failed:', err);
        setError(`Initialization error: ${err instanceof Error ? err.message : String(err)}`);
        setInitialized(true);
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure all Telegram SDK is ready
    const timer = setTimeout(() => {
      initTelegram();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Handle retry
  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    window.location.reload();
  };

  // Render loading state
  if (!initialized || isLoading) {
    return <LoadingState/>;
  }

  // Render error state
  if (error) {
    return (
      <ErrorState 
        error={error}
        onRetry={handleRetry}
        retryable={error.includes('Please open') ? false : true}
      />
    );
  }

  // Main app UI
  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6 text-center">Digital Store</h1>
      
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">User Information</h2>
        <p>User ID: {userId || 'Not available'}</p>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Welcome to our Mini App!</h2>
        <p className="text-gray-600">
          This is a sample Telegram Mini App. More features coming soon!
        </p>
      </div>
    </div>
  );
}