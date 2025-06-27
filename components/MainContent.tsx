import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, CheckCircle } from 'lucide-react';

export default function MainContent({
  step,
  userId,
  showFeatures
}: {
  step: number;
  userId: string;
  showFeatures: boolean;
}) {
  return (
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
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 cursor-pointer">
                <ShoppingCart className="text-blue-500" />
                Featured Products
              </h3>
              <p className="text-gray-300">
                Discover our exclusive collection just for Telegram users!
              </p>
            </motion.div>
            <button
              className="w-full border-2 border-blue-500 shadow-lg rounded-lg py-3 px-4 mt-2 text-blue-500 font-semibold hover:bg-blue-500 hover:text-white transition-colors duration-200"
              onClick={() => window.location.href = '/dashboard'}
            >
              Explore Products
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
