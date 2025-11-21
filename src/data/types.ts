// src/data/types.ts

export type Arcana = 'major' | 'minor';
export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles' | 'major';
export type Element = 'fire' | 'water' | 'air' | 'earth';
export type Orientation = 'upright' | 'reversed';
export type SpreadType = 'single' | 'three-card' | 'celtic-cross';
export type ThreeCardVariant = 'past-present-future' | 'situation-action-outcome' | 'mind-body-spirit';
export type ReadingType = 'one' | 'three';

// Zodiac Signs
export type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

export const ZODIAC_SIGNS = {
  aries: { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19', element: 'Fire' },
  taurus: { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20', element: 'Earth' },
  gemini: { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20', element: 'Air' },
  cancer: { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', element: 'Water' },
  leo: { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22', element: 'Fire' },
  virgo: { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', element: 'Earth' },
  libra: { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22', element: 'Air' },
  scorpio: { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', element: 'Water' },
  sagittarius: { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', element: 'Fire' },
  capricorn: { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19', element: 'Earth' },
  aquarius: { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18', element: 'Air' },
  pisces: { name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20', element: 'Water' },
} as const;

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