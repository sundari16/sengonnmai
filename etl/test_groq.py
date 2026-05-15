from groq import Groq
import os
from pathlib import Path
from dotenv import load_dotenv
load_dotenv(dotenv_path=Path(__file__).parent.parent / '.env.local')

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user",
      "content": "Reply with exactly: GROQ_WORKING"}],
    max_tokens=10
)

print(response.choices[0].message.content)
