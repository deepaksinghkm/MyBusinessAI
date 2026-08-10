from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
)

from database import Base
from datetime import datetime


class Customer(Base):

    __tablename__ = "customers"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    customer_code = Column(
        String(50),
        unique=True,
        nullable=False,
    )

    customer_name = Column(
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
