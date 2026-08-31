from typing import Optional
from sqlalchemy.orm import Session
from app.database import models
from app.schemas.profile import ProfileUpdateRequest

def get_profile(db: Session, user_id: int) -> Optional[models.UserProfile]:
    return db.query(models.UserProfile).filter(models.UserProfile.user_id == user_id).first()

def create_profile(db: Session, user_id: int, full_name: str) -> models.UserProfile:
    profile = models.UserProfile(user_id=user_id, full_name=full_name)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

def update_profile(db: Session, user_id: int, data: ProfileUpdateRequest) -> models.UserProfile:
    profile = get_profile(db, user_id)
    if not profile:
        raise ValueError("Profile not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile
