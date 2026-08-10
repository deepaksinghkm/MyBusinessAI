from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class StockLedgerCreate(BaseModel):
    variant_id: int
    transaction_type: str
    qty: int
    reference_no: Optional[str] = None
    remarks: Optional[str] = None


class StockLedgerResponse(BaseModel):
    id: int
    variant_id: int
    transaction_type: str
    qty: int
    reference_no: Optional[str] = None
    remarks: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True