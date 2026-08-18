from sqlalchemy import Column, Integer, String, ForeignKey, Numeric
from sqlalchemy.orm import relationship

from database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    # SKU is no longer required.
    # Kept nullable for old database compatibility.
    sku = Column(
        String(100),
        unique=True,
        nullable=True,
    )

    name = Column(
        String(200),
        nullable=False,
    )

    brand_id = Column(
        Integer,
        ForeignKey("brands.id"),
        nullable=False,
    )

    category_id = Column(
        Integer,
        ForeignKey("categories.id"),
        nullable=False,
    )

    # Kept for old data compatibility.
    # Variant MRP is the actual selling master value.
    mrp = Column(
        Numeric(12, 2),
        nullable=True,
    )

    # Product-level discount.
    # Same discount applies to all variants.
    discount_percent = Column(
        Numeric(5, 2),
        default=0,
        nullable=False,
    )

    image = Column(
        String(255),
        nullable=True,
    )

    packing_qty = Column(
        Integer,
        default=0,
    )

    packing_type = Column(
        String(50),
        default="Carton",
    )

    description = Column(
        String(500),
        nullable=True,
    )

    brand = relationship(
        "Brand"
    )

    category = relationship(
        "Category"
    )

    variants = relationship(
        "ProductVariant",
        back_populates="product",
        cascade="all, delete-orphan",
    )