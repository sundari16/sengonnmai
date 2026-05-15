"""
RBI DBIE state finance fetcher.
The DBIE interactive database is JS-rendered, but the statistics
landing page returns enough text for Groq extraction.
"""
import requests
import warnings
warnings.filterwarnings("ignore")

HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Accept": "text/html, */*",
}

SOURCES = [
  {
    "name": "RBI DBIE State Finance Statistics",
    "url":  "https://dbie.rbi.org.in/DBIE/dbie.rbi?site=statistics",
    "note": "Landing page — contains publication index and summary tables",
  },
]

def fetch_rbi_sources():
  results = []
  for source in SOURCES:
    try:
      r = requests.get(source["url"], headers=HEADERS, timeout=20, verify=False)
      if r.ok and len(r.text) > 500:
        results.append({
          "source": source["name"],
          "chars":  len(r.text),
          "content": r.text[:5000],
        })
        print(f"  RBI: {source['name']} — {len(r.text)} chars")
      else:
        print(f"  RBI: {source['name']} — HTTP {r.status_code}")
    except Exception as e:
      print(f"  RBI error ({source['name']}): {e}")
  return results

if __name__ == "__main__":
  results = fetch_rbi_sources()
  print(f"\nFetched {len(results)} RBI source(s)")
