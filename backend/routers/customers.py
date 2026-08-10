from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from database import get_db

from models.customer import Customer

from schemas.customer import (
    CustomerCreate,
    CustomerUpdate,
    CustomerResponse,
)


router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


# =========================================================
# CREATE
# =========================================================

@router.post(
    "/",
    response_model=CustomerResponse,
)
def create_customer(
    data: CustomerCreate,
    db: Session = Depends(get_db),
):

    existing_code = (
        db.query(Customer)
        .filter(
            Customer.customer_code
            == data.customer_code
        )
        .first()
    )

    if existing_code:

        raise HTTPException(
            status_code=400,
            detail="Customer code already exists",
        )

    existing_name = (
        db.query(Customer)
        .filter(
            Customer.customer_name
            == data.customer_name
        )
        .first()
    )

    if existing_name:

        raise HTTPException(
            status_code=400,
            detail="Customer name already exists",
        )

    customer = Customer(
        **data.model_dump()
    )

    db.add(customer)

    db.commit()

    db.refresh(customer)

    return customer


# =========================================================
# GET ALL
# =========================================================

@router.get(
    "/",
    response_model=list[CustomerResponse],
)
def get_customers(
    db: Session = Depends(get_db),
):

    return (
        db.query(Customer)
        .order_by(
            Customer.id.desc()
        )
        .all()
    )


# =========================================================
# GET ONE
# =========================================================

@router.get(
    "/{customer_id}",
    response_model=CustomerResponse,
)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
):

    customer = (
        db.query(Customer)
        .filter(
            Customer.id
            == customer_id
        )
        .first()
    )

    if not customer:

        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    return customer


# =========================================================
# UPDATE
# =========================================================

@router.put(
    "/{customer_id}",
    response_model=CustomerResponse,
)
def update_customer(
    customer_id: int,
    data: CustomerUpdate,
    db: Session = Depends(get_db),
):

    customer = (
        db.query(Customer)
        .filter(
            Customer.id
            == customer_id
        )
        .first()
    )

    if not customer:

        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    update_data = data.model_dump(
        exclude_unset=True
    )

    # -----------------------------------------------------
    # CHECK CUSTOMER CODE
    # -----------------------------------------------------

    if "customer_code" in update_data:

        existing = (
            db.query(Customer)
            .filter(
                Customer.customer_code
                == update_data[
                    "customer_code"
                ],
                Customer.id
                != customer_id,
            )
            .first()
        )

        if existing:

            raise HTTPException(
                status_code=400,
                detail="Customer code already exists",
            )

    # -----------------------------------------------------
    # CHECK CUSTOMER NAME
    # -----------------------------------------------------

    if "customer_name" in update_data:

        existing = (
            db.query(Customer)
            .filter(
                Customer.customer_name
                == update_data[
                    "customer_name"
                ],
                Customer.id
                != customer_id,
            )
            .first()
        )

        if existing:

            raise HTTPException(
                status_code=400,
                detail="Customer name already exists",
            )

    # -----------------------------------------------------
    # UPDATE
    # -----------------------------------------------------

    for key, value in update_data.items():

        setattr(
            customer,
            key,
            value,
        )

    db.commit()

    db.refresh(customer)

    return customer


# =========================================================
# DELETE
# =========================================================

@router.delete(
    "/{customer_id}"
)
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
):

    customer = (
        db.query(Customer)
        .filter(
            Customer.id
            == customer_id
        )
        .first()
    )

    if not customer:

        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    db.delete(customer)

    db.commit()

    return {
        "message":
            "Customer deleted successfully"
    }
