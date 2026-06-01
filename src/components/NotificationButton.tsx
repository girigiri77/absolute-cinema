import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check } from 'lucide-react';
import { requestNotificationPermission, isSubscribed } from '../lib/onesignal';

const NotificationButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubscribedState, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    const subscribed = await isSubscribed();
    setIsSubscribed(subscribed);
  };

  const handleEnableClick = () => {
    setIsModalOpen(true);
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const granted = await requestNotificationPermission();
      
      if (granted) {
        setIsSubscribed(true);
        showToastMessage('Notifications Enabled Successfully', 'success');
      } else {
        showToastMessage('Notifications were blocked. Please enable them in your browser settings.', 'error');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to request permission:', error);
      showToastMessage('Failed to enable notifications. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (isSubscribedState) {
    return (
      <>
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_-5px_rgba(168,85,247,0.6)]">
            <Check className="h-4 w-4" />
            <span>Notifications Enabled</span>
          </div>
        </div>

        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-24 right-6 z-[60] rounded-xl border border-white/10 bg-[#0a0612] px-4 py-3 text-sm text-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5)]"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEnableClick}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-5px_rgba(168,85,247,0.6)] transition hover:shadow-[0_15px_40px_-5px_rgba(168,85,247,0.8)]"
        >
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Enable Notifications</span>
          <span className="sm:hidden">Enable</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0612] p-6 shadow-[0_25px_60px_-15px_rgba(168,85,247,0.4)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Stay Updated</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mb-6 text-white/70">Get instant alerts for:</p>

              <ul className="mb-6 space-y-3 text-white/80">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                  <span>Latest OTT Releases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                  <span>Friday Release Roundups</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                  <span>Saturday Weekend Picks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                  <span>Trending Movies & Series</span>
                </li>
              </ul>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="flex-1 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-5px_rgba(168,85,247,0.6)] transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? 'Enabling...' : 'Enable Notifications'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-24 right-6 z-[60] rounded-xl border px-4 py-3 text-sm text-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5)] ${
              toastType === 'success'
                ? 'border-fuchsia-500/30 bg-[#0a0612]'
                : 'border-red-500/30 bg-[#0a0612]'
            }`}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationButton;
