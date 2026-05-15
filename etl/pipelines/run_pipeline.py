import argparse, requests, json, os, sys, tempfile
from datetime import datetime
from groq import Groq
from supabase import create_client

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
SUPABASE_URL = (os.environ.get("SUPABASE_URL") or
  os.environ.get("NEXT_PUBLIC_SUPABASE_URL"))
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
GROQ_MODEL = "llama-3.3-70b-versatile"

HEADERS = {"User-Agent":
  "Sengonnmai-ETL/1.0 (Tamil Nadu Public Accounts)"}

SOURCES = {
  "budget": [
    {"name": "TN Budget Highlights 2024-25",
     "url": "https://tnbudget.tn.gov.in/tnweb_files/"
            "budget%20highlights/"
            "HIGHLIGHTS%20ENG%202024_25.pdf",
     "type": "pdf"},
    {"name": "TN Budget Speech 2024-25",
     "url": "https://tnbudget.tn.gov.in/tnweb_files/"
            "budget%20speech/"
            "BUDGET%20SPEECH%202024_25_ENG.pdf",
     "type": "pdf"},
  ],
  "gazette": [
    {"name": "TN Gazette Portal",
     "url": "https://www.tngazette.gov.in",
     "type": "webpage"},
  ],
  "schemes": [
    {"name": "myScheme TN Active",
     "url": "https://www.myscheme.gov.in/search"
            "?keyword=&state=Tamil+Nadu&status=active",
     "type": "webpage"},
    {"name": "TN Govt Schemes Page",
     "url": "https://www.tn.gov.in/scheme/",
     "type": "webpage"},
  ],
}

PROMPTS = {
  "budget": (
    "Extract ALL department budget figures. "
    "Return ONLY JSON array: "
    '[{"dept_name":"","budget_estimate_cr":0,'
    '"revised_estimate_cr":0,'
    '"actual_expenditure_cr":0,'
    '"financial_year":"2024-25"}] '
    "Numbers must be numeric, not strings. "
    "Text: "
  ),
  "gazette": (
    "Extract officer transfers and new scheme GOs. "
    "Return ONLY JSON: "
    '{"transfers":[{"officer_name":"",'
    '"from_post":"","to_post":"",'
    '"department":"","go_number":"","date":""}],'
    '"new_schemes":[{"scheme_name":"",'
    '"department":"","go_number":"",'
    '"date":"","brief":""}]} '
    "Text: "
  ),
  "schemes": (
    "Extract scheme information. "
    "Return ONLY JSON array: "
    '[{"scheme_name":"","department":"",'
    '"funding_type":"central|state|css",'
    '"status":"active|discontinued",'
    '"eligibility":""}] '
    "Text: "
  ),
}

def fetch_pdf(url):
  try:
    import pdfplumber
    r = requests.get(url, headers=HEADERS,
      timeout=30)
    if r.status_code != 200:
      return f"HTTP_{r.status_code}"
    with tempfile.NamedTemporaryFile(
        suffix=".pdf", delete=False) as f:
      f.write(r.content)
      path = f.name
    text = ""
    with pdfplumber.open(path) as pdf:
      for page in pdf.pages[:25]:
        text += page.extract_text() or ""
    os.unlink(path)
    return text[:12000]
  except Exception as e:
    return f"ERROR:{e}"

def fetch_page(url):
  try:
    r = requests.get(url, headers=HEADERS,
      timeout=20)
    return r.text[:8000] if r.ok else f"HTTP_{r.status_code}"
  except Exception as e:
    return f"ERROR:{e}"

def extract(text, source_type):
  if not text or text.startswith(("HTTP_","ERROR:")):
    print(f"  Skipping — fetch failed: {text}")
    return []
  client = Groq(api_key=GROQ_API_KEY)
  prompt = PROMPTS.get(source_type, PROMPTS["budget"])
  try:
    resp = client.chat.completions.create(
      model=GROQ_MODEL,
      messages=[{"role":"user",
        "content": prompt + text[:7000]}],
      temperature=0.1,
      max_tokens=3000,
    )
    raw = resp.choices[0].message.content
    start = raw.find("[") if "[" in raw else raw.find("{")
    end = (raw.rfind("]")+1 if "[" in raw
      else raw.rfind("}")+1)
    if start >= 0 and end > start:
      return json.loads(raw[start:end])
    return []
  except Exception as e:
    print(f"  Groq error: {e}")
    return []

def save_queue(items, source_name,
               source_type, sb):
  saved = 0
  for item in (items if isinstance(items, list)
               else [items]):
    try:
      sb.table("admin_queue").insert({
        "source_type": source_type,
        "pipeline_name": source_name,
        "data": item if isinstance(item, dict)
          else {"raw": item},
        "confidence": 0.82,
        "status": "pending_review",
        "created_at": datetime.now().isoformat(),
      }).execute()
      saved += 1
    except Exception as e:
      print(f"  Supabase error: {e}")
  return saved

def make_supabase_client():
  if not GROQ_API_KEY:
    print("ERROR: GROQ_API_KEY not set")
    sys.exit(1)
  if not SUPABASE_URL or not SUPABASE_URL.startswith("http"):
    print("WARNING: SUPABASE_URL not configured — extraction will run but items won't be saved")
    return None
  if not SUPABASE_KEY or len(SUPABASE_KEY) < 20:
    print("WARNING: SUPABASE_SERVICE_ROLE_KEY not configured — extraction will run but items won't be saved")
    return None
  try:
    return create_client(SUPABASE_URL, SUPABASE_KEY)
  except Exception as e:
    print(f"WARNING: Supabase connection failed ({e}) — extraction will run but items won't be saved")
    return None

def run(source_type):
  print(f"\n=== {source_type.upper()} pipeline ===")
  sb = make_supabase_client()
  total = 0
  for s in SOURCES.get(source_type, []):
    print(f"Fetching: {s['name']}")
    text = (fetch_pdf(s["url"])
      if s["type"] == "pdf"
      else fetch_page(s["url"]))
    print(f"  Got {len(str(text))} chars")
    items = extract(text, source_type)
    print(f"  Extracted {len(items)} items")
    if sb is None:
      print(f"  Supabase not configured — skipping save")
      if items:
        print(f"  Preview: {json.dumps(items[:2], ensure_ascii=False)[:300]}")
    else:
      saved = save_queue(items, s["name"], source_type, sb)
      print(f"  Saved {saved} to admin queue")
      total += saved
  print(f"Total saved: {total}")

if __name__ == "__main__":
  p = argparse.ArgumentParser()
  p.add_argument("--source",
    choices=["budget","gazette","schemes","all"],
    default="all")
  args = p.parse_args()
  sources = (["budget","gazette","schemes"]
    if args.source == "all" else [args.source])
  for s in sources:
    run(s)
