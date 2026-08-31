from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.api import auth, onboarding, roadmap, dashboard, profile, assessments, opportunities, simulator, ai_navigator

settings = get_settings()

app = FastAPI(title="NEXORA Backend", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(onboarding.router, prefix="/api/onboarding", tags=["onboarding"])
app.include_router(roadmap.router, prefix="/api/roadmap", tags=["roadmap"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])
app.include_router(assessments.router, prefix="/api/assessments", tags=["assessments"])
app.include_router(opportunities.router, prefix="/api/opportunities", tags=["opportunities"])
app.include_router(simulator.router, prefix="/api/simulator", tags=["simulator"])
app.include_router(ai_navigator.router, prefix="/api/ai-navigator", tags=["ai-navigator"])

@app.get("/")
async def root():
    return {"message": "NEXORA Backend is running"}
