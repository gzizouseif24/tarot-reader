// src/components/Deck/Deck.tsx
import { motion } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { TarotCard } from '../../data/types';
import './Deck.css';

interface DeckProps {
  isShuffling: boolean;
  cardsRemaining: number;
  onShuffle: () => void;
  deck: TarotCard[];
}

export function Deck({ isShuffling, cardsRemaining, onShuffle, deck }: DeckProps) {
  const [displayCards, setDisplayCards] = useState<TarotCard[]>([]);
  const [hasSwapped, setHasSwapped] = useState(false);

  // Initialize display cards on mount
  useEffect(() => {
    if (displayCards.length === 0 && deck.length > 0) {
      const randomStartIndex = Math.floor(Math.random() * Math.max(0, deck.length - 6));
      setDisplayCards(deck.slice(randomStartIndex, randomStartIndex + 6));
    }
  }, [deck, displayCards.length]);

  // Handle shuffle completion
  useEffect(() => {
    if (!isShuffling && hasSwapped) {
      // Animation finished, reset flag
      setHasSwapped(false);
    } else if (isShuffling && !hasSwapped) {
      // Swap cards at midpoint
      const timer = setTimeout(() => {
        const randomStartIndex = Math.floor(Math.random() * Math.max(0, deck.length - 6));
        setDisplayCards(deck.slice(randomStartIndex, randomStartIndex + 6));
        setHasSwapped(true);
      }, 1400); // 50% of 2.8s animation

      return () => clearTimeout(timer);
    }
  }, [isShuffling, hasSwapped, deck]);

  const getStackPosition = (index: number) => ({
    x: 0,
    y: -index * 0.5,
    rotate: -index * 0.2,
    scale: 1,
    zIndex: displayCards.length - index,
  });

  if (displayCards.length === 0) return null;

  return (
    <div className={`deck-container ${isShuffling ? 'shuffle-active' : ''}`}>
      <div 
        className="deck-stack"
        onClick={!isShuffling ? onShuffle : undefined}
        style={{ cursor: isShuffling ? 'default' : 'pointer' }}
      >
        {displayCards.map((card, index) => {
          const stackPos = getStackPosition(index);

          return (
            <motion.div
              key={`card-${index}`}
              className="deck-card-riffle"
              style={{ 
                position: 'absolute',
                zIndex: stackPos.zIndex 
              }}
              animate={isShuffling ? {
                // Riffle shuffle: split left/right, lift, interleave back
                x: [
                  stackPos.x,
                  index % 2 === 0 ? -90 : 90,   // Split wider
                  index % 2 === 0 ? -90 : 90,   // Hold position
                  index % 2 === 0 ? -20 : 20,   // Move closer for interleave
                  0,                             // Merge at center
                  stackPos.x                     // Return to stack
                ],
                y: [
                  stackPos.y,
                  -Math.floor(index / 2) * 4 - 15,  // Lift higher
                  -Math.floor(index / 2) * 4 - 15,  // Hold lifted
                  -Math.floor(index / 2) * 3,       // Start descending
                  -index * 0.8,                     // Interleave descent
                  stackPos.y                         // Return to stack
                ],
                rotate: [
                  stackPos.rotate,
                  index % 2 === 0 ? -12 : 12,   // Tilt more
                  index % 2 === 0 ? -12 : 12,   // Hold tilt
                  index % 2 === 0 ? -5 : 5,     // Reduce tilt
                  0,                             // Straighten
                  stackPos.rotate                // Return to stack angle
                ],
                scale: [1, 1.05, 1.05, 1, 1, 1],
                transition: {
                  duration: 2.8,
                  times: [0, 0.2, 0.4, 0.55, 0.75, 1],
                  ease: [0.34, 0.51, 0.45, 0.94],  // Custom smooth easing
                  delay: index * 0.03
                }
              } : stackPos}
            >
              <div className="card-riffle-wrapper">
                <img
                  src={card.image}
                  alt={`${card.cardName} preview`}
                  className="deck-card-image-riffle"
                />
                <div className="card-riffle-shadow"></div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="deck-info">
        <p className="cards-remaining">
          {isShuffling ? (
            <>
              <Shuffle size={14} className="shuffle-icon spinning" />
              Shuffling...
            </>
          ) : (
            `${cardsRemaining} cards • Click to shuffle`
          )}
        </p>
      </div>
    </div>
  );
}
