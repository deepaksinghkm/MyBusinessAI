from pydantic import BaseModel
from typing import Optional


class UnitCreate(BaseModel):
    code: str
    name: str
    short_name: str
    is_active: bool = True


class UnitUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    short_name: Optional[str] = None
    is_active: Optional[bool] = None


class UnitResponse(BaseModel):
    id: int
    code: str
    name: str
    short_name: str
    is_active: bool

    class Config:
        from_attributes = True
