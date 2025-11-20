// src/App.tsx
import { useState, useEffect } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useDeck } from './hooks/useDeck';
import { useTarotReading } from './hooks/useTarotApi';
import { Deck } from './components/Deck/Deck';
import { Card } from './components/Card/Card';
import { ReadingTypeSelector } from './components/ReadingTypeSelector';
import { LoadingStates } from './components/LoadingStates/LoadingStates';
import { ReadingDisplay } from './components/ReadingDisplay/ReadingDisplay';
import type { ReadingType } from './data/types';
import './App.css';

function App() {
  const { deck, drawnCards, isShuffling, shuffle, handleShuffleComplete, draw, reset, cardsRemaining } = useDeck();
  const { generateReading, loading: apiLoading, error: apiError } = useTarotReading();
  const [question, setQuestion] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [readingType, setReadingType] = useState<ReadingType>('one');
  const [aiReading, setAiReading] = useState<string | null>(null);

  // Preload all card images on mount
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = deck.map((card) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = card.image;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        setImagesLoaded(true); // Continue anyway
      }
    };

    preloadImages();
  }, [deck]);

  const handleShuffle = async () => {
    setIsRevealed(false);
    await shuffle();
  };

  const handleDraw = async () => {
    if (question.trim()) {
      const cardCount = readingType === 'one' ? 1 : 3;
      const drawn = draw(cardCount);
      
      // Reveal cards after a short delay for suspense
      setTimeout(() => setIsRevealed(true), 500);
      
      // Generate AI reading after cards are revealed
      setTimeout(async () => {
        const result = await generateReading(question, drawn);
        if (result.reading) {
          setAiReading(result.reading);
        } else if (result.error) {
          console.error('Reading generation error:', result.error);
          setAiReading('Unable to generate reading. Please try again.');
        }
      }, 1500); // Wait for card reveal animation
    } else {
      alert('Please enter your question or intention first!');
    }
  };

  const handleReset = () => {
    reset();
    setQuestion('');
    setIsRevealed(false);
    setAiReading(null);
    // Wait for reset to complete before shuffling
    setTimeout(() => shuffle(), 100);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Celestial Tarot</h1>
        <p className="app-subtitle">Seek Guidance from the Void</p>
      </header>

      <main className="app-main">
        {!imagesLoaded ? (
          <div className="loading-container">
            <Sparkles size={48} className="loading-icon" />
            <p>Loading cards...</p>
          </div>
        ) : drawnCards.length === 0 ? (
          <>
            <div className="intention-container">
              <input
                type="text"
                className="intention-input"
                placeholder="What guidance do you seek?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={isShuffling}
              />
            </div>

            <ReadingTypeSelector
              selectedType={readingType}
              onTypeChange={setReadingType}
              disabled={isShuffling}
            />

            <Deck
              isShuffling={isShuffling}
              cardsRemaining={cardsRemaining}
              onShuffle={handleShuffle}
              deck={deck}
              onShuffleComplete={handleShuffleComplete}
            />

            <div className="control-dock">
              <button
                className="btn-primary"
                onClick={handleDraw}
                disabled={isShuffling || !question.trim()}
              >
                <Sparkles size={18} />
                Reveal Destiny
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={`result-view ${drawnCards.length > 1 ? 'multi-card' : ''}`}>
              {drawnCards.map((card, index) => (
                <Card
                  key={card.id}
                  card={card}
                  isRevealed={isRevealed}
                  index={index}
                  onReset={drawnCards.length === 1 && !apiLoading && aiReading ? handleReset : undefined}
                />
              ))}
            </div>
            
            {/* Loading state while generating reading */}
            {isRevealed && !aiReading && !apiError && (
              <LoadingStates isLoading={apiLoading} />
            )}
            
            {/* Display AI reading */}
            {aiReading && (
              <ReadingDisplay reading={aiReading} isVisible={true} />
            )}
            
            {/* Error message */}
            {apiError && (
              <div className="error-message">
                <p>⚠️ {apiError}</p>
                <p className="error-hint">Make sure the backend is running on localhost:8000</p>
              </div>
            )}
            
            {/* New Reading button */}
            {isRevealed && (aiReading || apiError) && (
              <button className="btn-new-reading-global" onClick={handleReset}>
                <RotateCcw size={16} />
                New Reading
              </button>
            )}
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Rider-Waite Tarot • {cardsRemaining} cards in deck</p>
      </footer>
    </div>
  );
}

export default App;