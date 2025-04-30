from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import sqlite3
import os
from fastapi import Form, File, UploadFile, Query
from fastapi import APIRouter, HTTPException, Form, File, UploadFile, Query
import sqlite3
import os
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from fastapi import APIRouter
import sqlite3
from config import DB_PATH
from datetime import datetime
router = APIRouter()  # 👈 This is the missing piece



# === CORS Config (adjust frontend URL if needed) ===

# === Local Persistent Paths ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "history.db")

# === Create DB + Table if not exists ===
def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS claims (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                policy_no TEXT, vehicle_make TEXT, vehicle_model TEXT, vehicle_color TEXT,
                engine_no TEXT, chassis_no TEXT, registration_no TEXT, year_of_manufacture INTEGER,
                policy_start_date TEXT, policy_end_date TEXT, vehicle_start_date TEXT, vehicle_end_date TEXT,
                claim_count INTEGER, claim_intimation_amount REAL, claim_paid_amount REAL,
                deductible_amount REAL, outstanding REAL,
                claim_type TEXT, branch TEXT, incident_date_time TEXT, incident_place TEXT,
                current_location TEXT, circumstances TEXT, missing_parts_details TEXT,
                workshop_type TEXT, vehicle_type TEXT, workshop_name TEXT, vehicle_availability TEXT,
                date_field TEXT, relation_with_insured TEXT, contact_person_name TEXT,
                contact_number TEXT, email TEXT, remarks TEXT, remarks2 TEXT, date_time TEXT
            )
        """)
        conn.commit()

init_db()

# === Pydantic Model ===
class Claim(BaseModel):
    policy_no: str
    vehicle_make: str
    vehicle_model: str
    vehicle_color: Optional[str] = None
    engine_no: Optional[str] = None
    chassis_no: Optional[str] = None
    registration_no: Optional[str] = None
    year_of_manufacture: Optional[int] = None
    policy_start_date: Optional[str]
    policy_end_date: Optional[str]
    vehicle_start_date: Optional[str]
    vehicle_end_date: Optional[str]
    claim_count: Optional[int] = 0
    claim_intimation_amount: Optional[float] = 0.0
    claim_paid_amount: Optional[float] = 0.0
    deductible_amount: Optional[float] = 0.0
    outstanding: Optional[float] = 0.0
    claim_type: str
    branch: str
    incident_date_time: str
    incident_place: str
    current_location: str
    circumstances: str
    missing_parts_details: str
    workshop_type: str
    vehicle_type: str
    workshop_name: str
    vehicle_availability: str
    date_field: str
    relation_with_insured: str
    contact_person_name: str
    contact_number: str
    email: EmailStr
    remarks: Optional[str]
    remarks2: Optional[str]
    date_time: str

# === Date Normalization ===
def normalize_date(date_str):
    try:
        if "/" in date_str:
            day, month, year = date_str.split("/")[:3]
            return f"{year}-{month.zfill(2)}-{day.zfill(2)}"
        return date_str
    except:
        return date_str

# === Save Claim ===
@router.post("/")
def submit_claim(claim: Claim):
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()

            def safe(date): return normalize_date(date) if date else None

            cursor.execute("""
                INSERT INTO claims (
                    policy_no, vehicle_make, vehicle_model, vehicle_color, engine_no, chassis_no,
                    registration_no, year_of_manufacture, policy_start_date, policy_end_date,
                    vehicle_start_date, vehicle_end_date, claim_count, claim_intimation_amount,
                    claim_paid_amount, deductible_amount, outstanding, claim_type, branch,
                    incident_date_time, incident_place, current_location, circumstances,
                    missing_parts_details, workshop_type, vehicle_type, workshop_name,
                    vehicle_availability, date_field, relation_with_insured, contact_person_name,
                    contact_number, email, remarks, remarks2, date_time
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                claim.policy_no, claim.vehicle_make, claim.vehicle_model, claim.vehicle_color,
                claim.engine_no, claim.chassis_no, claim.registration_no, claim.year_of_manufacture,
                safe(claim.policy_start_date), safe(claim.policy_end_date),
                safe(claim.vehicle_start_date), safe(claim.vehicle_end_date),
                claim.claim_count, claim.claim_intimation_amount, claim.claim_paid_amount,
                claim.deductible_amount, claim.outstanding, claim.claim_type, claim.branch,
                claim.incident_date_time, claim.incident_place, claim.current_location,
                claim.circumstances, claim.missing_parts_details, claim.workshop_type,
                claim.vehicle_type, claim.workshop_name, claim.vehicle_availability,
                safe(claim.date_field), claim.relation_with_insured, claim.contact_person_name,
                claim.contact_number, claim.email, claim.remarks, claim.remarks2,
                safe(claim.date_time)
            ))
            conn.commit()
        return {"message": "✅ Claim saved successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ Submission failed: {str(e)}")
    




