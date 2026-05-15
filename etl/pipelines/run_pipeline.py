import argparse, requests, json, os, sys, tempfile, warnings
from datetime import datetime
from groq import Groq
from supabase import create_client

# Suppress SSL warnings for .gov.in sites with broken cert chains
warnings.filterwarnings("ignore", message="Unverified HTTPS request")

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
SUPABASE_URL = (os.environ.get("SUPABASE_URL") or
  os.environ.get("NEXT_PUBLIC_SUPABASE_URL"))
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
GROQ_MODEL   = "llama-3.3-70b-versatile"

HEADERS = {
  "User-Agent": "Sengonnmai-ETL/1.0 (Tamil Nadu Public Accounts)",
  "Accept": "application/json, text/html, */*",
}

# ssl_verify=False bypasses broken cert chains on *.gov.in in CI
SOURCES = {
  "budget": [
    {"name": "TN Budget Highlights 2024-25",
     "url":  "https://tnbudget.tn.gov.in/tnweb_files/"
             "budget%20highlights/HIGHLIGHTS%20ENG%202024_25.pdf",
     "type": "pdf", "ssl_verify": False},
    {"name": "TN Budget Speech 2024-25",
     "url":  "https://tnbudget.tn.gov.in/tnweb_files/"
             "budget%20speech/BUDGET%20SPEECH%202024_25_ENG.pdf",
     "type": "pdf", "ssl_verify": False},
  ],
  "gazette": [
    # egazette is more stable than tngazette; ssl_verify=False for .gov.in
    {"name": "eGazette TN — latest",
     "url":  "https://egazette.tn.gov.in/",
     "type": "webpage", "ssl_verify": False},
    {"name": "TN Gazette (backup)",
     "url":  "https://www.tngazette.gov.in/",
     "type": "webpage", "ssl_verify": False},
  ],
  "schemes": [
    # myScheme API returns structured JSON — far more useful than the React SPA
    {"name": "myScheme API — TN batch 1",
     "url":  "https://api.myscheme.gov.in/search/v4/schemes"
             "?lang=en&q=&sort=&from=0&size=30"
             "&filterby=state%3ATamil%2BNadu",
     "type": "api"},
    {"name": "myScheme API — TN batch 2",
     "url":  "https://api.myscheme.gov.in/search/v4/schemes"
             "?lang=en&q=&sort=&from=30&size=30"
             "&filterby=state%3ATamil%2BNadu",
     "type": "api"},
  ],
}

PROMPTS = {
  "budget": (
    "Extract ALL department budget figures from this Tamil Nadu budget document. "
    "Return ONLY a JSON array, no commentary:\n"
    '[{"dept_name":"","budget_estimate_cr":0,'
    '"revised_estimate_cr":0,"actual_expenditure_cr":0,'
    '"financial_year":"2024-25"}]\n'
    "All numbers must be numeric (crore rupees). Text:\n"
  ),
  "gazette": (
    "Extract officer transfers and new scheme Government Orders from this Tamil Nadu Gazette text. "
    "Return ONLY JSON:\n"
    '{"transfers":[{"officer_name":"","from_post":"","to_post":"",'
    '"department":"","go_number":"","date":""}],'
    '"new_schemes":[{"scheme_name":"","department":"",'
    '"go_number":"","date":"","brief":""}]}\n'
    "Text:\n"
  ),
  "schemes": (
    "Extract Tamil Nadu government scheme details. "
    "Return ONLY a JSON array:\n"
    '[{"scheme_name":"","department":"","funding_type":"central|state|css",'
    '"status":"active|discontinued","eligibility":"","brief":""}]\n'
    "Only include schemes with non-empty scheme_name. Text:\n"
  ),
}


# ── Fetchers ─────────────────────────────────────────────────────────────────

def fetch_pdf(url, ssl_verify=True):
  try:
    import pdfplumber
    r = requests.get(url, headers=HEADERS, timeout=40, verify=ssl_verify)
    if r.status_code != 200:
      return f"HTTP_{r.status_code}"
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as f:
      f.write(r.content)
      path = f.name
    text = ""
    with pdfplumber.open(path) as pdf:
      for page in pdf.pages[:30]:
        text += page.extract_text() or ""
    os.unlink(path)
    extracted = text.strip()
    if not extracted:
      return "ERROR:PDF extracted no text (may be scanned image)"
    return extracted[:14000]
  except Exception as e:
    return f"ERROR:{e}"

def fetch_page(url, ssl_verify=True):
  try:
    r = requests.get(url, headers=HEADERS, timeout=25, verify=ssl_verify)
    return r.text[:10000] if r.ok else f"HTTP_{r.status_code}"
  except Exception as e:
    return f"ERROR:{e}"

