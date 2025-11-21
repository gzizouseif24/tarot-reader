// src/hooks/useTarotApi.ts
import { useState } from 'react';
import type { DrawnCard, ZodiacSign } from '../data/types';
import { getCardMeaning } from '../utils/cardHelpers';

interface ReadingResponse {
  reading: string;
}

interface ReadingError {
  detail: string;
}

export const useTarotReading = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReading = async (question: string, cards: DrawnCard[], zodiacSign?: ZodiacSign | null) => {
    setLoading(true);
    setError(null);

    try {
      // Build request payload with card data and optional zodiac sign
      const requestBody = {
        question,
        cards: cards.map(card => ({
          card_name: card.cardName,
          orientation: card.orientation,
          keywords: card.keywords,
          meaning: getCardMeaning(card) // Get upright or reversed meaning
        })),
        zodiac_sign: zodiacSign || null
      };

      const response = await fetch('http://localhost:8000/api/reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData: ReadingError = await response.json();
        throw new Error(errorData.detail || 'Failed to generate reading');
      }
      
      const data: ReadingResponse = await response.json();
      setLoading(false);
      return { reading: data.reading, error: null };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      setLoading(false);
      return { reading: null, error: errorMsg };
    }
  };
  
  return { generateReading, loading, error };
};
