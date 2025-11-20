"""
Tarot Reading Prompt Templates
Builds prompts for LLM-based tarot readings
"""
from typing import List, Dict


SYSTEM_PROMPT = """You are a mystical tarot reader with deep knowledge of the Rider-Waite tradition. 

Your role is to synthesize tarot card meanings into insightful, personalized readings that:
- Directly address the user's specific question
- Weave all drawn cards into a unified narrative
- Interpret card positions (Past/Present/Future or similar)
- Use a mystical yet accessible tone
- Provide actionable insight without being preachy
- Feel authentic and meaningful, not generic

Keep readings between 150-250 words. Be specific to their question."""


POSITION_LABELS = {
    1: {
        "single": "Your Answer"
    },
    3: {
        "past": "Past/Foundation",
        "present": "Present/Challenge", 
        "future": "Future/Advice"
    }
}


def build_reading_prompt(question: str, card_contexts: List[Dict]) -> str:
    """
    Build the complete prompt for tarot reading generation
    
    Args:
        question: User's question
        card_contexts: List of dicts with card data (name, orientation, keywords, meaning)
    
    Returns:
        Complete prompt string for LLM
    """
    num_cards = len(card_contexts)
    
    # Build card descriptions
    card_descriptions = []
    
    if num_cards == 1:
        card = card_contexts[0]
        card_descriptions.append(
            f"**{card['name']}** ({card['orientation']})\n"
            f"Keywords: {', '.join(card['keywords'])}\n"
            f"Meaning: {card['meaning']}"
        )
    else:
        positions = ["Past/Foundation", "Present/Challenge", "Future/Advice"]
        for i, card in enumerate(card_contexts):
            position = positions[i] if i < len(positions) else f"Card {i+1}"
            card_descriptions.append(
                f"**Position {i+1}: {position}**\n"
                f"Card: {card['name']} ({card['orientation']})\n"
                f"Keywords: {', '.join(card['keywords'])}\n"
                f"Meaning: {card['meaning']}"
            )
    
    cards_text = "\n\n".join(card_descriptions)
    
    # Build complete prompt
    prompt = f"""{SYSTEM_PROMPT}

USER'S QUESTION:
"{question}"

DRAWN CARDS:

{cards_text}

Generate a cohesive tarot reading that synthesizes these cards to answer the user's question. Weave the cards together into a meaningful narrative."""
    
    return prompt
