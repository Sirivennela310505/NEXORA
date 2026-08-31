from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import onboarding as onboarding_schema
from app.services import onboarding_service
from app.dependencies import get_current_user
from app.database.database import get_db

router = APIRouter()

@router.post("", response_model=onboarding_schema.OnboardingResponse)
def create_onboarding(data: onboarding_schema.OnboardingRequest, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    # Delete existing onboarding if any
    existing = onboarding_service.get_onboarding(db, current_user.id)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Onboarding already completed")
    onboarding = onboarding_service.create_onboarding(db, current_user.id, data)
    return onboarding_schema.OnboardingResponse.from_orm(onboarding)

@router.get("", response_model=onboarding_schema.OnboardingResponse)
def read_onboarding(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    onboarding = onboarding_service.get_onboarding(db, current_user.id)
    if not onboarding:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Onboarding not found")
    return onboarding_schema.OnboardingResponse.from_orm(onboarding)
