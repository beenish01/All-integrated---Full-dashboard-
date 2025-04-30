# schemas.py
from pydantic import BaseModel
from typing import Optional

class UserRead(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    role: str
    is_verified: bool

class EmployeeUserCreate(BaseModel):
    email: str
    full_name: Optional[str] = None
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
