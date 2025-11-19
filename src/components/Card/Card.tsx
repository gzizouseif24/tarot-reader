// src/components/Card/Card.tsx
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';
import type { DrawnCard } from '../../data/types';
import { getCardMeaning } from '../../utils/cardHelpers';
import './Card.css';

interface CardProps {
  card: DrawnCard;
  isRevealed: boolean;
  index?: number;
  onReset?: () => void;
}

export function Card({ card, isRevealed, index = 0, onReset }: CardProps) {
  const meaning = getCardMeaning(card);

  return (
    <div className="card-container">
      <motion.div
        className="card"
        initial={{
          rotateY: 180,
          opacity: 0,
          scale: 0.8,
          y: -50
        }}
        animate={{
          rotateY: isRevealed ? 0 : 180,
          opacity: 1,
          scale: 1,
          y: 0
        }}
        transition={{
          delay: index * 0.5, // Longer stagger for dramatic one-by-one reveal
          duration: 0.8,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        whileHover={isRevealed ? {
          scale: 1.05,
          y: -10,
          transition: { duration: 0.2 }
        } : {}}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <div className={`card-face ${card.orientation}`}>
          <img 
            src={card.image} 
            alt={card.cardName}
            className="card-image"
          />
        </div>
      </motion.div>

      {isRevealed && (
        <motion.div
          className="card-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.5 + 0.8, duration: 0.4 }}
        >
          <h3 className="card-name">{card.cardName}</h3>
          <p className="card-orientation">
            {card.orientation === 'upright' ? (
              <>
                <ArrowUp size={16} />
                Upright
              </>
            ) : (
              <>
                <ArrowDown size={16} />
                Reversed
              </>
            )}
          </p>
          <div className="card-keywords">
            {card.keywords.map((keyword, i) => (
              <span key={i} className="keyword">{keyword}</span>
            ))}
          </div>
          <p className="card-meaning">{meaning}</p>
        </motion.div>
      )}

      {isRevealed && onReset && (
        <motion.button
          className="btn-new-reading"
          onClick={onReset}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.5 + 1.2, duration: 0.3 }}
        >
          <RotateCcw size={16} />
          New Reading
        </motion.button>
      )}
    </div>
  );
}