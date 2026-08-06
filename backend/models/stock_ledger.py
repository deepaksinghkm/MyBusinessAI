from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base


class StockLedger(Base):
    __tablename__ = "stock_ledger"

    id = Column(Integer, primary_key=True, index=True)

    variant_id = Column(Integer, ForeignKey("product_variants.id"))

    transaction_type = Column(
        String(30),
        nullable=False
    )  # Opening, Purchase, Sale, Adjustment

    qty = Column(Integer, nullable=False)

    reference_no = Column(String(100), nullable=True)

    remarks = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    variant = relationship("ProductVariant")
