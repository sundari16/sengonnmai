import requests, warnings
warnings.filterwarnings("ignore")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json, text/html, */*",
}

SOURCES = [
    ("NHM Tamil Nadu Key Indicators",
     "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=1043&lid=418"),
    ("MGNREGA TN State Report",
     "https://nrega.nic.in/Nregahome/MGNREGA_new/Nrega_home.aspx"),
    ("PM KISAN TN Dashboard",
     "https://pmkisan.gov.in/StateDist_Beneficiary.aspx"),
]

print(f"{'STATUS':<12} {'CHARS':>8}  SOURCE")
print("-" * 50)
for name, url in SOURCES:
    try:
        r = requests.get(url, headers=HEADERS, timeout=15, verify=False)
        chars = len(r.text)
        if r.ok and chars > 500:
            status = "OK"
        elif not r.ok:
            status = f"HTTP_{r.status_code}"
        else:
            status = "EMPTY"
        print(f"{status:<12} {chars:>8}  {name}")
    except Exception as e:
        print(f"{'ERROR':<12} {'':>8}  {name}: {str(e)[:70]}")
