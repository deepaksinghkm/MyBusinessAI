from pydantic import BaseModel

from typing import Optional


class SupplierCreate(BaseModel):

    supplier_code: str

    supplier_name: str

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

    bank_name: Optional[str] = None

    bank_account_no: Optional[str] = None

    ifsc_code: Optional[str] = None

    branch_name: Optional[str] = None

    upi_id: Optional[str] = None

    remarks: Optional[str] = None

    is_active: bool = True


class SupplierUpdate(BaseModel):

    supplier_code: Optional[str] = None

    supplier_name: Optional[str] = None

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

    bank_name: Optional[str] = None

    bank_account_no: Optional[str] = None

    ifsc_code: Optional[str] = None

    branch_name: Optional[str] = None

    upi_id: Optional[str] = None

    remarks: Optional[str] = None

    is_active: Optional[bool] = None


class SupplierResponse(BaseModel):

    id: int

    supplier_code: str

    supplier_name: str

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

    bank_name: Optional[str]

    bank_account_no: Optional[str]

    ifsc_code: Optional[str]

    branch_name: Optional[str]

    upi_id: Optional[str]

    remarks: Optional[str]

    is_active: bool

    class Config:

        from_attributes = True
