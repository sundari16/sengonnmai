from supabase import create_client
import os, json
from dotenv import load_dotenv
load_dotenv(dotenv_path=".env.local")

sb = create_client(
  os.environ["NEXT_PUBLIC_SUPABASE_URL"],
  os.environ["SUPABASE_SERVICE_ROLE_KEY"]
)

items = sb.table("admin_queue").select(
  "id, pipeline_name, data, created_at, status"
).eq("status", "pending_review").order(
  "created_at", desc=True
).limit(20).execute()

print(f"Pending review: {len(items.data)} items")
print("=" * 50)
for item in items.data:
  print(f"\nSource: {item['pipeline_name']}")
  print(f"Data: {json.dumps(item['data'])}")
