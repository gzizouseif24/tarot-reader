// src/App.tsx
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
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
        <h1 className="app-title">Celestial Tarot</h1>
        <p className="app-subtitle">Seek Guidance from the Void</p>
      </header>

      <main className="app-main">
        {drawnCards.length === 0 ? (
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

            <Deck 
              isShuffling={isShuffling}
              cardsRemaining={cardsRemaining}
              onShuffle={handleShuffle}
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
          <div className="result-view">
            {drawnCards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                isRevealed={isRevealed}
                index={index}
                onReset={handleReset}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Rider-Waite Tarot • {cardsRemaining} cards in deck</p>
      </footer>
    </div>
  );
}

export default App;