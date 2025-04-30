# routers/claim.py

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from typing import List, Optional
from datetime import datetime, date
from sqlmodel import Session, select
from pathlib import Path
from uuid import uuid4

from models import Claim, User
from schemas import (
    ClaimCreate,
    ClaimRead,
    ClaimUpdate,
    DashboardSummary,
    ClaimStatus,
)
from database import get_session
from routers.auth import get_current_user, get_admin_user

router = APIRouter(prefix="/claims", tags=["claims"])

# ensure upload directory exists
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

@router.post(
    "/",
    response_model=ClaimRead,
    status_code=status.HTTP_201_CREATED,
)
async def create_claim(
    form: ClaimCreate = Depends(),
    registration_book: Optional[UploadFile] = File(None),
    driving_license: Optional[UploadFile] = File(None),
    roznamcha: Optional[UploadFile] = File(None),
    nic: Optional[UploadFile] = File(None),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Employee creates a new claim. Files are saved locally and URLs stored.
    """
    claim = Claim.from_orm(form)
    claim.user_id = current_user.id

    # Save uploads
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

@router.get("/", response_model=List[ClaimRead])
def list_my_claims(
    status: Optional[List[ClaimStatus]] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    List the current employee's claims, optionally filtered by status.
    """
    stmt = select(Claim).where(Claim.user_id == current_user.id)
    if status:
        stmt = stmt.where(Claim.status.in_(status))
    return session.exec(stmt).all()

@router.get(
    "/all",
    response_model=List[ClaimRead],
    dependencies=[Depends(get_admin_user)],
)
def list_all_claims(
    status: Optional[List[ClaimStatus]] = None,
    session: Session = Depends(get_session),
):
    """
    Admin: list all claims, optionally filtered by status.
    """
    stmt = select(Claim)
    if status:
        stmt = stmt.where(Claim.status.in_(status))
    return session.exec(stmt).all()

@router.patch("/{claim_id}/status", response_model=ClaimRead)
def update_status(
    *,
    claim_id: int,
    update: ClaimUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_admin_user),
):
    """
    Admin: approve or deny a claim.
    """
    claim = session.get(Claim, claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    claim.status = update.status
    claim.updated_at = datetime.utcnow()
    session.add(claim)
    session.commit()
    session.refresh(claim)
    return claim

@router.get("/dashboard", response_model=DashboardSummary)
def dashboard_metrics(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Employee dashboard summary: pending count, processed today, ratio, avg processing time.
    """
    # fetch all user's claims
    all_claims = session.exec(
        select(Claim).where(Claim.user_id == current_user.id)
    ).all()
    total = len(all_claims)
    pending = sum(1 for c in all_claims if c.status == ClaimStatus.pending)

    # processed today (approved or denied since start of day)
    today_start = datetime.combine(date.today(), datetime.min.time())
    processed_today = session.exec(
        select(Claim)
        .where(
            Claim.user_id == current_user.id,
            Claim.status != ClaimStatus.pending,
            Claim.updated_at >= today_start,
        )
    ).all()

    ratio = (pending / total) if total else 0
    processing_times = [
        (c.updated_at - c.submitted_at).total_seconds()
        for c in all_claims
        if c.status != ClaimStatus.pending
    ]
    avg_hours = (sum(processing_times) / len(processing_times) / 3600) if processing_times else 0

    return DashboardSummary(
        pending_count=pending,
        processed_today_count=len(processed_today),
        claim_ratio=ratio,
        average_processing_hours=avg_hours,
    )
