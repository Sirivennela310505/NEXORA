from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import roadmap as roadmap_schema
from app.services import roadmap_service
from app.dependencies import get_current_user
from app.database.database import get_db

router = APIRouter()

@router.post("/generate", response_model=roadmap_schema.RoadmapGenerateResponse)
def generate_roadmap(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    # Generate roadmap based on user's onboarding and assessments
    roadmap = roadmap_service.generate_roadmap(db, current_user.id)
    if not roadmap:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unable to generate roadmap")
    return roadmap_schema.RoadmapGenerateResponse(roadmap=roadmap_schema.RoadmapSchema.from_orm(roadmap))

@router.get("/{roadmap_id}", response_model=roadmap_schema.RoadmapSchema)
def get_roadmap(roadmap_id: int, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    roadmap = roadmap_service.get_roadmap(db, current_user.id, roadmap_id)
    if not roadmap:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roadmap not found")
    return roadmap_schema.RoadmapSchema.from_orm(roadmap)
