# models.py
from sqlmodel import SQLModel, Field
from typing import Optional

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
     first_name: Optional[str] = None
    last_name: Optional[str] = None
    hashed_password: str
    role: str  # "employee" or "admin"
    is_verified: bool = Field(default=False)
