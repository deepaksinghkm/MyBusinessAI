from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db

from models.stock_ledger import StockLedger
from models.product_variant import ProductVariant

from schemas.stock_ledger import (
    StockLedgerCreate,
    StockLedgerResponse,
)


router = APIRouter(
    prefix="/stock-ledger",
    tags=["Stock Ledger"],
)


# =========================================================
# CREATE STOCK TRANSACTION
# =========================================================

@router.post(
    "/",
    response_model=StockLedgerResponse,
)
def create_stock_entry(
    data: StockLedgerCreate,
    db: Session = Depends(get_db),
):

    variant = (
        db.query(ProductVariant)
        .filter(
            ProductVariant.id == data.variant_id
        )
        .first()
    )

    if not variant:
        raise HTTPException(
            status_code=404,
            detail="Variant not found",
        )

    allowed_types = [
        "Opening",
        "Purchase",
        "Sale",
        "Adjustment",
    ]

    if data.transaction_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid transaction type. "
                "Allowed: Opening, Purchase, Sale, Adjustment"
            ),
        )

    if data.qty == 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity cannot be zero",
        )

    # Opening / Purchase / Sale must be positive.
    # Adjustment can be positive or negative.

    if data.transaction_type in [
        "Opening",
        "Purchase",
        "Sale",
    ] and data.qty < 0:
        raise HTTPException(
            status_code=400,
            detail=(
                f"{data.transaction_type} quantity "
                "must be positive"
            ),
        )

    # Prevent multiple opening entries for same variant

    if data.transaction_type == "Opening":

        existing_opening = (
            db.query(StockLedger)
            .filter(
                StockLedger.variant_id
                == data.variant_id,
                StockLedger.transaction_type
                == "Opening",
            )
            .first()
        )

        if existing_opening:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Opening stock already exists "
                    "for this variant"
                ),
            )

    entry = StockLedger(
        variant_id=data.variant_id,
        transaction_type=data.transaction_type,
        qty=data.qty,
        reference_no=data.reference_no,
        remarks=data.remarks,
    )

    db.add(entry)
    db.commit()
    db.refresh(entry)

    return entry


# =========================================================
# GET ALL STOCK LEDGER
# =========================================================

@router.get(
    "/",
    response_model=list[StockLedgerResponse],
)
def get_stock_ledger(
    db: Session = Depends(get_db),
):

    return (
        db.query(StockLedger)
        .order_by(
            StockLedger.id.desc()
        )
        .all()
    )


# =========================================================
# GET LEDGER BY VARIANT
# =========================================================

@router.get(
    "/variant/{variant_id}",
    response_model=list[StockLedgerResponse],
)
def get_variant_stock_ledger(
    variant_id: int,
    db: Session = Depends(get_db),
):

    variant = (
        db.query(ProductVariant)
        .filter(
            ProductVariant.id == variant_id
        )
        .first()
    )

    if not variant:
        raise HTTPException(
            status_code=404,
            detail="Variant not found",
        )

    return (
        db.query(StockLedger)
        .filter(
            StockLedger.variant_id
            == variant_id
        )
        .order_by(
            StockLedger.id.desc()
        )
        .all()
    )


# =========================================================
# CURRENT STOCK
# =========================================================

@router.get(
    "/current-stock/{variant_id}"
)
def current_stock(
    variant_id: int,
    db: Session = Depends(get_db),
):

    variant = (
        db.query(ProductVariant)
        .filter(
            ProductVariant.id == variant_id
        )
        .first()
    )

    if not variant:
        raise HTTPException(
            status_code=404,
            detail="Variant not found",
        )

    incoming = (
        db.query(
            func.coalesce(
                func.sum(
                    StockLedger.qty
                ),
                0,
            )
        )
        .filter(
            StockLedger.variant_id
            == variant_id,

            StockLedger.transaction_type.in_(
                [
                    "Opening",
                    "Purchase",
                    "Adjustment",
                ]
            ),
        )
        .scalar()
    )

    sale = (
        db.query(
            func.coalesce(
                func.sum(
                    StockLedger.qty
                ),
                0,
            )
        )
        .filter(
            StockLedger.variant_id
            == variant_id,

            StockLedger.transaction_type
            == "Sale",
        )
        .scalar()
    )

    current = (
        int(incoming or 0)
        - int(sale or 0)
    )

    return {
        "variant_id": variant_id,
        "current_stock": current,
    }