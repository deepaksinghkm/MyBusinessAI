from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)

from fastapi.responses import FileResponse

from sqlalchemy.orm import Session
from sqlalchemy import func

import os

from database import get_db

from models.product import Product
from models.category import Category
from models.company import Company
from models.stock_ledger import StockLedger


from services.pdf_generator import (
    generate_catalog_pdf,
)


router = APIRouter(
    prefix="/pdf-catalog",
    tags=["PDF Catalog"],
)


# =========================================================
# CURRENT COMPANY
# =========================================================

def get_current_company(
    db: Session,
):

    company = (
        db.query(Company)
        .filter(
            Company.is_active == True
        )
        .order_by(
            Company.id.asc()
        )
        .first()
    )

    return company


# =========================================================
# CURRENT STOCK
# =========================================================

def get_current_stock(
    variant_id: int,
    db: Session,
):
    """
    Actual stock Stock Ledger se calculate hoga.

    Opening
    + Purchase
    + Adjustment
    - Sale
    = Current Stock
    """

    incoming_stock = (
        db.query(
            func.coalesce(
                func.sum(
                    StockLedger.qty
                ),
                0,
            )
        )
        .filter(
            StockLedger.variant_id
            == variant_id,

            StockLedger.transaction_type.in_(
                [
                    "Opening",
                    "Purchase",
                    "Adjustment",
                ]
            ),
        )
        .scalar()
    )

    outgoing_stock = (
        db.query(
            func.coalesce(
                func.sum(
                    StockLedger.qty
                ),
                0,
            )
        )
        .filter(
            StockLedger.variant_id
            == variant_id,

            StockLedger.transaction_type
            == "Sale",
        )
        .scalar()
    )

    incoming_stock = int(
        incoming_stock or 0
    )

    outgoing_stock = int(
        outgoing_stock or 0
    )

    current_stock = (
        incoming_stock
        - outgoing_stock
    )

    return current_stock


# =========================================================
# GET PRODUCTS FOR PDF
# =========================================================

def get_products_for_pdf(
    db: Session,
    category_id=None,
    stock_limit: int = 5,
):
    """
    IMPORTANT PDF RULE:

    Stock 0:
        Product PDF mein nahi aayega.

    Stock 1:
        PDF Qty = 1

    Stock 3:
        PDF Qty = 3

    Stock 5:
        PDF Qty = 5

    Stock 8:
        PDF Qty = 5

    Stock 20:
        PDF Qty = 5

    Stock 100:
        PDF Qty = 5

    Matlab:
        PDF Qty = MIN(Current Stock, Stock Limit)
    """

    query = db.query(Product)

    # -----------------------------------------------------
    # CATEGORY FILTER
    # -----------------------------------------------------

    if category_id is not None:

        query = query.filter(
            Product.category_id
            == category_id
        )

    products = (
        query
        .order_by(
            Product.id.desc()
        )
        .all()
    )

    final_products = []

    filtered_variants = {}

    # -----------------------------------------------------
    # PRODUCT LOOP
    # -----------------------------------------------------

    for product in products:

        product_variants = []

        # -------------------------------------------------
        # VARIANT LOOP
        # -------------------------------------------------

        for variant in (
            product.variants or []
        ):

            # ---------------------------------------------
            # ACTUAL STOCK FROM LEDGER
            # ---------------------------------------------

            current_stock = (
                get_current_stock(
                    variant.id,
                    db,
                )
            )

            # ---------------------------------------------
            # ZERO STOCK EXCLUDE
            # ---------------------------------------------

            if current_stock <= 0:
                continue

            # ---------------------------------------------
            # IMPORTANT:
            #
            # Product ko stock limit se filter
            # NAHI karna hai.
            #
            # Sirf PDF mein dikhne wali qty
            # ko limit karna hai.
            #
            # Example:
            #
            # Actual = 8
            # Limit  = 5
            # PDF    = 5
            #
            # Actual = 3
            # Limit  = 5
            # PDF    = 3
            # ---------------------------------------------

            pdf_stock = min(
                current_stock,
                stock_limit,
            )

            # Temporary value for PDF.
            # Database mein save nahi hoga.
            variant.stock = pdf_stock

            product_variants.append(
                variant
            )

        # -------------------------------------------------
        # PRODUCT ADD
        # -------------------------------------------------

        if product_variants:

            final_products.append(
                product
            )

            filtered_variants[
                product.id
            ] = product_variants

    return (
        final_products,
        filtered_variants,
    )


# =========================================================
# ALL CATEGORY PDF
# =========================================================

@router.get("/generate")
def generate_all_products_pdf(
    stock_limit: int = Query(
        5,
        ge=1,
    ),

    db: Session = Depends(get_db),
):

    (
        products,
        filtered_variants,
    ) = get_products_for_pdf(
        db=db,
        category_id=None,
        stock_limit=stock_limit,
    )

    company = (
        get_current_company(db)
    )

    company_name = (
        company.company_name
        if company
        else "Company"
    )

    file_path = (
        generate_catalog_pdf(
            products=products,

            category_name=(
                "All Categories"
            ),

            company=company,

            filtered_variants=
                filtered_variants,

            stock_limit=stock_limit,
        )
    )

    if not os.path.exists(
        file_path
    ):

        raise HTTPException(
            status_code=500,
            detail=(
                "PDF generation failed"
            ),
        )

    filename = (
        f"{company_name}_"
        f"Stock_Upto_"
        f"{stock_limit}.pdf"
    )

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=filename,
    )


# =========================================================
# CATEGORY-WISE PDF
# =========================================================

@router.get(
    "/generate/category/{category_id}"
)
def generate_category_pdf(
    category_id: int,

    stock_limit: int = Query(
        5,
        ge=1,
    ),

    db: Session = Depends(get_db),
):

    # -----------------------------------------------------
    # CATEGORY CHECK
    # -----------------------------------------------------

    category = (
        db.query(Category)
        .filter(
            Category.id
            == category_id
        )
        .first()
    )

    if not category:

        raise HTTPException(
            status_code=404,
            detail="Category not found",
        )

    # -----------------------------------------------------
    # PRODUCTS
    # -----------------------------------------------------

    (
        products,
        filtered_variants,
    ) = get_products_for_pdf(
        db=db,
        category_id=category_id,
        stock_limit=stock_limit,
    )

    # -----------------------------------------------------
    # COMPANY
    # -----------------------------------------------------

    company = (
        get_current_company(db)
    )

    company_name = (
        company.company_name
        if company
        else "Company"
    )

    # -----------------------------------------------------
    # GENERATE PDF
    # -----------------------------------------------------

    file_path = (
        generate_catalog_pdf(
            products=products,

            category_name=(
                category.name
            ),

            company=company,

            filtered_variants=
                filtered_variants,

            stock_limit=stock_limit,
        )
    )

    if not os.path.exists(
        file_path
    ):

        raise HTTPException(
            status_code=500,
            detail=(
                "PDF generation failed"
            ),
        )

    filename = (
        f"{company_name}_"
        f"{category.name}_"
        f"Stock_Upto_"
        f"{stock_limit}.pdf"
    )

    return FileResponse(
        path=file_path,
        media_type="application/pdf",
        filename=filename,
    )