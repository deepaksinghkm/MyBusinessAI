from pydantic import BaseModel
from typing import Optional
from decimal import Decimal


class ProductCreate(BaseModel):

    name: str

    brand_id: int

    category_id: int

    discount_percent: Decimal = Decimal("0")

    image: Optional[str] = None

    packing_qty: int = 0

    packing_type: str = "Carton"

    description: Optional[str] = None


class ProductUpdate(BaseModel):

    name: Optional[str] = None

    brand_id: Optional[int] = None

    category_id: Optional[int] = None

    discount_percent: Optional[Decimal] = None

    image: Optional[str] = None

    packing_qty: Optional[int] = None

    packing_type: Optional[str] = None

    description: Optional[str] = None


class ProductResponse(BaseModel):

    id: int

    name: str

    brand_id: int

    category_id: int

    discount_percent: Decimal

    image: Optional[str]

    packing_qty: int

    packing_type: str

    description: Optional[str]

    class Config:
        from_attributes = True