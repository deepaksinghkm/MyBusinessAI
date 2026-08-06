from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.role import Role
from models.user_role import UserRole
from schemas.user_role import UserRoleCreate

router = APIRouter(
    prefix="/user-roles",
    tags=["User Roles"]
)


# Assign Role to User
@router.post("/")
def assign_role(user_role: UserRoleCreate, db: Session = Depends(get_db)):

    # Check User
    user = db.query(User).filter(User.id == user_role.user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Check Role
    role = db.query(Role).filter(Role.id == user_role.role_id).first()

    if not role:
        raise HTTPException(
            status_code=404,
            detail="Role not found"
        )

    # Check Existing Assignment
    existing = db.query(UserRole).filter(
        UserRole.user_id == user_role.user_id,
        UserRole.role_id == user_role.role_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Role already assigned to this user"
        )

    # Assign Role
    new_assignment = UserRole(
        user_id=user_role.user_id,
        role_id=user_role.role_id
    )

    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)

    return {
        "message": "Role assigned successfully",
        "user_id": new_assignment.user_id,
        "role_id": new_assignment.role_id
    }


# Get All User Role Assignments
@router.get("/")
def get_user_roles(db: Session = Depends(get_db)):

    assignments = db.query(UserRole).all()

    return assignments
