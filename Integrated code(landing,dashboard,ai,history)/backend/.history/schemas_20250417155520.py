# schemas.py
from datetime import datetime
from pydantic import BaseModel, validator
from typing import Optional
import re

class UserRead(BaseModel):
    id: int
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: str
    is_verified: bool

    class Config:
        orm_mode = True

class EmployeeUserCreate(BaseModel):
    email: str
    first_name: str
    last_name: str
    password: str

    @validator("password")
    def check_password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one number")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError("Password must contain at least one special character")
        return v

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# ──────────────── Claim Creation Schema ────────────────

class ClaimCreate(BaseModel):
    # Step 1 - Vehicle Details
    policy_no: str
    vehicle_make: str
    policy_start_date: datetime
    policy_end_date: datetime
    claim_count: str
    engine_no: str
    vehicle_model: str
    claim_paid_amount: float
    claim_intimation_amount: float
    chassis_no: str
    vehicle_color: str
    vehicle_start_date: datetime
    vehicle_end_date: datetime
    deductible_amount: float
    registration_no: str
    year_of_manufacture: str
    outstanding: str

    # Step 2 - Claim Details
    claim_type: str
    branch: str
    incident_datetime: datetime
    incident_place: str
    current_location: str
    circumstances: str
    missing_parts_details: str
    workshop_type: str
    vehicle_type: str
    workshop_name: str
    vehicle_availability: str
    date_field: datetime

    # Step 3 - Contact & Remarks
    relation_with_insured: str
    contact_person_name: str
    contact_number: str
    email: str
    remarks: Optional[str] = None
    remarks2: Optional[str] = None
    date_time: datetime
