from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    ForeignKey,
    Numeric,
)

from sqlalchemy.orm import relationship

from database import Base

from datetime import datetime


class Purchase(Base):

    __tablename__ = "purchases"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    purchase_no = Column(
        String(100),
        unique=True,
        nullable=False,
    )

    purchase_date = Column(
        Date,
        nullable=False,
    )

    supplier_id = Column(
        Integer,
        ForeignKey("suppliers.id"),
        nullable=False,
    )

    invoice_no = Column(
        String(100),
        nullable=True,
    )

    invoice_date = Column(
        Date,
        nullable=True,
    )

    remarks = Column(
        String(500),
        nullable=True,
    )

    subtotal = Column(
        Numeric(12, 2),
        default=0,
    )

    discount = Column(
        Numeric(12, 2),
        default=0,
    )

    tax = Column(
        Numeric(12, 2),
        default=0,
    )

    grand_total = Column(
        Numeric(12, 2),
        default=0,
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

    supplier = relationship(
        "Supplier"
    )

    items = relationship(
        "PurchaseItem",
        back_populates="purchase",
        cascade="all, delete-orphan",
    )


class PurchaseItem(Base):

    __tablename__ = "purchase_items"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    purchase_id = Column(
        Integer,
        ForeignKey("purchases.id"),
        nullable=False,
    )

    variant_id = Column(
        Integer,
        ForeignKey("product_variants.id"),
        nullable=False,
    )

    qty = Column(
        Integer,
        nullable=False,
    )

    rate = Column(
        Numeric(12, 2),
        nullable=False,
    )

    discount = Column(
        Numeric(12, 2),
        default=0,
    )

    tax_percent = Column(
        Numeric(5, 2),
        default=0,
    )

    tax_amount = Column(
        Numeric(12, 2),
        default=0,
    )

    amount = Column(
        Numeric(12, 2),
        default=0,
    )

    purchase = relationship(
        "Purchase",
        back_populates="items",
    )

    variant = relationship(
        "ProductVariant"
    )