import requests
import warnings
warnings.filterwarnings("ignore")

HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Accept": "application/json, text/html, */*",
}

ALL_SOURCES = [
  # Previously confirmed working
  ("PRS India TN Budget",
   "https://prsindia.org/budgets/states/tamil-nadu-budget-analysis-2024-25",
   "webpage"),
  ("myScheme homepage",
   "https://www.myscheme.gov.in",
   "webpage"),
  ("data.gov.in homepage",
   "https://data.gov.in",
   "webpage"),
  ("CAG TN reports page",
   "https://cag.gov.in/en/audit-report?state=Tamil+Nadu&report_type=&year=",
   "webpage"),
  ("DBT Bharat homepage",
   "https://dbtbharat.gov.in",
   "webpage"),

  # New API / direct sources to validate
  ("data.gov.in API — resource 6176b38f",
   "https://data.gov.in/api/datastore/resource.json?resource_id=6176b38f-4a78-4b5b-b27b-df9a6e86d5ba&limit=5",
   "json_api"),
  ("data.gov.in API — resource 4c5e8b2a (placeholder)",
   "https://data.gov.in/api/datastore/resource.json?resource_id=4c5e8b2a-1234-5678-abcd-ef1234567890&limit=5",
   "json_api"),
  ("RBI DBIE statistics",
   "https://dbie.rbi.org.in/DBIE/dbie.rbi?site=statistics",
   "webpage"),
  ("RBI DBIE publications",
   "https://rbidocs.rbi.org.in/rdocs/Publications/PDFs/",
   "webpage"),
  ("CAG TN Finance Accounts PDF 2022-23",
   "https://cag.gov.in/uploads/download_audit_report/2024/Report_No._2_of_2024_Finance_Accounts_2022-23-Tamil_Nadu07062024121616.pdf",
   "pdf"),
  ("CAG TN State Finances PDF 2021-22",
   "https://cag.gov.in/uploads/download_audit_report/2023/Report_No._3_of_2023-Tamil_Nadu07062024.pdf",
   "pdf"),
  ("DBT Bharat scheme by state id=33",
   "https://dbtbharat.gov.in/scheme/schemelistbystate?id=33",
   "webpage"),
  ("India Code TN Acts",
   "https://www.indiacode.nic.in/handle/123456789/1362",
   "webpage"),
]

print("Testing all candidate data sources...")
print(f"{'STATUS':<10} {'CHARS':>8}  {'TYPE':<10}  SOURCE")
print("-" * 70)
working = []
for name, url, stype in ALL_SOURCES:
  try:
    r = requests.get(url, headers=HEADERS, timeout=15, verify=False)
    chars = len(r.content)
    ct = r.headers.get("content-type", "")
    if r.ok and chars > 500:
      status = "OK"
      working.append((name, url, stype, chars))
    elif not r.ok:
      status = f"HTTP_{r.status_code}"
    else:
      status = "EMPTY"
    print(f"{status:<10} {chars:>8}  {stype:<10}  {name}")
    # For JSON APIs show a snippet of response
    if stype == "json_api" and r.ok:
      try:
        j = r.json()
        print(f"           JSON keys: {list(j.keys())[:5]}")
      except Exception:
        print(f"           (not JSON)")
  except Exception as e:
    short = str(e)[:80]
    print(f"{'ERROR':<10} {'':>8}  {stype:<10}  {name}: {short}")

print("-" * 70)
print(f"Working (500+ chars): {len(working)}/{len(ALL_SOURCES)}")
print()
for name, url, stype, chars in working:
  print(f"  OK  {chars:>8} chars  [{stype}]  {name}")
