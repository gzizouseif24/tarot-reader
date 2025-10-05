// src/utils/shuffle.ts
import type { TarotCard } from '../data/types';

/**
 * Fisher-Yates shuffle algorithm
 * Performs 7 passes for better randomization (traditional tarot practice)
 */
export function shuffleDeck(deck: TarotCard[]): TarotCard[] {
  const shuffled = [...deck];
  
  // Perform 7 passes (traditional number in tarot)
  for (let pass = 0; pass < 7; pass++) {
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  }
  
  return shuffled;
}

/**
 * Simulate realistic shuffle timing
 * Returns a promise that resolves after shuffle duration
 */
export function shuffleWithDelay(deck: TarotCard[], duration: number = 2000): Promise<TarotCard[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(shuffleDeck(deck));
    }, duration);
  });
}