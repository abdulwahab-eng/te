'use client';

import { useEffect, useState } from 'react';

// Import components
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

  // Fetch purchase history
  useEffect(() => {
    if (initialized && userId) {
    }
  }, [initialized, userId]);


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

  // Main app UI
  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6 text-center">Digital Store</h1>
      
    </div>
  );
}