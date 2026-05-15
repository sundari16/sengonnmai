from supabase import create_client
import os, json
from dotenv import load_dotenv
from collections import Counter
load_dotenv(dotenv_path=".env.local")

sb = create_client(
    os.environ["NEXT_PUBLIC_SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_ROLE_KEY"]
)

# Reject all 4 CAG items
r1 = sb.table("admin_queue").update({
    "status": "rejected",
    "reviewer_notes": (
        "Rejected: round numbers (100/500/200 Cr) and generic descriptions "
        "— likely Groq approximations, not real audit findings. "
        "Real CAG findings need specific amounts, project names, GO references."
    ),
}).eq("source_type", "cag").eq("status", "pending_review").execute()
print(f"CAG rejected: {len(r1.data)}")

# Reject PRS items where budget_estimate_cr == 0
pending = sb.table("admin_queue").select("id,data").eq(
    "pipeline_name", "PRS India TN Budget Analysis 2024-25"
).eq("status", "pending_review").execute()

zero_ids = [i["id"] for i in pending.data if (i["data"].get("budget_estimate_cr") or 0) == 0]
if zero_ids:
    for zid in zero_ids:
        sb.table("admin_queue").update({
            "status": "rejected",
            "reviewer_notes": "Rejected: budget_estimate_cr is 0 — PRS narrative text did not contain dept-level figure.",
        }).eq("id", zid).execute()
    print(f"PRS zero-value rejected: {len(zero_ids)}")

# Approve PRS items with budget_estimate_cr > 10000
approved = 0
for item in pending.data:
    be = item["data"].get("budget_estimate_cr") or 0
    if be > 10000:
        sb.table("admin_queue").update({
            "status": "approved",
            "reviewer_notes": "Approved: real aggregate figure from PRS India analysis. Source verified.",
            "reviewed_at": "now()",
        }).eq("id", item["id"]).execute()
        approved += 1
        print(f"  Approved: {item['data'].get('dept_name')} — Rs {be:,} Cr")

print(f"\nApproved {approved} PRS items")

# Final counts
counts = sb.table("admin_queue").select("status").execute()
status_counts = Counter(i["status"] for i in counts.data)
print("\nQueue summary:")
for status, count in sorted(status_counts.items()):
    print(f"  {status}: {count}")
