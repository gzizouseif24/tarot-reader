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
 * Draw multiple cards from a shuffled deck
 */
export function drawCards(deck: TarotCard[], count: number): DrawnCard[] {
  const drawn: DrawnCard[] = [];
  
  for (let i = 0; i < count && i < deck.length; i++) {
    drawn.push(drawCard(deck[i]));
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