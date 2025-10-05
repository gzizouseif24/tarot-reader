// src/data/index.ts
import { majorArcana } from './majorArcana';
import { wands, cups, swords, pentacles } from './minorArcana';
import type { TarotCard } from './types';

// Combine all 78 cards
export const allCards: TarotCard[] = [
  ...majorArcana,
  ...wands,
  ...cups,
  ...swords,
  ...pentacles
];

// Export individual suits for easy access
export { majorArcana, wands, cups, swords, pentacles };

// Export types
export * from './types';

// Validation function
export function validateDeck(): boolean {
  if (allCards.length !== 78) {
    console.error(`Invalid deck size: ${allCards.length}. Expected 78 cards.`);
    return false;
  }
  
  // Check for duplicate IDs
  const ids = new Set(allCards.map(card => card.id));
  if (ids.size !== 78) {
    console.error('Duplicate card IDs found!');
    return false;
  }
  
  console.log('✅ Deck validated: 78 cards loaded successfully!');
  return true;
}