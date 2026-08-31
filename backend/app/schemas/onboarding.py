from pydantic import BaseModel, Field
from typing import Optional, List

class OnboardingRequest(BaseModel):
    goal: str = Field(...)
    education_stage: Optional[str]
    current_skill_level: Optional[str]
    known_technologies: Optional[str]
    experience_level: Optional[str]
    study_time_per_week: Optional[int]
    target_timeline_months: Optional[int]
    learning_style: Optional[str]
    other_answers: Optional[str]

class OnboardingResponse(OnboardingRequest):
    id: int
    user_id: int

    model_config = {"from_attributes": True}
