from pydantic import BaseModel
from typing import Optional

class OpportunityResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    related_goal: Optional[str] = None

    model_config = {"from_attributes": True}
