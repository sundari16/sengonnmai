from supabase import create_client
import os, json
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone

load_dotenv(dotenv_path=".env.local")

sb = create_client(
  os.environ["NEXT_PUBLIC_SUPABASE_URL"],
  os.environ["SUPABASE_SERVICE_ROLE_KEY"]
)

# ── TASK A: Save DDL fix ──────────────────────────────────────────────────────
sql = """ALTER TABLE admin_queue
ALTER COLUMN status SET DEFAULT 'pending_review';
"""
os.makedirs("etl", exist_ok=True)
with open("etl/fix_status_default.sql", "w") as f:
    f.write(sql)
print("SQL saved to etl/fix_status_default.sql")
print("Run this in Supabase SQL Editor:")
print(sql)

# ── TASK B: Revert auto-approved items ───────────────────────────────────────
yesterday = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()

recent_approved = sb.table("admin_queue").select(
    "id, pipeline_name, data, status, reviewer_notes"
).eq("status", "approved").is_(
    "reviewer_notes", "null"
).gte("created_at", yesterday).execute()

print(f"Found {len(recent_approved.data)} auto-approved items to revert")

for item in recent_approved.data:
    print(f"  {item['pipeline_name']}: {str(item['data'])[:60]}")
    sb.table("admin_queue").update({
        "status": "pending_review",
        "reviewer_notes": "Reverted: was auto-approved due to DB default bug. Requires proper review."
    }).eq("id", item["id"]).execute()

# ── TASK C: Show pending items ────────────────────────────────────────────────
pending = sb.table("admin_queue").select(
    "id, pipeline_name, data"
).eq("status", "pending_review").execute()

print(f"\nNow pending review: {len(pending.data)} items")
print("\nShow me each pending item:")
for item in pending.data:
    print(f"\n{item['pipeline_name']}")
    print(f"  Data: {json.dumps(item['data'], ensure_ascii=False)}")
