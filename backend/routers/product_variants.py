from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db

from models.product import Product
from models.color import Color
from models.size import Size
from models.unit import Unit
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
# CURRENT STOCK
# =========================================================

def calculate_current_stock(
    db: Session,
    variant_id: int,
):

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

    sales = (
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

    return (
        int(incoming or 0)
        - int(sales or 0)
    )


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

    # Product
    product = (
        db.query(Product)
        .filter(
            Product.id
            == data.product_id
        )
        .first()
    )

    if not product:

        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    # Colour
    if data.color_id is not None:

        color = (
            db.query(Color)
            .filter(
                Color.id
                == data.color_id
            )
            .first()
        )

        if not color:

            raise HTTPException(
                status_code=404,
                detail="Color not found",
            )

    # Size
    if data.size_id is not None:

        size = (
            db.query(Size)
            .filter(
                Size.id
                == data.size_id
            )
            .first()
        )

        if not size:

            raise HTTPException(
                status_code=404,
                detail="Size not found",
            )

    # Unit
    if data.unit_id is not None:

        unit = (
            db.query(Unit)
            .filter(
                Unit.id
                == data.unit_id
            )
            .first()
        )

        if not unit:

            raise HTTPException(
                status_code=404,
                detail="Unit not found",
            )

    # Price validation
    if data.mrp < 0:

        raise HTTPException(
            status_code=400,
            detail="MRP cannot be negative",
        )

    if data.rate < 0:

        raise HTTPException(
            status_code=400,
            detail="Rate cannot be negative",
        )

    if data.rate > data.mrp:

        raise HTTPException(
            status_code=400,
            detail="Rate cannot be greater than MRP",
        )

    if data.stock < 0:

        raise HTTPException(
            status_code=400,
            detail="Opening stock cannot be negative",
        )

    # Duplicate
    duplicate = (
        db.query(ProductVariant)
        .filter(
            ProductVariant.product_id
            == data.product_id,

            ProductVariant.color_id
            == data.color_id,

            ProductVariant.size_id
            == data.size_id,

            ProductVariant.unit_id
            == data.unit_id,
        )
        .first()
    )

    if duplicate:

        raise HTTPException(
            status_code=400,
            detail=(
                "This Product + Color + "
                "Size + Unit variant "
                "already exists"
            ),
        )

    try:

        variant = ProductVariant(
            product_id=data.product_id,
            color_id=data.color_id,
            size_id=data.size_id,
            unit_id=data.unit_id,
            mrp=data.mrp,
            rate=data.rate,
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
                remarks=(
                    "Opening stock while "
                    "creating product variant"
                ),
            )

            db.add(opening_entry)

        db.commit()

        db.refresh(variant)

        current_stock = (
            calculate_current_stock(
                db,
                variant.id,
            )
        )

        return {
            "id": variant.id,
            "product_id": variant.product_id,
            "color_id": variant.color_id,
            "size_id": variant.size_id,
            "unit_id": variant.unit_id,
            "mrp": variant.mrp,
            "rate": variant.rate,
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
    response_model=list[
        ProductVariantResponse
    ],
)
def get_variants(
    db: Session = Depends(get_db),
):

    variants = (
        db.query(ProductVariant)
        .order_by(
            ProductVariant.id.desc()
        )
        .all()
    )

    result = []

    for variant in variants:

        current_stock = (
            calculate_current_stock(
                db,
                variant.id,
            )
        )

        result.append(
            {
                "id": variant.id,
                "product_id": variant.product_id,
                "color_id": variant.color_id,
                "size_id": variant.size_id,
                "unit_id": variant.unit_id,
                "mrp": variant.mrp,
                "rate": variant.rate,
                "stock": current_stock,
            }
        )

    return result


# =========================================================
# GET PRODUCT VARIANTS
# =========================================================

@router.get(
    "/product/{product_id}",
    response_model=list[
        ProductVariantResponse
    ],
)
def get_product_variants(
    product_id: int,
    db: Session = Depends(get_db),
):

    product = (
        db.query(Product)
        .filter(
            Product.id == product_id
        )
        .first()
    )

    if not product:

        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    variants = (
        db.query(ProductVariant)
        .filter(
            ProductVariant.product_id
            == product_id
        )
        .order_by(
            ProductVariant.id.asc()
        )
        .all()
    )

    result = []

    for variant in variants:

        current_stock = (
            calculate_current_stock(
                db,
                variant.id,
            )
        )

        result.append(
            {
                "id": variant.id,
                "product_id": variant.product_id,
                "color_id": variant.color_id,
                "size_id": variant.size_id,
                "unit_id": variant.unit_id,
                "mrp": variant.mrp,
                "rate": variant.rate,
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
            ProductVariant.id
            == variant_id
        )
        .first()
    )

    if not variant:

        raise HTTPException(
            status_code=404,
            detail="Variant not found",
        )

    current_stock = (
        calculate_current_stock(
            db,
            variant.id,
        )
    )

    return {
        "id": variant.id,
        "product_id": variant.product_id,
        "color_id": variant.color_id,
        "size_id": variant.size_id,
        "unit_id": variant.unit_id,
        "mrp": variant.mrp,
        "rate": variant.rate,
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
            ProductVariant.id
            == variant_id
        )
        .first()
    )

    if not variant:

        raise HTTPException(
            status_code=404,
            detail="Variant not found",
        )

    update_data = data.model_dump(
        exclude_unset=True
    )

    new_color_id = update_data.get(
        "color_id",
        variant.color_id,
    )

    new_size_id = update_data.get(
        "size_id",
        variant.size_id,
    )

    new_unit_id = update_data.get(
        "unit_id",
        variant.unit_id,
    )

    new_mrp = update_data.get(
        "mrp",
        variant.mrp,
    )

    new_rate = update_data.get(
        "rate",
        variant.rate,
    )

    new_stock = update_data.get(
        "stock",
        variant.stock,
    )

    if new_color_id is not None:

        if not (
            db.query(Color)
            .filter(
                Color.id
                == new_color_id
            )
            .first()
        ):

            raise HTTPException(
                status_code=404,
                detail="Color not found",
            )

    if new_size_id is not None:

        if not (
            db.query(Size)
            .filter(
                Size.id
                == new_size_id
            )
            .first()
        ):

            raise HTTPException(
                status_code=404,
                detail="Size not found",
            )

    if new_unit_id is not None:

        if not (
            db.query(Unit)
            .filter(
                Unit.id
                == new_unit_id
            )
            .first()
        ):

            raise HTTPException(
                status_code=404,
                detail="Unit not found",
            )

    if new_mrp < 0:

        raise HTTPException(
            status_code=400,
            detail="MRP cannot be negative",
        )

    if new_rate < 0:

        raise HTTPException(
            status_code=400,
            detail="Rate cannot be negative",
        )

    if new_rate > new_mrp:

        raise HTTPException(
            status_code=400,
            detail="Rate cannot be greater than MRP",
        )

    if new_stock < 0:

        raise HTTPException(
            status_code=400,
            detail="Stock cannot be negative",
        )

    duplicate = (
        db.query(ProductVariant)
        .filter(
            ProductVariant.product_id
            == variant.product_id,

            ProductVariant.color_id
            == new_color_id,

            ProductVariant.size_id
            == new_size_id,

            ProductVariant.unit_id
            == new_unit_id,

            ProductVariant.id
            != variant.id,
        )
        .first()
    )

    if duplicate:

        raise HTTPException(
            status_code=400,
            detail=(
                "This Product + Color + "
                "Size + Unit variant "
                "already exists"
            ),
        )

    # Do not directly manipulate stock
    # because stock ledger controls it.
    for key in [
        "color_id",
        "size_id",
        "unit_id",
        "mrp",
        "rate",
    ]:

        if key in update_data:

            setattr(
                variant,
                key,
                update_data[key],
            )

    db.commit()
    db.refresh(variant)

    current_stock = (
        calculate_current_stock(
            db,
            variant.id,
        )
    )

    return {
        "id": variant.id,
        "product_id": variant.product_id,
        "color_id": variant.color_id,
        "size_id": variant.size_id,
        "unit_id": variant.unit_id,
        "mrp": variant.mrp,
        "rate": variant.rate,
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
            ProductVariant.id
            == variant_id
        )
        .first()
    )

    if not variant:

        raise HTTPException(
            status_code=404,
            detail="Variant not found",
        )

    db.query(StockLedger).filter(
        StockLedger.variant_id
        == variant_id
    ).delete(
        synchronize_session=False
    )

    db.delete(variant)

    db.commit()

    return {
        "message": (
            "Variant and related "
            "stock ledger deleted successfully"
        )
    }