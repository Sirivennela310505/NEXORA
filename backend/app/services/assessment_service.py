from sqlalchemy.orm import Session
from app.database import models
from app.schemas import assessment as assessment_schema
import random

def _create_static_questions(db: Session, assessment_id: int):
    # Simple static diagnostic questions – in a real app these would be loaded from seed data
    sample_questions = [
        {"content": "What is the time complexity of binary search?", "correct_option": "O(log n)"},
        {"content": "Which HTML tag is used for the largest heading?", "correct_option": "<h1>"},
        {"content": "What does CSS stand for?", "correct_option": "Cascading Style Sheets"},
    ]
    for q in sample_questions:
        question = models.AssessmentQuestion(
            content=q["content"],
            options="[\"A\", \"B\", \"C\", \"D\"]",
            correct_option=q["correct_option"],
        )
        db.add(question)
        db.flush()
        # associate with assessment via AssessmentAttempt placeholder
        attempt = models.AssessmentAttempt(
            assessment_id=assessment_id,
            question_id=question.id,
            answer=None,
            is_correct=False,
        )
        db.add(attempt)
    db.commit()

def create_assessment(db: Session, user_id: int):
    assessment = models.Assessment(
        user_id=user_id,
        title="Diagnostic Assessment",
    )
    db.add(assessment)
    db.flush()
    _create_static_questions(db, assessment.id)
    db.refresh(assessment)
    # Load related questions via relationship (assessment.questions not defined – use join)
    # For simplicity, we fetch the attempts which link to questions
    assessment.questions = [attempt.question for attempt in assessment.attempts]
    return assessment

def evaluate_assessment(db: Session, user_id: int, assessment_id: int, answers: list[str]):
    assessment = db.query(models.Assessment).filter(models.Assessment.id == assessment_id, models.Assessment.user_id == user_id).first()
    if not assessment:
        raise ValueError("Assessment not found")
    # map answers to attempts
    attempts = db.query(models.AssessmentAttempt).filter(models.AssessmentAttempt.assessment_id == assessment_id).order_by(models.AssessmentAttempt.id).all()
    score = 0
    for attempt, answer in zip(attempts, answers):
        attempt.answer = answer
        correct = attempt.question.correct_option == answer
        attempt.is_correct = correct
        if correct:
            score += 1
    assessment.score = score
    assessment.completed_at = datetime.utcnow()
    db.commit()
    passed = score >= len(attempts) * 0.7
    feedback = f"You scored {score}/{len(attempts)}. {'Great job!' if passed else 'Consider reviewing the topics.'}"
    return {"score": score, "passed": passed, "feedback": feedback}

def get_assessment(db: Session, user_id: int, assessment_id: int):
    return db.query(models.Assessment).filter(models.Assessment.id == assessment_id, models.Assessment.user_id == user_id).first()
