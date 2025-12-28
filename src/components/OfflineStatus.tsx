import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OfflineStatus: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed top-0 left-0 right-0 z-[110] p-4"
        >
          <div className="max-w-md mx-auto bg-amber-500 text-black px-6 py-3 rounded-2xl flex items-center justify-between shadow-2xl shadow-amber-500/20">
            <div className="flex items-center gap-3">
              <WifiOff size={20} className="animate-pulse" />
              <div className="text-xs font-black uppercase tracking-widest">Você está offline</div>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <RefreshCcw size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
