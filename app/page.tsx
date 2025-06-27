'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { Plane, ShoppingCart, Rocket, CheckCircle } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { InteractiveHoverButton } from '@/app/components/magicui/interactive-hover-button';
import LoadingState from '@/app/components/LoadingState';
import ErrorState from '@/app/components/ErrorState';

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

  // Animation values
  const arcCenterX = 490;
  const arcCenterY = 390;
  const arcRadius = 380;
  const cx = useTransform(progress, t => arcCenterX + arcRadius * Math.cos(Math.PI * (1 - t)));
  const cy = useTransform(progress, t => arcCenterY - arcRadius * Math.sin(Math.PI * (1 - t)));
  const angle = useTransform(progress, t => {
    const theta = Math.PI + Math.PI * t;
    const dx = -arcRadius * Math.PI * Math.sin(theta);
    const dy = arcRadius * Math.PI * Math.cos(theta);
    return (Math.atan2(dy, dx) * 180) / Math.PI + 40;
  });
  const arcPath = "M 120 400 A 380 380 0 0 1 880 400";

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
          const controls = animate(progress, 1, {
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
  }, []);

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
      className="flex flex-col w-full min-h-screen bg-gradient-to-br from-[#181A20] via-[#101114] to-[#181A20]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Header */}
      <motion.div className="relative h-64 overflow-hidden">
        <svg
          viewBox="0 0 1000 500"
          className="pointer-events-none absolute top-0 left-0 w-full h-full"
        >
          {/* Animated Arc */}
          <motion.path
            d={arcPath}
            stroke="#3b82f6"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8 10"
            initial={{ opacity: 0 }}
            animate={{ opacity: step >= 1 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Animated Rocket Icon moving along the arc */}
          {step >= 1 && (
            <motion.g
              style={{
                translateX: cx,
                translateY: cy,
                rotate: angle,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Rocket className="text-blue-500" height={24} width={24} />
            </motion.g>
          )}
        </svg>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="flex-1 p-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 30 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
          Digital Store
        </h1>
        
        {/* User Card */}
        <motion.div 
          className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 w-full max-w-md"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-500" />
            <span>Welcome to our Store!</span>
          </h2>
          <div className="space-y-2">
            <p className="text-gray-300">Your Telegram ID:</p>
            <p className="text-blue-400 font-mono text-lg">{userId || 'Not available'}</p>
          </div>
        </motion.div>

        {/* Features Section */}
        <AnimatePresence>
          {showFeatures && (
            <motion.div
              className="w-full max-w-md space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div 
                className="bg-gray-800 rounded-xl p-6 shadow-lg"
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <ShoppingCart className="text-blue-500" />
                  Featured Products
                </h3>
                <p className="text-gray-300">
                  Discover our exclusive collection just for Telegram users!
                </p>
              </motion.div>

              <InteractiveHoverButton 
                className="w-full border-2 border-blue-500 shadow-lg"
                onClick={() => alert('Coming soon!')}
              >
                Explore Products
              </InteractiveHoverButton>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}