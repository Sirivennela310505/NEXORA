import urllib.request
import json
import logging
from datetime import datetime
from app.schemas.ai_navigator import AIResponse, AIRequest
from app.core.config import get_settings

logger = logging.getLogger(__name__)

def generate_intelligent_fallback(user_msg: str) -> str:
    msg_lower = user_msg.lower()
    
    if any(k in msg_lower for k in ["resume", "cv", "portfolio"]):
        return (
            "📄 **Resume & Portfolio Recommendation:**\n"
            "1. **Highlight Impact:** Quantify achievements (e.g., 'Optimized query latency by 40%').\n"
            "2. **Key Projects:** Include 2-3 full-stack or AI projects with GitHub links and live demos.\n"
            "3. **Skill Matrix:** Group skills into Core Languages, Frameworks, Databases, and Tools.\n"
            "4. **Tailor for ATS:** Match keywords from the job description in your summary."
        )
    elif any(k in msg_lower for k in ["interview", "prep", "question", "mock"]):
        return (
            "🎯 **Interview Preparation Strategy:**\n"
            "1. **Behavioral (STAR Method):** Prepare Situation, Task, Action, Result stories for leadership & conflict.\n"
            "2. **System Design:** Practice components like Load Balancers, Caching (Redis), and DB Indexing.\n"
            "3. **DSA & Problem Solving:** Focus on Data Structures (Trees, Graphs, Dynamic Programming).\n"
            "4. **Mock Practice:** Practice explaining your thought process out loud."
        )
    elif any(k in msg_lower for k in ["python", "django", "fastapi", "flask"]):
        return (
            "🐍 **Python Career & Skill Guidance:**\n"
            "• **Foundations:** Master OOP, Generators, Decorators, and Asyncio.\n"
            "• **Frameworks:** Build RESTful APIs with FastAPI or Django REST Framework.\n"
            "• **Data & Testing:** Practice SQLAlchemy ORM, pytest unit testing, and Dockerization."
        )
    elif any(k in msg_lower for k in ["react", "frontend", "javascript", "typescript", "web"]):
        return (
            "⚡ **Frontend Engineering Path:**\n"
            "• **Core JS/TS:** Master ES6+, Async/Await, Closures, and TypeScript Interfaces.\n"
            "• **React Architecture:** Custom Hooks, Context API / Redux Toolkit, and Tailwind CSS.\n"
            "• **Performance:** Lazy Loading, Component Memoization, and Web Vitals optimization."
        )
    elif any(k in msg_lower for k in ["ai", "machine learning", "ml", "deep learning", "data science"]):
        return (
            "🤖 **AI & Data Science Roadmap:**\n"
            "• **Math & Statistics:** Linear Algebra, Probability, Calculus.\n"
            "• **Core Toolkit:** NumPy, Pandas, Scikit-learn, Matplotlib.\n"
            "• **Advanced AI:** PyTorch / TensorFlow, LLM Fine-Tuning, Prompt Engineering, and RAG architectures."
        )
    elif any(k in msg_lower for k in ["cloud", "devops", "aws", "docker", "kubernetes"]):
        return (
            "☁️ **Cloud & DevOps Best Practices:**\n"
            "• **Containerization:** Dockerize microservices and write efficient Dockerfiles.\n"
            "• **CI/CD:** Setup GitHub Actions or GitLab CI pipelines for automated testing & deployment.\n"
            "• **Cloud Infrastructure:** Master AWS (EC2, S3, RDS, Lambda) or GCP infrastructure as code (Terraform)."
        )
    elif any(k in msg_lower for k in ["cyber", "security", "hacking"]):
        return (
            "🛡️ **Cyber Security & Ethical Hacking Path:**\n"
            "• **Networking Fundamentals:** TCP/IP, OSI model, Subnetting, Wireshark packet analysis.\n"
            "• **Web Security:** OWASP Top 10 (SQLi, XSS, CSRF, Authentication bypasses).\n"
            "• **Hands-On Practice:** TryHackMe, HackTheBox, and Security+ / CEH certification paths."
        )
    else:
        return (
            f"💡 **NEXORA AI Career Recommendation:**\n"
            f"Based on your query regarding *'{user_msg}'*:\n\n"
            "1. **Skill Mastery:** Focus on building hands-on projects that solve real-world problems.\n"
            "2. **Structured Roadmap:** Follow your dynamic NEXORA roadmap stages and complete topics systematically.\n"
            "3. **Practical Simulation:** Head over to the Workplace Simulator to test your decision-making in real technical scenarios.\n"
            "4. **Career Opportunities:** Check the Opportunities tab for internships and hackathons tailored to your learning goals."
        )

async def chat_ai(user_id: int, request: AIRequest) -> AIResponse:
    settings = get_settings()
    api_key = settings.GEMINI_API_KEY or settings.VITE_GEMINI_API_KEY or settings.LLM_API_KEY
    
    # Filter placeholder keys
    if api_key and api_key.strip() and "your_gemini_api_key" not in api_key.lower():
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key.strip()}"
            prompt_data = {
                "contents": [{
                    "parts": [{
                        "text": f"You are NEXORA AI Navigator, a professional career coach and technical advisor. Respond concisely and helpfully to the student's prompt: {request.message}"
                    }]
                }]
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(prompt_data).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                result = json.loads(resp.read().decode("utf-8"))
                candidates = result.get("candidates", [])
                if candidates:
                    text_parts = candidates[0].get("content", {}).get("parts", [])
                    if text_parts:
                        reply = text_parts[0].get("text", "")
                        return AIResponse(reply=reply, timestamp=datetime.utcnow().isoformat())
        except Exception as e:
            logger.warning(f"Gemini API call failed, using intelligent fallback: {e}")

    # Intelligent context-aware AI response fallback
    reply = generate_intelligent_fallback(request.message)
    return AIResponse(reply=reply, timestamp=datetime.utcnow().isoformat())
