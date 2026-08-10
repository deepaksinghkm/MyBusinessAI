from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
)

from database import Base
from datetime import datetime


class Brand(Base):
    __tablename__ = "brands"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    code = Column(
        String(50),
        nullable=False,
    )

    name = Column(
        String(150),
        nullable=False,
        unique=True,
    )

    description = Column(
        String(500),
        nullable=True,
    )

    logo = Column(
        String(255),
        nullable=True,
    )

    is_active = Column(
        Boolean,
        default=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )