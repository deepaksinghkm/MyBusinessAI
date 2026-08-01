from fastapi import APIRouter
from schemas.login import LoginRequest

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login")
def login(data: LoginRequest):
    return {
        "status": "success",
        "message": "Login Successful",
        "username": data.username
    }
