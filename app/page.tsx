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
    const initTelegram = async () => {
      try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          setError('Not running in a browser environment');
          setIsLoading(false);
          setInitialized(true);
          return;
        }

        // Dynamically import TWA SDK
        const { default: WebApp } = await import('@twa-dev/sdk');
        console.log('Telegram WebApp SDK loaded:', WebApp);

        // Enhanced Telegram environment check
        const isTelegram = WebApp.platform !== 'unknown' && 
                          (WebApp.initData || WebApp.initDataUnsafe);
        console.log('Running in Telegram:', isTelegram, 'Platform:', WebApp.platform);

        if (!isTelegram) {
          setError('Please open this app within Telegram');
          setIsLoading(false);
          setInitialized(true);
          return;
        }

        // Initialize Telegram WebApp
        WebApp.ready();
        WebApp.expand();
        console.log('Telegram WebApp initialized');

        // Get user data with more robust checking
        const initData = WebApp.initDataUnsafe;
        console.log('Full initData:', initData);

        if (!initData?.user?.id) {
          console.warn('User data missing, initData:', initData);
          setError('No user data available from Telegram');
          // You might want to continue without user data in some cases
          // setInitialized(true);
          // setIsLoading(false);
          // return;
        } else {
          setUserId(initData.user.id.toString());
          // Here you would typically fetch user-specific data
        }

        // Set up back button handler if needed
        if (WebApp.BackButton) {
          WebApp.BackButton.onClick(() => {
            WebApp.close();
          });
        }

        setInitialized(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Initialization failed:', err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Initialization error: ${errorMessage}`);
        setInitialized(true);
        setIsLoading(false);
      }
    };

    // Remove the delay if not necessary - it might be hiding initialization issues
    initTelegram();

    // Cleanup function if needed
    return () => {
      // Any cleanup code here
    };
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    window.location.reload();
  };

  if (!initialized || isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState 
        error={error}
        onRetry={handleRetry}
        retryable={!error.includes('Please open')}
      />
    );
  }

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