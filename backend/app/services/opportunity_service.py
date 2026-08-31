from app.database.models import Opportunity, UserOpportunity
from sqlalchemy.orm import Session

def get_all_opportunities(db: Session):
    return db.query(Opportunity).all()

def save_user_opportunity(db: Session, user_id: int, opportunity_id: int):
    # Check if already saved
    existing = db.query(UserOpportunity).filter_by(user_id=user_id, opportunity_id=opportunity_id).first()
    if existing:
        return db.query(Opportunity).filter_by(id=opportunity_id).first()
    # Create association
    association = UserOpportunity(user_id=user_id, opportunity_id=opportunity_id)
    db.add(association)
    db.commit()
    db.refresh(association)
    return db.query(Opportunity).filter_by(id=opportunity_id).first()
