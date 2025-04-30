# === Setup ===
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlmodel import SQLModel, select, Session
# from backend.routers import dashboard
# from backend.routers.dashboard import router as dashboard_router
from routers import dashboard  # Ensure correct import path
# === Local Modules ===
from database import engine
from models import User
from utils import get_password_hash
from routers import auth, claim, history,dashboard

# === Load environment variables ===
load_dotenv()

# === Ensure uploads folder exists ===
os.makedirs("uploads", exist_ok=True)

# === FastAPI App Init ===
app = FastAPI(title="IntelliClaims API")

# === Middleware: CORS for local frontend ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Only allow local frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Static Files (PDFs, Annotated Images, etc.) ===
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# === Rate Limiting ===
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={"detail": "⏳ Too many requests. Please slow down."},
    )

# === Database Initialization + Default Admin Creation ===
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

    default_email = os.getenv("DEFAULT_ADMIN_EMAIL")
    default_password = os.getenv("DEFAULT_ADMIN_PASSWORD")

    if default_email and default_password:
        with Session(engine) as session:
            user_exists = session.exec(
                select(User).where(User.email == default_email)
            ).first()

            if not user_exists:
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
                print(f"✅ Admin created: {default_email}")

# === Include API Routers ===
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(claim.router, prefix="/api/claims", tags=["Claims"])
app.include_router(history.router, prefix="/api/history", tags=["History"])
# app.include_router(dashboard_router)
# app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])

