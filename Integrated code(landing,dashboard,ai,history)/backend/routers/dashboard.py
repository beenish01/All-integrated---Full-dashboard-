from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import sqlite3
from config import DB_PATH

router = APIRouter()

# Pydantic Schema
class ClaimedCarModel(BaseModel):
    name: str
    value: int
    percentage: float


# Endpoint to fetch Top 5 Most Claimed Car Models
@router.get("/top-claimed-models", response_model=List[ClaimedCarModel])
def get_top_claimed_models():
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT car_model, COUNT(car_model) AS total_claims
                FROM predictions
                GROUP BY car_model
                ORDER BY total_claims DESC
                LIMIT 5
            """)
            rows = cursor.fetchall()

        total_claims_all = sum(row[1] for row in rows)

        result = [
            ClaimedCarModel(
                name=row[0],
                value=row[1],
                percentage=round((row[1] / total_claims_all) * 100, 2)
            )
            for row in rows
        ]

        return result

    except Exception as e:
        return {"error": str(e)}@router.get("/damage-part-frequency")
def get_damage_part_frequency():
    try:
        with sqlite3.connect(DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute("SELECT breakdown_json FROM predictions")
            rows = cursor.fetchall()

        # Initialize counter
        damage_counter = {}

        for row in rows:
            breakdown_raw = row["breakdown_json"]

            try:
                breakdown = json.loads(breakdown_raw)
            except Exception:
                continue  # if it's not valid JSON, skip it

            if not isinstance(breakdown, dict):
                continue  # if somehow it's not a dict, skip too

            for part, severities in breakdown.items():
                if not isinstance(severities, dict):
                    continue  # again, safely skip

                if part not in damage_counter:
                    damage_counter[part] = {"minor": 0, "moderate": 0, "major": 0}

                damage_counter[part]["minor"] += severities.get("minor", 0)
                damage_counter[part]["moderate"] += severities.get("moderate", 0)
                damage_counter[part]["major"] += severities.get("major", 0)

        formatted = []
        for part, counts in damage_counter.items():
            formatted.append({
                "part": part,
                "minor": counts["minor"],
                "moderate": counts["moderate"],
                "major": counts["major"],
                "total": counts["minor"] + counts["moderate"] + counts["major"]
            })

        formatted.sort(key=lambda x: x["total"], reverse=True)

        return formatted

    except Exception as e:
        return {"error": str(e)}
@router.get("/repair-cost-timeline-daywise")
def get_repair_cost_timeline_daywise():
    try:
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT 
                    car_model, 
                    strftime('%Y-%m-%d', timestamp) AS day, 
                    SUM(predicted_cost) AS total_cost
                FROM predictions
                GROUP BY car_model, day
                ORDER BY day ASC
            """)
            rows = cursor.fetchall()

        # Step 1: Group total cost per car
        total_per_car = {}
        for car_model, _, cost in rows:
            if car_model not in total_per_car:
                total_per_car[car_model] = 0
            total_per_car[car_model] += cost

        # Step 2: Get Top 3 cars by total cost
        top_3_cars = sorted(total_per_car.items(), key=lambda x: x[1], reverse=True)[:3]
        top_car_models = [car[0] for car in top_3_cars]

        # Step 3: Restructure only for top 3 cars
        data = {}
        for car_model, day, cost in rows:
            if car_model in top_car_models:
                if day not in data:
                    data[day] = {"name": day}
                data[day][car_model] = int(cost)

        # Step 4: Build final timeline
        result = [data[d] for d in sorted(data.keys())]

        return result

    except Exception as e:
        return {"error": str(e)}



# from fastapi import APIRouter
# from pydantic import BaseModel
# from typing import List
# import sqlite3
# import json
# from config import DB_PATH

# router = APIRouter()

# # Pydantic Schema
# class ClaimedCarModel(BaseModel):
#     name: str
#     value: int
#     percentage: float