def fetch_api(url):
  """Fetch a JSON API — returns the raw text for Groq, or parsed items directly."""
  try:
    r = requests.get(url, headers=HEADERS, timeout=25)
    if not r.ok:
      return f"HTTP_{r.status_code}", []
    data = r.json()
    # myScheme API structure: data.hits.hits[*]._source
    hits = (data.get("data", {})
               .get("hits", {})
               .get("hits", []))
    if hits:
      items = []
      for h in hits:
        src = h.get("_source", {})
        name = src.get("schemeName") or src.get("scheme_name") or ""
        if not name:
          continue
        items.append({
          "scheme_name":  name,
          "department":   src.get("ministry") or src.get("department") or "",
          "funding_type": (
            "central" if src.get("level") == "Central" else
            "state"   if src.get("level") == "State"   else "css"
          ),
          "status":       "active" if src.get("isActive") != False else "discontinued",
          "eligibility":  (src.get("eligibility") or "")[:300],
          "brief":        (src.get("shortDescription") or src.get("description") or "")[:300],
        })
      print(f"  API parsed {len(hits)} hits → {len(items)} named schemes")
      return None, items   # None = skip Groq, items already parsed
    # fallback: send raw JSON text to Groq
    return json.dumps(data)[:10000], []
  except Exception as e:
    return f"ERROR:{e}", []


# ── Extraction via Groq ───────────────────────────────────────────────────────

def extract(text, source_type):
  if not text or str(text).startswith(("HTTP_", "ERROR:")):
    print(f"  Skipping — fetch failed: {text}")
    return []
  client = Groq(api_key=GROQ_API_KEY)
  prompt = PROMPTS.get(source_type, PROMPTS["budget"])
  try:
    resp = client.chat.completions.create(
      model=GROQ_MODEL,
      messages=[{"role": "user", "content": prompt + str(text)[:8000]}],
      temperature=0.1,
      max_tokens=4000,
    )
    raw   = resp.choices[0].message.content
    start = raw.find("[") if "[" in raw else raw.find("{")
    end   = (raw.rfind("]") + 1 if "[" in raw else raw.rfind("}") + 1)
    if start >= 0 and end > start:
      return json.loads(raw[start:end])
    return []
  except Exception as e:
    print(f"  Groq error: {e}")
    return []


# ── Filter ────────────────────────────────────────────────────────────────────

def is_meaningful(item):
  """Skip items where every value is empty string/None."""
  if not isinstance(item, dict):
    return True
  values = [v for v in item.values() if isinstance(v, str)]
  return any(v.strip() for v in values)


# ── Supabase ──────────────────────────────────────────────────────────────────

def make_supabase_client():
  if not GROQ_API_KEY:
    print("ERROR: GROQ_API_KEY not set"); sys.exit(1)
  if not SUPABASE_URL or not SUPABASE_URL.startswith("http"):
    print("WARNING: SUPABASE_URL not configured — items won't be saved")
    return None
  if not SUPABASE_KEY or len(SUPABASE_KEY) < 20:
    print("WARNING: SUPABASE_SERVICE_ROLE_KEY not configured — items won't be saved")
    return None
  try:
    return create_client(SUPABASE_URL, SUPABASE_KEY)
  except Exception as e:
    print(f"WARNING: Supabase failed ({e}) — items won't be saved")
    return None

def save_queue(items, source_name, source_type, sb):
  saved = 0
  for item in (items if isinstance(items, list) else [items]):
    if not is_meaningful(item):
      continue
    try:
      sb.table("admin_queue").insert({
        "source_type":   source_type,
        "pipeline_name": source_name,
        "data":          item if isinstance(item, dict) else {"raw": item},
        "confidence":    0.82,
        "status":        "pending_review",
        "created_at":    datetime.now().isoformat(),
      }).execute()
      saved += 1
    except Exception as e:
      print(f"  Supabase error: {e}")
  return saved


# ── Runner ────────────────────────────────────────────────────────────────────

def run(source_type):
  print(f"\n=== {source_type.upper()} pipeline ===")
  sb    = make_supabase_client()
  total = 0

  for s in SOURCES.get(source_type, []):
    verify = s.get("ssl_verify", True)
    print(f"Fetching: {s['name']}" + ("" if verify else " [ssl_verify=off]"))

    if s["type"] == "api":
      text, direct_items = fetch_api(s["url"])
      if direct_items:
        # Already structured — no Groq needed
        items = direct_items
        print(f"  Extracted {len(items)} items (direct parse)")
      else:
        print(f"  Got {len(str(text))} chars — sending to Groq")
        items = extract(text, source_type)
        print(f"  Extracted {len(items)} items (Groq)")
    elif s["type"] == "pdf":
      text = fetch_pdf(s["url"], ssl_verify=verify)
      print(f"  Got {len(str(text))} chars")
      items = extract(text, source_type)
      print(f"  Extracted {len(items)} items")
    else:
      text = fetch_page(s["url"], ssl_verify=verify)
      print(f"  Got {len(str(text))} chars")
      items = extract(text, source_type)
      print(f"  Extracted {len(items)} items")

    meaningful = [i for i in (items if isinstance(items, list) else [items])
                  if is_meaningful(i)]
    print(f"  Meaningful: {len(meaningful)}")

    if sb is None:
      if meaningful:
        print(f"  Preview: {json.dumps(meaningful[:2], ensure_ascii=False)[:400]}")
    else:
      saved = save_queue(meaningful, s["name"], source_type, sb)
      print(f"  Saved {saved} to admin queue")
      total += saved

  print(f"Total saved: {total}")


if __name__ == "__main__":
  p = argparse.ArgumentParser()
  p.add_argument("--source",
    choices=["budget", "gazette", "schemes", "all"], default="all")
  args = p.parse_args()
  sources = (["budget", "gazette", "schemes"]
    if args.source == "all" else [args.source])
  for s in sources:
    run(s)
