import argparse, requests, json, os, sys, tempfile, warnings, re
from datetime import datetime
from groq import Groq
from supabase import create_client

warnings.filterwarnings("ignore", message="Unverified HTTPS request")

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
SUPABASE_URL = (os.environ.get("SUPABASE_URL") or
  os.environ.get("NEXT_PUBLIC_SUPABASE_URL"))
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
GROQ_MODEL   = "llama-3.3-70b-versatile"

HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Accept": "application/json, text/html, */*",
}

# All sources verified reachable from international runners (etl/test_sources.py)
SOURCES = {
  "budget": [
    {"name": "PRS India TN Budget Analysis 2024-25",
     "url":  "https://prsindia.org/budgets/states/"
             "tamil-nadu-budget-analysis-2024-25",
     "type": "webpage"},
    {"name": "RBI DBIE State Finances",
     "url":  "https://dbie.rbi.org.in/DBIE/dbie.rbi?site=statistics",
     "type": "webpage"},
  ],
  "gazette": [
    {"name": "India Code TN Acts",
     "url":  "https://www.indiacode.nic.in/handle/123456789/1362",
     "type": "webpage"},
  ],
  "schemes": [
    {"name": "myScheme.gov.in TN",
     "url":  "https://www.myscheme.gov.in/search?keyword=&state=Tamil+Nadu",
     "type": "webpage"},
    {"name": "DBT Bharat TN Schemes",
     "url":  "https://dbtbharat.gov.in",
     "type": "webpage"},
    {"name": "data.gov.in TN Datasets",
     "url":  "https://data.gov.in/catalogs"
             "?filters[field_catalog_reference_state][]=Tamil+Nadu"
             "&sort_by=changed&sort_order=DESC",
     "type": "webpage"},
    # NHM verified working: 29k chars, text-heavy page (tested 2026-05-15)
    {"name": "NHM Tamil Nadu Key Indicators",
     "url":  "https://nhm.gov.in/index1.php"
             "?lang=1&level=3&sublinkid=1043&lid=418",
     "type": "webpage"},
  ],
  # CAG: listing page is JS-rendered; state filter is client-side only.
  # PDFs found in HTML are national reports, not TN-specific.
  # Keeping empty until TN-specific PDF URLs are identified manually.
  "cag": [],
}

PROMPTS = {
  "budget": (
    "Extract ALL department budget figures from this Tamil Nadu budget text. "
    "Return ONLY a JSON array:\n"
    '[{"dept_name":"","budget_estimate_cr":0,'
    '"revised_estimate_cr":0,"actual_expenditure_cr":0,'
    '"financial_year":"2024-25"}]\n'
    "All monetary values must be numeric (crore rupees). "
    "If revised or actual are unavailable use 0. Text:\n"
  ),
  "gazette": (
    "Extract legislation titles and descriptions from this India Code / Gazette text. "
    "Return ONLY a JSON array:\n"
    '[{"act_title":"","act_number":"","year":"","department":"","brief":""}]\n'
    "Only include entries with a non-empty act_title. Text:\n"
  ),
  "schemes": (
    "Extract Tamil Nadu government scheme details from this text. "
    "Return ONLY a JSON array:\n"
    '[{"scheme_name":"","department":"","funding_type":"central|state|css",'
    '"status":"active|discontinued","eligibility":"","brief":""}]\n'
    "Only include schemes with non-empty scheme_name. Text:\n"
  ),
  "cag": (
    "Extract CAG audit report titles and findings for Tamil Nadu. "
    "Return ONLY a JSON array:\n"
    '[{"report_title":"","department":"","financial_year":"",'
    '"finding":"","amount_cr":0,"finding_type":"irregularity|shortage|excess|other"}]\n'
    "Only include entries with a non-empty finding. "
    "Use neutral factual language. Numbers in crore rupees (0 if unknown). Text:\n"
  ),
}


# ── HTML stripping ────────────────────────────────────────────────────────────

def strip_html(html):
  """Remove tags, collapse whitespace, return plain text up to 12000 chars."""
  text = re.sub(r'<script[^>]*>.*?</script>', ' ', html, flags=re.S | re.I)
  text = re.sub(r'<style[^>]*>.*?</style>',  ' ', text,  flags=re.S | re.I)
  text = re.sub(r'<[^>]+>', ' ', text)
  text = re.sub(r'&nbsp;', ' ', text)
  text = re.sub(r'&[a-z]+;', ' ', text)
  text = re.sub(r'\s+', ' ', text).strip()
  return text[:12000]


# ── Fetchers ──────────────────────────────────────────────────────────────────

def fetch_pdf(url, ssl_verify=False):
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

def fetch_page(url, ssl_verify=False, retries=2):
  import time
  r = None
  for attempt in range(retries + 1):
    try:
      r = requests.get(url, headers=HEADERS, timeout=25, verify=ssl_verify)
      if r.ok and len(r.text) > 500:
        plain = strip_html(r.text)
        return plain
      if attempt < retries:
        print(f"  Retry {attempt+1}: got {len(r.text) if r else 0} chars")
        time.sleep(3)
    except Exception as e:
      if attempt < retries:
        time.sleep(3)
      else:
        return f"ERROR:{e}"
  if r is not None:
    return f"HTTP_{r.status_code}"
  return "ERROR:unknown"

def fetch_json_api(url, ssl_verify=False):
  """Fetch a structured JSON API; returns (records_list, raw_text_fallback)."""
  try:
    r = requests.get(url, headers=HEADERS, timeout=20, verify=ssl_verify)
    if not r.ok:
      return [], f"HTTP_{r.status_code}"
    data = r.json()
    # data.gov.in format
    records = data.get("records") or data.get("result", {}).get("records", [])
    if records:
      return records[:30], None
    # myScheme hits format
    hits = data.get("data", {}).get("hits", {}).get("hits", [])
    if hits:
      return [h.get("_source", {}) for h in hits], None
    return [], json.dumps(data)[:8000]
  except Exception as e:
    return [], f"ERROR:{e}"


# ── Extraction via Groq ───────────────────────────────────────────────────────

def extract(text, source_type):
  if not text or str(text).startswith(("HTTP_", "ERROR:")):
    print(f"  Skipping — fetch failed: {text}")
    return []
  if len(str(text).strip()) < 500:
    print(f"  SKIP: insufficient content ({len(str(text).strip())} chars) — skipping Groq to prevent hallucination")
    return []
  client = Groq(api_key=GROQ_API_KEY)
  prompt = PROMPTS.get(source_type, PROMPTS["budget"])
  raw = ""
  try:
    resp = client.chat.completions.create(
      model=GROQ_MODEL,
      messages=[
        {"role": "system", "content": (
          "You are a data extraction assistant. "
          "Return ONLY valid JSON. No explanation. No markdown. "
          "No code blocks. Start your response with [ or { directly."
        )},
        {"role": "user", "content": prompt + str(text)[:8000]},
      ],
      temperature=0.0,
      max_tokens=4000,
    )
    raw = resp.choices[0].message.content.strip()

    # Strip markdown code fences if present
    if raw.startswith("```"):
      raw = raw.split("```")[1]
      if raw.startswith("json"):
        raw = raw[4:]
      raw = raw.strip()

    # Trim to outermost JSON structure
    if raw.startswith("["):
      raw = raw[:raw.rfind("]") + 1]
    elif raw.startswith("{"):
      raw = raw[:raw.rfind("}") + 1]

    parsed = json.loads(raw)

    if isinstance(parsed, list):
      return parsed
    if isinstance(parsed, dict):
      # Flatten dict of lists (gazette returns {transfers:[...], new_schemes:[...]})
      items = []
      for v in parsed.values():
        if isinstance(v, list):
          items.extend(v)
        elif isinstance(v, dict):
          items.append(v)
      return items
    return [parsed]

  except json.JSONDecodeError as e:
    print(f"  JSON parse error: {e}")
    print(f"  Raw preview: {raw[:200]}")
    return []
  except Exception as e:
    print(f"  Groq error: {e}")
    return []


# ── Filter ────────────────────────────────────────────────────────────────────

def is_meaningful(item):
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
  print(f"Python version: {sys.version}")
  print(f"Groq model: {GROQ_MODEL}")
  print(f"Supabase URL configured: {bool(SUPABASE_URL)}")
  print(f"Sources for {source_type}: {len(SOURCES.get(source_type, []))}")
  sb    = make_supabase_client()
  total = 0

  for s in SOURCES.get(source_type, []):
    print(f"Fetching: {s['name']}")

    if s["type"] == "json_api":
      records, fallback = fetch_json_api(s["url"])
      if records:
        print(f"  API returned {len(records)} records directly")
        items = records
      else:
        print(f"  Got {len(str(fallback))} chars — sending to Groq")
        items = extract(fallback, source_type)
        print(f"  Extracted {len(items)} items (Groq)")
    elif s["type"] == "pdf":
      text = fetch_pdf(s["url"])
      print(f"  Got {len(str(text))} chars")
      items = extract(text, source_type)
      print(f"  Extracted {len(items)} items")
    else:
      text = fetch_page(s["url"])
      print(f"  Got {len(str(text))} chars (stripped HTML)")
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
    choices=["budget", "gazette", "schemes", "cag", "all"], default="all")
  args = p.parse_args()
  sources = (["budget", "gazette", "schemes", "cag"]
    if args.source == "all" else [args.source])
  for s in sources:
    run(s)
