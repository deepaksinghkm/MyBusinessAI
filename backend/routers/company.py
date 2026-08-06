from fastapi import UploadFile, File
from pathlib import Path
import shutil
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.company import Company
from schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse

router = APIRouter(
    prefix="/companies",
    tags=["Company Master"]
)
UPLOAD_DIR = Path("uploads/company_logo")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("/{company_id}/logo")
def upload_company_logo(
    company_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    company = db.query(Company).filter(
        Company.id == company_id
    ).first()

    if not company:
        raise HTTPException(404, "Company not found")

    if file.size and file.size > 150 * 1024:
        raise HTTPException(400, "Maximum file size is 150KB")

    ext = Path(file.filename).suffix

    filename = f"{uuid.uuid4()}{ext}"

    filepath = UPLOAD_DIR / filename

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    company.logo = str(filepath)

    db.commit()

    return {
        "message": "Logo uploaded successfully",
        "logo": company.logo
    }


@router.post("/", response_model=CompanyResponse)
def create_company(data: CompanyCreate, db: Session = Depends(get_db)):
    company = Company(**data.model_dump())

    db.add(company)
    db.commit()
    db.refresh(company)

    return company


@router.get("/", response_model=list[CompanyResponse])
def get_companies(db: Session = Depends(get_db)):
    return db.query(Company).all()


@router.get("/{company_id}", response_model=CompanyResponse)
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(
        Company.id == company_id
    ).first()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    return company


@router.put("/{company_id}", response_model=CompanyResponse)
def update_company(
    company_id: int,
    data: CompanyUpdate,
    db: Session = Depends(get_db),
):
    company = db.query(Company).filter(
        Company.id == company_id
    ).first()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(company, key, value)

    db.commit()
    db.refresh(company)

    return company


@router.delete("/{company_id}")
def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
):
    company = db.query(Company).filter(
        Company.id == company_id
    ).first()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    db.delete(company)
    db.commit()

    return {"message": "Company deleted successfully"}
