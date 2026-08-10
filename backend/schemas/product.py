from pydantic import BaseModel
from typing import Optional


class ProductCreate(BaseModel):
    sku: str
    name: str
    brand_id: int
    category_id: int
    mrp: int

    image: str

    packing_qty: int
    packing_type: str

    description: Optional[str] = None


class ProductUpdate(BaseModel):
    sku: Optional[str] = None
    name: Optional[str] = None
    brand_id: Optional[int] = None
    category_id: Optional[int] = None

    mrp: Optional[int] = None

    image: Optional[str] = None

    packing_qty: Optional[int] = None
    packing_type: Optional[str] = None

    description: Optional[str] = None


class ProductResponse(BaseModel):
    id: int
    sku: str
    name: str
    brand_id: int
    category_id: int
    mrp: int
    image: Optional[str]
    packing_qty: int
    packing_type: str
    description: Optional[str]

    class Config:
        from_attributes = True
from pydantic import BaseModel
from typing import Optional


class ProductCreate(BaseModel):
    sku: str
    name: str
    brand_id: int
    category_id: int
    mrp: float

    image: str

    packing_qty: int
    packing_type: str

    description: Optional[str] = None


class ProductUpdate(BaseModel):
    sku: Optional[str] = None
    name: Optional[str] = None
    brand_id: Optional[int] = None
    category_id: Optional[int] = None

    mrp: Optional[float] = None

    image: Optional[str] = None

    packing_qty: Optional[int] = None
    packing_type: Optional[str] = None

    description: Optional[str] = None


class ProductResponse(BaseModel):
    id: int

    sku: str
    name: str

    brand_id: int
    category_id: int

    mrp: float

    image: Optional[str]

    packing_qty: int
    packing_type: str

    description: Optional[str]

    class Config:
        from_attributes = True
