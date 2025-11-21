"""
Tarot Reading Prompt Templates
Builds prompts for LLM-based tarot readings
"""
from typing import List, Dict


# Zodiac sign metadata for personalized readings
ZODIAC_INFO = {
    "aries": {"element": "Fire", "traits": "bold, pioneering, passionate, direct", "dates": "Mar 21 - Apr 19"},
    "taurus": {"element": "Earth", "traits": "grounded, patient, sensual, determined", "dates": "Apr 20 - May 20"},
    "gemini": {"element": "Air", "traits": "curious, adaptable, communicative, versatile", "dates": "May 21 - Jun 20"},
    "cancer": {"element": "Water", "traits": "nurturing, intuitive, emotional, protective", "dates": "Jun 21 - Jul 22"},
    "leo": {"element": "Fire", "traits": "confident, creative, generous, charismatic", "dates": "Jul 23 - Aug 22"},
    "virgo": {"element": "Earth", "traits": "analytical, practical, detail-oriented, helpful", "dates": "Aug 23 - Sep 22"},
    "libra": {"element": "Air", "traits": "diplomatic, harmonious, social, balanced", "dates": "Sep 23 - Oct 22"},
    "scorpio": {"element": "Water", "traits": "intense, transformative, passionate, perceptive", "dates": "Oct 23 - Nov 21"},
    "sagittarius": {"element": "Fire", "traits": "adventurous, philosophical, optimistic, free-spirited", "dates": "Nov 22 - Dec 21"},
    "capricorn": {"element": "Earth", "traits": "ambitious, disciplined, responsible, pragmatic", "dates": "Dec 22 - Jan 19"},
    "aquarius": {"element": "Air", "traits": "innovative, independent, humanitarian, unconventional", "dates": "Jan 20 - Feb 18"},
    "pisces": {"element": "Water", "traits": "empathetic, imaginative, spiritual, compassionate", "dates": "Feb 19 - Mar 20"},
}


SYSTEM_PROMPT = """You are a mystical tarot reader with deep knowledge of the Rider-Waite tradition and astrological wisdom.

Your role is to synthesize tarot card meanings into insightful, personalized readings that:
- Directly address the user's specific question
- Weave all drawn cards into a unified narrative
- Interpret card positions (Past/Present/Future or similar)
- When provided, consider the user's zodiac sign and how its elemental and personality traits relate to the cards
- Use a mystical yet accessible tone
- Provide actionable insight without being preachy
- Feel authentic and meaningful, not generic

Keep readings between 50-100. Be specific to their question."""


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


def build_reading_prompt(question: str, card_contexts: List[Dict], zodiac_sign: str | None = None) -> str:
    """
    Build the complete prompt for tarot reading generation

    Args:
        question: User's question
        card_contexts: List of dicts with card data (name, orientation, keywords, meaning)
        zodiac_sign: Optional zodiac sign for personalized reading

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

    # Build zodiac context if provided
    zodiac_context = ""
    if zodiac_sign and zodiac_sign.lower() in ZODIAC_INFO:
        sign_data = ZODIAC_INFO[zodiac_sign.lower()]
        zodiac_context = f"""
QUERENT'S ZODIAC SIGN:
{zodiac_sign.capitalize()} ({sign_data['element']} sign)
Traits: {sign_data['traits']}

Consider how the {sign_data['element']} element and {zodiac_sign.capitalize()} traits relate to the cards drawn. Weave this astrological insight naturally into your reading.
"""

    # Build complete prompt
    prompt = f"""{SYSTEM_PROMPT}

USER'S QUESTION:
"{question}"
{zodiac_context}
DRAWN CARDS:

{cards_text}

Generate a cohesive tarot reading that synthesizes these cards to answer the user's question. Weave the cards together into a meaningful narrative."""

    return prompt
