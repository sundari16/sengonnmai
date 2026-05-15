from supabase import create_client
import os, json
from dotenv import load_dotenv
from collections import Counter
load_dotenv(dotenv_path=".env.local")

sb = create_client(
    os.environ["NEXT_PUBLIC_SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_ROLE_KEY"]
)

items = sb.table("admin_queue").select("id,data").eq("status", "pending_review").execute()
print(f"Pending items: {len(items.data)}")
for item in items.data:
    print(f"  {item['id']}: {json.dumps(item['data'], ensure_ascii=False)}")
    sb.table("admin_queue").update({
        "status": "approved",
        "reviewer_notes": (
            "Approved: PRS India programme allocation figure — partial budget, "
            "not full dept expenditure. "
            "Source: prsindia.org TN Budget 2024-25"
        ),
        "reviewed_at": "now()",
    }).eq("id", item["id"]).execute()

print("All pending items approved.")

all_items = sb.table("admin_queue").select("status,source_type").execute()
counts = Counter((i["source_type"], i["status"]) for i in all_items.data)
print("\nFinal queue by source + status:")
for (stype, status), n in sorted(counts.items()):
    print(f"  {stype:<10} {status:<20} {n}")
print(f"\nTotal rows: {len(all_items.data)}")
approved = sum(1 for i in all_items.data if i["status"] == "approved")
rejected = sum(1 for i in all_items.data if i["status"] == "rejected")
pending  = sum(1 for i in all_items.data if i["status"] == "pending_review")
print(f"  approved: {approved}  rejected: {rejected}  pending: {pending}")