# # Endpoint 1: Top 5 Most Claimed Car Models
# @router.get("/top-claimed-models", response_model=List[ClaimedCarModel])
# def get_top_claimed_models():
#     try:
#         with sqlite3.connect(DB_PATH) as conn:
#             cursor = conn.cursor()
#             cursor.execute("""
#                 SELECT car_model, COUNT(car_model) AS total_claims
#                 FROM predictions
#                 GROUP BY car_model
#                 ORDER BY total_claims DESC
#                 LIMIT 5
#             """)
#             rows = cursor.fetchall()

#         total_claims_all = sum(row[1] for row in rows)

#         result = [
#             ClaimedCarModel(
#                 name=row[0],
#                 value=row[1],
#                 percentage=round((row[1] / total_claims_all) * 100, 2)
#             )
#             for row in rows
#         ]

#         return result

#     except Exception as e:
#         return {"error": str(e)}

# # Endpoint 2: Damage Part Frequency
# @router.get("/damage-part-frequency")
# def get_damage_part_frequency():
#     try:
#         with sqlite3.connect(DB_PATH) as conn:
#             conn.row_factory = sqlite3.Row
#             cursor = conn.cursor()
#             cursor.execute("SELECT breakdown_json FROM predictions")
#             rows = cursor.fetchall()

#         damage_counter = {}

#         for row in rows:
#             breakdown_raw = row["breakdown_json"]

#             try:
#                 breakdown = json.loads(breakdown_raw)
#             except Exception:
#                 continue

#             if not isinstance(breakdown, dict):
#                 continue

#             for part, severities in breakdown.items():
#                 if not isinstance(severities, dict):
#                     continue

#                 if part not in damage_counter:
#                     damage_counter[part] = {"minor": 0, "moderate": 0, "major": 0}

#                 damage_counter[part]["minor"] += severities.get("minor", 0)
#                 damage_counter[part]["moderate"] += severities.get("moderate", 0)
#                 damage_counter[part]["major"] += severities.get("major", 0)

#         formatted = []
#         for part, counts in damage_counter.items():
#             formatted.append({
#                 "part": part,
#                 "minor": counts["minor"],
#                 "moderate": counts["moderate"],
#                 "major": counts["major"],
#                 "total": counts["minor"] + counts["moderate"] + counts["major"]
#             })

#         formatted.sort(key=lambda x: x["total"], reverse=True)
#         return formatted

#     except Exception as e:
#         return {"error": str(e)}

# # Endpoint 3: Repair Cost Timeline (Day-wise)
# @router.get("/repair-cost-timeline-daywise")
# def get_repair_cost_timeline_daywise():
#     try:
#         with sqlite3.connect(DB_PATH) as conn:
#             cursor = conn.cursor()
#             cursor.execute("""
#                 SELECT 
#                     car_model, 
#                     strftime('%Y-%m-%d', timestamp) AS day, 
#                     SUM(predicted_cost) AS total_cost
#                 FROM predictions
#                 GROUP BY car_model, day
#                 ORDER BY day ASC
#             """)
#             rows = cursor.fetchall()

#         # Group total cost per car
#         total_per_car = {}
#         for car_model, _, cost in rows:
#             total_per_car[car_model] = total_per_car.get(car_model, 0) + cost

#         # Top 3 cars by cost
#         top_3_cars = sorted(total_per_car.items(), key=lambda x: x[1], reverse=True)[:3]
#         top_car_models = [car[0] for car in top_3_cars]

#         # Restructure only for top 3 cars
#         data = {}
#         for car_model, day, cost in rows:
#             if car_model in top_car_models:
#                 if day not in data:
#                     data[day] = {"name": day}
#                 data[day][car_model] = int(cost)

#         # Build timeline
#         result = [data[d] for d in sorted(data.keys())]
#         return result

#     except Exception as e:
#         return {"error": str(e)}
