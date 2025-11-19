// src/utils/cardHelpers.ts
import type { TarotCard, DrawnCard, Orientation } from '../data/types';

/**
 * Assign random orientation to a card (50/50 upright/reversed)
 */
export function assignOrientation(): Orientation {
  return Math.random() < 0.5 ? 'upright' : 'reversed';
}

/**
 * Draw a single card from the deck with orientation
 */
export function drawCard(card: TarotCard): DrawnCard {
  const orientation = assignOrientation();

  return {
    ...card,
    orientation
  };
}

/**
 * Draw multiple cards RANDOMLY from the deck (not related to shuffle order)
 */
export function drawCards(deck: TarotCard[], count: number): DrawnCard[] {
  const drawn: DrawnCard[] = [];

  // Create a copy to avoid mutating original deck
  const availableCards = [...deck];

  for (let i = 0; i < count && availableCards.length > 0; i++) {
    // Pick a random index
    const randomIndex = Math.floor(Math.random() * availableCards.length);

    // Draw the card at that random index
    drawn.push(drawCard(availableCards[randomIndex]));

    // Remove it from available cards so we don't draw it again
    availableCards.splice(randomIndex, 1);
  }

  return drawn;
}

/**
 * Get the appropriate meaning based on orientation
 */
export function getCardMeaning(card: DrawnCard): string {
  return card.orientation === 'upright'
    ? card.uprightMeaning
    : card.reversedMeaning;
}

/**
 * Generate a unique ID for readings
 */
export function generateReadingId(): string {
  return `reading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}