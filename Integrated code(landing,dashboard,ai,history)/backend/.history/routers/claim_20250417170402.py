# routers/claim.py

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status, Query
from typing import List, Optional
from datetime import datetime, date
from sqlmodel import Session, select
from pathlib import Path
from uuid import uuid4

from models import Claim, User, ClaimAudit
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

# auto‐approval threshold in PKR
AUTO_APPROVAL_THRESHOLD = 50_000

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
    draft: bool = Query(False, description="Save as draft if true"),
    registration_book: Optional[UploadFile] = File(None),
    driving_license: Optional[UploadFile] = File(None),
    roznamcha: Optional[UploadFile] = File(None),
    nic: Optional[UploadFile] = File(None),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    - draft=true  ⇒ status = Draft  
    - else:
        • claim_paid_amount ≤ 50k ⇒ Auto‐Approved  
        • otherwise ⇒ Pending (In Review)  
    Records an audit entry for the initial status.
    """
    # determine initial status
    if draft:
        status_value = ClaimStatus.draft
    elif form.claim_paid_amount <= AUTO_APPROVAL_THRESHOLD:
        status_value = ClaimStatus.approved
    else:
        status_value = ClaimStatus.pending

    # build claim
    claim = Claim.from_orm(form)
    claim.user_id = current_user.id
    claim.status = status_value

    # handle uploads
    if registration_book:
        claim.registration_book_url = save_upload(registration_book, "registration_books")
    if driving_license:
        claim.driving_license_url = save_upload(driving_license, "driving_licenses")
    if roznamcha:
        claim.roznamcha_url = save_upload(roznamcha, "roznamchas")
    if nic:
        claim.nic_url = save_upload(nic, "nics")

    # persist claim and audit
    session.add(claim)
    session.flush()  # to get claim.id
    audit = ClaimAudit(
        claim_id=claim.id,
        changed_by=current_user.id,
        old_status=None,
        new_status=status_value,
    )
    session.add(audit)
    session.commit()
    session.refresh(claim)
    return claim

@router.get("/", response_model=List[ClaimRead])
def list_my_claims(
    status: Optional[List[ClaimStatus]] = Query(None),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Employee’s own claims; filterable by ?status=Approved&status=Draft etc.
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
    status: Optional[List[ClaimStatus]] = Query(None),
    session: Session = Depends(get_session),
):
    """
    Admin: all claims, filter by status if desired.
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
    Admin: approve or deny a claim, with audit log.
    """
    claim = session.get(Claim, claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    old = claim.status
    claim.status = update.status
    claim.updated_at = datetime.utcnow()

    session.add(claim)
    session.flush()
    audit = ClaimAudit(
        claim_id=claim.id,
        changed_by=current_user.id,
        old_status=old,
        new_status=update.status,
    )
    session.add(audit)
    session.commit()
    session.refresh(claim)
    return claim

@router.get("/dashboard", response_model=DashboardSummary)
def dashboard_metrics(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Employee dashboard: 
      • pending_count  
      • processed_today_count  
      • claim_ratio  
      • average_processing_hours  
    """
    all_claims = session.exec(
        select(Claim).where(Claim.user_id == current_user.id)
    ).all()
    total = len(all_claims)
    pending = sum(1 for c in all_claims if c.status == ClaimStatus.pending)

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
    durations = [
        (c.updated_at - c.submitted_at).total_seconds()
        for c in all_claims if c.status != ClaimStatus.pending
    ]
    avg_hours = (sum(durations) / len(durations) / 3600) if durations else 0

    return DashboardSummary(
        pending_count=pending,
        processed_today_count=len(processed_today),
        claim_ratio=ratio,
        average_processing_hours=avg_hours,
    )
