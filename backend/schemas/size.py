from pydantic import BaseModel
from typing import Optional


class SizeCreate(BaseModel):
    code: str
    name: str
    size_type: str
    is_active: bool = True


class SizeUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    size_type: Optional[str] = None
    is_active: Optional[bool] = None


class SizeResponse(BaseModel):
    id: int
    code: str
    name: str
    size_type: str
    is_active: bool

    class Config:
        from_attributes = True
