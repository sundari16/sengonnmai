"""Run once to reject known-bad items from first pipeline run."""
from supabase import create_client
import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=".env.local")

sb = create_client(
    os.environ["NEXT_PUBLIC_SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_ROLE_KEY"]
)

# Reject RBI items (extracted from 4 chars — hallucinated)
r1 = sb.table("admin_queue").update({
    "status": "rejected",
    "reviewer_notes": (
        "Auto-rejected: extracted from 4 chars of stripped HTML. "
        "RBI DBIE is JS-rendered; content was empty after stripping. "
        "Items are Groq hallucinations."
    ),
}).eq("pipeline_name", "RBI DBIE State Finances").eq("status", "pending_review").execute()
print(f"Rejected RBI items: {len(r1.data)}")

# Reject the connection test row
r2 = sb.table("admin_queue").update({
    "status": "rejected",
    "reviewer_notes": "Auto-rejected: connection test row.",
}).eq("pipeline_name", "connection test").eq("status", "pending_review").execute()
print(f"Rejected test items: {len(r2.data)}")

# Show what remains
remaining = sb.table("admin_queue").select(
    "pipeline_name,status,data"
).eq("status", "pending_review").execute()
print(f"\nRemaining pending: {len(remaining.data)} items")
for item in remaining.data:
    print(f"  [{item['pipeline_name']}] {str(item['data'])[:100]}")
