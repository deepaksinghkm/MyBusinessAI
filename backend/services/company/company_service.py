from sqlalchemy.orm import Session
from models.company import Company


def create_company(db: Session, data):
    company = Company(**data.model_dump())

    db.add(company)
    db.commit()
    db.refresh(company)

    return company


def get_all_companies(db: Session):
    return db.query(Company).all()


def get_company(db: Session, company_id: int):
    return (
        db.query(Company)
        .filter(Company.id == company_id)
        .first()
    )


def update_company(db: Session, company, data):
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(company, key, value)

    db.commit()
    db.refresh(company)

    return company


def delete_company(db: Session, company):
    db.delete(company)
    db.commit()