from sqlalchemy.orm import Session
from app.database.models import User, Roadmap, RoadmapTopic, LearningProgress, Assessment, Skill
from app.schemas.dashboard import DashboardResponse

async def get_dashboard_summary(db: Session, user_id: int) -> DashboardResponse:
    """Compute aggregated dashboard data for the given user using real DB queries."""
    # Fetch user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise ValueError("User not found")

    # Total roadmap items (topics)
    total_items = db.query(RoadmapTopic).join(Roadmap).filter(Roadmap.user_id == user_id).count()

    # Completed items based on LearningProgress status
    completed_items = (
        db.query(LearningProgress)
        .join(RoadmapTopic)
        .join(Roadmap)
        .filter(Roadmap.user_id == user_id, LearningProgress.status == "Completed")
        .count()
    )

    upcoming_items = total_items - completed_items if total_items >= completed_items else 0

    # Simple skill gap score: proportion of missing skills vs total defined skills
    total_skills = db.query(Skill).count()
    user_skill_count = len(user.skills) if hasattr(user, "skills") else 0
    skill_gap_score = int(((total_skills - user_skill_count) / total_skills) * 100) if total_skills else 0

    # Last login (using updated_at as approximation)
    last_login = user.updated_at

    return DashboardResponse(
        total_items=total_items,
        completed_items=completed_items,
        upcoming_items=upcoming_items,
        skill_gap_score=skill_gap_score,
        last_login=last_login,
    )
