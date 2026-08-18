from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from models.product import Product
from models.brand import Brand
from models.category import Category

from schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
)


router = APIRouter(
    prefix="/products",
    tags=["Products"],
)


# =========================================================
# CREATE PRODUCT
# =========================================================

@router.post(
    "/",
    response_model=ProductResponse,
)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
):

    # Validate name
    if not product.name.strip():
        raise HTTPException(
            status_code=400,
            detail="Product Name is required",
        )

    # Validate brand
    brand = (
        db.query(Brand)
        .filter(
            Brand.id == product.brand_id
        )
        .first()
    )

    if not brand:
        raise HTTPException(
            status_code=404,
            detail="Brand not found",
        )

    # Validate category
    category = (
        db.query(Category)
        .filter(
            Category.id == product.category_id
        )
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found",
        )

    # Discount validation
    if (
        product.discount_percent < 0
        or product.discount_percent > 100
    ):
        raise HTTPException(
            status_code=400,
            detail="Discount must be between 0 and 100",
        )

    new_product = Product(
        name=product.name.strip(),
        brand_id=product.brand_id,
        category_id=product.category_id,
        discount_percent=product.discount_percent,
        image=product.image,
        packing_qty=product.packing_qty,
        packing_type=product.packing_type,
        description=product.description,
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


# =========================================================
# GET PRODUCTS
# =========================================================

@router.get(
    "/",
    response_model=list[ProductResponse],
)
def get_products(
    db: Session = Depends(get_db),
):

    return (
        db.query(Product)
        .order_by(Product.id.desc())
        .all()
    )


# =========================================================
# GET SINGLE PRODUCT
# =========================================================

@router.get(
    "/{product_id}",
    response_model=ProductResponse,
)
def get_product(
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

    return product


# =========================================================
# UPDATE PRODUCT
# =========================================================

@router.put(
    "/{product_id}",
    response_model=ProductResponse,
)
def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db),
):

    db_product = (
        db.query(Product)
        .filter(
            Product.id == product_id
        )
        .first()
    )

    if not db_product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    update_data = product.model_dump(
        exclude_unset=True
    )

    if "name" in update_data:

        if not str(
            update_data["name"]
        ).strip():

            raise HTTPException(
                status_code=400,
                detail="Product Name is required",
            )

        update_data["name"] = (
            str(
                update_data["name"]
            ).strip()
        )

    if "brand_id" in update_data:

        brand = (
            db.query(Brand)
            .filter(
                Brand.id
                == update_data["brand_id"]
            )
            .first()
        )

        if not brand:

            raise HTTPException(
                status_code=404,
                detail="Brand not found",
            )

    if "category_id" in update_data:

        category = (
            db.query(Category)
            .filter(
                Category.id
                == update_data["category_id"]
            )
            .first()
        )

        if not category:

            raise HTTPException(
                status_code=404,
                detail="Category not found",
            )

    if "discount_percent" in update_data:

        discount = update_data[
            "discount_percent"
        ]

        if discount < 0 or discount > 100:

            raise HTTPException(
                status_code=400,
                detail="Discount must be between 0 and 100",
            )

    for key, value in update_data.items():

        setattr(
            db_product,
            key,
            value,
        )

    db.commit()
    db.refresh(db_product)

    return db_product


# =========================================================
# DELETE PRODUCT
# =========================================================

@router.delete(
    "/{product_id}"
)
def delete_product(
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

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }