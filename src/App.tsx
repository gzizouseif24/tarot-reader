// src/App.tsx
import { useState } from 'react';
import { useDeck } from './hooks/useDeck';
import { Deck } from './components/Deck/Deck';
import { Card } from './components/Card/Card';
import './App.css';

function App() {
  const { deck, drawnCards, isShuffling, shuffle, draw, reset, cardsRemaining } = useDeck();
  const [question, setQuestion] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  const handleShuffle = async () => {
    setIsRevealed(false);
    await shuffle();
  };

  const handleDraw = () => {
    if (question.trim()) {
      draw(1);
      // Reveal after a short delay for suspense
      setTimeout(() => setIsRevealed(true), 500);
    } else {
      alert('Please enter your question or intention first!');
    }
  };

  const handleReset = () => {
    reset();
    setQuestion('');
    setIsRevealed(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🔮 Tarot Card Puller</h1>
        <p className="app-subtitle">Connect with your intuition</p>
      </header>

      <main className="app-main">
        {drawnCards.length === 0 ? (
          <>
            <section className="intention-section">
              <label htmlFor="question" className="intention-label">
                Set Your Intention
              </label>
              <input
                id="question"
                type="text"
                className="intention-input"
                placeholder="What guidance do you seek?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={isShuffling}
              />
            </section>

            <section className="deck-section">
              <Deck 
                isShuffling={isShuffling}
                cardsRemaining={cardsRemaining}
                onShuffle={handleShuffle}
              />

              <button
                className="draw-button"
                onClick={handleDraw}
                disabled={isShuffling || !question.trim()}
              >
                ✨ Draw Card
              </button>
            </section>
          </>
        ) : (
          <>
            <section className="reading-section">
              <div className="question-display">
                <p className="question-label">Your Question:</p>
                <p className="question-text">"{question}"</p>
              </div>

              <div className="cards-display">
                {drawnCards.map((card, index) => (
                  <Card
                    key={card.id}
                    card={card}
                    isRevealed={isRevealed}
                    index={index}
                  />
                ))}
              </div>

              <button className="reset-button" onClick={handleReset}>
                🔄 New Reading
              </button>
            </section>
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