// src/components/Deck/Deck.tsx
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
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
  const prevShufflingRef = useRef(isShuffling);

  // Initialize display cards on mount
  useEffect(() => {
    if (displayCards.length === 0 && deck.length > 0) {
      const randomStartIndex = Math.floor(Math.random() * Math.max(0, deck.length - 6));
      setDisplayCards(deck.slice(randomStartIndex, randomStartIndex + 6));
    }
  }, [deck, displayCards.length]);

  // Track shuffle state changes
  useEffect(() => {
    prevShufflingRef.current = isShuffling;
  }, [isShuffling]);

  // Card positioning functions
  const getStackPosition = (index: number) => ({
    x: 0,
    y: -index * 0.5,
    rotate: -index * 0.2,
    scale: 1,
    opacity: 1,
    zIndex: displayCards.length - index,
  });

  const getShufflePosition = (index: number, phase: number) => {
    const isLeftPile = index % 2 === 0;
    const baseOffset = isLeftPile ? -100 : 100;
    const verticalSpread = -Math.floor(index / 2) * 2;
    const washX = Math.sin(phase * Math.PI * 2 + index) * 15;
    const washY = Math.cos(phase * Math.PI * 2 + index) * 8;
    const washRotate = Math.sin(phase * Math.PI * 4 + index) * 5;

    return {
      x: baseOffset + washX,
      y: verticalSpread + washY,
      rotate: (isLeftPile ? -3 : 3) + washRotate,
      scale: 1.02 + Math.sin(phase * Math.PI * 2 + index) * 0.05,
      zIndex: isLeftPile 
        ? displayCards.length - Math.floor(index / 2) 
        : displayCards.length + Math.floor(index / 2),
    };
  };

  if (displayCards.length === 0) return null;

  return (
    <div className={`deck-container ${isShuffling ? 'shuffle-active' : ''}`}>
      <div 
        className="deck-stack"
        onClick={!isShuffling ? onShuffle : undefined}
        style={{ cursor: isShuffling ? 'default' : 'pointer' }}
      >
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {displayCards.map((card, index) => {
              const stackPos = getStackPosition(index);
              const phase1 = getShufflePosition(index, 0);
              const phase2 = getShufflePosition(index, 0.25);
              const phase3 = getShufflePosition(index, 0.5);
              const phase4 = getShufflePosition(index, 0.75);

              return (
                <motion.div
                  key={card.id}
                  layoutId={`card-${card.id}`}
                  className="deck-card-riffle"
                  style={{ zIndex: isShuffling ? phase2.zIndex : stackPos.zIndex }}
                  initial={false}
                  animate={isShuffling ? {
                    x: [stackPos.x, phase1.x, phase2.x, phase3.x, phase4.x, phase3.x, phase2.x, phase1.x, stackPos.x],
                    y: [stackPos.y, phase1.y, phase2.y, phase3.y, phase4.y, phase3.y, phase2.y, phase1.y, stackPos.y],
                    rotate: [stackPos.rotate, phase1.rotate, phase2.rotate, phase3.rotate, phase4.rotate, phase3.rotate, phase2.rotate, phase1.rotate, stackPos.rotate],
                    scale: [1, phase1.scale, phase2.scale, phase3.scale, phase4.scale, phase3.scale, phase2.scale, phase1.scale, 1],
                    transition: {
                      duration: 2.5,
                      times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.85, 0.95, 1],
                      ease: [0.25, 0.46, 0.45, 0.94],
                      delay: index * 0.03
                    }
                  } : stackPos}
                  layout
                  transition={{ layout: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }}
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
        </LayoutGroup>
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
