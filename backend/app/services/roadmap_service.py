from sqlalchemy.orm import Session
from app.database import models
from app.schemas import roadmap as roadmap_schema
from app.ml.prerequisite_engine import PrerequisiteEngine
from app.ml.skill_gap_engine import SkillGapEngine
from app.ml.recommendation_engine import RecommendationEngine
from datetime import datetime

# Simple deterministic recommendation logic

def generate_roadmap(db: Session, user_id: int):
    # Fetch onboarding profile
    onboarding = db.query(models.OnboardingProfile).filter(models.OnboardingProfile.user_id == user_id).first()
    if not onboarding:
        return None
    # Fetch any existing assessments to derive skill gaps (placeholder)
    # For demo, we just create a static set of stages/topics based on goal
    goal = onboarding.goal.lower()
    # Simple mapping for demo purposes
    if "full-stack" in goal:
        stages_data = [
            {"title": "Programming Foundations", "order": 1, "topics": ["HTML", "CSS", "JavaScript"]},
            {"title": "Frontend Framework", "order": 2, "topics": ["React", "State Management"]},
            {"title": "Backend Development", "order": 3, "topics": ["Node.js", "Express", "Database (SQL)"]},
            {"title": "Full-Stack Project", "order": 4, "topics": ["Capstone Project"]},
        ]
    elif "ai" in goal or "machine learning" in goal:
        stages_data = [
            {"title": "Math Foundations", "order": 1, "topics": ["Linear Algebra", "Calculus", "Probability"]},
            {"title": "Python & Tools", "order": 2, "topics": ["Python", "NumPy", "Pandas", "Scikit-learn"]},
            {"title": "Deep Learning", "order": 3, "topics": ["TensorFlow", "PyTorch", "Neural Networks"]},
            {"title": "AI Projects", "order": 4, "topics": ["Capstone Project"]},
        ]
    else:
        # fallback generic roadmap
        stages_data = [
            {"title": "Core Concepts", "order": 1, "topics": ["Fundamentals"]},
        ]

    # Create Roadmap record
    roadmap = models.Roadmap(
        user_id=user_id,
        title=f"Personalized Roadmap for {onboarding.goal}",
        goal=onboarding.goal,
        progress=0,
    )
    db.add(roadmap)
    db.flush()  # assign roadmap.id
    # Create stages and topics
    for stage_info in stages_data:
        stage = models.RoadmapStage(
            roadmap_id=roadmap.id,
            title=stage_info["title"],
            order=stage_info["order"],
        )
        db.add(stage)
        db.flush()
        for idx, topic_title in enumerate(stage_info["topics"], start=1):
            topic = models.RoadmapTopic(
                stage_id=stage.id,
                title=topic_title,
                description=f"Learn {topic_title} as part of {stage_info['title']}",
                status="Locked" if idx > 1 else "Upcoming",
                estimated_duration_hours=10,
                difficulty="Medium",
                resources="[]",
                order=idx,
            )
            db.add(topic)
    db.commit()
    db.refresh(roadmap)
    return roadmap

def get_roadmap(db: Session, user_id: int, roadmap_id: int):
    return (
        db.query(models.Roadmap)
        .filter(models.Roadmap.id == roadmap_id, models.Roadmap.user_id == user_id)
        .first()
    )
