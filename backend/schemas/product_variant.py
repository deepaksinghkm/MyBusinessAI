from pydantic import BaseModel
from typing import Optional
from decimal import Decimal


class ProductVariantCreate(BaseModel):

    product_id: int

    color_id: Optional[int] = None

    size_id: Optional[int] = None

    unit_id: Optional[int] = None

    mrp: Decimal

    rate: Decimal

    stock: int = 0


class ProductVariantUpdate(BaseModel):

    color_id: Optional[int] = None

    size_id: Optional[int] = None

    unit_id: Optional[int] = None

    mrp: Optional[Decimal] = None

    rate: Optional[Decimal] = None

    stock: Optional[int] = None


class ProductVariantResponse(BaseModel):

    id: int

    product_id: int

    color_id: Optional[int]

    size_id: Optional[int]

    unit_id: Optional[int]

    mrp: Decimal

    rate: Decimal

    stock: int

    class Config:
        from_attributes = True