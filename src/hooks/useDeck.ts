// src/hooks/useDeck.ts
import { useState, useCallback } from 'react';
import type { TarotCard, DrawnCard } from '../data/types';
import { allCards } from '../data';
import { shuffleDeck } from '../utils/shuffle';
import { drawCards } from '../utils/cardHelpers';

export function useDeck() {
  const [deck, setDeck] = useState<TarotCard[]>(allCards);
  const [isShuffling, setIsShuffling] = useState(false);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);

  // Shuffle the deck
  const shuffle = useCallback(async () => {
    setIsShuffling(true);
    
    // Simulate shuffle animation duration (match animation: 2500ms + stagger delays)
    await new Promise(resolve => setTimeout(resolve, 2700));
    
    const shuffled = shuffleDeck(allCards);
    setDeck(shuffled);
    setIsShuffling(false);
  }, []);

  // Draw specified number of cards
  const draw = useCallback((count: number = 1) => {
    const drawn = drawCards(deck, count);
    setDrawnCards(drawn);
    
    // Remove drawn cards from deck
    setDeck(prevDeck => prevDeck.slice(count));
    
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
    draw,
    reset,
    cardsRemaining: deck.length
  };
}