from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)

    product_id = Column(Integer, ForeignKey("products.id"))
    color_id = Column(Integer, ForeignKey("colors.id"))
    size_id = Column(Integer, ForeignKey("sizes.id"))

    stock = Column(Integer, default=0)

    product = relationship(
        "Product",
        back_populates="variants"
    )

    color = relationship("Color")
    size = relationship("Size")
