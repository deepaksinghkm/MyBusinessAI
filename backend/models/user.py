from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    full_name = Column(String(150))
    email = Column(String(150), unique=True)
    is_super_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
