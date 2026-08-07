from pydantic import BaseModel
from typing import Optional


class BrandBase(BaseModel):
    name: str
    description: Optional[str] = None
    logo: Optional[str] = None
    is_active: Optional[bool] = True


class BrandCreate(BrandBase):
    pass


class BrandUpdate(BrandBase):
    pass


class BrandResponse(BrandBase):
    id: int

    class Config:
        from_attributes = True
