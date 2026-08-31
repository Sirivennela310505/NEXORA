from sqlalchemy.orm import Session
from app.database import models
from app.schemas import onboarding as onboarding_schema

def create_onboarding(db: Session, user_id: int, data: onboarding_schema.OnboardingRequest):
    onboarding = models.OnboardingProfile(
        user_id=user_id,
        goal=data.goal,
        education_stage=data.education_stage,
        current_skill_level=data.current_skill_level,
        known_technologies=data.known_technologies,
        experience_level=data.experience_level,
        study_time_per_week=data.study_time_per_week,
        target_timeline_months=data.target_timeline_months,
        learning_style=data.learning_style,
        other_answers=data.other_answers,
    )
    db.add(onboarding)
    db.commit()
    db.refresh(onboarding)
    return onboarding

def get_onboarding(db: Session, user_id: int):
    return (
        db.query(models.OnboardingProfile)
        .filter(models.OnboardingProfile.user_id == user_id)
        .first()
    )
