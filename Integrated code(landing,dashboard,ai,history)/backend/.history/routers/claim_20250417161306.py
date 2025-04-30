from fastapi import APIRouter, Depends, UploadFile, File
from sqlmodel import Session
from uuid import uuid4
from pathlib import Path
from app.models import Claim, User
from app.schemas import ClaimCreate
from app.database import get_session
from app.auth import get_current_user  # adjust import if needed

router = APIRouter()
UPLOADS_DIR = Path("app/uploads")
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

def save_upload(file: UploadFile, folder: str) -> str:
    folder_path = UPLOADS_DIR / folder
    folder_path.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid4().hex}_{file.filename}"
    path = folder_path / filename
    with open(path, "wb") as f:
        f.write(file.file.read())
    return f"/uploads/{folder}/{filename}"

@router.post("/claims/", response_model=ClaimCreate)
async def create_claim(
    form: ClaimCreate = Depends(),
    registration_book: UploadFile = File(None),
    driving_license: UploadFile = File(None),
    roznamcha: UploadFile = File(None),
    nic: UploadFile = File(None),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    claim = Claim(**form.dict(), user_id=current_user.id)

    # Save file paths if files are uploaded
    if registration_book:
        claim.registration_book_url = save_upload(registration_book, "registration_books")
    if driving_license:
        claim.driving_license_url = save_upload(driving_license, "driving_licenses")
    if roznamcha:
        claim.roznamcha_url = save_upload(roznamcha, "roznamchas")
    if nic:
        claim.nic_url = save_upload(nic, "nics")

    session.add(claim)
    session.commit()
    session.refresh(claim)
    return claim
