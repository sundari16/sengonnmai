"""
Budget data extraction script.
Reads PDF/text budget documents and extracts structured data using an AI provider.

Usage:
    python etl/extract_budget.py <input_file>

Provider is selected via AI_PROVIDER env var ('anthropic' | 'groq' | 'ollama').
Results are appended to etl/extraction_log.csv.
"""

import csv
import os
import sys
import json
import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env.local")

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

AI_PROVIDER = os.environ.get("AI_PROVIDER", "anthropic").lower()

MODELS = {
    "anthropic": "claude-sonnet-4-6",
    "groq": "llama-3.1-70b-versatile",
    "ollama": "llama3.1",
}

LOG_PATH = Path(__file__).parent / "extraction_log.csv"
LOG_FIELDS = ["timestamp", "provider", "model", "input_file", "tokens_used", "status", "error"]

# ---------------------------------------------------------------------------
# Prompt — identical across all providers
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = (
    "You are a government budget analyst. Extract structured data from Tamil Nadu "
    "budget documents. Return only valid JSON — no commentary, no markdown fences."
)

def build_user_prompt(text: str) -> str:
    return f"""Extract all budget line items from the following Tamil Nadu government budget text.

Return a JSON object with this exact schema:
{{
  "year": "string — e.g. '2024-25'",
  "department": "string",
  "items": [
    {{
      "head": "string — budget head code or name",
      "description": "string",
      "budget_cr": number,
      "revised_cr": number | null,
      "actual_cr": number | null
    }}
  ]
}}

Budget text:
---
{text}
---"""

# ---------------------------------------------------------------------------
# Provider implementations
# ---------------------------------------------------------------------------

def call_anthropic(prompt: str) -> tuple[str, int]:
    import anthropic
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise EnvironmentError("ANTHROPIC_API_KEY is not set")
    client = anthropic.Anthropic(api_key=api_key)
    model = MODELS["anthropic"]
    message = client.messages.create(
        model=model,
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )
    content = message.content[0].text
    tokens = message.usage.input_tokens + message.usage.output_tokens
    return content, tokens


def call_groq(prompt: str) -> tuple[str, int]:
    from groq import Groq
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        raise EnvironmentError("GROQ_API_KEY is not set")
    client = Groq(api_key=api_key)
    model = MODELS["groq"]
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        max_tokens=4096,
        temperature=0,
    )
    content = response.choices[0].message.content
    usage = response.usage
    tokens = (usage.prompt_tokens or 0) + (usage.completion_tokens or 0)
    return content, tokens


def call_ollama(prompt: str) -> tuple[str, int]:
    import ollama
    model = MODELS["ollama"]
    response = ollama.chat(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        options={"temperature": 0},
    )
    content = response["message"]["content"]
    # ollama doesn't always report token counts; fall back to 0
    tokens = response.get("eval_count", 0) + response.get("prompt_eval_count", 0)
    return content, tokens


PROVIDER_FNS = {
    "anthropic": call_anthropic,
    "groq": call_groq,
    "ollama": call_ollama,
}

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

def append_log(row: dict) -> None:
    write_header = not LOG_PATH.exists()
    with open(LOG_PATH, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=LOG_FIELDS)
        if write_header:
            writer.writeheader()
        writer.writerow(row)

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def extract(input_path: str) -> dict:
    if AI_PROVIDER not in PROVIDER_FNS:
        raise ValueError(f"Unknown AI_PROVIDER '{AI_PROVIDER}'. Choose: {', '.join(PROVIDER_FNS)}")

    text = Path(input_path).read_text(encoding="utf-8")
    prompt = build_user_prompt(text)

    print(f"Provider : {AI_PROVIDER}")
    print(f"Model    : {MODELS[AI_PROVIDER]}")
    print(f"Input    : {input_path}")

    log_row: dict = {
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "provider": AI_PROVIDER,
        "model": MODELS[AI_PROVIDER],
        "input_file": input_path,
        "tokens_used": 0,
        "status": "error",
        "error": "",
    }

    try:
        raw, tokens = PROVIDER_FNS[AI_PROVIDER](prompt)
        log_row["tokens_used"] = tokens
        result = json.loads(raw)
        log_row["status"] = "ok"
        print(f"Tokens   : {tokens}")
        print(f"Items    : {len(result.get('items', []))}")
        return result
    except json.JSONDecodeError as e:
        log_row["error"] = f"JSON parse error: {e}"
        raise
    except Exception as e:
        log_row["error"] = str(e)
        raise
    finally:
        append_log(log_row)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python etl/extract_budget.py <input_file>")
        sys.exit(1)

    data = extract(sys.argv[1])
    out_path = Path(sys.argv[1]).with_suffix(".json")
    out_path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Saved    : {out_path}")
