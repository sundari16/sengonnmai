"""
Tamil Nadu Government Gazette scraper.
Downloads gazette PDFs listed on the official gazette index page,
extracts text, and saves each issue as a .txt file ready for extract_budget.py.

Usage:
    # Scrape latest N issues (default 10):
    python etl/scrape_gazette.py

    # Scrape a specific year:
    python etl/scrape_gazette.py --year 2024

    # Scrape a single known PDF URL:
    python etl/scrape_gazette.py --url https://www.tn.gov.in/gazette/...pdf

    # Dry-run — list issues without downloading:
    python etl/scrape_gazette.py --dry-run

Config (via .env.local):
    GAZETTE_BASE_URL   Override the gazette index URL (optional)
    GAZETTE_OUT_DIR    Directory to save downloaded text files (default: etl/gazette_raw/)

Activity is appended to etl/scrape_log.csv.
"""

import argparse
import csv
import datetime
import os
import sys
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
import pdfplumber

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

load_dotenv(Path(__file__).parent.parent / ".env.local")

GAZETTE_BASE_URL = os.environ.get(
    "GAZETTE_BASE_URL",
    "https://www.tn.gov.in/gazette/",
)
OUT_DIR = Path(
    os.environ.get("GAZETTE_OUT_DIR", Path(__file__).parent / "gazette_raw")
)
LOG_PATH = Path(__file__).parent / "scrape_log.csv"
LOG_FIELDS = [
    "timestamp", "url", "filename", "year",
    "size_bytes", "pages", "status", "error",
]

REQUEST_DELAY = 1.5   # seconds between requests — be polite
REQUEST_TIMEOUT = 30  # seconds
HEADERS = {
    "User-Agent": (
        "Sengonnmai/1.0 (civic transparency project; "
        "github.com/sengonnmai) Python-requests"
    )
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


def log_row(url: str, filename: str = "", year: str = "") -> dict:
    return {
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "url": url,
        "filename": filename,
        "year": year,
        "size_bytes": 0,
        "pages": 0,
        "status": "error",
        "error": "",
    }

# ---------------------------------------------------------------------------
# HTTP helpers
# ---------------------------------------------------------------------------

def get_html(url: str) -> str:
    resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
    resp.raise_for_status()
    return resp.text


def download_pdf(url: str, dest: Path) -> int:
    """Download PDF to dest, return file size in bytes."""
    with requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT, stream=True) as resp:
        resp.raise_for_status()
        dest.write_bytes(resp.content)
    return dest.stat().st_size

# ---------------------------------------------------------------------------
# PDF → text
# ---------------------------------------------------------------------------

def pdf_to_text(pdf_path: Path) -> tuple[str, int]:
    """Extract plain text from a PDF. Returns (text, page_count)."""
    pages_text = []
    with pdfplumber.open(pdf_path) as pdf:
        page_count = len(pdf.pages)
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                pages_text.append(text)
    return "\n\n".join(pages_text), page_count

# ---------------------------------------------------------------------------
# Gazette index scraping
# ---------------------------------------------------------------------------

def find_pdf_links(html: str, base_url: str) -> list[dict]:
    """
    Parse the gazette index page and return a list of
    {"url": ..., "label": ..., "year": ...} dicts for all PDF links found.
    """
    soup = BeautifulSoup(html, "html.parser")
    results = []
    seen = set()

    for a in soup.find_all("a", href=True):
        href = a["href"].strip()
        if not href.lower().endswith(".pdf"):
            continue
        full_url = urljoin(base_url, href)
        if full_url in seen:
            continue
        seen.add(full_url)

        label = a.get_text(strip=True) or Path(urlparse(href).path).stem
        # Try to extract year from URL or label
        year = ""
        for tok in [href, label]:
            for part in tok.replace("/", " ").replace("_", " ").replace("-", " ").split():
                if part.isdigit() and len(part) == 4 and 2000 <= int(part) <= 2100:
                    year = part
                    break
            if year:
                break

        results.append({"url": full_url, "label": label, "year": year})

    return results


def filter_by_year(links: list[dict], year: str) -> list[dict]:
    return [l for l in links if l["year"] == year]

# ---------------------------------------------------------------------------
# Core: scrape one PDF
# ---------------------------------------------------------------------------

def scrape_one(url: str, year: str = "", dry_run: bool = False) -> None:
    filename = Path(urlparse(url).path).name or "gazette.pdf"
    txt_path = OUT_DIR / filename.replace(".pdf", ".txt")
    pdf_path = OUT_DIR / filename
    row = log_row(url, filename, year)

    if txt_path.exists():
        print(f"  skip  {filename} (already extracted)")
        return

    if dry_run:
        print(f"  [dry] {filename}")
        return

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    try:
        print(f"  dl    {filename} …", end=" ", flush=True)
        size = download_pdf(url, pdf_path)
        row["size_bytes"] = size
        print(f"{size // 1024} KB", end=" ", flush=True)

        text, pages = pdf_to_text(pdf_path)
        row["pages"] = pages
        txt_path.write_text(text, encoding="utf-8")
        print(f"→ {pages}pp → {txt_path.name}")

        # Remove PDF after extracting text to save space
        pdf_path.unlink(missing_ok=True)

        row["status"] = "ok"
    except Exception as e:
        row["error"] = str(e)
        print(f"ERROR: {e}")
        pdf_path.unlink(missing_ok=True)
    finally:
        append_log(row)

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Scrape Tamil Nadu Government Gazette PDFs")
    parser.add_argument("--year", help="Filter by year, e.g. 2024")
    parser.add_argument("--url", help="Scrape a single known PDF URL directly")
    parser.add_argument("--limit", type=int, default=10, help="Max issues to download (default 10)")
    parser.add_argument("--dry-run", action="store_true", help="List issues without downloading")
    args = parser.parse_args()

    # Single URL mode
    if args.url:
        print(f"Single URL mode: {args.url}")
        scrape_one(args.url, dry_run=args.dry_run)
        return

    # Index scrape mode
    print(f"Fetching gazette index: {GAZETTE_BASE_URL}")
    try:
        html = get_html(GAZETTE_BASE_URL)
    except requests.HTTPError as e:
        print(f"Failed to fetch gazette index: {e}")
        sys.exit(1)
    except requests.ConnectionError:
        print(f"Cannot reach {GAZETTE_BASE_URL} — check network or set GAZETTE_BASE_URL in .env.local")
        sys.exit(1)

    links = find_pdf_links(html, GAZETTE_BASE_URL)
    if not links:
        print("No PDF links found on the index page. The page structure may have changed.")
        sys.exit(1)

    print(f"Found {len(links)} PDF links")

    if args.year:
        links = filter_by_year(links, args.year)
        print(f"Filtered to {len(links)} links for year {args.year}")

    links = links[: args.limit]
    print(f"Processing {len(links)} issues (limit={args.limit})\n")

    for i, link in enumerate(links, 1):
        print(f"[{i}/{len(links)}] {link['label']} ({link['year'] or 'year unknown'})")
        scrape_one(link["url"], year=link["year"], dry_run=args.dry_run)
        if i < len(links):
            time.sleep(REQUEST_DELAY)

    print(f"\nDone. Text files saved to: {OUT_DIR}")
    print(f"Log appended to: {LOG_PATH}")


if __name__ == "__main__":
    main()
