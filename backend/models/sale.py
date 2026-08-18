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


class Sale(Base):

    __tablename__ = "sales"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    sale_no = Column(
        String(100),
        unique=True,
        nullable=False,
    )

    sale_date = Column(
        Date,
        nullable=False,
    )

    # =====================================================
    # BILL TO / SHIP TO
    # =====================================================

    bill_to_customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=True,
    )

    ship_to_customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=True,
    )

    # =====================================================
    # OLD CUSTOMER DETAILS
    # Kept for backward compatibility
    # =====================================================

    customer_name = Column(
        String(200),
        nullable=True,
    )

    customer_mobile = Column(
        String(20),
        nullable=True,
    )

    invoice_no = Column(
        String(100),
        nullable=True,
    )

    remarks = Column(
        String(500),
        nullable=True,
    )

    # =====================================================
    # TOTALS
    # =====================================================

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

    # =====================================================
    # CUSTOMER RELATIONSHIPS
    # =====================================================

    bill_to_customer = relationship(
        "Customer",
        foreign_keys=[bill_to_customer_id],
    )

    ship_to_customer = relationship(
        "Customer",
        foreign_keys=[ship_to_customer_id],
    )

    # =====================================================
    # SALE ITEMS
    # =====================================================

    items = relationship(
        "SaleItem",
        back_populates="sale",
        cascade="all, delete-orphan",
    )


class SaleItem(Base):

    __tablename__ = "sale_items"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    sale_id = Column(
        Integer,
        ForeignKey("sales.id"),
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

    sale = relationship(
        "Sale",
        back_populates="items",
    )

    variant = relationship(
        "ProductVariant",
    )