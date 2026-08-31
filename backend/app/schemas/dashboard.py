from pydantic import BaseModel
from datetime import datetime

class DashboardResponse(BaseModel):
    total_items: int
    completed_items: int
    upcoming_items: int
    skill_gap_score: int
    last_login: datetime
