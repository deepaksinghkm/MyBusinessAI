from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    username: str
    full_name: str
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    full_name: str
    email: EmailStr
    is_active: bool


class UserResponse(BaseModel):
    id: int
    username: str
    full_name: str
    email: str
    is_active: bool

    class Config:
        from_attributes = True
