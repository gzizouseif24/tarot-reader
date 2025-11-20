"""
Celestial Tarot Backend - FastAPI Application
MVP: Single LLM call for tarot readings
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
import os
from dotenv import load_dotenv

from services.llm_service import generate_reading

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Celestial Tarot API",
    description="AI-powered tarot readings using Qwen",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request/Response Models
class CardInput(BaseModel):
    card_name: str = Field(..., description="Name of the tarot card")
    orientation: str = Field(..., description="Card orientation: upright or reversed")
    keywords: List[str] = Field(..., description="Card keywords")
    meaning: str = Field(..., description="Card meaning based on orientation")


class ReadingRequest(BaseModel):
    question: str = Field(..., description="User's question or intention")
    cards: List[CardInput] = Field(..., min_length=1, max_length=3, description="Drawn cards (1-3)")


class ReadingResponse(BaseModel):
    reading: str = Field(..., description="AI-generated tarot reading")


# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "Celestial Tarot API",
        "status": "online",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    api_key = os.getenv("DASHSCOPE_API_KEY")
    return {
        "status": "healthy",
        "api_key_configured": bool(api_key)
    }


@app.post("/api/reading", response_model=ReadingResponse)
async def create_reading(request: ReadingRequest):
    """
    Generate an AI-powered tarot reading
    
    Takes a user's question and 1-3 drawn cards with their meanings, returns a synthesized reading
    """
    try:
        # Build card contexts from frontend data
        card_contexts = []
        for card in request.cards:
            card_contexts.append({
                "name": card.card_name,
                "orientation": card.orientation,
                "keywords": card.keywords,
                "meaning": card.meaning
            })
        
        # Generate reading using LLM
        reading_text = await generate_reading(request.question, card_contexts)
        
        return ReadingResponse(reading=reading_text)
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating reading: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
