from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.brand import Brand
from schemas.brand import (
    BrandCreate,
    BrandUpdate,
    BrandResponse,
)

router = APIRouter(
    prefix="/brands",
    tags=["Brands"]
)


@router.post("/", response_model=BrandResponse)
def create_brand(
    brand: BrandCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(Brand).filter(
        Brand.code == brand.code
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Brand code already exists"
        )

    new_brand = Brand(**brand.model_dump())

    db.add(new_brand)
    db.commit()
    db.refresh(new_brand)

    return new_brand


@router.get("/", response_model=list[BrandResponse])
def get_brands(db: Session = Depends(get_db)):
    return db.query(Brand).all()


@router.put("/{brand_id}", response_model=BrandResponse)
def update_brand(
    brand_id: int,
    brand: BrandUpdate,
    db: Session = Depends(get_db)
):
    db_brand = db.query(Brand).filter(
        Brand.id == brand_id
    ).first()

    if not db_brand:
        raise HTTPException(
            status_code=404,
            detail="Brand not found"
        )

    update_data = brand.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_brand, key, value)

    db.commit()
    db.refresh(db_brand)

    return db_brand


@router.delete("/{brand_id}")
def delete_brand(
    brand_id: int,
    db: Session = Depends(get_db)
):
    db_brand = db.query(Brand).filter(
        Brand.id == brand_id
    ).first()

    if not db_brand:
        raise HTTPException(
            status_code=404,
            detail="Brand not found"
        )

    db.delete(db_brand)
    db.commit()

    return {
        "message": "Brand deleted successfully"
    }
