from supabase import create_client
import os, json
from dotenv import load_dotenv
from collections import Counter
load_dotenv(dotenv_path=".env.local")

sb = create_client(
    os.environ["NEXT_PUBLIC_SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_ROLE_KEY"]
)

# ── Overview ──────────────────────────────────────────────────────────────────
all_items = sb.table("admin_queue").select("id,source_type,pipeline_name,status,data").execute()
status_counts = Counter(r["status"] for r in all_items.data)
print("=== Queue overview ===")
print(f"Total rows: {len(all_items.data)}")
print("By status:", dict(status_counts))
print("By pipeline:")
by_pipeline = Counter(r["pipeline_name"] for r in all_items.data)
for k, v in by_pipeline.most_common():
    print(f"  {v:3}  {k}")

# ── PRS + CAG items ───────────────────────────────────────────────────────────
print("\n=== PRS Budget items ===")
prs = [r for r in all_items.data if r["pipeline_name"] == "PRS India TN Budget Analysis 2024-25"]
for item in prs:
    print(f"[{item['status']}] {json.dumps(item['data'], ensure_ascii=False)}")

print("\n=== CAG items ===")
cag = [r for r in all_items.data if r["pipeline_name"] == "CAG Audit Reports TN"]
for item in cag:
    print(f"[{item['status']}] {json.dumps(item['data'], ensure_ascii=False)}")

# ── RBI items (to be rejected) ────────────────────────────────────────────────
print("\n=== RBI items (hallucinated) ===")
rbi = [r for r in all_items.data if r["pipeline_name"] == "RBI DBIE State Finances"]
print(f"Count: {len(rbi)}")
for item in rbi[:5]:
    print(f"  {json.dumps(item['data'], ensure_ascii=False)[:120]}")
if len(rbi) > 5:
    print(f"  ... and {len(rbi)-5} more")
