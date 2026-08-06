from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models.product import Product
from models.brand import Brand
from models.category import Category

from schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse
)

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.post("/", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):

    if db.query(Product).filter(Product.sku == product.sku).first():
        raise HTTPException(status_code=400, detail="SKU already exists")

    if not db.query(Brand).filter(Brand.id == product.brand_id).first():
        raise HTTPException(status_code=404, detail="Brand not found")

    if not db.query(Category).filter(Category.id == product.category_id).first():
        raise HTTPException(status_code=404, detail="Category not found")

    new_product = Product(**product.model_dump())

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


@router.get("/", response_model=list[ProductResponse])
def get_products(db: Session =Depends(get_db)):
    return db.query(Product).all()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id:int,db:Session=Depends(get_db)):
    product=db.query(Product).filter(Product.id==product_id).first()

    if not product:
        raise HTTPException(status_code=404,detail="Product not found")

    return product


@router.put("/{product_id}",response_model=ProductResponse)
def update_product(
        product_id:int,
        product:ProductUpdate,
        db:Session=Depends(get_db)
):

    db_product=db.query(Product).filter(Product.id==product_id).first()

    if not db_product:
        raise HTTPException(status_code=404,detail="Product not found")

    update_data=product.model_dump(exclude_unset=True)

    for key,value in update_data.items():
        setattr(db_product,key,value)

    db.commit()
    db.refresh(db_product)

    return db_product


@router.delete("/{product_id}")
def delete_product(product_id:int,db:Session=Depends(get_db)):

    product=db.query(Product).filter(Product.id==product_id).first()

    if not product:
        raise HTTPException(status_code=404,detail="Product not found")

    db.delete(product)
    db.commit()

    return {"message":"Product deleted successfully"}
