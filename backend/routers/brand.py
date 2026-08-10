import re
import shutil
import uuid

from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
)

from sqlalchemy.orm import Session

from database import get_db
from models.brand import Brand

from schemas.brand import (
    BrandCreate,
    BrandUpdate,
    BrandResponse,
)


router = APIRouter(
    prefix="/brands",
    tags=["Brand Master"],
)


# =========================================================
# BRAND LOGO DIRECTORY
# =========================================================

UPLOAD_DIR = Path("uploads/brand_logos")

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# =========================================================
# GENERATE BRAND CODE
# =========================================================

def generate_brand_code(name: str) -> str:
    code = re.sub(
        r"[^A-Za-z0-9]",
        "",
        name,
    ).upper()

    code = code[:50]

    if not code:
        code = "BRAND"

    return code


# =========================================================
# CREATE BRAND
# =========================================================

@router.post(
    "/",
    response_model=BrandResponse,
)
def create_brand(
    data: BrandCreate,
    db: Session = Depends(get_db),
):
    exists = (
        db.query(Brand)
        .filter(
            Brand.name == data.name
        )
        .first()
    )

    if exists:
        raise HTTPException(
            status_code=400,
            detail="Brand already exists",
        )

    brand_code = (
        data.code.strip()
        if data.code
        else generate_brand_code(
            data.name
        )
    )

    if not brand_code:
        brand_code = generate_brand_code(
            data.name
        )

    brand = Brand(
        code=brand_code,
        name=data.name,
        description=data.description,
        logo=data.logo,
        is_active=data.is_active,
    )

    db.add(brand)
    db.commit()
    db.refresh(brand)

    return brand


# =========================================================
# GET ALL BRANDS
# =========================================================

@router.get(
    "/",
    response_model=list[BrandResponse],
)
def get_brands(
    db: Session = Depends(get_db),
):
    return (
        db.query(Brand)
        .order_by(
            Brand.id.desc()
        )
        .all()
    )


# =========================================================
# GET SINGLE BRAND
# =========================================================

@router.get(
    "/{brand_id}",
    response_model=BrandResponse,
)
def get_brand(
    brand_id: int,
    db: Session = Depends(get_db),
):
    brand = (
        db.query(Brand)
        .filter(
            Brand.id == brand_id
        )
        .first()
    )

    if not brand:
        raise HTTPException(
            status_code=404,
            detail="Brand not found",
        )

    return brand


# =========================================================
# UPDATE BRAND
# =========================================================

@router.put(
    "/{brand_id}",
    response_model=BrandResponse,
)
def update_brand(
    brand_id: int,
    data: BrandUpdate,
    db: Session = Depends(get_db),
):
    brand = (
        db.query(Brand)
        .filter(
            Brand.id == brand_id
        )
        .first()
    )

    if not brand:
        raise HTTPException(
            status_code=404,
            detail="Brand not found",
        )

    update_data = data.model_dump(
        exclude_unset=True
    )

    if (
        "name" in update_data
        and "code" not in update_data
    ):
        update_data["code"] = (
            generate_brand_code(
                update_data["name"]
            )
        )

    for key, value in update_data.items():
        setattr(
            brand,
            key,
            value,
        )

    db.commit()
    db.refresh(brand)

    return brand


# =========================================================
# UPLOAD BRAND LOGO
# =========================================================

@router.post(
    "/{brand_id}/logo"
)
def upload_brand_logo(
    brand_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    brand = (
        db.query(Brand)
        .filter(
            Brand.id == brand_id
        )
        .first()
    )

    if not brand:
        raise HTTPException(
            status_code=404,
            detail="Brand not found",
        )

    # Check file type

    if not file.content_type:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type",
        )

    if not file.content_type.startswith(
        "image/"
    ):
        raise HTTPException(
            status_code=400,
            detail="Only image files are allowed",
        )

    # Check file size - 2 MB

    file_content = file.file.read()

    if len(file_content) > 2 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Maximum logo size is 2 MB",
        )

    file.file.seek(0)

    # Delete old logo

    if brand.logo:
        old_path = Path(
            brand.logo
        )

        if old_path.exists():
            try:
                old_path.unlink()
            except OSError:
                pass

    # File extension

    extension = Path(
        file.filename or ""
    ).suffix.lower()

    if not extension:
        extension = ".jpg"

    # Unique filename

    filename = (
        f"{uuid.uuid4()}"
        f"{extension}"
    )

    filepath = (
        UPLOAD_DIR / filename
    )

    # Save file

    with open(
        filepath,
        "wb",
    ) as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    # Save URL path in database

    logo_url = (
        f"/uploads/brand_logos/"
        f"{filename}"
    )

    brand.logo = logo_url

    db.commit()
    db.refresh(brand)

    return {
        "message":
            "Brand logo uploaded successfully",
        "logo":
            brand.logo,
    }


# =========================================================
# DELETE BRAND LOGO
# =========================================================

@router.delete(
    "/{brand_id}/logo"
)
def delete_brand_logo(
    brand_id: int,
    db: Session = Depends(get_db),
):
    brand = (
        db.query(Brand)
        .filter(
            Brand.id == brand_id
        )
        .first()
    )

    if not brand:
        raise HTTPException(
            status_code=404,
            detail="Brand not found",
        )

    if brand.logo:
        logo_path = Path(
            brand.logo
        )

        if logo_path.exists():
            try:
                logo_path.unlink()
            except OSError:
                pass

    brand.logo = None

    db.commit()
    db.refresh(brand)

    return {
        "message":
            "Brand logo deleted successfully"
    }


# =========================================================
# DELETE BRAND
# =========================================================

@router.delete(
    "/{brand_id}"
)
def delete_brand(
    brand_id: int,
    db: Session = Depends(get_db),
):
    brand = (
        db.query(Brand)
        .filter(
            Brand.id == brand_id
        )
        .first()
    )

    if not brand:
        raise HTTPException(
            status_code=404,
            detail="Brand not found",
        )

    # Delete logo file also

    if brand.logo:
        logo_path = Path(
            brand.logo
        )

        if logo_path.exists():
            try:
                logo_path.unlink()
            except OSError:
                pass

    db.delete(brand)
    db.commit()

    return {
        "message":
            "Brand deleted successfully"
    }