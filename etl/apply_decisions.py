from supabase import create_client
import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=".env.local")

sb = create_client(
  os.environ["NEXT_PUBLIC_SUPABASE_URL"],
  os.environ["SUPABASE_SERVICE_ROLE_KEY"]
)

# Get the 7 pending items
items = sb.table("admin_queue").select(
  "id, pipeline_name, data"
).eq("status", "pending_review").execute()

print(f"Processing {len(items.data)} items\n")

approved = 0
rejected = 0

for item in items.data:
  data = item["data"]
  source = item["pipeline_name"]
  dept = (data.get("dept_name", "") or
          data.get("department", "") or "").lower()
  scheme = data.get("scheme_name", "")
  budget = data.get("budget_estimate_cr", 0) or 0

  # APPROVE: TANGEDCO 73,821
  if "tangedco" in dept and budget > 50000:
    sb.table("admin_queue").update({
      "status": "approved",
      "reviewer_notes": "Approved: TANGEDCO total spend "
        "figure plausible at this scale. "
        "Source: PRS India TN Budget 2024-25"
    }).eq("id", item["id"]).execute()
    approved += 1
    print(f"APPROVED: {dept} Rs {budget} Cr")
    continue

  # APPROVE: Roads 2,500 (the higher figure)
  if "roads" in dept and budget == 2500:
    sb.table("admin_queue").update({
      "status": "approved",
      "reviewer_notes": "Approved: Roads capital "
        "allocation. Source: PRS India TN Budget 2024-25"
    }).eq("id", item["id"]).execute()
    approved += 1
    print(f"APPROVED: {dept} Rs {budget} Cr")
    continue

  # APPROVE: Housing 3,500
  if "housing" in dept and budget == 3500:
    sb.table("admin_queue").update({
      "status": "approved",
      "reviewer_notes": "Approved: Housing allocation "
        "matches earlier verified figure. "
        "Source: PRS India TN Budget 2024-25"
    }).eq("id", item["id"]).execute()
    approved += 1
    print(f"APPROVED: {dept} Rs {budget} Cr")
    continue

  # REJECT: Education 360 (misleading partial figure)
  if "education" in dept and budget == 360:
    sb.table("admin_queue").update({
      "status": "rejected",
      "reviewer_notes": "Rejected: Rs 360 Cr is a "
        "sub-scheme allocation, not total Education "
        "budget. Total Education is ~Rs 40,000 Cr. "
        "Publishing this without context is misleading."
    }).eq("id", item["id"]).execute()
    rejected += 1
    print(f"REJECTED: {dept} Rs {budget} Cr — misleading")
    continue

  # REJECT: Duplicate Roads 1,000
  if "roads" in dept and budget == 1000:
    sb.table("admin_queue").update({
      "status": "rejected",
      "reviewer_notes": "Rejected: Duplicate Roads "
        "entry without distinction from higher "
        "figure. Keeping only the larger figure."
    }).eq("id", item["id"]).execute()
    rejected += 1
    print(f"REJECTED: {dept} Rs {budget} Cr — duplicate")
    continue

  # REJECT: Empty/placeholder schemes
  if (scheme and
      not data.get("eligibility") and
      not data.get("department") and
      not data.get("brief")):
    sb.table("admin_queue").update({
      "status": "rejected",
      "reviewer_notes": "Rejected: Scheme name only, "
        "no meaningful data fields populated. "
        "Cannot publish without context."
    }).eq("id", item["id"]).execute()
    rejected += 1
    print(f"REJECTED: scheme '{scheme}' empty")
    continue

  # REJECT: Placeholder values like "active|discontinued"
  status_val = data.get("status", "")
  if "|" in str(status_val) or scheme == "":
    sb.table("admin_queue").update({
      "status": "rejected",
      "reviewer_notes": "Rejected: Placeholder template "
        "values not real data. Groq returned schema "
        "instead of extracted content."
    }).eq("id", item["id"]).execute()
    rejected += 1
    print(f"REJECTED: placeholder values")
    continue

  # Default: leave pending, ask for human review
  print(f"UNCHANGED: {source} — {str(data)[:80]}")

print(f"\nSummary:")
print(f"  Approved: {approved}")
print(f"  Rejected: {rejected}")

# Final queue summary
all_items = sb.table("admin_queue").select(
  "status"
).execute()
from collections import Counter
status_counts = Counter(
  i["status"] for i in all_items.data
)
print(f"\nFinal queue:")
for status, count in status_counts.items():
  print(f"  {status}: {count}")
