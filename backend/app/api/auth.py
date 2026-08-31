from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import auth as auth_schemas
from app.services import auth_service
from app.core.security import create_access_token
from app.database.database import get_db

router = APIRouter()

@router.post("/register", response_model=auth_schemas.TokenResponse)
def register(request: auth_schemas.RegisterRequest, db: Session = Depends(get_db)):
    if request.password != request.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match")
    user = auth_service.create_user(db, request.full_name, request.email, request.password)
    access_token = create_access_token(data={"sub": str(user.id)})
    return auth_schemas.TokenResponse(access_token=access_token)

@router.post("/login", response_model=auth_schemas.TokenResponse)
def login(request: auth_schemas.LoginRequest, db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": str(user.id)})
    return auth_schemas.TokenResponse(access_token=access_token)

from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from app.core.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = db.query(auth_service.models.User).filter(auth_service.models.User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@router.get("/me", response_model=auth_schemas.UserResponse)
def read_current_user(current_user = Depends(get_current_user)):
    return auth_schemas.UserResponse(
        id=current_user.id,
        full_name=current_user.full_name,
        email=current_user.email,
        is_active=current_user.is_active,
    )