# === Get Claims Summary ===
class ClaimOut(BaseModel):
    id: int
    claim_number: str
    contact_person_name: str
    date_time: str
    claim_paid_amount: float

class ClaimListResponse(BaseModel):
    total: int
    claims: List[ClaimOut]

@router.get("/", response_model=ClaimListResponse)
def get_claims():
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM claims ORDER BY id DESC")
        rows = cursor.fetchall()

    claims = []
    for row in rows:
        claim = dict(row)
        claim["claim_number"] = f"CLM-{claim['id']:03d}"
        claims.append({
            "id": claim["id"],
            "claim_number": claim["claim_number"],
            "contact_person_name": claim["contact_person_name"],
            "date_time": claim["date_time"],
            "claim_paid_amount": claim["claim_paid_amount"]
        })

    return {"total": len(claims), "claims": claims}
@router.post("/")
async def create_claim(
    draft: bool = Query(default=False),
    policyNo: str = Form(...),
    vehicleMake: str = Form(...),
    policyStartDate: str = Form(...),
    policyEndDate: str = Form(...),
    claimCount: str = Form(...),
    engineNo: str = Form(...),
    vehicleModel: str = Form(...),
    claimPaidAmount: float = Form(...),
    claimIntimationAmount: float = Form(...),
    chassisNo: str = Form(...),
    vehicleColor: str = Form(...),
    vehicleStartDate: str = Form(...),
    vehicleEndDate: str = Form(...),
    deductibleAmount: float = Form(...),
    registrationNo: str = Form(...),
    yearOfManufacture: str = Form(...),
    outstanding: str = Form(...),
    branch: str = Form(...),
    incidentDatetime: str = Form(...),
    incidentPlace: str = Form(...),
    currentLocation: str = Form(...),
    circumstances: str = Form(...),
    missingPartsDetails: str = Form(...),
    workshopType: str = Form(...),
    vehicleType: str = Form(...),
    workshopName: str = Form(...),
    vehicleAvailability: str = Form(...),
    dateField: str = Form(...),
    relationWithInsured: str = Form(...),
    contactPersonName: str = Form(...),
    contactNumber: str = Form(...),
    email: EmailStr = Form(...),
    remarks: Optional[str] = Form(None),
    remarks2: Optional[str] = Form(None),
    dateTime: str = Form(...),
    registration_book: Optional[UploadFile] = File(None),
    driving_license: Optional[UploadFile] = File(None),
    roznamcha: Optional[UploadFile] = File(None),
    nic: Optional[UploadFile] = File(None),
):
    try:
        # 🛠 Correctly determine claim status based on paid amount
        status = "Draft" if draft else ("Approved" if claimPaidAmount <= 50000 else "Pending")

        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO claims (
                    policy_no, vehicle_make, vehicle_model, vehicle_color, engine_no, chassis_no,
                    registration_no, year_of_manufacture, policy_start_date, policy_end_date,
                    vehicle_start_date, vehicle_end_date, claim_count, claim_intimation_amount,
                    claim_paid_amount, deductible_amount, outstanding, claim_type, branch,
                    incident_date_time, incident_place, current_location, circumstances,
                    missing_parts_details, workshop_type, vehicle_type, workshop_name,
                    vehicle_availability, date_field, relation_with_insured, contact_person_name,
                    contact_number, email, remarks, remarks2, date_time
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                policyNo, vehicleMake, vehicleModel, vehicleColor, engineNo, chassisNo,
                registrationNo, yearOfManufacture, policyStartDate, policyEndDate,
                vehicleStartDate, vehicleEndDate, claimCount, claimIntimationAmount,
                claimPaidAmount, deductibleAmount, outstanding, status, branch,  # 👈 Save computed status
                incidentDatetime, incidentPlace, currentLocation, circumstances,
                missingPartsDetails, workshopType, vehicleType, workshopName,
                vehicleAvailability, dateField, relationWithInsured, contactPersonName,
                contactNumber, email, remarks, remarks2, dateTime
            ))
            conn.commit()

        return {"message": f"✅ Claim submitted with status: {status}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ Error: {str(e)}")

