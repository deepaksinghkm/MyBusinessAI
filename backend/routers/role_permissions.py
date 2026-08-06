from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.role import Role
from models.permission import Permission
from models.role_permission import RolePermission
from schemas.role_permission import (
    RolePermissionCreate,
    RolePermissionResponse,
)

router = APIRouter(
    prefix="/role-permissions",
    tags=["Role Permissions"]
)


@router.post("/", response_model=RolePermissionResponse)
def assign_permission(
    data: RolePermissionCreate,
    db: Session = Depends(get_db)
):
    print("=" * 50)
    print("Received role_id:", data.role_id)
    print("Received permission_id:", data.permission_id)

    roles = db.query(Role).all()
    permissions = db.query(Permission).all()

    print("Roles in DB:")
    for r in roles:
        print(r.id, r.name)

    print("Permissions in DB:")
    for p in permissions:
        print(p.id, p.name)

    role = db.query(Role).filter(Role.id == data.role_id).first()

    if role is None:
        raise HTTPException(
            status_code=404,
            detail="Role not found"
        )

    permission = db.query(Permission).filter(
        Permission.id == data.permission_id
    ).first()

    if permission is None:
        raise HTTPException(
            status_code=404,
            detail="Permission not found"
        )

    existing = db.query(RolePermission).filter(
        RolePermission.role_id == data.role_id,
        RolePermission.permission_id == data.permission_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Permission already assigned"
        )

    new_role_permission = RolePermission(
        role_id=data.role_id,
        permission_id=data.permission_id
    )

    db.add(new_role_permission)
    db.commit()
    db.refresh(new_role_permission)

    return new_role_permission


@router.get("/", response_model=list[RolePermissionResponse])
def get_role_permissions(db: Session = Depends(get_db)):
    return db.query(RolePermission).all()
