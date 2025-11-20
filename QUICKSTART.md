# 🔮 Celestial Tarot - Quick Start Guide

## Running the Full Stack

### 1. Backend Setup (Python FastAPI)

```bash
# Navigate to backend
cd tarot-back

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your Dashscope API key
# DASHSCOPE_API_KEY=sk-your-key-here

# Test the LLM (optional)
python test_llm.py

# Start the backend server
python app.py
```

Backend will run at: `http://localhost:8000`

### 2. Frontend Setup (React + Vite)

Open a new terminal:

```bash
# Install dependencies (if not already done)
npm install

# Start the dev server
npm run dev
```

Frontend will run at: `http://localhost:5173`

### 3. Use the App

1. Open `http://localhost:5173` in your browser
2. Enter your question (e.g., "What should I focus on in my relationship?")
3. Choose reading type (One Card or Three Cards)
4. Click "Reveal Destiny"
5. Watch the cards reveal
6. Wait for AI-generated reading to appear with typewriter effect

## Architecture

```
User enters question → Draws cards → Frontend sends to Backend
                                            ↓
                                    Backend → Qwen LLM
                                            ↓
                                    AI Reading Generated
                                            ↓
                                    Frontend displays with typewriter effect
```

## API Endpoint

**POST** `http://localhost:8000/api/reading`

**Request:**
```json
{
  "question": "Will I find love?",
  "cards": [
    {
      "card_name": "The Lovers",
      "orientation": "upright",
      "keywords": ["love", "harmony", "relationships"],
      "meaning": "Love, harmony, relationships..."
    }
  ]
}
```

**Response:**
```json
{
  "reading": "The Lovers card speaks of deep connection..."
}
```

## Troubleshooting

**Backend not connecting?**
- Make sure backend is running on port 8000
- Check `.env` file has valid `DASHSCOPE_API_KEY`
- Run `python test_llm.py` to verify LLM works

**CORS errors?**
- Backend CORS is configured for `http://localhost:5173`
- Make sure frontend is running on that port

**Cards not loading?**
- Check that card images exist in `public/assets/tarot-cards/`
- Open browser console for errors

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Framer Motion
- **Backend**: Python FastAPI + OpenAI client
- **LLM**: Qwen Plus (via Dashscope OpenAI-compatible API)
- **Styling**: Tailwind CSS + Custom CSS