# ... your routes here ...
@router.get("/dashboard-stats")
def get_dashboard_stats():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()

        # Example aggregation queries (customize these as needed)
        cursor.execute("SELECT vehicle_model, COUNT(*) FROM claims GROUP BY vehicle_model ORDER BY COUNT(*) DESC LIMIT 5")
        top_models = cursor.fetchall()

        cursor.execute("SELECT strftime('%m', date_time), AVG(claim_paid_amount), AVG(claim_intimation_amount) FROM claims GROUP BY strftime('%m', date_time)")
        cost_delta = cursor.fetchall()

        cursor.execute("SELECT vehicle_model, COUNT(*) FILTER (WHERE claim_type='minor'), COUNT(*) FILTER (WHERE claim_type='moderate'), COUNT(*) FILTER (WHERE claim_type='major') FROM claims GROUP BY vehicle_model")
        repair_freq = cursor.fetchall()

        return {
            "topClaimedModels": [{"name": m[0], "value": m[1]} for m in top_models],
            "costDelta": [{"name": f"Month {i+1}", "predicted": c[1], "actual": c[2]} for i, c in enumerate(cost_delta)],
            "repairFrequency": [{"name": r[0], "week1": r[1], "week2": r[2], "week3": r[1], "week4": r[2]} for r in repair_freq],
        }

# Export the router
__all__ = ["router"]

