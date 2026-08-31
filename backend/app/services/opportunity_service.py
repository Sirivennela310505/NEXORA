from app.database.models import Opportunity, user_opportunities
from sqlalchemy.orm import Session
from sqlalchemy import select

def get_all_opportunities(db: Session):
    return db.query(Opportunity).all()

def save_user_opportunity(db: Session, user_id: int, opportunity_id: int):
    # Check if already saved via association table
    existing = db.execute(
        select(user_opportunities).where(
            user_opportunities.c.user_id == user_id,
            user_opportunities.c.opportunity_id == opportunity_id
        )
    ).first()
    if existing:
        return db.query(Opportunity).filter_by(id=opportunity_id).first()
    # Insert into association table
    db.execute(user_opportunities.insert().values(user_id=user_id, opportunity_id=opportunity_id))
    db.commit()
    return db.query(Opportunity).filter_by(id=opportunity_id).first()
