'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';
import FooterTabBar from '@/components/FooterTabBar';

export default function Home() {
  // Telegram state
  const [initialized, setInitialized] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animation state
  const [step, setStep] = useState(0); // 0: init, 1: loading, 2: content
  const progress = useMotionValue(0);
  const [showFeatures, setShowFeatures] = useState(false);

  // Initialize Telegram WebApp
  useEffect(() => {
    const initTelegram = async () => {
      try {
        // 1. Dynamically import TWA SDK
        const { default: WebApp } = await import('@twa-dev/sdk');
        
        // 2. Check if running in Telegram environment
        const isTelegram = WebApp.platform !== 'unknown' && 
                         (WebApp.initData || WebApp.initDataUnsafe);

        if (!isTelegram) {
          setError('Please open this app within Telegram');
          setIsLoading(false);
          setInitialized(true);
          return;
        }

        // 3. Initialize Telegram WebApp
        WebApp.ready();
        WebApp.expand();

        // 4. Get user data
        const user = WebApp.initDataUnsafe?.user;
        if (!user?.id) {
          setError('No user data available');
        } else {
          setUserId(user.id.toString());
          // Start success animation sequence
          setStep(1);
          animate(progress, 1, {
            duration: 1.5,
            ease: "easeInOut",
            onComplete: () => {
              setStep(2);
              setTimeout(() => setShowFeatures(true), 500);
            }
          });
        }

        setInitialized(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Initialization failed:', err);
        setError(`Initialization error: ${err instanceof Error ? err.message : String(err)}`);
        setInitialized(true);
        setIsLoading(false);
      }
    };

    initTelegram();
  }, [progress]);

  // Handle retry
  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setStep(0);
    progress.set(0);
    setShowFeatures(false);
    window.location.reload();
  };

  // Render loading state
  if (!initialized || isLoading) {
    return <LoadingState />;
  }

  // Render error state
  if (error) {
    return (
      <ErrorState 
        error={error}
        onRetry={handleRetry}
        retryable={!error.includes('Please open')}
      />
    );
  }

  // Main app UI with animations
  return (
    <motion.section
      className="flex flex-col w-full min-h-screen bg-gradient-to-br from-[#181A20] via-[#101114] to-[#181A20] pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <Header />
      {/* Main Content */}
      <MainContent step={step} userId={userId} showFeatures={showFeatures} />
      {/* Footer TabBar */}
      <FooterTabBar />
    </motion.section>
  );
}