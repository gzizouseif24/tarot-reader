// src/components/LoadingStates/LoadingStates.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Moon, Stars, Eye } from 'lucide-react';
import './LoadingStates.css';

const loadingMessages = [
  { text: "Shuffling the cosmic deck...", icon: Sparkles },
  { text: "Consulting the stars...", icon: Stars },
  { text: "Reading the cards...", icon: Eye },
  { text: "Channeling your message...", icon: Moon },
];

interface LoadingStatesProps {
  isLoading: boolean;
}

export function LoadingStates({ isLoading }: LoadingStatesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setCurrentIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000); // Change message every 2 seconds

    return () => clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) return null;

  const currentMessage = loadingMessages[currentIndex];
  const Icon = currentMessage.icon;

  return (
    <div className="loading-states">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="loading-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          <Icon size={24} className="loading-message-icon" />
          <p className="loading-message-text">{currentMessage.text}</p>
        </motion.div>
      </AnimatePresence>
      
      <div className="loading-dots">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
}
