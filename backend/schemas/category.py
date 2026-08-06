from pydantic import BaseModel
from typing import Optional


class CategoryCreate(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    is_active: bool = True


class CategoryUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class CategoryResponse(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True
