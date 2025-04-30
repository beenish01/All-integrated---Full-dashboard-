from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query, status, Request
from sqlmodel import Session, select
from models import User
from schemas import UserRead, EmployeeUserCreate, Token, TokenData
from database import get_session
from utils import get_password_hash, create_verification_token, send_verification_email, create_access_token, verify_password
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from datetime import timedelta
from config import ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM
from jose import JWTError, jwt

router = APIRouter(tags=["Auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

def get_user(session: Session, email: str) -> User:
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()

@router.post("/signup", response_model=UserRead)
def signup(user_create: EmployeeUserCreate, background_tasks: BackgroundTasks, session: Session = Depends(get_session)):
    if get_user(session, user_create.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=user_create.email,
        first_name=user_create.first_name,
        last_name=user_create.last_name,
        hashed_password=get_password_hash(user_create.password),
        role="employee",
        is_verified=False
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    token = create_verification_token(user.email)
    background_tasks.add_task(send_verification_email, user.email, token)
    return user

@router.get("/verify-email")
def verify_email(token: str = Query(...), session: Session = Depends(get_session)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=400, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid token")
    
    user = get_user(session, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_verified:
        return {"message": "Email already verified."}
    
    user.is_verified = True
    session.add(user)
    session.commit()
    return {"message": "Email successfully verified."}

# Set up a local limiter instance for this router.
limiter = Limiter(key_func=get_remote_address)

@router.post("/resend-verification")
@limiter.limit("3/hour")
def resend_verification(email: str, background_tasks: BackgroundTasks, session: Session = Depends(get_session), request: Request = None):
    user = get_user(session, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_verified:
        return {"message": "Email already verified."}
    token = create_verification_token(user.email)
    background_tasks.add_task(send_verification_email, user.email, token)
    return {"message": "Verification email resent."}

@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = get_user(session, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if user.role == "employee" and not user.is_verified:
        raise HTTPException(status_code=400, detail="Email not verified. Please verify your email before logging in.")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/admin-token", response_model=Token)
def login_admin_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = get_user(session, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Access forbidden: not an admin.")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users/me", response_model=UserRead)
def read_users_me(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user(session, email)
    if user is None:
        raise credentials_exception
    return user

@router.get("/admin/claims")
def read_claims_for_admin(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = get_user(session, email)
    if not user or user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough privileges.")
    return {"claims": "Admin claims dashboard - pending approvals"}

@router.get("/employee/claims")
def read_claims_for_employee(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = get_user(session, email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid user")
    return {"claims": f"Claims for user {user.email}"}
