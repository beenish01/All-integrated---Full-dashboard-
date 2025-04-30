# main.py
from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from sqlmodel import select, Session

from database import engine, init_db
from routers import auth, claim
from models import User
from utils import get_password_hash

app = FastAPI(title="IntelliClaims API")

# CORS configuration
origins = ["http://localhost:8080", "http://127.0.0.1:8080"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiter setup
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too Many Requests. Please try again later."},
    )

# Startup event: initialize DB and default admin
@app.on_event("startup")
def on_startup():
    # create tables
    init_db()

    # create default admin if not exists
    default_email = os.getenv("DEFAULT_ADMIN_EMAIL")
    default_password = os.getenv("DEFAULT_ADMIN_PASSWORD")
    if default_email and default_password:
        with Session(engine) as session:
            existing = session.exec(
                select(User).where(User.email == default_email)
            ).first()
            if not existing:
                admin = User(
                    email=default_email,
                    first_name="Default",
                    last_name="Admin",
                    hashed_password=get_password_hash(default_password),
                    role="admin",
                    is_verified=True,
                )
                session.add(admin)
                session.commit()
                print(f"Default admin created: {default_email}")

# Include authentication and claim routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(claim.router, prefix="/api", tags=["Claims"])
