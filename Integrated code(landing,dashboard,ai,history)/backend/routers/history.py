from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
import os, sqlite3, uuid, json
from datetime import datetime
from config import DB_PATH

from collections import defaultdict
import sqlite3, json
from fastapi import APIRouter
from config import DB_PATH

router = APIRouter()

# === Paths ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "uploads"))
DB_PATH = os.path.join(UPLOAD_DIR, "history.db")

# === Ensure upload dir exists ===
os.makedirs(UPLOAD_DIR, exist_ok=True)

# === Init DB ===
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS predictions (
    id TEXT PRIMARY KEY,
    filename TEXT,
    car_model TEXT,
    predicted_cost REAL,
    manual_cost REAL,
    breakdown_json TEXT,
    img_parts_path TEXT,
    img_severity_path TEXT,
    timestamp TEXT
)
""")
conn.commit()


# === Save prediction from GenerateReport.tsx ===
@router.post("/upload")
async def save_prediction(
    car_model: str = Form(...),
    predicted_cost: float = Form(...),
    manual_cost: float = Form(...),
    breakdown_json: str = Form(...),
    img_parts: UploadFile = File(...),
    img_severity: UploadFile = File(...)
):
    try:
        pred_id = str(uuid.uuid4())
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Save images
        parts_path = os.path.join(UPLOAD_DIR, f"{pred_id}_parts.png")
        severity_path = os.path.join(UPLOAD_DIR, f"{pred_id}_severity.png")

        with open(parts_path, "wb") as f:
            f.write(await img_parts.read())
        with open(severity_path, "wb") as f:
            f.write(await img_severity.read())

        # Save metadata
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO predictions (
                    id, filename, car_model, predicted_cost, manual_cost,
                    breakdown_json, img_parts_path, img_severity_path, timestamp
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                pred_id, img_parts.filename, car_model, predicted_cost, manual_cost,
                breakdown_json, parts_path, severity_path, timestamp
            ))
            conn.commit()

        return {"message": "✅ Prediction saved", "id": pred_id}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


# === Fetch all predictions for History.tsx ===
@router.get("/")
def get_history():
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, car_model, predicted_cost, manual_cost,
                       img_parts_path, img_severity_path, timestamp
                FROM predictions GROUP BY id ORDER BY timestamp DESC
            """)
            rows = cursor.fetchall()

        result = []
        for row in rows:
            prediction_id, model, pred_cost, man_cost, parts_path, severity_path, ts = row
            result.append({
                "id": prediction_id,
                "car_model": model,
                "predicted_cost": int(pred_cost),
                "manual_cost": int(man_cost),
                "timestamp": ts,
                "part_image_url": "/uploads/" + os.path.basename(parts_path),
                "severity_image_url": "/uploads/" + os.path.basename(severity_path),
            })

        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    
