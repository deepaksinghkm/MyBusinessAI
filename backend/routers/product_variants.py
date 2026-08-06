from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from models.product import Product
from models.color import Color
from models.size import Size
from models.product_variant import ProductVariant

from schemas.product_variant import (
    ProductVariantCreate,
    ProductVariantUpdate,
    ProductVariantResponse
)

router = APIRouter(
    prefix="/product-variants",
    tags=["Product Variants"]
)


@router.post("/", response_model=ProductVariantResponse)
def create_variant(data: ProductVariantCreate, db: Session = Depends(get_db)):

    if not db.query(Product).filter(Product.id == data.product_id).first():
        raise HTTPException(status_code=404, detail="Product not found")

    if not db.query(Color).filter(Color.id == data.color_id).first():
        raise HTTPException(status_code=404, detail="Color not found")

    if not db.query(Size).filter(Size.id == data.size_id).first():
        raise HTTPException(status_code=404, detail="Size not found")

    duplicate = db.query(ProductVariant).filter(
        ProductVariant.product_id == data.product_id,
        ProductVariant.color_id == data.color_id,
        ProductVariant.size_id == data.size_id
    ).first()

    if duplicate:
        raise HTTPException(
            status_code=400,
            detail="Variant already exists"
        )

    variant = ProductVariant(**data.model_dump())

    db.add(variant)
    db.commit()
    db.refresh(variant)

    return variant


@router.get("/", response_model=list[ProductVariantResponse])
def get_variants(db: Session = Depends(get_db)):
    return db.query(ProductVariant).all()


@router.put("/{variant_id}", response_model=ProductVariantResponse)
def update_variant(
    variant_id: int,
    data: ProductVariantUpdate,
    db: Session = Depends(get_db)
):
    variant = db.query(ProductVariant).filter(
        ProductVariant.id == variant_id
    ).first()

    if not variant:
        raise HTTPException(status_code=404, detail="Variant not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(variant, key, value)

    db.commit()
    db.refresh(variant)

    return variant


@router.delete("/{variant_id}")
def delete_variant(
    variant_id: int,
    db: Session = Depends(get_db)
):
    variant = db.query(ProductVariant).filter(
        ProductVariant.id == variant_id
    ).first()

    if not variant:
        raise HTTPException(status_code=404, detail="Variant not found")

    db.delete(variant)
    db.commit()

    return {"message": "Variant deleted successfully"}
