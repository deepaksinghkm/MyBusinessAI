from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
)

from database import Base

from datetime import datetime


class Supplier(Base):

    __tablename__ = "suppliers"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    supplier_code = Column(
        String(50),
        unique=True,
        nullable=False,
    )

    supplier_name = Column(
        String(200),
        nullable=False,
    )

    legal_name = Column(
        String(200),
        nullable=True,
    )

    gst_no = Column(
        String(20),
        nullable=True,
    )

    pan_no = Column(
        String(20),
        nullable=True,
    )

    contact_person = Column(
        String(100),
        nullable=True,
    )

    mobile = Column(
        String(20),
        nullable=True,
    )

    phone = Column(
        String(20),
        nullable=True,
    )

    email = Column(
        String(100),
        nullable=True,
    )

    address1 = Column(
        String(255),
        nullable=True,
    )

    address2 = Column(
        String(255),
        nullable=True,
    )

    city = Column(
        String(100),
        nullable=True,
    )

    state = Column(
        String(100),
        nullable=True,
    )

    country = Column(
        String(100),
        default="India",
    )

    pincode = Column(
        String(20),
        nullable=True,
    )

    payment_terms = Column(
        String(100),
        nullable=True,
    )

    credit_limit = Column(
        Integer,
        default=0,
    )

    bank_name = Column(
        String(150),
        nullable=True,
    )

    bank_account_no = Column(
        String(100),
        nullable=True,
    )

    ifsc_code = Column(
        String(50),
        nullable=True,
    )

    branch_name = Column(
        String(150),
        nullable=True,
    )

    upi_id = Column(
        String(100),
        nullable=True,
    )

    remarks = Column(
        String(500),
        nullable=True,
    )

    is_active = Column(
        Boolean,
        default=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )
