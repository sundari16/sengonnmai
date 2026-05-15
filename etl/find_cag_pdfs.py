import requests, re, warnings
warnings.filterwarnings("ignore")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "text/html,application/xhtml+xml,*/*",
}

def find_pdfs(url, label):
    try:
        r = requests.get(url, headers=HEADERS, verify=False, timeout=20)
        print(f"\n{label}: HTTP {r.status_code} — {len(r.text)} chars")
        pdfs = re.findall(r'href=["\']([^"\']*\.pdf[^"\']*)["\']', r.text, re.I)
        # Also look for data-href or src attributes with PDFs
        pdfs += re.findall(r'(?:data-href|src)=["\']([^"\']*\.pdf[^"\']*)["\']', r.text, re.I)
        # Deduplicate
        pdfs = list(dict.fromkeys(pdfs))
        print(f"PDF links found: {len(pdfs)}")
        for link in pdfs[:15]:
            # Make absolute if relative
            if link.startswith("/"):
                link = "https://cag.gov.in" + link
            print(f"  {link}")
        return pdfs
    except Exception as e:
        print(f"\n{label}: ERROR — {e}")
        return []

p1 = find_pdfs(
    "https://cag.gov.in/en/audit-report?state=Tamil+Nadu&report_type=&year=2024",
    "CAG TN 2024 reports"
)
p2 = find_pdfs(
    "https://cag.gov.in/en/audit-report?state=Tamil+Nadu",
    "CAG TN all reports"
)
p3 = find_pdfs(
    "https://cag.gov.in/en/audit-report?state=Tamil+Nadu&report_type=&year=2023",
    "CAG TN 2023 reports"
)

all_pdfs = list(dict.fromkeys(p1 + p2 + p3))
print(f"\n=== Total unique PDF links: {len(all_pdfs)} ===")
for p in all_pdfs:
    if p.startswith("/"):
        p = "https://cag.gov.in" + p
    print(f"  {p}")
