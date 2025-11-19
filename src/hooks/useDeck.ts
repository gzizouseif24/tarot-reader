// src/hooks/useDeck.ts
import { useState, useCallback } from 'react';
import type { TarotCard, DrawnCard } from '../data/types';
import { allCards } from '../data';
import { drawCards } from '../utils/cardHelpers';

export function useDeck() {
  const [deck, setDeck] = useState<TarotCard[]>(allCards);
  const [isShuffling, setIsShuffling] = useState(false);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);

  // Start shuffle animation
  const shuffle = useCallback(() => {
    setIsShuffling(true);
    // Animation will call handleShuffleComplete when done
  }, []);

  // Called by Deck component when animation completes
  const handleShuffleComplete = useCallback((newOrder: TarotCard[]) => {
    setDeck(newOrder);
    setIsShuffling(false);
  }, []);

  // Draw specified number of cards RANDOMLY
  const draw = useCallback((count: number = 1) => {
    const drawn = drawCards(deck, count);
    setDrawnCards(drawn);

    // Remove the drawn cards from the deck
    const drawnIds = new Set(drawn.map(c => c.id));
    setDeck(prevDeck => prevDeck.filter(card => !drawnIds.has(card.id)));

    return drawn;
  }, [deck]);

  // Reset deck to full 78 cards
  const reset = useCallback(() => {
    setDeck(allCards);
    setDrawnCards([]);
    setIsShuffling(false);
  }, []);

  return {
    deck,
    drawnCards,
    isShuffling,
    shuffle,
    handleShuffleComplete,
    draw,
    reset,
    cardsRemaining: deck.length
  };
}