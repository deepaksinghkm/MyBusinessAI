from sqlalchemy import Column, Integer, String, Boolean
from database import Base


class Size(Base):
    __tablename__ = "sizes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    name = Column(String(50), unique=True, nullable=False)
    size_type = Column(String(50), nullable=False)  # Kids, Men, Women, Sports
    is_active = Column(Boolean, default=True)
