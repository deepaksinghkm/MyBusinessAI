from pydantic import BaseModel
from typing import Optional


class BrandBase(BaseModel):
    code: Optional[str] = None

    name: str

    description: Optional[str] = None

    logo: Optional[str] = None

    is_active: Optional[bool] = True


class BrandCreate(BrandBase):
    pass


class BrandUpdate(BaseModel):
    code: Optional[str] = None

    name: Optional[str] = None

    description: Optional[str] = None

    logo: Optional[str] = None

    is_active: Optional[bool] = None


class BrandResponse(BrandBase):
    id: int

    class Config:
        from_attributes = True