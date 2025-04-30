# schemas.py
from datetime import datetime, date
from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field, validator
import re

# ──────────── Helpers & Config ────────────

def to_camel(string: str) -> str:
    parts = string.split("_")
    return parts[0] + "".join(word.capitalize() for word in parts[1:])

class BaseConfig:
    alias_generator = to_camel
    allow_population_by_field_name = True
    orm_mode = True

# ──────────── Enums ────────────

class ClaimStatus(str, Enum):
    pending = "Pending"
    approved = "Approved"
    denied = "Denied"
    draft = "Draft"

# ──────────── User / Auth Schemas ────────────

class UserRead(BaseModel):
    id: int
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: str
    is_verified: bool

    class Config(BaseConfig):
        pass

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

    class Config(BaseConfig):
        pass

class Token(BaseModel):
    access_token: str
    token_type: str

    class Config(BaseConfig):
        pass

class TokenData(BaseModel):
    email: Optional[str] = None

    class Config(BaseConfig):
        pass

# ──────────── Claim Schemas ────────────

class ClaimCreate(BaseModel):
    # Step 1 – Vehicle Details
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

    # Step 2 – Claim Details
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

    # Step 3 – Contact & Remarks
    relation_with_insured: str
    contact_person_name: str
    contact_number: str
    email: str
    remarks: Optional[str] = None
    remarks2: Optional[str] = None
    date_time: datetime

    # File URLs (if you store uploaded file paths)
    registration_book_url: Optional[str] = None
    driving_license_url: Optional[str] = None
    roznamcha_url: Optional[str] = None
    nic_url: Optional[str] = None

    class Config(BaseConfig):
        pass

class ClaimRead(ClaimCreate):
    id: int
    claim_number: str
    status: ClaimStatus
    submitted_at: datetime
    updated_at: datetime
    user_id: int

    class Config(BaseConfig):
        pass

class ClaimUpdate(BaseModel):
    status: ClaimStatus

    class Config(BaseConfig):
        pass

class DashboardSummary(BaseModel):
    pending_count: int
    processed_today_count: int
    claim_ratio: float             # pending / total
    average_processing_hours: float

    class Config(BaseConfig):
        pass
