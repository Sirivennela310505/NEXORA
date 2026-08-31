from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies import get_current_user
from app.database.database import get_db
from app.schemas.profile import ProfileResponse, ProfileUpdateRequest
from app.services.profile_service import get_profile, update_profile, create_profile

router = APIRouter()

@router.get("/", response_model=ProfileResponse)
def read_profile(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    profile = get_profile(db, current_user.id)
    if not profile:
        # create default profile if missing
        profile = create_profile(db, current_user.id, current_user.full_name)
    return profile

@router.put("/", response_model=ProfileResponse)
def update_user_profile(update: ProfileUpdateRequest, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    profile = get_profile(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
    updated = update_profile(db, current_user.id, update)
    return updated
