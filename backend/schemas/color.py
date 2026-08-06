from pydantic import BaseModel
from typing import Optional


class ColorCreate(BaseModel):
    code: str
    name: str
    hex_code: Optional[str] = None
    is_active: bool = True


class ColorUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    hex_code: Optional[str] = None
    is_active: Optional[bool] = None


class ColorResponse(BaseModel):
    id: int
    code: str
    name: str
    hex_code: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True
