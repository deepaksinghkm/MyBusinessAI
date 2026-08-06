from pydantic import BaseModel
from typing import Optional


class ProductVariantCreate(BaseModel):
    product_id: int
    color_id: int
    size_id: int


class ProductVariantUpdate(BaseModel):
    color_id: Optional[int] = None
    size_id: Optional[int] = None


class ProductVariantResponse(BaseModel):
    id: int
    product_id: int
    color_id: int
    size_id: int

    class Config:
        from_attributes = True
