// src/components/Deck/Deck.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import { useDeck } from '../../hooks/useDeck';
import { useState, useEffect } from 'react';
import './Deck.css';

interface DeckProps {
  isShuffling: boolean;
  cardsRemaining: number;
  onShuffle: () => void;
}

export function Deck({ isShuffling, cardsRemaining, onShuffle }: DeckProps) {
  const { deck } = useDeck();
  const [displayCards, setDisplayCards] = useState(deck.slice(0, 6));

  // Update display cards when deck changes (after shuffle)
  useEffect(() => {
    if (!isShuffling && deck.length > 0) {
      // Pick 6 random cards from the shuffled deck to display
      const randomStartIndex = Math.floor(Math.random() * (deck.length - 6));
      setDisplayCards(deck.slice(randomStartIndex, randomStartIndex + 6));
    }
  }, [deck, isShuffling]);

  const currentCards = displayCards;
  const totalCards = currentCards.length;

  // Get position for stacked cards
  const getStackPosition = (index: number) => ({
    x: 0,
    y: -index * 0.5, // Tighter stack
    rotate: -index * 0.2, // Settle rotation
    scale: 1,
    opacity: 1,
    zIndex: totalCards - index,
  });

  // Get dynamic shuffle position with washing motion
  const getShufflePosition = (index: number, phase: number) => {
    const isLeftPile = index % 2 === 0;
    const baseOffset = isLeftPile ? -100 : 100;
    const verticalSpread = -Math.floor(index / 2) * 2;

    // Add washing motion - cards move around within piles
    const washX = Math.sin(phase * Math.PI * 2 + index) * 15;
    const washY = Math.cos(phase * Math.PI * 2 + index) * 8;
    const washRotate = Math.sin(phase * Math.PI * 4 + index) * 5;

    return {
      x: baseOffset + washX,
      y: verticalSpread + washY,
      rotate: (isLeftPile ? -3 : 3) + washRotate,
      scale: 1.02 + Math.sin(phase * Math.PI * 2 + index) * 0.05,
      opacity: 1,
      zIndex: isLeftPile ? totalCards - Math.floor(index / 2) : totalCards + Math.floor(index / 2),
    };
  };

  return (
    <div className={`deck-container ${isShuffling ? 'shuffle-active' : ''}`}>
      <div 
        className="deck-stack"
        onClick={!isShuffling ? onShuffle : undefined}
        style={{ cursor: isShuffling ? 'default' : 'pointer' }}
      >
        <AnimatePresence mode="sync">
          {currentCards.map((card, index) => {
            const stackPos = getStackPosition(index);
            // Multiple shuffle phases for dynamic washing motion
            const shufflePhase1 = getShufflePosition(index, 0);
            const shufflePhase2 = getShufflePosition(index, 0.25);
            const shufflePhase3 = getShufflePosition(index, 0.5);
            const shufflePhase4 = getShufflePosition(index, 0.75);

            return (
              <motion.div
                key={card.id}
                className="deck-card-riffle"
                style={{
                  zIndex: isShuffling ? shufflePhase2.zIndex : stackPos.zIndex,
                }}
                initial={false}
                animate={isShuffling ? {
                  // Dynamic washing shuffle with multiple phases
                  x: [
                    stackPos.x,
                    shufflePhase1.x, shufflePhase2.x, shufflePhase3.x, shufflePhase4.x,
                    shufflePhase3.x, shufflePhase2.x, shufflePhase1.x,
                    stackPos.x
                  ],
                  y: [
                    stackPos.y,
                    shufflePhase1.y, shufflePhase2.y, shufflePhase3.y, shufflePhase4.y,
                    shufflePhase3.y, shufflePhase2.y, shufflePhase1.y,
                    stackPos.y
                  ],
                  rotate: [
                    stackPos.rotate,
                    shufflePhase1.rotate, shufflePhase2.rotate, shufflePhase3.rotate, shufflePhase4.rotate,
                    shufflePhase3.rotate, shufflePhase2.rotate, shufflePhase1.rotate,
                    stackPos.rotate
                  ],
                  scale: [
                    1,
                    shufflePhase1.scale, shufflePhase2.scale, shufflePhase3.scale, shufflePhase4.scale,
                    shufflePhase3.scale, shufflePhase2.scale, shufflePhase1.scale,
                    1
                  ],
                  opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1],
                  transition: {
                    duration: 2.5, // Longer for dynamic washing motion
                    times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.85, 0.95, 1],
                    ease: [0.25, 0.46, 0.45, 0.94], // Smooth natural easing
                    delay: index * 0.03 // Staggered for realistic washing effect
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
        </AnimatePresence>
      </div>

      <div className="deck-info">
        <p className="cards-remaining">
          {isShuffling ? (
            <>
              <Shuffle size={14} className="shuffle-icon spinning" />
              Shuffling...
            </>
          ) : (
            <>
              {cardsRemaining} cards • Click to shuffle
            </>
          )}
        </p>
      </div>
    </div>
  );
}