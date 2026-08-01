from sqlalchemy import Column, Integer, String
from database import Base

class Permission(Base):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, index=True)
    module = Column(String(100), nullable=False)
    action = Column(String(50), nullable=False)
