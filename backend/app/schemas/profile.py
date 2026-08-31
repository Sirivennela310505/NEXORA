from pydantic import BaseModel, EmailStr
from typing import Optional

class ProfileResponse(BaseModel):
    id: int
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    goal: Optional[str] = None
    education_stage: Optional[str] = None
    current_skill_level: Optional[str] = None
    known_technologies: Optional[str] = None
    experience_level: Optional[str] = None
    study_time_per_week: Optional[int] = None
    target_timeline_months: Optional[int] = None
    learning_style: Optional[str] = None

    model_config = {"from_attributes": True}

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    education_stage: Optional[str] = None
    current_skill_level: Optional[str] = None
    known_technologies: Optional[str] = None
    experience_level: Optional[str] = None
    study_time_per_week: Optional[int] = None
    target_timeline_months: Optional[int] = None
    learning_style: Optional[str] = None
