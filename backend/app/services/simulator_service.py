from datetime import datetime, timedelta
from app.schemas.simulator import SimulationResponse, SimulationRequest

async def run_simulation(user_id: int, request: SimulationRequest) -> SimulationResponse:
    """Simple deterministic simulation.
    Calculates an estimated effort based on current study minutes and target months.
    Returns a projected completion date, estimated total effort in hours, and a note.
    """
    # Convert current study minutes to hours per week
    weekly_hours = request.current_study_minutes / 60.0
    # Assume 4 weeks per month
    total_hours = weekly_hours * 4 * request.target_months
    # Projected completion date based on today plus target months
    projected_date = datetime.utcnow() + timedelta(days=30 * request.target_months)
    notes = f"Simulation for goal '{request.goal}'."
    return SimulationResponse(
        projected_completion_date=projected_date.isoformat(),
        estimated_effort_hours=round(total_hours, 2),
        notes=notes,
    )
