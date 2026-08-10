from pydantic import BaseModel

from typing import Optional

from datetime import date

from decimal import Decimal


class PurchaseItemCreate(BaseModel):

    variant_id: int

    qty: int

    rate: Decimal

    discount: Decimal = Decimal("0")

    tax_percent: Decimal = Decimal("0")


class PurchaseCreate(BaseModel):

    purchase_no: str

    purchase_date: date

    supplier_id: int

    invoice_no: Optional[str] = None

    invoice_date: Optional[date] = None

    remarks: Optional[str] = None

    discount: Decimal = Decimal("0")

    tax: Decimal = Decimal("0")

    items: list[PurchaseItemCreate]


class PurchaseItemResponse(BaseModel):

    id: int

    purchase_id: int

    variant_id: int

    qty: int

    rate: Decimal

    discount: Decimal

    tax_percent: Decimal

    tax_amount: Decimal

    amount: Decimal

    class Config:

        from_attributes = True


class PurchaseResponse(BaseModel):

    id: int

    purchase_no: str

    purchase_date: date

    supplier_id: int

    invoice_no: Optional[str]

    invoice_date: Optional[date]

    remarks: Optional[str]

    subtotal: Decimal

    discount: Decimal

    tax: Decimal

    grand_total: Decimal

    items: list[PurchaseItemResponse]

    class Config:

        from_attributes = True
