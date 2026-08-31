from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.dependencies import get_current_user
from app.database.database import get_db
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard_service import get_dashboard_summary

router = APIRouter()

@router.get('/', response_model=DashboardResponse)
async def read_dashboard(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    summary = await get_dashboard_summary(db, current_user.id)
    return summary