@router.get("/claims-over-time")
def get_claims_over_time():
    try:
        with sqlite3.connect(DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()

            cursor.execute("""
                SELECT 
                    strftime('%Y-%m', date_time) AS month_year,
                    claim_type,
                    COUNT(*) as total
                FROM claims
                WHERE claim_type IS NOT NULL
                GROUP BY month_year, claim_type
                ORDER BY month_year ASC
            """)
            rows = cursor.fetchall()

        monthly_data = {}

        for row in rows:
            month_key = row['month_year']
            if month_key not in monthly_data:
                monthly_data[month_key] = {"Approved": 0, "Pending": 0, "Rejected": 0}

            status_raw = row['claim_type']
            if not status_raw:
                continue

            status = status_raw.capitalize()
            if status not in ["Approved", "Pending", "Rejected"]:
                continue

            monthly_data[month_key][status] += row['total']

        # Now reformat for frontend
        result = []
        for month_key, statuses in monthly_data.items():
            month_name = datetime.strptime(month_key, "%Y-%m").strftime("%b %Y")  # like "Apr 2025"
            result.append({
                "name": month_name,
                "Approved": statuses["Approved"],
                "Pending": statuses["Pending"],
                "Rejected": statuses["Rejected"],
            })

        return result

    except Exception as e:
        return {"error": str(e)}
    

    from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import sqlite3
import os
from fastapi import Form, File, UploadFile, Query
from fastapi import APIRouter, HTTPException, Form, File, UploadFile, Query
import sqlite3
import os
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from fastapi import APIRouter
import sqlite3
from config import DB_PATH
from datetime import datetime
router = APIRouter()  # 👈 This is the missing piece



# === CORS Config (adjust frontend URL if needed) ===

# === Local Persistent Paths ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "history.db")

# === Create DB + Table if not exists ===
def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS claims (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                policy_no TEXT, vehicle_make TEXT, vehicle_model TEXT, vehicle_color TEXT,
                engine_no TEXT, chassis_no TEXT, registration_no TEXT, year_of_manufacture INTEGER,
                policy_start_date TEXT, policy_end_date TEXT, vehicle_start_date TEXT, vehicle_end_date TEXT,
                claim_count INTEGER, claim_intimation_amount REAL, claim_paid_amount REAL,
                deductible_amount REAL, outstanding REAL,
                claim_type TEXT, branch TEXT, incident_date_time TEXT, incident_place TEXT,
                current_location TEXT, circumstances TEXT, missing_parts_details TEXT,
                workshop_type TEXT, vehicle_type TEXT, workshop_name TEXT, vehicle_availability TEXT,
                date_field TEXT, relation_with_insured TEXT, contact_person_name TEXT,
                contact_number TEXT, email TEXT, remarks TEXT, remarks2 TEXT, date_time TEXT
            )
        """)
        conn.commit()

init_db()

# === Pydantic Model ===
class Claim(BaseModel):
    policy_no: str
    vehicle_make: str
    vehicle_model: str
    vehicle_color: Optional[str] = None
    engine_no: Optional[str] = None
    chassis_no: Optional[str] = None
    registration_no: Optional[str] = None
    year_of_manufacture: Optional[int] = None
    policy_start_date: Optional[str]
    policy_end_date: Optional[str]
    vehicle_start_date: Optional[str]
    vehicle_end_date: Optional[str]
    claim_count: Optional[int] = 0
    claim_intimation_amount: Optional[float] = 0.0
    claim_paid_amount: Optional[float] = 0.0
    deductible_amount: Optional[float] = 0.0
    outstanding: Optional[float] = 0.0
    claim_type: str
    branch: str
    incident_date_time: str
    incident_place: str
    current_location: str
    circumstances: str
    missing_parts_details: str
    workshop_type: str
    vehicle_type: str
    workshop_name: str
    vehicle_availability: str
    date_field: str
    relation_with_insured: str
    contact_person_name: str
    contact_number: str
    email: EmailStr
    remarks: Optional[str]
    remarks2: Optional[str]
    date_time: str

# === Date Normalization ===
def normalize_date(date_str):
    try:
        if "/" in date_str:
            day, month, year = date_str.split("/")[:3]
            return f"{year}-{month.zfill(2)}-{day.zfill(2)}"
        return date_str
    except:
        return date_str

# === Save Claim ===
@router.post("/")
def submit_claim(claim: Claim):
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()

            def safe(date): return normalize_date(date) if date else None

            cursor.execute("""
                INSERT INTO claims (
                    policy_no, vehicle_make, vehicle_model, vehicle_color, engine_no, chassis_no,
                    registration_no, year_of_manufacture, policy_start_date, policy_end_date,
                    vehicle_start_date, vehicle_end_date, claim_count, claim_intimation_amount,
                    claim_paid_amount, deductible_amount, outstanding, claim_type, branch,
                    incident_date_time, incident_place, current_location, circumstances,
                    missing_parts_details, workshop_type, vehicle_type, workshop_name,
                    vehicle_availability, date_field, relation_with_insured, contact_person_name,
                    contact_number, email, remarks, remarks2, date_time
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                claim.policy_no, claim.vehicle_make, claim.vehicle_model, claim.vehicle_color,
                claim.engine_no, claim.chassis_no, claim.registration_no, claim.year_of_manufacture,
                safe(claim.policy_start_date), safe(claim.policy_end_date),
                safe(claim.vehicle_start_date), safe(claim.vehicle_end_date),
                claim.claim_count, claim.claim_intimation_amount, claim.claim_paid_amount,
                claim.deductible_amount, claim.outstanding, claim.claim_type, claim.branch,
                claim.incident_date_time, claim.incident_place, claim.current_location,
                claim.circumstances, claim.missing_parts_details, claim.workshop_type,
                claim.vehicle_type, claim.workshop_name, claim.vehicle_availability,
                safe(claim.date_field), claim.relation_with_insured, claim.contact_person_name,
                claim.contact_number, claim.email, claim.remarks, claim.remarks2,
                safe(claim.date_time)
            ))
            conn.commit()
        return {"message": "✅ Claim saved successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ Submission failed: {str(e)}")
    




