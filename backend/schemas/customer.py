from pydantic import BaseModel
from typing import Optional


class CustomerCreate(BaseModel):

    customer_code: str

    customer_name: str

    legal_name: Optional[str] = None

    gst_no: Optional[str] = None

    pan_no: Optional[str] = None

    contact_person: Optional[str] = None

    mobile: Optional[str] = None

    phone: Optional[str] = None

    email: Optional[str] = None

    address1: Optional[str] = None

    address2: Optional[str] = None

    city: Optional[str] = None

    state: Optional[str] = None

    country: Optional[str] = "India"

    pincode: Optional[str] = None

    payment_terms: Optional[str] = None

    credit_limit: int = 0

    remarks: Optional[str] = None

    is_active: bool = True


class CustomerUpdate(BaseModel):

    customer_code: Optional[str] = None

    customer_name: Optional[str] = None

    legal_name: Optional[str] = None

    gst_no: Optional[str] = None

    pan_no: Optional[str] = None

    contact_person: Optional[str] = None

    mobile: Optional[str] = None

    phone: Optional[str] = None

    email: Optional[str] = None

    address1: Optional[str] = None

    address2: Optional[str] = None

    city: Optional[str] = None

    state: Optional[str] = None

    country: Optional[str] = None

    pincode: Optional[str] = None

    payment_terms: Optional[str] = None

    credit_limit: Optional[int] = None

    remarks: Optional[str] = None

    is_active: Optional[bool] = None


class CustomerResponse(BaseModel):

    id: int

    customer_code: str

    customer_name: str

    legal_name: Optional[str]

    gst_no: Optional[str]

    pan_no: Optional[str]

    contact_person: Optional[str]

    mobile: Optional[str]

    phone: Optional[str]

    email: Optional[str]

    address1: Optional[str]

    address2: Optional[str]

    city: Optional[str]

    state: Optional[str]

    country: Optional[str]

    pincode: Optional[str]

    payment_terms: Optional[str]

    credit_limit: int

    remarks: Optional[str]

    is_active: bool

    class Config:

        from_attributes = True