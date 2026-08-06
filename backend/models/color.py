from sqlalchemy import Column, Integer, String, Boolean
from database import Base


class Color(Base):
    __tablename__ = "colors"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), unique=True, nullable=False)
    hex_code = Column(String(10), nullable=True)
    is_active = Column(Boolean, default=True)
