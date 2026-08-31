from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies import get_current_user
from app.database.database import get_db
from app.schemas.opportunity import OpportunityResponse
from app.services.opportunity_service import get_all_opportunities, save_user_opportunity

router = APIRouter()

@router.get("/", response_model=list[OpportunityResponse])
def list_opportunities(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return get_all_opportunities(db)

@router.post("/{opportunity_id}/save", response_model=OpportunityResponse)
def save_opportunity(opportunity_id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    saved = save_user_opportunity(db, current_user.id, opportunity_id)
    if not saved:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unable to save opportunity")
    return saved
