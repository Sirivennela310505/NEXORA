from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.ai_navigator import AIRequest, AIResponse
from app.services.ai_service import chat_ai
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/ai-navigator", tags=["AI Navigator"])

@router.post("/chat", response_model=AIResponse)
async def chat(request: AIRequest, current_user = Depends(get_current_user)):
    """Simple mock AI navigator that echoes back the user's message."""
    try:
        response = await chat_ai(current_user.id, request)
        return response
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
