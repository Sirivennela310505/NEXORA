from pydantic import BaseModel

class SimulationRequest(BaseModel):
    goal: str
    current_study_minutes: int
    target_months: int

class SimulationResponse(BaseModel):
    projected_completion_date: str
    estimated_effort_hours: float
    notes: str
