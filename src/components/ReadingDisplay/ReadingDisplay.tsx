// src/components/ReadingDisplay/ReadingDisplay.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import './ReadingDisplay.css';

interface ReadingDisplayProps {
  reading: string;
  isVisible: boolean;
}

export function ReadingDisplay({ reading, isVisible }: ReadingDisplayProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!isVisible || !reading) {
      setDisplayedText('');
      setIsTyping(true);
      return;
    }

    let currentIndex = 0;
    setDisplayedText('');
    setIsTyping(true);

    // Typewriter effect
    const interval = setInterval(() => {
      if (currentIndex < reading.length) {
        setDisplayedText(reading.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 20); // 20ms per character for smooth typing

    return () => clearInterval(interval);
  }, [reading, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="reading-display"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="reading-header">
        <Sparkles size={20} className="reading-icon" />
        <h3 className="reading-title">Your Reading</h3>
        <Sparkles size={20} className="reading-icon" />
      </div>
      
      <div className="reading-content">
        <p className="reading-text">
          {displayedText}
          {isTyping && <span className="cursor">|</span>}
        </p>
      </div>
    </motion.div>
  );
}
