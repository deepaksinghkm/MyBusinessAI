from pydantic import BaseModel
from typing import Optional


class BrandCreate(BaseModel):
    code: str
    name: str
    description: Optional[str] = None
    is_active: bool = True


class BrandUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class BrandResponse(BaseModel):
    id: int
    code: str
    name: str
    description: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True
