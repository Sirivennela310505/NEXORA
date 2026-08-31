from datetime import datetime
from app.schemas.ai_navigator import AIResponse, AIRequest

async def chat_ai(user_id: int, request: AIRequest) -> AIResponse:
    """Mock AI navigator that simply echoes the message with a timestamp.
    In a real implementation this would call an LLM service.
    """
    reply = f"Echo from AI Navigator: {request.message}"
    timestamp = datetime.utcnow().isoformat()
    return AIResponse(reply=reply, timestamp=timestamp)
