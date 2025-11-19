// src/data/types.ts

export type Arcana = 'major' | 'minor';
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles' | 'major';
export type Element = 'fire' | 'water' | 'air' | 'earth';
export type Orientation = 'upright' | 'reversed';
export type SpreadType = 'single' | 'three-card' | 'celtic-cross';
export type ThreeCardVariant = 'past-present-future' | 'situation-action-outcome' | 'mind-body-spirit';
export type ReadingType = 'one' | 'three';

// Position labels for three-card spread
export const THREE_CARD_POSITIONS = ['Past', 'Present', 'Future'] as const;
export type ThreeCardPosition = typeof THREE_CARD_POSITIONS[number];

export interface TarotCard {
  id: string;
  cardName: string;
  arcana: Arcana;
  suit: Suit;
  number: number | string;
  element?: Element;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  image: string;
}

export interface DrawnCard extends TarotCard {
  orientation: Orientation;
  positionInSpread?: string;
  positionMeaning?: string;
}

export interface Reading {
  id: string;
  timestamp: number;
  spreadType: SpreadType;
  question: string;
  cards: DrawnCard[];
  notes: string;
}

export interface CelticCrossPositions {
  presentSituation: DrawnCard;
  challenge: DrawnCard;
  consciousGoal: DrawnCard;
  subconscious: DrawnCard;
  recentPast: DrawnCard;
  nearFuture: DrawnCard;
  yourAttitude: DrawnCard;
  externalInfluences: DrawnCard;
  hopesAndFears: DrawnCard;
  finalOutcome: DrawnCard;
}

export interface ThreeCardReading {
  variant: ThreeCardVariant;
  cards: [DrawnCard, DrawnCard, DrawnCard];
  positions: [string, string, string];
  question: string;
}