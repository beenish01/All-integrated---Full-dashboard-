# config.py
import os

SECRET_KEY = os.getenv("SECRET_KEY", "586cd378c9a98bdef2a434886dc0ce6e4543923249055a72d41ffe9488d141d6")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
VERIFICATION_TOKEN_EXPIRE_MINUTES = 60

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

# Email configuration – replace these with your actual values or use environment variables.
from fastapi_mail import ConnectionConfig

MAIL_CONF = ConnectionConfig(
    MAIL_USERNAME="intelliclaimapp@gmail.com",  # Your sender email address
    MAIL_PASSWORD="magbwkucfkkowfza",           # Your app password (no spaces)
    MAIL_FROM="intelliclaimapp@gmail.com",      # The sender's email
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)
# === Add this block to support prediction history DB ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.abspath(os.path.join(BASE_DIR, "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)

DB_PATH = os.path.join(UPLOAD_DIR, "history.db")
