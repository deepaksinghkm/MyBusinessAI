from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime
)

from database import Base
from datetime import datetime


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)

    company_name = Column(String(200), nullable=False)
    legal_name = Column(String(200))

    brand_name = Column(String(200))

    gst_no = Column(String(20))
    pan_no = Column(String(20))
    cin_no = Column(String(30))
    msme_no = Column(String(50))

    logo = Column(String(255))

    address1 = Column(String(255))
    address2 = Column(String(255))

    city = Column(String(100))
    state = Column(String(100))
    country = Column(String(100))

    pincode = Column(String(20))

    contact_person = Column(String(100))

    mobile = Column(String(20))
    phone = Column(String(20))

    email = Column(String(100))
    website = Column(String(150))

    business_type = Column(String(100))

    financial_year = Column(String(20))

    currency = Column(String(20), default="INR")

    timezone = Column(String(100), default="Asia/Kolkata")

    invoice_prefix = Column(String(20), default="INV")

    purchase_prefix = Column(String(20), default="PUR")

    sales_prefix = Column(String(20), default="SAL")

    stock_unit = Column(String(30), default="Pair")

    packing_type = Column(String(30), default="Carton")

    low_stock_limit = Column(Integer, default=5)

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
bank_name = Column(String(150))
bank_account_no = Column(String(100))
ifsc_code = Column(String(50))
branch_name = Column(String(150))

upi_id = Column(String(100))

signature = Column(String(255))

invoice_footer = Column(String(500))

terms_conditions = Column(String(1000))

theme = Column(String(30), default="light")
