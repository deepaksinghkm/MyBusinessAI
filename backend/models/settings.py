from sqlalchemy import Column, Integer, String, Boolean
from database import Base


class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)

    company_name = Column(String(200), nullable=False)
    company_logo = Column(String(255), nullable=True)

    pdf_title = Column(String(200), default="Stock Catalog")

    stock_print_limit = Column(Integer, default=5)

    default_packing_type = Column(String(50), default="Carton")

    image_max_size_kb = Column(Integer, default=150)

    watermark_enabled = Column(Boolean, default=False)

    is_active = Column(Boolean, default=True)
