from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from database import get_db

from models.supplier import Supplier

from schemas.supplier import (
    SupplierCreate,
    SupplierUpdate,
    SupplierResponse,
)


router = APIRouter(
    prefix="/suppliers",
    tags=["Suppliers"],
)


# =========================================================
# CREATE
# =========================================================

@router.post(
    "/",
    response_model=SupplierResponse,
)
def create_supplier(
    data: SupplierCreate,
    db: Session = Depends(get_db),
):

    existing_code = (
        db.query(Supplier)
        .filter(
            Supplier.supplier_code
            == data.supplier_code
        )
        .first()
    )

    if existing_code:

        raise HTTPException(
            status_code=400,
            detail=(
                "Supplier code already exists"
            ),
        )

    existing_name = (
        db.query(Supplier)
        .filter(
            Supplier.supplier_name
            == data.supplier_name
        )
        .first()
    )

    if existing_name:

        raise HTTPException(
            status_code=400,
            detail=(
                "Supplier name already exists"
            ),
        )

    supplier = Supplier(
        **data.model_dump()
    )

    db.add(supplier)

    db.commit()

    db.refresh(supplier)

    return supplier


# =========================================================
# GET ALL
# =========================================================

@router.get(
    "/",
    response_model=list[SupplierResponse],
)
def get_suppliers(
    db: Session = Depends(get_db),
):

    return (
        db.query(Supplier)
        .order_by(
            Supplier.id.desc()
        )
        .all()
    )


# =========================================================
# GET ONE
# =========================================================

@router.get(
    "/{supplier_id}",
    response_model=SupplierResponse,
)
def get_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
):

    supplier = (
        db.query(Supplier)
        .filter(
            Supplier.id
            == supplier_id
        )
        .first()
    )

    if not supplier:

        raise HTTPException(
            status_code=404,
            detail="Supplier not found",
        )

    return supplier


# =========================================================
# UPDATE
# =========================================================

@router.put(
    "/{supplier_id}",
    response_model=SupplierResponse,
)
def update_supplier(
    supplier_id: int,
    data: SupplierUpdate,
    db: Session = Depends(get_db),
):

    supplier = (
        db.query(Supplier)
        .filter(
            Supplier.id
            == supplier_id
        )
        .first()
    )

    if not supplier:

        raise HTTPException(
            status_code=404,
            detail="Supplier not found",
        )

    update_data = (
        data.model_dump(
            exclude_unset=True
        )
    )

    if "supplier_code" in update_data:

        existing = (
            db.query(Supplier)
            .filter(
                Supplier.supplier_code
                == update_data[
                    "supplier_code"
                ],
                Supplier.id
                != supplier_id,
            )
            .first()
        )

        if existing:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Supplier code already exists"
                ),
            )

    if "supplier_name" in update_data:

        existing = (
            db.query(Supplier)
            .filter(
                Supplier.supplier_name
                == update_data[
                    "supplier_name"
                ],
                Supplier.id
                != supplier_id,
            )
            .first()
        )

        if existing:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Supplier name already exists"
                ),
            )

    for key, value in update_data.items():

        setattr(
            supplier,
            key,
            value,
        )

    db.commit()

    db.refresh(supplier)

    return supplier


# =========================================================
# DELETE
# =========================================================

@router.delete(
    "/{supplier_id}"
)
def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db),
):

    supplier = (
        db.query(Supplier)
        .filter(
            Supplier.id
            == supplier_id
        )
        .first()
    )

    if not supplier:

        raise HTTPException(
            status_code=404,
            detail="Supplier not found",
        )

    db.delete(supplier)

    db.commit()

    return {
        "message":
            "Supplier deleted successfully"
    }
