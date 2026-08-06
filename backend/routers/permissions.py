from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.permission import Permission
from schemas.permissions import PermissionCreate, PermissionResponse

router = APIRouter(
    prefix="/permissions",
    tags=["Permissions"]
)


@router.post("/", response_model=PermissionResponse)
def create_permission(permission: PermissionCreate, db: Session = Depends(get_db)):
    existing = db.query(Permission).filter(
        Permission.name == permission.name
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Permission already exists")

    new_permission = Permission(
        name=permission.name,
        description=permission.description
    )

    db.add(new_permission)
    db.commit()
    db.refresh(new_permission)

    return new_permission


@router.get("/", response_model=list[PermissionResponse])
def get_permissions(db: Session = Depends(get_db)):
    return db.query(Permission).all()
