import requests
import warnings
warnings.filterwarnings("ignore")

HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; "
    "Win64; x64) AppleWebKit/537.36",
}

SOURCES_TO_TEST = [
  ("PRS India TN Budget",
   "https://prsindia.org/budgets/states/"
   "tamil-nadu-budget-analysis-2024-25"),
  ("Open Budgets India",
   "https://openbudgetsindia.org"),
  ("DBT Bharat",
   "https://dbtbharat.gov.in"),
  ("myScheme webpage",
   "https://www.myscheme.gov.in/search"
   "?keyword=&state=Tamil+Nadu"),
  ("data.gov.in",
   "https://data.gov.in"),
  ("CAG TN reports",
   "https://cag.gov.in/en/audit-report"
   "?state=Tamil+Nadu"),
  ("TN Assembly",
   "https://tnassembly.gov.in/"),
]

print("Testing all data sources...")
print("-" * 50)
working = 0
for name, url in SOURCES_TO_TEST:
  try:
    r = requests.get(url, headers=HEADERS,
      timeout=15, verify=False)
    chars = len(r.text)
    status = "OK" if r.ok and chars > 500 else "BLOCKED"
    if status == "OK":
      working += 1
    print(f"{status:8} {chars:6} chars  {name}")
  except Exception as e:
    print(f"ERROR           {name}: {e}")

print("-" * 50)
print(f"Working: {working}/{len(SOURCES_TO_TEST)}")
