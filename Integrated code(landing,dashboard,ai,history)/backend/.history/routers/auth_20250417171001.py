# auth.py

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlmodel import Session, select
from jose import JWTError, jwt
from datetime import timedelta

from models import User
from schemas import UserRead, EmployeeUserCreate, Token
from database import get_session
from utils import (
    get_password_hash,
    create_verification_token,
    send_verification_email,
    create_access_token,
    verify_password,
)
from config import ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/api/auth", tags=["Auth"])

# updated to match your mounted path
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

# ──────── Dependency Helpers ────────

def get_user_by_email(session: Session, email: str) -> User:
    stmt = select(User).where(User.email == email)
    return session.exec(stmt).first()

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> User:
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if not email:
            raise credentials_exc
    except JWTError:
        raise credentials_exc

    user = get_user_by_email(session, email)
    if not user:
        raise credentials_exc
    return user

async def get_admin_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough privileges")
    return current_user

# ──────── Your existing endpoints ────────

limiter = Limiter(key_func=get_remote_address)

@router.post("/signup", response_model=UserRead)
def signup(
    user_create: EmployeeUserCreate,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
):
    if get_user_by_email(session, user_create.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=user_create.email,
        first_name=user_create.first_name,
        last_name=user_create.last_name,
        hashed_password=get_password_hash(user_create.password),
        role="employee",
        is_verified=False,
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    token = create_verification_token(user.email)
    background_tasks.add_task(send_verification_email, user.email, token)
    return user

@router.get("/verify-email")
def verify_email(token: str = Query(...), session: Session = Depends(get_session)):
    # ... unchanged ...
    pass

@router.post("/resend-verification")
@limiter.limit("3/hour")
def resend_verification(
    email: str,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session),
    request: Request = None,
):
    # ... unchanged ...
    pass

@router.post("/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    # ... unchanged ...
    pass

@router.post("/admin-token", response_model=Token)
def login_admin_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    # ... unchanged ...
    pass

@router.get("/users/me", response_model=UserRead)
def read_users_me(
    current_user: User = Depends(get_current_user),
):
    return current_user

# admin‐only example
@router.get("/admin/claims")
def read_claims_for_admin(
    admin: User = Depends(get_admin_user),
):
    return {"claims": "Admin claims dashboard – pending approvals"}

# employee‐only example
@router.get("/employee/claims")
def read_claims_for_employee(
    user: User = Depends(get_current_user),
):
    return {"claims": f"Claims for user {user.email}"}
