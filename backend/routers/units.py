from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.unit import Unit
from schemas.unit import UnitCreate, UnitUpdate, UnitResponse

router = APIRouter(prefix="/units", tags=["Units"])


@router.post("/", response_model=UnitResponse)
def create_unit(unit: UnitCreate, db: Session = Depends(get_db)):
    existing = db.query(Unit).filter(Unit.code == unit.code).first()

    if existing:
        raise HTTPException(status_code=400, detail="Unit code already exists")

    new_unit = Unit(**unit.model_dump())
    db.add(new_unit)
    db.commit()
    db.refresh(new_unit)

    return new_unit


@router.get("/", response_model=list[UnitResponse])
def get_units(db: Session = Depends(get_db)):
    return db.query(Unit).all()


@router.get("/{unit_id}", response_model=UnitResponse)
def get_unit(unit_id: int, db: Session = Depends(get_db)):
    unit = db.query(Unit).filter(Unit.id == unit_id).first()

    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")

    return unit


@router.put("/{unit_id}", response_model=UnitResponse)
def update_unit(unit_id: int, unit: UnitUpdate, db: Session = Depends(get_db)):
    db_unit = db.query(Unit).filter(Unit.id == unit_id).first()

    if not db_unit:
        raise HTTPException(status_code=404, detail="Unit not found")

    update_data = unit.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_unit, key, value)

    db.commit()
    db.refresh(db_unit)

    return db_unit


@router.delete("/{unit_id}")
def delete_unit(unit_id: int, db: Session = Depends(get_db)):
    db_unit = db.query(Unit).filter(Unit.id == unit_id).first()

    if not db_unit:
        raise HTTPException(status_code=404, detail="Unit not found")

    db.delete(db_unit)
    db.commit()

    return {"message": "Unit deleted successfully"}
