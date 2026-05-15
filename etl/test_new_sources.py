import requests, warnings, tempfile, os
warnings.filterwarnings("ignore")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json, text/html, */*",
}

CANDIDATES = [
    # budget
    ("Open Budgets India TN API",
     "https://openbudgetsindia.org/api/3/action/datastore_search?resource_id=tamilnadu-budget-2024-25&limit=50",
     "json_api"),
    ("PRS India TN Budget PDF",
     "https://prsindia.org/files/budget/budget_analysis/state/2024-25/Tamil%20Nadu/TN%20Budget%20Analysis%202024-25.pdf",
     "pdf"),
    # schemes
    ("PM POSHAN TN Report",
     "https://pmposhan.education.gov.in/Circular/StatewiseProgressReport",
     "webpage"),
    ("NREGA TN State Summary",
     "https://nrega.nic.in/Nregahome/MGNREGA_new/nregakey.aspx?state_code=33&state_name=TAMIL%20NADU",
     "webpage"),
    ("Ayushman Bharat PM-JAY TN PDF",
     "https://pmjay.gov.in/sites/default/files/2024-01/State-wise-Progress-Report.pdf",
     "pdf"),
    # cag
    ("CAG TN 2023 listing",
     "https://cag.gov.in/en/audit-report?state=Tamil+Nadu&year=2023",
     "webpage"),
]

print(f"{'STATUS':<14} {'CHARS':>8}  TYPE        SOURCE")
print("-" * 70)

try:
    import pdfplumber
    HAS_PDF = True
except ImportError:
    HAS_PDF = False

working = []
for name, url, stype in CANDIDATES:
    try:
        r = requests.get(url, headers=HEADERS, timeout=20, verify=False)
        if not r.ok:
            print(f"{'HTTP_'+str(r.status_code):<14} {len(r.content):>8}  {stype:<10}  {name}")
            continue

        if stype == "pdf":
            size = len(r.content)
            if not HAS_PDF:
                status = "OK(no-pdf-lib)" if size > 10000 else "SMALL"
                print(f"{status:<14} {size:>8}  {stype:<10}  {name}")
                if size > 10000:
                    working.append((name, url, stype, size))
                continue
            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as f:
                f.write(r.content)
                path = f.name
            text = ""
            try:
                with pdfplumber.open(path) as pdf:
                    for page in pdf.pages[:3]:
                        text += page.extract_text() or ""
            finally:
                os.unlink(path)
            chars = len(text)
            status = "OK" if chars > 500 else "PDF-EMPTY"
            print(f"{status:<14} {chars:>8}  {stype:<10}  {name}")
            if chars > 500:
                working.append((name, url, stype, chars))
                print(f"               Preview: {text[:200].strip()}")

        elif stype == "json_api":
            try:
                data = r.json()
                keys = list(data.keys())[:5]
                # Check for records
                records = (data.get("result", {}).get("records", [])
                           or data.get("records", [])
                           or data.get("data", {}).get("hits", {}).get("hits", []))
                chars = len(r.text)
                status = f"OK({len(records)}rec)" if records else ("OK(no-rec)" if chars > 500 else "EMPTY")
                print(f"{status:<14} {chars:>8}  {stype:<10}  {name}")
                print(f"               Keys: {keys}")
                if records:
                    print(f"               Sample: {str(records[0])[:120]}")
                    working.append((name, url, stype, chars))
            except Exception as je:
                print(f"{'JSON-ERR':<14} {len(r.text):>8}  {stype:<10}  {name}: {je}")

        else:  # webpage
            chars = len(r.text)
            status = "OK" if chars > 500 else "EMPTY"
            print(f"{status:<14} {chars:>8}  {stype:<10}  {name}")
            if chars > 500:
                working.append((name, url, stype, chars))

    except Exception as e:
        print(f"{'ERROR':<14} {'':>8}  {stype:<10}  {name}: {str(e)[:70]}")

print("-" * 70)
print(f"Working: {len(working)}/{len(CANDIDATES)}")
print()
for name, url, stype, chars in working:
    print(f"  OK  {chars:>8}  [{stype}]  {name}")
