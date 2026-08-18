from pydantic import BaseModel

from typing import Optional

from datetime import date

from decimal import Decimal


class SaleItemCreate(BaseModel):

    variant_id: int

    qty: int

    rate: Decimal

    discount: Decimal = Decimal("0")

    tax_percent: Decimal = Decimal("0")


class SaleCreate(BaseModel):

    sale_no: str

    sale_date: date

    # =====================================================
    # BILL TO / SHIP TO
    # =====================================================

    bill_to_customer_id: Optional[int] = None

    ship_to_customer_id: Optional[int] = None

    # =====================================================
    # OLD CUSTOMER DETAILS
    # =====================================================

    customer_name: Optional[str] = None

    customer_mobile: Optional[str] = None

    invoice_no: Optional[str] = None

    remarks: Optional[str] = None

    discount: Decimal = Decimal("0")

    tax: Decimal = Decimal("0")

    items: list[SaleItemCreate]


class SaleItemResponse(BaseModel):

    id: int

    sale_id: int

    variant_id: int

    qty: int

    rate: Decimal

    discount: Decimal

    tax_percent: Decimal

    tax_amount: Decimal

    amount: Decimal

    class Config:

        from_attributes = True


class SaleResponse(BaseModel):

    id: int

    sale_no: str

    sale_date: date

    # =====================================================
    # BILL TO / SHIP TO
    # =====================================================

    bill_to_customer_id: Optional[int]

    ship_to_customer_id: Optional[int]

    # =====================================================
    # OLD CUSTOMER DETAILS
    # =====================================================

    customer_name: Optional[str]

    customer_mobile: Optional[str]

    invoice_no: Optional[str]

    remarks: Optional[str]

    subtotal: Decimal

    discount: Decimal

    tax: Decimal

    grand_total: Decimal

    items: list[SaleItemResponse]

    class Config:

        from_attributes = True