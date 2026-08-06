from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db

from models.stock_ledger import StockLedger
from models.product_variant import ProductVariant

from schemas.stock_ledger import (
    StockLedgerCreate,
    StockLedgerResponse
)

router = APIRouter(
    prefix="/stock-ledger",
    tags=["Stock Ledger"]
)


@router.post("/", response_model=StockLedgerResponse)
def create_stock_entry(
    data: StockLedgerCreate,
    db: Session = Depends(get_db)
):

    variant = db.query(ProductVariant).filter(
        ProductVariant.id == data.variant_id
    ).first()

    if not variant:
        raise HTTPException(
            status_code=404,
            detail="Variant not found"
        )

    entry = StockLedger(**data.model_dump())

    db.add(entry)
    db.commit()
    db.refresh(entry)

    return entry


@router.get("/", response_model=list[StockLedgerResponse])
def get_stock_ledger(db: Session = Depends(get_db)):
    return db.query(StockLedger).all()


@router.get("/current-stock/{variant_id}")
def current_stock(
    variant_id: int,
    db: Session = Depends(get_db)
):

    variant = db.query(ProductVariant).filter(
        ProductVariant.id == variant_id
    ).first()

    if not variant:
        raise HTTPException(
            status_code=404,
            detail="Variant not found"
        )

    opening = db.query(func.coalesce(func.sum(StockLedger.qty), 0)).filter(
        StockLedger.variant_id == variant_id,
        StockLedger.transaction_type.in_(["Opening", "Purchase", "Adjustment"])
    ).scalar()

    sale = db.query(func.coalesce(func.sum(StockLedger.qty), 0)).filter(
        StockLedger.variant_id == variant_id,
        StockLedger.transaction_type == "Sale"
    ).scalar()

    current = opening - sale

    return {
        "variant_id": variant_id,
        "current_stock": current
    }
