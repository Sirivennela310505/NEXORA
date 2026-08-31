from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.database import Base

# Association tables
user_skills = Table(
    "user_skills",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.id"), primary_key=True),
)

user_opportunities = Table(
    "user_opportunities",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
    Column("opportunity_id", Integer, ForeignKey("opportunities.id"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    # Relationships
    onboarding = relationship("OnboardingProfile", back_populates="user", uselist=False)
    roadmap = relationship("Roadmap", back_populates="user", uselist=False)
    assessments = relationship("Assessment", back_populates="user")
    skills = relationship("Skill", secondary=user_skills, back_populates="users")
    opportunities = relationship("Opportunity", secondary=user_opportunities, back_populates="users")
    profile = relationship("UserProfile", back_populates="user", uselist=False)

class OnboardingProfile(Base):
    __tablename__ = "onboarding_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    goal = Column(String, nullable=False)
    education_stage = Column(String)
    current_skill_level = Column(String)
    known_technologies = Column(Text)
    experience_level = Column(String)
    study_time_per_week = Column(Integer)
    target_timeline_months = Column(Integer)
    learning_style = Column(String)
    other_answers = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user = relationship("User", back_populates="onboarding")

class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(Text)
    users = relationship("User", secondary=user_skills, back_populates="skills")

class Roadmap(Base):
    __tablename__ = "roadmaps"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    goal = Column(String, nullable=False)
    progress = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user = relationship("User", back_populates="roadmap")
    stages = relationship("RoadmapStage", back_populates="roadmap", cascade="all, delete-orphan")

class RoadmapStage(Base):
    __tablename__ = "roadmap_stages"
    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id"), nullable=False)
    title = Column(String, nullable=False)
    order = Column(Integer, nullable=False)
    roadmap = relationship("Roadmap", back_populates="stages")
    topics = relationship("RoadmapTopic", back_populates="stage", cascade="all, delete-orphan")

class RoadmapTopic(Base):
    __tablename__ = "roadmap_topics"
    id = Column(Integer, primary_key=True, index=True)
    stage_id = Column(Integer, ForeignKey("roadmap_stages.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="Locked")  # Locked, Upcoming, In Progress, Completed
    estimated_duration_hours = Column(Integer)
    difficulty = Column(String)
    resources = Column(Text)  # JSON string of resources
    stage = relationship("RoadmapStage", back_populates="topics")
    progress = relationship("LearningProgress", back_populates="topic", uselist=False)

class LearningProgress(Base):
    __tablename__ = "learning_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("roadmap_topics.id"), nullable=False)
    status = Column(String, default="Not Started")
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    user = relationship("User")
    topic = relationship("RoadmapTopic", back_populates="progress")

class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    score = Column(Integer)
    user = relationship("User", back_populates="assessments")
    attempts = relationship("AssessmentAttempt", back_populates="assessment", cascade="all, delete-orphan")

class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("assessment_questions.id"), nullable=False)
    answer = Column(Text)
    is_correct = Column(Boolean)
    assessment = relationship("Assessment", back_populates="attempts")
    question = relationship("AssessmentQuestion")

class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    options = Column(Text)  # JSON string of options
    correct_option = Column(String)

class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    full_name = Column(String)
    goal = Column(String)
    education_stage = Column(String)
    current_skill_level = Column(String)
    known_technologies = Column(Text)
    experience_level = Column(String)
    study_time_per_week = Column(Integer)
    target_timeline_months = Column(Integer)
    learning_style = Column(String)
    bio = Column(Text)
    avatar_url = Column(String)
    email = Column(String)
    user = relationship("User", back_populates="profile")

class Opportunity(Base):
    __tablename__ = "opportunities"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    related_goal = Column(String)
    users = relationship("User", secondary=user_opportunities, back_populates="opportunities")

class AIConversation(Base):
    __tablename__ = "ai_conversations"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    messages = relationship("AIMessage", back_populates="conversation", cascade="all, delete-orphan")

class AIMessage(Base):
    __tablename__ = "ai_messages"
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("ai_conversations.id"), nullable=False)
    role = Column(String)  # user or assistant
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)
    conversation = relationship("AIConversation", back_populates="messages")
