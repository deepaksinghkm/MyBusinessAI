from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db

from models.product import Product
from models.color import Color
from models.size import Size
from models.product_variant import ProductVariant
from models.stock_ledger import StockLedger

from schemas.product_variant import (
    ProductVariantCreate,
    ProductVariantUpdate,
    ProductVariantResponse,
)


router = APIRouter(
    prefix="/product-variants",
    tags=["Product Variants"],
)


# =========================================================
# HELPER - CURRENT STOCK
# =========================================================

def calculate_current_stock(
    db: Session,
    variant_id: int,
):
    incoming = (
        db.query(
            func.coalesce(
                func.sum(StockLedger.qty),
                0,
            )
        )
        .filter(
            StockLedger.variant_id == variant_id,
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

    sales = (
        db.query(
            func.coalesce(
                func.sum(StockLedger.qty),
                0,
            )
        )
        .filter(
            StockLedger.variant_id == variant_id,
            StockLedger.transaction_type == "Sale",
        )
        .scalar()
    )

    return int(incoming or 0) - int(sales or 0)


# =========================================================
# CREATE VARIANT
# =========================================================

@router.post(
    "/",
    response_model=ProductVariantResponse,
)
def create_variant(
    data: ProductVariantCreate,
    db: Session = Depends(get_db),
):

    # Product check

    product = (
        db.query(Product)
        .filter(
            Product.id == data.product_id
        )
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    # Color check

    color = (
        db.query(Color)
        .filter(
            Color.id == data.color_id
        )
        .first()
    )

    if not color:
        raise HTTPException(
            status_code=404,
            detail="Color not found",
        )

    # Size check

    size = (
        db.query(Size)
        .filter(
            Size.id == data.size_id
        )
        .first()
    )

    if not size:
        raise HTTPException(
            status_code=404,
            detail="Size not found",
        )

    # Duplicate check

    duplicate = (
        db.query(ProductVariant)
        .filter(
            ProductVariant.product_id
            == data.product_id,

            ProductVariant.color_id
            == data.color_id,

            ProductVariant.size_id
            == data.size_id,
        )
        .first()
    )

    if duplicate:
        raise HTTPException(
            status_code=400,
            detail="This Product + Color + Size variant already exists",
        )

    # Stock validation

    if data.stock < 0:
        raise HTTPException(
            status_code=400,
            detail="Opening stock cannot be negative",
        )

    try:

        # Create variant

        variant = ProductVariant(
            product_id=data.product_id,
            color_id=data.color_id,
            size_id=data.size_id,
            stock=data.stock,
        )

        db.add(variant)
        db.flush()

        # Opening stock ledger

        if data.stock > 0:

            opening_entry = StockLedger(
                variant_id=variant.id,
                transaction_type="Opening",
                qty=data.stock,
                reference_no="OPENING",
                remarks="Opening stock while creating product variant",
            )

            db.add(opening_entry)

        db.commit()
        db.refresh(variant)

        current_stock = calculate_current_stock(
            db,
            variant.id,
        )

        return {
            "id": variant.id,
            "product_id": variant.product_id,
            "color_id": variant.color_id,
            "size_id": variant.size_id,
            "stock": current_stock,
        }

    except Exception:
        db.rollback()
        raise


# =========================================================
# GET ALL VARIANTS
# =========================================================

@router.get(
    "/",
    response_model=list[ProductVariantResponse],
)
def get_variants(
    db: Session = Depends(get_db),
):

    variants = (
        db.query(ProductVariant)
        .order_by(ProductVariant.id.desc())
        .all()
    )

    result = []

    for variant in variants:

        current_stock = calculate_current_stock(
            db,
            variant.id,
        )

        result.append(
            {
                "id": variant.id,
                "product_id": variant.product_id,
                "color_id": variant.color_id,
                "size_id": variant.size_id,
                "stock": current_stock,
            }
        )

    return result


# =========================================================
# GET SINGLE VARIANT
# =========================================================

@router.get(
    "/{variant_id}",
    response_model=ProductVariantResponse,
)
def get_variant(
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

    current_stock = calculate_current_stock(
        db,
        variant.id,
    )

    return {
        "id": variant.id,
        "product_id": variant.product_id,
        "color_id": variant.color_id,
        "size_id": variant.size_id,
        "stock": current_stock,
    }


# =========================================================
# UPDATE VARIANT
# =========================================================

@router.put(
    "/{variant_id}",
    response_model=ProductVariantResponse,
)
def update_variant(
    variant_id: int,
    data: ProductVariantUpdate,
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

    # Color validation

    if data.color_id is not None:

        color = (
            db.query(Color)
            .filter(
                Color.id == data.color_id
            )
            .first()
        )

        if not color:
            raise HTTPException(
                status_code=404,
                detail="Color not found",
            )

    # Size validation

    if data.size_id is not None:

        size = (
            db.query(Size)
            .filter(
                Size.id == data.size_id
            )
            .first()
        )

        if not size:
            raise HTTPException(
                status_code=404,
                detail="Size not found",
            )

    update_data = data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            variant,
            key,
            value,
        )

    # Check duplicate after update

    duplicate = (
        db.query(ProductVariant)
        .filter(
            ProductVariant.product_id
            == variant.product_id,

            ProductVariant.color_id
            == variant.color_id,

            ProductVariant.size_id
            == variant.size_id,

            ProductVariant.id
            != variant.id,
        )
        .first()
    )

    if duplicate:
        raise HTTPException(
            status_code=400,
            detail="This Product + Color + Size variant already exists",
        )

    db.commit()
    db.refresh(variant)

    current_stock = calculate_current_stock(
        db,
        variant.id,
    )

    return {
        "id": variant.id,
        "product_id": variant.product_id,
        "color_id": variant.color_id,
        "size_id": variant.size_id,
        "stock": current_stock,
    }


# =========================================================
# DELETE VARIANT
# =========================================================

@router.delete(
    "/{variant_id}"
)
def delete_variant(
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

    # Delete related stock ledger entries first

    db.query(StockLedger).filter(
        StockLedger.variant_id
        == variant_id
    ).delete(
        synchronize_session=False
    )

    db.delete(variant)

    db.commit()

    return {
        "message": "Variant and related stock ledger deleted successfully"
    }