@router.get("/severity-distribution")
def get_severity_distribution():
    try:
        with sqlite3.connect(DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT breakdown_json FROM predictions")
            rows = cursor.fetchall()

        severity_counts = {"Minor": 0, "Moderate": 0, "Severe": 0}

        for row in rows:
            try:
                breakdown = json.loads(row["breakdown_json"])
                if isinstance(breakdown, list):
                    for item in breakdown:
                        severity = item.get("severity", "").lower()
                        if severity == "minor":
                            severity_counts["Minor"] += 1
                        elif severity == "moderate":
                            severity_counts["Moderate"] += 1
                        elif severity == "severe":
                            severity_counts["Severe"] += 1
            except Exception:
                continue  # skip bad rows

        return [
            { "name": "Minor", "value": severity_counts["Minor"] },
            { "name": "Moderate", "value": severity_counts["Moderate"] },
            { "name": "Severe", "value": severity_counts["Severe"] },
        ]

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

#         with sqlite3.connect(DB_PATH) as conn:
#             conn.row_factory = sqlite3.Row
#             cursor = conn.cursor()

#             # Total claims today
#             cursor.execute("SELECT COUNT(*) FROM predictions WHERE DATE(timestamp) = ?", (today,))
#             claims_today = cursor.fetchone()[0]

#             # Fetch all breakdowns
#             cursor.execute("SELECT breakdown_json FROM predictions")
#             damage_rows = cursor.fetchall()

#         # Initialize counters
#         damage_counter = {}
#         severity_counter = {"minor": 0, "moderate": 0, "severe": 0}

#         for row in damage_rows:
#             breakdown_raw = row["breakdown_json"]
#             try:
#                 breakdown_list = json.loads(breakdown_raw)
#             except:
#                 continue
#             if isinstance(breakdown_list, list):
#                 for item in breakdown_list:
#                     part = item.get("part")
#                     severity = item.get("severity")
#                     if part:
#                         damage_counter[part] = damage_counter.get(part, 0) + 1
#                     if severity:
#                         severity_counter[severity.lower()] += 1

#         # Find top part and top severity
#         top_part = max(damage_counter, key=damage_counter.get) if damage_counter else None
#         top_severity = max(severity_counter, key=severity_counter.get) if any(severity_counter.values()) else None

#         # Total estimated repair cost today
#         with sqlite3.connect(DB_PATH) as conn:
#             cursor = conn.cursor()
#             cursor.execute("SELECT SUM(predicted_cost) FROM predictions WHERE DATE(timestamp) = ?", (today,))
#             total_cost = cursor.fetchone()[0] or 0

#         return {
#             "claimsToday": claims_today,
#             "topPart": top_part,
#             "topSeverity": top_severity.capitalize() if top_severity else None,
#             "repairCostToday": int(total_cost)
#         }
#     except Exception as e:
#         return JSONResponse(status_code=500, content={"error": str(e)})


@router.get("/dashboard-overview")
def dashboard_overview():
    try:
        today = datetime.now().strftime("%Y-%m-%d")

        # === For Predictions ===
        with sqlite3.connect(DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()

            # Total AI claims today
            cursor.execute("SELECT COUNT(*) FROM predictions WHERE DATE(timestamp) = ?", (today,))
            ai_claims_today = cursor.fetchone()[0]

            # Total AI repair cost today
            cursor.execute("SELECT SUM(predicted_cost) FROM predictions WHERE DATE(timestamp) = ?", (today,))
            ai_total_cost = cursor.fetchone()[0] or 0

            # Fetch damage breakdown
            cursor.execute("SELECT breakdown_json FROM predictions")
            damage_rows = cursor.fetchall()

        # Initialize counters
        damage_counter = {}
        severity_counter = {"minor": 0, "moderate": 0, "severe": 0}

        for row in damage_rows:
            breakdown_raw = row["breakdown_json"]
            try:
                breakdown_list = json.loads(breakdown_raw)
            except:
                continue
            if isinstance(breakdown_list, list):
                for item in breakdown_list:
                    part = item.get("part")
                    severity = item.get("severity")
                    if part:
                        damage_counter[part] = damage_counter.get(part, 0) + 1
                    if severity:
                        severity_counter[severity.lower()] += 1

        top_part = max(damage_counter, key=damage_counter.get) if damage_counter else None
        top_severity = max(severity_counter, key=severity_counter.get) if any(severity_counter.values()) else None

        # === For Manual Claims ===
        manual_claims_today = 0
        manual_claims_cost_today = 0
        manual_db_path = os.path.join(BASE_DIR, "history.db")  # your claims are saved in the same history.db
        with sqlite3.connect(manual_db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM claims WHERE DATE(date_time) = ?", (today,))
            manual_claims_today = cursor.fetchone()[0]

            cursor.execute("SELECT SUM(claim_paid_amount) FROM claims WHERE DATE(date_time) = ?", (today,))
            manual_claims_cost_today = cursor.fetchone()[0] or 0

        # === Final Combined KPIs ===
        total_claims_today = ai_claims_today + manual_claims_today
        total_repair_cost_today = ai_total_cost + manual_claims_cost_today

        return {
            "claimsToday": total_claims_today,
            "topPart": top_part,
            "topSeverity": top_severity.capitalize() if top_severity else None,
            "repairCostToday": int(total_repair_cost_today)
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})



PART_CLASSES = [
    'car', 'RunningBoard-Dent', 'Sidemirror-Damage', 'damaged-head-light',
    'damaged-hood', 'damaged_bumper', 'damaged_door', 'damaged_fender',
    'damaged_trunk', 'missing_grille', 'shattered-glass'
]

@router.get("/damage-parts-over-time")
def damage_parts_over_time():
    try:
        with sqlite3.connect(DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT timestamp, breakdown_json FROM predictions")
            rows = cursor.fetchall()

        from collections import defaultdict, Counter
        daily_counts = defaultdict(lambda: defaultdict(int))
        total_counts = Counter()

        for row in rows:
            try:
                date_raw = row["timestamp"]
                date_str = date_raw[:10] if isinstance(date_raw, str) else str(date_raw)

                breakdown = json.loads(row["breakdown_json"])
                if isinstance(breakdown, list):
                    for item in breakdown:
                        part = item.get("part")
                        if part in PART_CLASSES:
                            daily_counts[date_str][part] += 1
                            total_counts[part] += 1
            except Exception as inner_err:
                print("⚠️ Skipping row due to error:", inner_err)
                continue

        # 🔥 Get top 5 most frequent parts overall
        top_parts = [part for part, _ in total_counts.most_common(5)]

        result = []
        for date in sorted(daily_counts.keys()):
            entry = {"date": date}
            for part in top_parts:
                entry[part] = daily_counts[date].get(part, 0)
            result.append(entry)

        return result

    except Exception as e:
        print("🔥 ERROR in damage_parts_over_time:", e)
        return JSONResponse(status_code=500, content={"error": str(e)})
