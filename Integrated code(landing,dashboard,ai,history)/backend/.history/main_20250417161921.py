# main.py
from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, select
from database import engine
from routers import claim
from routers import auth
from models import User
from utils import get_password_hash

# SlowAPI imports
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse

app = FastAPI()

origins = ["http://localhost:8080", "http://127.0.0.1:8080"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up SlowAPI limiter using client's IP address.
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

# Add exception handler for rate limit exceeded errors.
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too Many Requests. Please try again later."},
    )

# Create database tables
SQLModel.metadata.create_all(engine)

# Create a default admin user if none exists
def create_default_admin():
    default_email = os.getenv("DEFAULT_ADMIN_EMAIL")
    default_password = os.getenv("DEFAULT_ADMIN_PASSWORD")

    if not default_email or not default_password:
        print("No default admin credentials found in environment.")
        return

    with Session(engine) as session:
        admin_exists = session.exec(select(User).where(User.email == default_email)).first()
        if not admin_exists:
            admin = User(
                email=default_email,
                first_name="Default",
                last_name="Admin",
                hashed_password=get_password_hash(default_password),
                role="admin",
                is_verified=True
            )
            session.add(admin)
            session.commit()
            print(f"Default admin created: {default_email}")

create_default_admin()

# Include authentication routes
app.include_router(auth.router)

app.include_router(claim.router, prefix="/api", tags=["Claims"])

