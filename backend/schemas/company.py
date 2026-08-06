from pydantic import BaseModel, EmailStr
from typing import Optional


class CompanyBase(BaseModel):
    company_name: str
    legal_name: Optional[str] = None
    brand_name: Optional[str] = None

    gst_no: Optional[str] = None
    pan_no: Optional[str] = None
    cin_no: Optional[str] = None
    msme_no: Optional[str] = None

    logo: Optional[str] = None

    address1: Optional[str] = None
    address2: Optional[str] = None

    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    pincode: Optional[str] = None

    contact_person: Optional[str] = None

    mobile: Optional[str] = None
    phone: Optional[str] = None

    email: Optional[EmailStr] = None
    website: Optional[str] = None

    business_type: Optional[str] = None

    financial_year: Optional[str] = None

    currency: Optional[str] = "INR"

    timezone: Optional[str] = "Asia/Kolkata"

    invoice_prefix: Optional[str] = "INV"

    purchase_prefix: Optional[str] = "PUR"

    sales_prefix: Optional[str] = "SAL"

    stock_unit: Optional[str] = "Pair"

    packing_type: Optional[str] = "Carton"

    low_stock_limit: Optional[int] = 5

    is_active: Optional[bool] = True


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(CompanyBase):
    pass


class CompanyResponse(CompanyBase):
    id: int

    class Config:
        from_attributes = True
bank_name: Optional[str] = None
bank_account_no: Optional[str] = None
ifsc_code: Optional[str] = None
branch_name: Optional[str] = None

upi_id: Optional[str] = None

signature: Optional[str] = None

invoice_footer: Optional[str] = None

terms_conditions: Optional[str] = None

theme: Optional[str] = "light"
