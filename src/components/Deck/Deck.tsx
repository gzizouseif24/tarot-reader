// src/components/Deck/Deck.tsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { Shuffle } from 'lucide-react';
import type { TarotCard } from '../../data/types';
import './Deck.css';

interface DeckProps {
  isShuffling: boolean;
  cardsRemaining: number;
  onShuffle: () => void;
  deck: TarotCard[];
  onShuffleComplete: (newOrder: TarotCard[]) => void;
}

export function Deck({ isShuffling, cardsRemaining, onShuffle, deck, onShuffleComplete }: DeckProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayCards, setDisplayCards] = useState<TarotCard[]>([]);
  const cardElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const isAnimatingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  // Number of cards to show in visual stack
  const DISPLAY_COUNT = 8;

  // Initialize display cards ONCE
  useEffect(() => {
    if (deck.length > 0 && displayCards.length === 0) {
      setDisplayCards(deck.slice(0, DISPLAY_COUNT));
    }
  }, [deck.length, displayCards.length, DISPLAY_COUNT]);

  // Easing function (quartOut - smooth deceleration)
  const ease = (t: number): number => 1 - Math.pow(1 - t, 4);

  // Animate a single card element
  const animateCard = (
    element: HTMLElement,
    to: { x: number; y: number; rotate: number },
    duration: number,
    delay: number
  ): Promise<void> => {
    return new Promise((resolve) => {
      // Get current values from data attributes (more reliable)
      const currentX = parseFloat(element.dataset.x || '0');
      const currentY = parseFloat(element.dataset.y || '0');
      const currentRotate = parseFloat(element.dataset.rotate || '0');

      const startTime = performance.now() + delay;

      const animate = (now: number) => {
        if (now < startTime) {
          requestAnimationFrame(animate);
          return;
        }

        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = ease(progress);

        const x = currentX + (to.x - currentX) * easedProgress;
        const y = currentY + (to.y - currentY) * easedProgress;
        const rotate = currentRotate + (to.rotate - currentRotate) * easedProgress;

        element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg)`;

        // Store current values
        element.dataset.x = String(x);
        element.dataset.y = String(y);
        element.dataset.rotate = String(rotate);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  };

  // Get stack position for a card at given index (FIXED: no random rotation)
  const getStackPosition = (index: number) => ({
    x: 0,
    y: -index * 1.2,
    rotate: -index * 0.3, // Consistent rotation based on index only
  });


  // Main shuffle animation - TWO ITERATIONS
  const performShuffle = useCallback(async () => {
    if (isAnimatingRef.current || displayCards.length === 0) return;
    isAnimatingRef.current = true;

    let currentCards = displayCards.map(card => ({
      card,
      element: cardElementsRef.current.get(card.id),
    })).filter(c => c.element) as Array<{ card: TarotCard; element: HTMLDivElement }>;

    if (currentCards.length === 0) {
      isAnimatingRef.current = false;
      return;
    }

    const SHUFFLE_ITERATIONS = 2;

    // Run shuffle animation twice
    for (let iteration = 0; iteration < SHUFFLE_ITERATIONS; iteration++) {
      // PHASE 1: Assign cards randomly to left/right piles
      const leftPile: typeof currentCards = [];
      const rightPile: typeof currentCards = [];

      currentCards.forEach(item => {
        if (Math.random() < 0.5) {
          leftPile.push(item);
        } else {
          rightPile.push(item);
        }
      });

      // Animate to split positions
      const splitPromises: Promise<void>[] = [];

      leftPile.forEach((item, pileIndex) => {
        if (!item.element) return;
        item.element.style.zIndex = String(100 + pileIndex);
        splitPromises.push(
          animateCard(
            item.element,
            {
              x: -70 + Math.random() * 10,
              y: -pileIndex * 1.5,
              rotate: -8 + Math.random() * 3
            },
            350,
            pileIndex * 25
          )
        );
      });

      rightPile.forEach((item, pileIndex) => {
        if (!item.element) return;
        item.element.style.zIndex = String(50 + pileIndex);
        splitPromises.push(
          animateCard(
            item.element,
            {
              x: 70 + Math.random() * 10,
              y: -pileIndex * 1.5,
              rotate: 8 + Math.random() * 3
            },
            350,
            pileIndex * 25
          )
        );
      });

      await Promise.all(splitPromises);

      // Small pause at split
      await new Promise(r => setTimeout(r, 150));

      // PHASE 2: Interleave cards back together (this creates the new order)
      const newOrder: typeof currentCards = [];

      while (leftPile.length > 0 || rightPile.length > 0) {
        // Randomly pick from left or right (like a real riffle)
        // But favor the pile with more cards for natural distribution
        const leftChance = leftPile.length / (leftPile.length + rightPile.length);

        if (Math.random() < leftChance && leftPile.length > 0) {
          newOrder.push(leftPile.shift()!);
        } else if (rightPile.length > 0) {
          newOrder.push(rightPile.shift()!);
        } else {
          newOrder.push(leftPile.shift()!);
        }
      }

      // PHASE 3: Animate to final stack positions in NEW order
      const stackPromises: Promise<void>[] = [];

      newOrder.forEach((item, newIndex) => {
        if (!item.element) return;

        const finalPos = getStackPosition(newIndex);
        item.element.style.zIndex = String(currentCards.length - newIndex);

        stackPromises.push(
          animateCard(
            item.element,
            finalPos,
            400,
            newIndex * 30
          )
        );
      });

      await Promise.all(stackPromises);

      // Update currentCards for next iteration
      currentCards = newOrder;

      // Brief pause between iterations (but not after the last one)
      if (iteration < SHUFFLE_ITERATIONS - 1) {
        await new Promise(r => setTimeout(r, 100));
      }
    }

    // PHASE 4: Update React state to match new visual order (AFTER both iterations)
    // This is KEY - we update state AFTER animation, and the positions already match
    const newDisplayCards = currentCards.map(item => item.card);

    // Notify parent with full shuffled deck
    // Combine the reordered display cards with the rest of the deck
    const restOfDeck = deck.slice(DISPLAY_COUNT);
    const shuffledRest = [...restOfDeck].sort(() => Math.random() - 0.5);
    const fullNewOrder = [...newDisplayCards, ...shuffledRest];

    onShuffleComplete(fullNewOrder);

    // Update display cards AFTER notifying parent
    setDisplayCards(newDisplayCards);

    isAnimatingRef.current = false;
  }, [displayCards, deck, onShuffleComplete, DISPLAY_COUNT]);

  // Trigger shuffle when isShuffling becomes true (FIXED: removed performShuffle from deps)
  useEffect(() => {
    if (isShuffling && !isAnimatingRef.current) {
      performShuffle();
    }
  }, [isShuffling]); // eslint-disable-line react-hooks/exhaustive-deps

  // Set initial positions ONLY ONCE when cards first render (FIXED: proper initialization)
  useEffect(() => {
    if (hasInitializedRef.current) return; // Only run once

    if (displayCards.length > 0) {
      // Initialize all cards
      displayCards.forEach((card, index) => {
        const element = cardElementsRef.current.get(card.id);
        if (element) {
          const pos = getStackPosition(index);
          element.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${pos.rotate}deg)`;
          element.style.zIndex = String(displayCards.length - index);
          element.dataset.x = String(pos.x);
          element.dataset.y = String(pos.y);
          element.dataset.rotate = String(pos.rotate);
        }
      });

      hasInitializedRef.current = true;
    }
  }, [displayCards.length]); // Only depend on length, not the array itself

  return (
    <div className={`deck-container ${isShuffling ? 'shuffle-active' : ''}`}>
      <div
        ref={containerRef}
        className="deck-stack"
        onClick={!isShuffling ? onShuffle : undefined}
        style={{ cursor: isShuffling ? 'default' : 'pointer' }}
      >
        {displayCards.map((card) => (
          <div
            key={card.id}
            ref={el => {
              if (el) cardElementsRef.current.set(card.id, el);
              else cardElementsRef.current.delete(card.id);
            }}
            className="deck-card"
          >
            <img
              src={card.image}
              alt={card.cardName}
              className="deck-card-image"
              draggable={false}
            />
          </div>
        ))}
      </div>

      <div className="deck-info">
        <p className="cards-remaining">
          {isShuffling ? (
            <>
              <Shuffle size={14} className="shuffle-icon spinning" />
              Shuffling...
            </>
          ) : (
            `${cardsRemaining} cards • Click to shuffle`
          )}
        </p>
      </div>
    </div>
  );
}
