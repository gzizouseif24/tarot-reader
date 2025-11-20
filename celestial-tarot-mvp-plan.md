# 🌙 Celestial Tarot MVP - Build Plan

## Overview
**Goal**: Enhance the existing React + Vite app with a professional Python FastAPI backend with AI-powered readings.

**Stack**:
- Backend: Python FastAPI + Qwen (single LLM call)
- Frontend: React 18 + TypeScript + Vite (already built)
- LLM: Qwen via Dashscope API → Claude API (post-MVP)
- Integration: REST API (localhost:8000 ↔ localhost:5173)

---

## MVP Architecture (One-Shot Reading)

```
User Question + 3 Drawn Cards
              ↓
      [FastAPI Endpoint]
              ↓
      [Single LLM Call] ──→ Qwen reads cards + generates reading
              ↓
        Final Reading
```

### What's in MVP
- Single API call, single LLM response
- Card meanings embedded in prompt (no RAG needed)
- 3-card spread only
- One reading, no follow-up conversation

### What's Post-MVP (Paid Feature)
- Multi-turn conversation after initial reading
- RAG with your Nebula conversation guides
- LangGraph multi-agent system
- ChromaDB for context retrieval

---

## How It Works

1. User enters their question
2. User draws 3 cards (with orientations)
3. Frontend sends question + cards to backend
4. Backend builds prompt with card meanings + user question
5. Qwen generates a synthesized reading
6. Response sent back to frontend

---

## Backend Structure

**Current Location**: `tarot-back/`

```
tarot-back/
├── app.py                    # FastAPI entry point + /api/reading endpoint
├── requirements.txt          # fastapi, uvicorn, dashscope, pydantic
├── .env                      # DASHSCOPE_API_KEY
│
├── services/
│   └── llm_service.py        # Qwen via Dashscope
│
├── prompts/
│   └── reading_prompt.py     # System prompt for tarot reading
│
└── data/
    └── card_meanings.py      # All 78 card meanings (dict lookup)
```

---

## API Endpoint

### POST `/api/reading`

**Request**:
```json
{
  "question": "What should I focus on this week?",
  "cards": [
    {"card_name": "The Fool", "orientation": "upright"},
    {"card_name": "Three of Cups", "orientation": "reversed"},
    {"card_name": "The Tower", "orientation": "upright"}
  ]
}
```

**Response**:
```json
{
  "reading": "The cards speak of new beginnings tempered by..."
}
```

### Backend Logic (app.py)

```python
@app.post("/api/reading")
async def generate_reading(request: ReadingRequest):
    # 1. Look up card meanings from dict
    card_contexts = []
    for card in request.cards:
        meaning = CARD_MEANINGS[card.card_name]
        orientation_meaning = meaning["upright"] if card.orientation == "upright" else meaning["reversed"]
        card_contexts.append(f"{card.card_name} ({card.orientation}): {orientation_meaning}")
    
    # 2. Build prompt
    prompt = build_reading_prompt(request.question, card_contexts)
    
    # 3. Call Qwen
    reading = await call_qwen(prompt)
    
    return {"reading": reading}
```

---

## Frontend Structure (React + Vite)

**Current Location**: `src/`

```
src/
├── App.tsx                      # Main app component
├── main.tsx                     # Entry point
├── App.css                      # Global styles
├── index.css                    # Base styles
│
├── components/
│   ├── Card/                    # ✅ Already exists - Card component
│   ├── Deck/                    # ✅ Already exists - Animated deck (shuffle, draw)
│   ├── ReadingTypeSelector/     # ✅ Already exists - Reading type selector
│   ├── ReadingDisplay/          # TO BUILD - AI reading with typewriter effect
│   └── LoadingStates/           # TO BUILD - Progress messages
│
├── hooks/
│   └── useTarotApi.ts           # TO BUILD - API calls to backend
│
├── data/
│   ├── majorArcana.ts           # ✅ Already exists - Major Arcana card data
│   └── minorArcana.ts           # ✅ Already exists - Minor Arcana card data
│
├── assets/
│   └── tarot-cards/             # ✅ Card images already here
│
└── utils/                       # Any utility functions
```

---

## API Hook (React)

```typescript
// hooks/useTarotApi.ts
import { useState } from 'react';

interface Card {
  name: string;
  orientation: 'upright' | 'reversed';
}

interface ReadingResponse {
  reading: string;
}

export const useTarotReading = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReading = async (question: string, cards: Card[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          cards: cards.map(c => ({
            card_name: c.name,
            orientation: c.orientation
          }))
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate reading');
      }
      
      const data: ReadingResponse = await response.json();
      return { reading: data.reading, error: null };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return { reading: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };
  
  return { generateReading, loading, error };
};
```

---

## Loading States (Timed, No WebSocket)

Instead of real-time agent updates, cycle through messages on timers:

```typescript
const loadingMessages = [
  "Shuffling the cosmic deck...",
  "Retrieving ancient wisdom...",
  "Reading the cards...",
  "Channeling your message..."
]

// Cycle every 2 seconds while waiting for response
```

---

## Data: Card Meanings

Convert your TypeScript card data to a Python dict for quick lookup:

```python
# data/card_meanings.py
CARD_MEANINGS = {
    "The Fool": {
        "keywords": ["beginnings", "innocence", "spontaneity", "free spirit"],
        "upright": "New beginnings, innocence, spontaneity, and a free spirit. Taking a leap of faith and embarking on a new journey without knowing the outcome.",
        "reversed": "Recklessness, foolishness, poor judgment, and taking unnecessary risks without proper planning."
    },
    "The Magician": {
        "keywords": ["manifestation", "power", "skill", "concentration"],
        "upright": "Manifestation, resourcefulness, power, and inspired action. You have all the tools you need to manifest your desires.",
        "reversed": "Manipulation, poor planning, untapped talents, and lack of focus."
    },
    # ... all 78 cards
}
```

You can script the conversion from your `majorArcana.ts` and `minorArcana.ts` files.

---

## Build Phases

### Phase 1: Backend MVP
- [ ] Initialize FastAPI project
- [ ] Convert TS card data to Python dict
- [ ] Create LLM service (Qwen/Dashscope)
- [ ] Write reading prompt
- [ ] Implement `/api/reading` endpoint
- [ ] Test with curl/Postman

### Phase 2: React Frontend Integration
- [✅] React + Vite setup complete
- [✅] Card data exists (majorArcana.ts, minorArcana.ts)
- [✅] Card, Deck, ReadingTypeSelector components exist
- [ ] Build ReadingDisplay component with typewriter effect
- [ ] Build LoadingStates component
- [ ] Create useTarotApi hook (hooks/useTarotApi.ts)
- [ ] Integrate API calls into App.tsx
- [ ] Add question input to UI
- [ ] Polish responsive design

### Phase 3: Integration & Polish
- [ ] Connect frontend to backend
- [ ] End-to-end testing
- [ ] Tune prompt for better readings
- [ ] Mobile responsive tweaks
- [ ] Swap Qwen → Claude API
- [ ] Deploy

---

## Key Files to Create First

### Backend (tarot-back/)
1. `requirements.txt`
2. `.env` (with DASHSCOPE_API_KEY)
3. `app.py` (FastAPI + endpoint)
4. `data/card_meanings.py` (converted from TypeScript)
5. `services/llm_service.py`
6. `prompts/reading_prompt.py`

### Frontend (src/)
1. `hooks/useTarotApi.ts` (API integration hook)
2. `components/ReadingDisplay/` (AI reading output)
3. `components/LoadingStates/` (loading messages)
4. Update `App.tsx` to integrate backend calls

---

## Environment Variables

### Backend `.env`
```
DASHSCOPE_API_KEY=your_key_here
```

### Frontend `.env` (Vite - optional)
```
VITE_API_BASE_URL=http://localhost:8000
```

> **Note**: Vite requires `VITE_` prefix for env variables

---

## Reading Prompt (Draft)

```python
# prompts/reading_prompt.py

SYSTEM_PROMPT = """You are a mystical tarot reader with deep knowledge of the Rider-Waite tradition. 

Given a user's question and 3 drawn cards with their meanings, synthesize a cohesive, insightful reading that:
- Addresses the user's specific question
- Weaves all 3 cards into a unified narrative
- Interprets the cards' positions (past/present/future or situation/challenge/advice)
- Uses a mystical but accessible tone
- Provides actionable insight without being preachy

Keep the reading between 150-250 words. Be specific to their question, not generic."""

def build_reading_prompt(question: str, card_contexts: list[str]) -> str:
    cards_text = "\n\n".join(card_contexts)
    
    return f"""{SYSTEM_PROMPT}

USER'S QUESTION:
{question}

DRAWN CARDS:

Card 1 (Past/Situation):
{card_contexts[0]}

Card 2 (Present/Challenge):
{card_contexts[1]}

Card 3 (Future/Advice):
{card_contexts[2]}

Generate a reading that synthesizes these three cards to answer the user's question."""
```

---

## Timeline

**Phase 1 (Backend)**: 1-2 sessions (create FastAPI backend from scratch)
**Phase 2 (Frontend Integration)**: 1 session (React already built, just integrate API)  
**Phase 3 (Polish)**: 1 session (tune prompts, loading states, responsive)

**Total**: ~3-4 sessions → Local MVP ready (Frontend head start!)

---

## Post-MVP Roadmap

### Paid Feature: Conversation Mode
- [ ] LangGraph multi-agent system
- [ ] RAG with Nebula conversation guides (ChromaDB)
- [ ] Multi-turn conversation after initial reading
- [ ] Session/context management
- [ ] Agents: RAG, Synthesis, Refinement, Supervisor

### Other Enhancements
- [ ] Multiple spread types (Celtic Cross, etc.)
- [ ] Claude API integration
- [ ] Mobile app (Capacitor or React Native)
- [ ] Reading history/saved readings
- [ ] User accounts & payments
- [ ] Deploy to production

---

## Notes

- Card images are already in the React app (`/assets/tarot-cards/`)
- MVP is a single LLM call - no agents, no RAG, no ChromaDB
- Conversation feature (paid) will use your Nebula markdown guides with RAG
- Start with 3-card spread only
- Prompt tuning is key - iterate on it based on output quality
- Timeline: Backend ~1 session, Frontend ~2-3 sessions
