from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    Numeric,
)
from sqlalchemy.orm import relationship

from database import Base


class ProductVariant(Base):

    __tablename__ = "product_variants"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id"),
        nullable=False,
    )

    color_id = Column(
        Integer,
        ForeignKey("colors.id"),
        nullable=True,
    )

    size_id = Column(
        Integer,
        ForeignKey("sizes.id"),
        nullable=True,
    )

    unit_id = Column(
        Integer,
        ForeignKey("units.id"),
        nullable=True,
    )

    mrp = Column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )

    rate = Column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )

    stock = Column(
        Integer,
        default=0,
        nullable=False,
    )

    product = relationship(
        "Product",
        back_populates="variants",
    )

    color = relationship(
        "Color"
    )

    size = relationship(
        "Size"
    )

    unit = relationship(
        "Unit"
    )