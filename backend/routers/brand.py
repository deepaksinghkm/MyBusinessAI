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
    tags=["Brand Master"],
)


@router.post("/", response_model=BrandResponse)
def create_brand(
    data: BrandCreate,
    db: Session = Depends(get_db),
):
    exists = (
        db.query(Brand)
        .filter(Brand.name == data.name)
        .first()
    )

    if exists:
        raise HTTPException(
            status_code=400,
            detail="Brand already exists",
        )

    brand = Brand(**data.model_dump())

    db.add(brand)
    db.commit()
    db.refresh(brand)

    return brand


@router.get("/", response_model=list[BrandResponse])
def get_brands(db: Session = Depends(get_db)):
    return (
        db.query(Brand)
        .order_by(Brand.id.desc())
        .all()
    )


@router.get("/{brand_id}", response_model=BrandResponse)
def get_brand(
    brand_id: int,
    db: Session = Depends(get_db),
):
    brand = (
        db.query(Brand)
        .filter(Brand.id == brand_id)
        .first()
    )

    if not brand:
        raise HTTPException(
            status_code=404,
            detail="Brand not found",
        )

    return brand


@router.put("/{brand_id}", response_model=BrandResponse)
def update_brand(
    brand_id: int,
    data: BrandUpdate,
    db: Session = Depends(get_db),
):
    brand = (
        db.query(Brand)
        .filter(Brand.id == brand_id)
        .first()
    )

    if not brand:
        raise HTTPException(
            status_code=404,
            detail="Brand not found",
        )

    for key, value in data.model_dump(
        exclude_unset=True
    ).items():
        setattr(brand, key, value)

    db.commit()
    db.refresh(brand)

    return brand


@router.delete("/{brand_id}")
def delete_brand(
    brand_id: int,
    db: Session = Depends(get_db),
):
    brand = (
        db.query(Brand)
        .filter(Brand.id == brand_id)
        .first()
    )

    if not brand:
        raise HTTPException(
            status_code=404,
            detail="Brand not found",
        )

    db.delete(brand)
    db.commit()

    return {
        "message": "Brand deleted successfully"
    }
