"""Test which CAG PDFs are accessible and contain Tamil Nadu content."""
import requests, warnings, tempfile, os
warnings.filterwarnings("ignore")

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

# Most promising PDFs from the CAG listing page
CANDIDATES = [
    ("CAG SFAR 2024-25 (Report 3 of 2026)",
     "https://cag.gov.in/webroot/uploads/download_audit_report/2025/SFAR-2024-25-Report-No.-3-of-2026-069cbae94884dd2.54030841.pdf"),
    ("CAG English SFAR 2024-25",
     "https://cag.gov.in/webroot/uploads/download_audit_report/2026/English-SFAR-2024-25-069c50935ce13c9.55626515.pdf"),
    ("CAG State Revenues March 2024 (Report 3 of 2026)",
     "https://cag.gov.in/webroot/uploads/download_audit_report/2026/Report-of-the-Comptroller-and-Auditor-General-of-India-on-State-Revenues-for-the-period-ended-March-2024--Report-No.-3-of-2026-069c60d8a133e16.82085064.pdf"),
    ("CAG Civil March 2023 (Report 5 of 2026)",
     "https://cag.gov.in/webroot/uploads/download_audit_report/2026/Report-No.-5-of-2025-(Civil)-March-2023-English-069c50fe6928003.30688042.pdf"),
]

try:
    import pdfplumber
    HAS_PDF = True
except ImportError:
    HAS_PDF = False
    print("pdfplumber not available — checking HTTP status only")

for name, url in CANDIDATES:
    try:
        r = requests.get(url, headers=HEADERS, timeout=30, verify=False)
        if not r.ok:
            print(f"HTTP_{r.status_code}  {name}")
            continue
        size_kb = len(r.content) // 1024
        if not HAS_PDF:
            print(f"OK {size_kb}KB  {name}")
            continue
        # Extract first 3 pages and check for Tamil Nadu
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as f:
            f.write(r.content)
            path = f.name
        text = ""
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages[:5]:
                text += page.extract_text() or ""
        os.unlink(path)
        tn_mention = "Tamil Nadu" in text or "TAMIL NADU" in text
        print(f"{'TN:YES' if tn_mention else 'TN:NO '} {size_kb:>5}KB  {name}")
        if tn_mention:
            # Print first 400 chars of text
            print(f"  Preview: {text[:400].strip()}")
    except Exception as e:
        print(f"ERROR  {name}: {str(e)[:80]}")
