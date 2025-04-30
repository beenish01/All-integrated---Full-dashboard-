from fastapi import FastAPI, Depends, HTTPException, status, Query, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import SQLModel, Field, Session, create_engine, select
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

# --------------------
# CONFIGURATION
# --------------------
SECRET_KEY = "586cd378c9a98bdef2a434886dc0ce6e4543923249055a72d41ffe9488d141d6"  # Replace with a secure key from your environment.
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
VERIFICATION_TOKEN_EXPIRE_MINUTES = 60  # Verification token expiry time

DATABASE_URL = "sqlite:///./app.db"  # Use PostgreSQL URL in production.
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, echo=True, connect_args=connect_args)

app = FastAPI()

# Update origins to match your frontend's URL(s)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# EMAIL CONFIGURATION
# --------------------
conf = ConnectionConfig(
    MAIL_USERNAME="intelliclaimapp@gmail.com",      # Your email address
    MAIL_PASSWORD="magbwkucfkkowfza",                # Your app password (without spaces)
    MAIL_FROM="intelliclaimapp@gmail.com",           # The sender's email address
    MAIL_PORT=587,                                  # Typical port for TLS
    MAIL_SERVER="smtp.gmail.com",                   # Gmail SMTP server
    MAIL_STARTTLS=True,                             # Use STARTTLS
    MAIL_SSL_TLS=False,                             # Do not use SSL/TLS mode
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)


async def send_verification_email(email: str, token: str):
    # Construct the verification link (adjust the domain as needed)
    verification_link = f"http://localhost:8000/verify-email?token={token}"
    message = MessageSchema(
        subject="Email Verification",
        recipients=[email],
        body=f"Click the following link to verify your email: {verification_link}",
        subtype="plain"
    )
    fm = FastMail(conf)
    await fm.send_message(message)
    print(f"Sent verification email to {email} with link: {verification_link}")

# --------------------
# DATABASE MODELS
# --------------------
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    full_name: Optional[str] = None
    hashed_password: str
    role: str  # "employee" or "admin"
    is_verified: bool = Field(default=False)  # For email verification

# --------------------
# Pydantic Schemas
# --------------------
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

# --------------------
# UTILITY FUNCTIONS (PASSWORDS & TOKENS)
# --------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_verification_token(email: str) -> str:
    data = {"sub": email}
    return create_access_token(data, expires_delta=timedelta(minutes=VERIFICATION_TOKEN_EXPIRE_MINUTES))

# --------------------
# DATABASE SESSION DEPENDENCY
# --------------------
def get_session():
    with Session(engine) as session:
        yield session

def get_user(session: Session, email: str) -> Optional[User]:
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()

def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
    user = get_user(session, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    # For employees, enforce email verification before allowing login.
    if user.role == "employee" and not user.is_verified:
        raise HTTPException(
            status_code=400,
            detail="Email not verified. Please verify your email before logging in."
        )
    return user

# --------------------
# OAUTH2 SETUP & AUTH DEPENDENCIES
# --------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
) -> User:
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
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = get_user(session, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

async def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough privileges.")
    return current_user

# --------------------
# STARTUP: CREATE TABLES AND DEFAULT ADMIN ACCOUNT
# --------------------
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)
    # Create a default admin account if it doesn't exist.
    with Session(engine) as session:
        admin = get_user(session, "admin@example.com")
        if not admin:
            admin_user = User(
                email="admin@example.com",
                full_name="Administrator",
                hashed_password=get_password_hash("adminpassword"),  # Replace with a secure password.
                role="admin",
                is_verified=True  # Admin account is automatically verified.
            )
            session.add(admin_user)
            session.commit()

# --------------------
# API ENDPOINTS
# --------------------

# Employee signup endpoint – only creates employee accounts.
@app.post("/signup", response_model=UserRead)
def signup(user_create: EmployeeUserCreate, background_tasks: BackgroundTasks, session: Session = Depends(get_session)):
    if get_user(session, user_create.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=user_create.email,
        full_name=user_create.full_name,
        hashed_password=get_password_hash(user_create.password),
        role="employee",  # Force employee role
        is_verified=False  # Require email verification
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    # Generate a verification token.
    verification_token = create_verification_token(user.email)
    # Instead of printing the token, send an email in the background.
    background_tasks.add_task(send_verification_email, user.email, verification_token)
    return user

# Email verification endpoint.
@app.get("/verify-email")
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

# Token endpoint for login (for both employees and admin).
@app.post("/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    user = authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Endpoint to get current user's info.
@app.get("/users/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# Admin-only endpoint example (e.g., for claims approval).
@app.get("/admin/claims")
def read_claims_for_admin(current_admin: User = Depends(get_current_admin)):
    return {"claims": "Admin claims dashboard - pending approvals"}

# Employee endpoint to view their own claims.
@app.get("/employee/claims")
def read_claims_for_employee(current_user: User = Depends(get_current_user)):
    return {"claims": f"Claims for user {current_user.email}"}
