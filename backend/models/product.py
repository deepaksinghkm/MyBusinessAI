from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    sku = Column(String(100), unique=True, nullable=False)
    name = Column(String(200), nullable=False)

    brand_id = Column(Integer, ForeignKey("brands.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))

    mrp = Column(Integer, nullable=False)

    image = Column(String(255), nullable=True)

    packing_qty = Column(Integer, default=0)
    packing_type = Column(String(50), default="Carton")

    description = Column(String(500), nullable=True)

    brand = relationship("Brand")
    category = relationship("Category")

    variants = relationship(
        "ProductVariant",
        back_populates="product",
        cascade="all, delete-orphan"
    )
