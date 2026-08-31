import os
from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache

class Settings(BaseSettings):
    # Core settings
    DATABASE_URL: str = Field(default="sqlite:///./nexora.db")
    JWT_SECRET_KEY: str = Field(default="supersecretkey")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60)
    ALGORITHM: str = Field(default="HS256")
    # CORS
    FRONTEND_URL: str = Field(default="http://localhost:5173")
    # LLM configuration (generic)
    LLM_API_URL: str = Field(default="")
    LLM_API_KEY: str = Field(default="")

    model_config = {"env_file": os.path.join(os.path.dirname(__file__), "..", "..", "..", ".env"), "env_file_encoding": "utf-8"}

@lru_cache()
def get_settings() -> Settings:
    return Settings()