# === Get Claims Summary ===
class ClaimOut(BaseModel):
    id: int
    claim_number: str
    contact_person_name: str
    date_time: str
    claim_paid_amount: float

class ClaimListResponse(BaseModel):
    total: int
    claims: List[ClaimOut]

@router.get("/", response_model=ClaimListResponse)
def get_claims():
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM claims ORDER BY id DESC")
        rows = cursor.fetchall()

    claims = []
    for row in rows:
        claim = dict(row)
        claim["claim_number"] = f"CLM-{claim['id']:03d}"
        claims.append({
            "id": claim["id"],
            "claim_number": claim["claim_number"],
            "contact_person_name": claim["contact_person_name"],
            "date_time": claim["date_time"],
            "claim_paid_amount": claim["claim_paid_amount"]
        })

    return {"total": len(claims), "claims": claims}
@router.post("/")
async def create_claim(
    draft: bool = Query(default=False),
    policyNo: str = Form(...),
    vehicleMake: str = Form(...),
    policyStartDate: str = Form(...),
    policyEndDate: str = Form(...),
    claimCount: str = Form(...),
    engineNo: str = Form(...),
    vehicleModel: str = Form(...),
    claimPaidAmount: float = Form(...),
    claimIntimationAmount: float = Form(...),
    chassisNo: str = Form(...),
    vehicleColor: str = Form(...),
    vehicleStartDate: str = Form(...),
    vehicleEndDate: str = Form(...),
    deductibleAmount: float = Form(...),
    registrationNo: str = Form(...),
    yearOfManufacture: str = Form(...),
    outstanding: str = Form(...),
    branch: str = Form(...),
    incidentDatetime: str = Form(...),
    incidentPlace: str = Form(...),
    currentLocation: str = Form(...),
    circumstances: str = Form(...),
    missingPartsDetails: str = Form(...),
    workshopType: str = Form(...),
    vehicleType: str = Form(...),
    workshopName: str = Form(...),
    vehicleAvailability: str = Form(...),
    dateField: str = Form(...),
    relationWithInsured: str = Form(...),
    contactPersonName: str = Form(...),
    contactNumber: str = Form(...),
    email: EmailStr = Form(...),
    remarks: Optional[str] = Form(None),
    remarks2: Optional[str] = Form(None),
    dateTime: str = Form(...),
    registration_book: Optional[UploadFile] = File(None),
    driving_license: Optional[UploadFile] = File(None),
    roznamcha: Optional[UploadFile] = File(None),
    nic: Optional[UploadFile] = File(None),
):
    try:
        # 🛠 Correctly determine claim status based on paid amount
        status = "Draft" if draft else ("Approved" if claimPaidAmount <= 50000 else "Pending")

        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO claims (
                    policy_no, vehicle_make, vehicle_model, vehicle_color, engine_no, chassis_no,
                    registration_no, year_of_manufacture, policy_start_date, policy_end_date,
                    vehicle_start_date, vehicle_end_date, claim_count, claim_intimation_amount,
                    claim_paid_amount, deductible_amount, outstanding, claim_type, branch,
                    incident_date_time, incident_place, current_location, circumstances,
                    missing_parts_details, workshop_type, vehicle_type, workshop_name,
                    vehicle_availability, date_field, relation_with_insured, contact_person_name,
                    contact_number, email, remarks, remarks2, date_time
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                policyNo, vehicleMake, vehicleModel, vehicleColor, engineNo, chassisNo,
                registrationNo, yearOfManufacture, policyStartDate, policyEndDate,
                vehicleStartDate, vehicleEndDate, claimCount, claimIntimationAmount,
                claimPaidAmount, deductibleAmount, outstanding, status, branch,  # 👈 Save computed status
                incidentDatetime, incidentPlace, currentLocation, circumstances,
                missingPartsDetails, workshopType, vehicleType, workshopName,
                vehicleAvailability, dateField, relationWithInsured, contactPersonName,
                contactNumber, email, remarks, remarks2, dateTime
            ))
            conn.commit()

        return {"message": f"✅ Claim submitted with status: {status}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ Error: {str(e)}")

