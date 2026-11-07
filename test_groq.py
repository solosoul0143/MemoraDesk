
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

try:
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": "Introduce yourself as the AI assistant of MemoraDesk in two sentences."
            }
        ],
        temperature=0.7,
        max_completion_tokens=300
    )

    print("\nMemoraDesk AI Response:")
    print(response.choices[0].message.content)

except Exception as e:
    print("Groq API Error:", e)
