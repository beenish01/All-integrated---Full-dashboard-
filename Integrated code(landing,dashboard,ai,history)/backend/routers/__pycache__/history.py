from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from datetime import datetime
import os, uuid, base64, json, sqlite3

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "uploads"))
DB_PATH = os.path.join(UPLOAD_DIR, "history.db")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ✅ Initialize DB
def init_db():
    with sqlite3.connect(DB_PATH) as conn:
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

init_db()

# ✅ Save endpoint from Colab
@router.post("/api/history/save")
async def save_history(
    image: UploadFile = File(...),
    car_model: str = Form(...),
    predicted_cost: float = Form(...),
    manual_cost: float = Form(...),
    breakdown: str = Form(...),
    part_image_base64: str = Form(...),
    severity_image_base64: str = Form(...)
):
    try:
        prediction_id = uuid.uuid4().hex
        timestamp = datetime.now().isoformat()

        original_path = os.path.join(UPLOAD_DIR, f"{prediction_id}_{image.filename}")
        with open(original_path, "wb") as f:
            f.write(await image.read())

        img_parts_path = os.path.join(UPLOAD_DIR, f"{prediction_id}_parts.jpg")
        img_severity_path = os.path.join(UPLOAD_DIR, f"{prediction_id}_severity.jpg")

        with open(img_parts_path, "wb") as f:
            f.write(base64.b64decode(part_image_base64))
        with open(img_severity_path, "wb") as f:
            f.write(base64.b64decode(severity_image_base64))

        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO predictions (
                    id, filename, car_model, predicted_cost, manual_cost,
                    breakdown_json, img_parts_path, img_severity_path, timestamp
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                prediction_id,
                os.path.basename(original_path),
                car_model,
                predicted_cost,
                manual_cost,
                breakdown,
                img_parts_path,
                img_severity_path,
                timestamp
            ))
            conn.commit()

        return {"message": "✅ Saved to local history!"}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ✅ History fetch endpoint
@router.get("/api/history")
def get_history():
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, car_model, predicted_cost, manual_cost,
                    img_parts_path, img_severity_path, timestamp
                FROM predictions ORDER BY timestamp DESC
            """)
            rows = cursor.fetchall()

        history = []
        for row in rows:
            prediction_id, model, pred_cost, man_cost, parts_img, sev_img, ts = row
            history.append({
                "id": prediction_id,
                "car_model": model,
                "predicted_cost": int(pred_cost),
                "manual_cost": int(man_cost),
                "timestamp": ts,
                "part_image_url": "/uploads/" + os.path.basename(parts_img),
                "severity_image_url": "/uploads/" + os.path.basename(sev_img)
            })

        return JSONResponse(content=history)

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
