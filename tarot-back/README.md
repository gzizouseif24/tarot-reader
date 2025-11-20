# Celestial Tarot Backend

FastAPI backend for AI-powered tarot readings using Qwen via Dashscope.

## Setup

1. **Install Python dependencies:**
```bash
cd tarot-back
pip install -r requirements.txt
```

2. **Configure environment:**
```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your Dashscope API key
# Get your key from: https://dashscope.aliyun.com/
```

3. **Run the server:**
```bash
python app.py
```

Server will start at `http://localhost:8000`

## API Endpoints

### `POST /api/reading`

Generate a tarot reading.

**Request:**
```json
{
  "question": "What should I focus on this week?",
  "cards": [
    {
      "card_name": "The Fool",
      "orientation": "upright",
      "keywords": ["beginnings", "innocence", "spontaneity"],
      "meaning": "New beginnings, innocence, spontaneity..."
    },
    {
      "card_name": "Three of Cups",
      "orientation": "reversed",
      "keywords": ["celebration", "friendship", "creativity"],
      "meaning": "Overindulgence, gossip, isolation..."
    },
    {
      "card_name": "The Tower",
      "orientation": "upright",
      "keywords": ["sudden change", "upheaval", "chaos"],
      "meaning": "Sudden change, upheaval, chaos..."
    }
  ]
}
```

**Response:**
```json
{
  "reading": "The cards speak of new beginnings tempered by..."
}
```

### `GET /health`

Health check endpoint.

## Architecture

- **FastAPI**: Modern Python web framework
- **Qwen (Dashscope)**: LLM for generating readings
- **Single LLM call**: MVP uses one API call per reading
- **No database**: Card meanings come from frontend

## Development

```bash
# Run with auto-reload
uvicorn app:app --reload --port 8000
```

## Environment Variables

- `DASHSCOPE_API_KEY`: Your Dashscope API key (required)