# ... your routes here ...
@router.get("/dashboard-stats")
def get_dashboard_stats():
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()

        # Example aggregation queries (customize these as needed)
        cursor.execute("SELECT vehicle_model, COUNT(*) FROM claims GROUP BY vehicle_model ORDER BY COUNT(*) DESC LIMIT 5")
        top_models = cursor.fetchall()

        cursor.execute("SELECT strftime('%m', date_time), AVG(claim_paid_amount), AVG(claim_intimation_amount) FROM claims GROUP BY strftime('%m', date_time)")
        cost_delta = cursor.fetchall()

        cursor.execute("SELECT vehicle_model, COUNT(*) FILTER (WHERE claim_type='minor'), COUNT(*) FILTER (WHERE claim_type='moderate'), COUNT(*) FILTER (WHERE claim_type='major') FROM claims GROUP BY vehicle_model")
        repair_freq = cursor.fetchall()

        return {
            "topClaimedModels": [{"name": m[0], "value": m[1]} for m in top_models],
            "costDelta": [{"name": f"Month {i+1}", "predicted": c[1], "actual": c[2]} for i, c in enumerate(cost_delta)],
            "repairFrequency": [{"name": r[0], "week1": r[1], "week2": r[2], "week3": r[1], "week4": r[2]} for r in repair_freq],
        }

# Export the router
__all__ = ["router"]

@router.get("/claims-over-time")
def get_claims_over_time():
    try:
        with sqlite3.connect(DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()

            cursor.execute("""
                SELECT 
                    strftime('%Y-%m', date_time) AS month_year,
                    claim_type,
                    COUNT(*) as total
                FROM claims
                WHERE claim_type IS NOT NULL
                GROUP BY month_year, claim_type
                ORDER BY month_year ASC
            """)
            rows = cursor.fetchall()

        monthly_data = {}

        for row in rows:
            month_key = row['month_year']
            if month_key not in monthly_data:
                monthly_data[month_key] = {"Approved": 0, "Pending": 0, "Rejected": 0}

            status_raw = row['claim_type']
            if not status_raw:
                continue

            status = status_raw.capitalize()
            if status not in ["Approved", "Pending", "Rejected"]:
                continue

            monthly_data[month_key][status] += row['total']

        # Now reformat for frontend
        result = []
        for month_key, statuses in monthly_data.items():
            month_name = datetime.strptime(month_key, "%Y-%m").strftime("%b %Y")  # like "Apr 2025"
            result.append({
                "name": month_name,
                "Approved": statuses["Approved"],
                "Pending": statuses["Pending"],
                "Rejected": statuses["Rejected"],
            })

        return result

    except Exception as e:
        return {"error": str(e)}
@router.get("/claims-distribution")
def get_claims_distribution():
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("""
            SELECT 
                CASE 
                    WHEN LOWER(claim_type) LIKE '%approved%' THEN 'Approved'
                    WHEN LOWER(claim_type) LIKE '%pending%' THEN 'Pending'
                    WHEN LOWER(claim_type) LIKE '%rejected%' THEN 'Rejected'
                    ELSE 'Other'
                END AS normalized_type,
                COUNT(*) as total
            FROM claims
            WHERE claim_type IS NOT NULL
            GROUP BY normalized_type
        """)
        rows = cursor.fetchall()

    return [{"name": row["normalized_type"], "value": row["total"]} for row in rows]
