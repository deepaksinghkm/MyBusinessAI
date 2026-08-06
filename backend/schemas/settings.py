from pydantic import BaseModel
from typing import Optional


class SettingsCreate(BaseModel):
    company_name: str
    company_logo: Optional[str] = None
    pdf_title: str = "Stock Catalog"
    stock_print_limit: int = 5
    default_packing_type: str = "Carton"
    image_max_size_kb: int = 150
    watermark_enabled: bool = False


class SettingsUpdate(BaseModel):
    company_name: Optional[str] = None
    company_logo: Optional[str] = None
    pdf_title: Optional[str] = None
    stock_print_limit: Optional[int] = None
    default_packing_type: Optional[str] = None
    image_max_size_kb: Optional[int] = None
    watermark_enabled: Optional[bool] = None


class SettingsResponse(SettingsCreate):
    id: int

    class Config:
        from_attributes = True
