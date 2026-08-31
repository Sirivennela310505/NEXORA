from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import assessment as assessment_schema
from app.services import assessment_service
from app.dependencies import get_current_user
from app.database.database import get_db

router = APIRouter()

@router.post("/start", response_model=assessment_schema.AssessmentStartResponse)
def start_assessment(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    # For demo, generate a static set of 3 questions
    assessment = assessment_service.create_assessment(db, current_user.id)
    questions = [
        assessment_schema.AssessmentQuestionSchema(
            id=q.id,
            content=q.content,
            options=["A", "B", "C", "D"],
            correct_option=q.correct_option,
        )
        for q in assessment.questions
    ]
    return assessment_schema.AssessmentStartResponse(
        assessment_id=assessment.id,
        title=assessment.title,
        questions=questions,
    )

@router.post("/{assessment_id}/submit", response_model=assessment_schema.AssessmentResultResponse)
def submit_assessment(assessment_id: int, payload: assessment_schema.AssessmentSubmitRequest, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    result = assessment_service.evaluate_assessment(db, current_user.id, assessment_id, payload.answers)
    return assessment_schema.AssessmentResultResponse(
        assessment_id=assessment_id,
        score=result["score"],
        passed=result["passed"],
        feedback=result["feedback"],
    )

@router.get("/{assessment_id}", response_model=assessment_schema.AssessmentSchema)
def get_assessment(assessment_id: int, current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    assessment = assessment_service.get_assessment(db, current_user.id, assessment_id)
    if not assessment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assessment not found")
    return assessment_schema.AssessmentSchema.from_orm(assessment)
