from sqlalchemy.orm import Session
from app.database import models
from app.schemas import roadmap as roadmap_schema
from datetime import datetime

# Dynamic career path roadmap database
CAREER_ROADMAPS = {
    "full-stack": [
        {"title": "1. Web Foundations", "order": 1, "topics": ["HTML5 & Semantics", "CSS3 & Flexbox/Grid", "Modern JavaScript (ES6+)"]},
        {"title": "2. Frontend Architecture", "order": 2, "topics": ["React & Component Lifecycle", "State Management (Redux/Context)", "Tailwind CSS & Styling"]},
        {"title": "3. Backend API Development", "order": 3, "topics": ["Node.js / Python FastAPI", "RESTful API Design", "SQL & Relational Databases"]},
        {"title": "4. Deployment & DevOps", "order": 4, "topics": ["Docker & Containers", "CI/CD Pipelines", "Full-Stack Capstone Deployment"]},
    ],
    "ai": [
        {"title": "1. Mathematical & Programming Foundations", "order": 1, "topics": ["Linear Algebra & Calculus", "Python for Data Science", "Probability & Statistics"]},
        {"title": "2. Data Analysis & Machine Learning", "order": 2, "topics": ["NumPy & Pandas Data Wrangling", "Scikit-Learn Supervised Models", "Unsupervised Learning & Clustering"]},
        {"title": "3. Deep Learning & Neural Networks", "order": 3, "topics": ["TensorFlow / PyTorch", "Convolutional & Recurrent Networks", "Transformers & LLM Architectures"]},
        {"title": "4. AI Application Development", "order": 4, "topics": ["Prompt Engineering & RAG", "Model Deployment & FastAPI", "AI Capstone Project"]},
    ],
    "data science": [
        {"title": "1. Data Analysis Foundations", "order": 1, "topics": ["Python & SQL Queries", "Exploratory Data Analysis (EDA)", "Data Visualization (Matplotlib/Seaborn)"]},
        {"title": "2. Statistical Modeling & ML", "order": 2, "topics": ["Hypothesis Testing", "Regression & Classification", "Feature Engineering"]},
        {"title": "3. Big Data & Business Analytics", "order": 3, "topics": ["SQL Advanced Analytics", "PowerBI / Tableau Dashboards", "Big Data Tools (Spark)"]},
        {"title": "4. End-to-End Data Science Project", "order": 4, "topics": ["Model Evaluation Metrics", "Data Science Portfolio Project"]},
    ],
    "cyber": [
        {"title": "1. Networking & System Security", "order": 1, "topics": ["TCP/IP & OSI Model", "Linux Command Line & Scripting", "Network Protocols & Traffic Analysis"]},
        {"title": "2. Web Security & Penetration Testing", "order": 2, "topics": ["OWASP Top 10 Vulnerabilities", "Ethical Hacking & Port Scanning", "Burp Suite & Vulnerability Assessment"]},
        {"title": "3. Defensive Security & Cryptography", "order": 3, "topics": ["Symmetric & Asymmetric Encryption", "SIEM Tools & Log Monitoring", "Incident Response"]},
        {"title": "4. Security Capstone", "order": 4, "topics": ["Capture The Flag (CTF) Challenges", "Security Audit Report"]},
    ],
    "cloud": [
        {"title": "1. Linux & Networking Essentials", "order": 1, "topics": ["Linux Administration", "Shell Scripting", "Networking & DNS Setup"]},
        {"title": "2. Cloud Platforms & Infrastructure", "order": 2, "topics": ["AWS Core Services (EC2, S3, RDS)", "Infrastructure as Code (Terraform)", "Cloud Security & IAM"]},
        {"title": "3. DevOps & Automation", "order": 3, "topics": ["Docker & Containerization", "Kubernetes Orchestration", "GitHub Actions CI/CD"]},
        {"title": "4. DevOps Capstone", "order": 4, "topics": ["Automated Cloud Infrastructure Setup"]},
    ],
    "mobile": [
        {"title": "1. Mobile UI & Language Basics", "order": 1, "topics": ["Dart / React Native JS", "Mobile UI Components", "State Management"]},
        {"title": "2. API Integration & Local Storage", "order": 2, "topics": ["REST API Consumption", "SQLite / Async Storage", "Authentication Flow"]},
        {"title": "3. Native Features & Publishing", "order": 3, "topics": ["Device Hardware APIs (Camera, GPS)", "Push Notifications", "App Store / Google Play Prep"]},
    ]
}

def generate_roadmap(db: Session, user_id: int):
    # Fetch onboarding profile
    onboarding = db.query(models.OnboardingProfile).filter(models.OnboardingProfile.user_id == user_id).first()
    goal = (onboarding.goal if onboarding and onboarding.goal else "Software Engineer").lower()
    
    # Select matching career roadmap
    stages_data = None
    for key, path in CAREER_ROADMAPS.items():
        if key in goal:
            stages_data = path
            break
            
    if not stages_data:
        # Generic Software Engineering Roadmap
        stages_data = [
            {"title": "1. Computer Science Foundations", "order": 1, "topics": ["Programming Fundamentals", "Data Structures & Algorithms", "Git & Version Control"]},
            {"title": "2. Core Application Development", "order": 2, "topics": ["Object Oriented Programming", "Database Design & SQL", "RESTful Web APIs"]},
            {"title": "3. Software Architecture", "order": 3, "topics": ["Design Patterns", "Unit Testing & Debugging", "System Architecture"]},
            {"title": "4. Capstone Project", "order": 4, "topics": ["Industry Ready Capstone Project"]},
        ]

    # Create Roadmap record
    roadmap = models.Roadmap(
        user_id=user_id,
        title=f"Adaptive Career Path: {onboarding.goal if onboarding else 'Software Engineer'}",
        goal=onboarding.goal if onboarding else "Software Engineering",
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
                description=f"Master {topic_title} for your target career role.",
                status="Completed" if (stage_info["order"] == 1 and idx == 1) else ("Upcoming" if (stage_info["order"] == 1) else "Locked"),
                estimated_duration_hours=12,
                difficulty="Beginner" if stage_info["order"] == 1 else ("Intermediate" if stage_info["order"] <= 3 else "Advanced"),
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
