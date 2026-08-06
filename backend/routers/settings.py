from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.settings import Settings
from schemas.settings import (
    SettingsCreate,
    SettingsUpdate,
    SettingsResponse
)

router = APIRouter(
    prefix="/settings",
    tags=["Settings"]
)


@router.post("/", response_model=SettingsResponse)
def create_settings(data: SettingsCreate, db: Session = Depends(get_db)):

    existing = db.query(Settings).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Settings already exist."
        )

    settings = Settings(**data.model_dump())

    db.add(settings)
    db.commit()
    db.refresh(settings)

    return settings


@router.get("/", response_model=SettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(Settings).first()

    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found.")

    return settings


@router.put("/", response_model=SettingsResponse)
def update_settings(
    data: SettingsUpdate,
    db: Session = Depends(get_db)
):
    settings = db.query(Settings).first()

    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found.")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(settings, key, value)

    db.commit()
    db.refresh(settings)

    return settings
