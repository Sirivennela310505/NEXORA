from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.dependencies import get_current_user
from app.services.simulator_service import run_simulation

router = APIRouter(prefix="/api/simulator", tags=["Simulator"])

class SimulationRequest(BaseModel):
    goal: str
    current_study_minutes: int
    target_months: int

class SimulationResponse(BaseModel):
    projected_completion_date: str
    estimated_effort_hours: float
    notes: str

@router.post("/run", response_model=SimulationResponse)
async def simulate(request: SimulationRequest, current_user = Depends(get_current_user)):
    """Run a deterministic what‑if simulation for the user based on goal and current study time."""
    try:
        result = await run_simulation(current_user.id, request)
        return result
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
