"""
Test script for Qwen/Dashscope LLM integration
Run this to verify your API key and LLM connection work
"""
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

def test_dashscope_connection():
    """Test basic Dashscope API connection"""
    print("=" * 60)
    print("Testing Dashscope/Qwen LLM Connection (OpenAI-compatible)")
    print("=" * 60)
    
    # Check API key
    api_key = os.getenv("DASHSCOPE_API_KEY")
    if not api_key:
        print("❌ ERROR: DASHSCOPE_API_KEY not found in .env file")
        print("\nPlease:")
        print("1. Copy .env.example to .env")
        print("2. Add your Dashscope API key")
        print("3. Get key from: https://dashscope.aliyun.com/")
        return False
    
    print(f"✅ API Key found: {api_key[:10]}...{api_key[-4:]}")
    
    # Initialize OpenAI client with Dashscope endpoint
    client = OpenAI(
        api_key=api_key,
        base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    )
    
    # Test simple prompt
    print("\n" + "-" * 60)
    print("Testing simple prompt...")
    print("-" * 60)
    
    try:
        completion = client.chat.completions.create(
            model="qwen-plus-latest",
            messages=[
                {"role": "user", "content": "Say 'Hello from Qwen!' and nothing else."}
            ],
            temperature=0.7,
            top_p=0.8,
        )
        
        response_text = completion.choices[0].message.content
        print("✅ LLM Response received!")
        print(f"\nResponse: {response_text}")
        return True
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return False


def test_tarot_reading():
    """Test a sample tarot reading prompt"""
    print("\n" + "=" * 60)
    print("Testing Tarot Reading Generation")
    print("=" * 60)
    
    api_key = os.getenv("DASHSCOPE_API_KEY")
    if not api_key:
        print("❌ Skipping - no API key")
        return False
    
    # Initialize OpenAI client
    client = OpenAI(
        api_key=api_key,
        base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    )
    
    # Sample tarot reading prompt
    sample_prompt = """You are a mystical tarot reader. Generate a brief tarot reading (2-3 sentences).

USER'S QUESTION:
"What should I focus on today?"

DRAWN CARD:
**The Fool** (upright)
Keywords: beginnings, innocence, spontaneity, free spirit
Meaning: New beginnings, innocence, spontaneity, and a free spirit. Taking a leap of faith and embarking on a new journey.

Generate a brief reading:"""
    
    print("\nPrompt:")
    print("-" * 60)
    print(sample_prompt)
    print("-" * 60)
    
    try:
        completion = client.chat.completions.create(
            model="qwen-plus-latest",
            messages=[
                {"role": "user", "content": sample_prompt}
            ],
            temperature=0.8,
            top_p=0.8,
            max_tokens=300,
        )
        
        reading = completion.choices[0].message.content
        print("\n✅ Tarot Reading Generated!")
        print("\nReading:")
        print("-" * 60)
        print(reading)
        print("-" * 60)
        return True
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return False


if __name__ == "__main__":
    print("\n🔮 Celestial Tarot - LLM Test Suite\n")
    
    # Test 1: Basic connection
    test1_passed = test_dashscope_connection()
    
    # Test 2: Tarot reading
    if test1_passed:
        test2_passed = test_tarot_reading()
    else:
        test2_passed = False
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    print(f"Basic Connection: {'✅ PASS' if test1_passed else '❌ FAIL'}")
    print(f"Tarot Reading:    {'✅ PASS' if test2_passed else '❌ FAIL'}")
    
    if test1_passed and test2_passed:
        print("\n🎉 All tests passed! Your LLM integration is working.")
        print("You can now run the FastAPI server with: python app.py")
    else:
        print("\n⚠️  Some tests failed. Please check your configuration.")
    
    print("=" * 60 + "\n")
