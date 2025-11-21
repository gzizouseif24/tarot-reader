"""
LLM Service - Qwen via Dashscope OpenAI-compatible API
Handles AI-powered tarot reading generation
"""
import os
from typing import List, Dict
from openai import OpenAI
from prompts.reading_prompt import build_reading_prompt
import asyncio
from functools import partial


def _get_client():
    """Get or create OpenAI client"""
    api_key = os.getenv("DASHSCOPE_API_KEY")
    if not api_key:
        raise ValueError("DASHSCOPE_API_KEY not configured")
    
    return OpenAI(
        api_key=api_key,
        base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    )


def _generate_reading_sync(question: str, card_contexts: List[Dict], zodiac_sign: str | None = None) -> str:
    """Synchronous reading generation"""
    client = _get_client()

    # Build the prompt with optional zodiac sign
    prompt = build_reading_prompt(question, card_contexts, zodiac_sign)
    
    # Call Qwen via OpenAI-compatible API
    completion = client.chat.completions.create(
        model="qwen3-max",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        top_p=0.8,
        max_tokens=500,
    )
    
    reading = completion.choices[0].message.content.strip()
    return reading


async def generate_reading(question: str, card_contexts: List[Dict], zodiac_sign: str | None = None) -> str:
    """
    Generate a tarot reading using Qwen LLM via OpenAI-compatible API

    Args:
        question: User's question or intention
        card_contexts: List of card data with name, orientation, keywords, meaning
        zodiac_sign: Optional zodiac sign for personalized reading

    Returns:
        AI-generated reading text
    """
    try:
        # Run synchronous OpenAI call in thread pool to avoid blocking
        loop = asyncio.get_event_loop()
        reading = await loop.run_in_executor(
            None,
            partial(_generate_reading_sync, question, card_contexts, zodiac_sign)
        )
        return reading

    except Exception as e:
        raise Exception(f"LLM generation failed: {str(e)}")
