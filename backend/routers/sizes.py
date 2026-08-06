from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.size import Size
from schemas.size import SizeCreate, SizeUpdate, SizeResponse

router = APIRouter(
    prefix="/sizes",
    tags=["Sizes"]
)


@router.post("/", response_model=SizeResponse)
def create_size(size: SizeCreate, db: Session = Depends(get_db)):
    existing = db.query(Size).filter(Size.code == size.code).first()

    if existing:
        raise HTTPException(status_code=400, detail="Size code already exists")

    new_size = Size(**size.model_dump())

    db.add(new_size)
    db.commit()
    db.refresh(new_size)

    return new_size


@router.get("/", response_model=list[SizeResponse])
def get_sizes(db: Session = Depends(get_db)):
    return db.query(Size).all()


@router.get("/{size_id}", response_model=SizeResponse)
def get_size(size_id: int, db: Session = Depends(get_db)):
    size = db.query(Size).filter(Size.id == size_id).first()

    if not size:
        raise HTTPException(status_code=404, detail="Size not found")

    return size


@router.put("/{size_id}", response_model=SizeResponse)
def update_size(size_id: int, size: SizeUpdate, db: Session = Depends(get_db)):
    db_size = db.query(Size).filter(Size.id == size_id).first()

    if not db_size:
        raise HTTPException(status_code=404, detail="Size not found")

    update_data = size.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_size, key, value)

    db.commit()
    db.refresh(db_size)

    return db_size


@router.delete("/{size_id}")
def delete_size(size_id: int, db: Session = Depends(get_db)):
    db_size = db.query(Size).filter(Size.id == size_id).first()

    if not db_size:
        raise HTTPException(status_code=404, detail="Size not found")

    db.delete(db_size)
    db.commit()

    return {"message": "Size deleted successfully"}
