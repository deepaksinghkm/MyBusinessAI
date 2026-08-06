from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.color import Color
from schemas.color import (
    ColorCreate,
    ColorUpdate,
    ColorResponse,
)

router = APIRouter(
    prefix="/colors",
    tags=["Colors"]
)


@router.post("/", response_model=ColorResponse)
def create_color(
    color: ColorCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(Color).filter(
        Color.code == color.code
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Color code already exists"
        )

    new_color = Color(**color.model_dump())

    db.add(new_color)
    db.commit()
    db.refresh(new_color)

    return new_color


@router.get("/", response_model=list[ColorResponse])
def get_colors(db: Session = Depends(get_db)):
    return db.query(Color).all()


@router.put("/{color_id}", response_model=ColorResponse)
def update_color(
    color_id: int,
    color: ColorUpdate,
    db: Session = Depends(get_db)
):
    db_color = db.query(Color).filter(
        Color.id == color_id
    ).first()

    if not db_color:
        raise HTTPException(
            status_code=404,
            detail="Color not found"
        )

    update_data = color.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_color, key, value)

    db.commit()
    db.refresh(db_color)

    return db_color


@router.delete("/{color_id}")
def delete_color(
    color_id: int,
    db: Session = Depends(get_db)
):
    db_color = db.query(Color).filter(
        Color.id == color_id
    ).first()

    if not db_color:
        raise HTTPException(
            status_code=404,
            detail="Color not found"
        )

    db.delete(db_color)
    db.commit()

    return {
        "message": "Color deleted successfully"
    }
