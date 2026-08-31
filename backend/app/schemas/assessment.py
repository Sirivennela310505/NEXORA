from pydantic import BaseModel, Field
from typing import List, Optional

class AssessmentQuestionSchema(BaseModel):
    id: int
    content: str
    options: Optional[List[str]]
    correct_option: Optional[str]

    model_config = {"from_attributes": True}

class AssessmentStartResponse(BaseModel):
    assessment_id: int
    title: str
    questions: List[AssessmentQuestionSchema]

class AssessmentSubmitRequest(BaseModel):
    answers: List[str]  # list aligned with question order

class AssessmentResultResponse(BaseModel):
    assessment_id: int
    score: int
    passed: bool
    feedback: Optional[str]

class AssessmentSchema(BaseModel):
    id: int
    title: str
    created_at: str
    completed_at: Optional[str]
    score: Optional[int]

    model_config = {"from_attributes": True}
