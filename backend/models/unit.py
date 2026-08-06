from sqlalchemy import Column, Integer, String, Boolean
from database import Base


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(100), unique=True, nullable=False)
    short_name = Column(String(20), nullable=False)
    is_active = Column(Boolean, default=True)
