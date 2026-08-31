from pydantic import BaseModel, Field
from typing import List, Optional

class RoadmapTopicSchema(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str = Field(..., description="Locked, Upcoming, In Progress, Completed")
    estimated_duration_hours: Optional[int]
    difficulty: Optional[str]
    resources: Optional[str]
    order: Optional[int]

    model_config = {"from_attributes": True}

class RoadmapStageSchema(BaseModel):
    id: int
    title: str
    order: int
    topics: List[RoadmapTopicSchema] = []

    model_config = {"from_attributes": True}

class RoadmapSchema(BaseModel):
    id: int
    title: str
    goal: str
    progress: int
    stages: List[RoadmapStageSchema] = []

    model_config = {"from_attributes": True}

class RoadmapGenerateRequest(BaseModel):
    # No body needed; uses current user's onboarding & assessments
    pass

class RoadmapGenerateResponse(BaseModel):
    roadmap: RoadmapSchema
