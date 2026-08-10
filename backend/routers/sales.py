from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from decimal import Decimal

from database import get_db

from models.sale import (
    Sale,
    SaleItem,
)

from models.product_variant import (
    ProductVariant,
)

from models.stock_ledger import (
    StockLedger,
)

from schemas.sale import (
    SaleCreate,
    SaleResponse,
)


router = APIRouter(
    prefix="/sales",
    tags=["Sales"],
)


# =========================================================
# CREATE SALE
# =========================================================

@router.post(
    "/",
    response_model=SaleResponse,
)
def create_sale(
    data: SaleCreate,
    db: Session = Depends(get_db),
):

    # -----------------------------------------------------
    # Duplicate Sale Number
    # -----------------------------------------------------

    existing_sale = (
        db.query(Sale)
        .filter(
            Sale.sale_no == data.sale_no
        )
        .first()
    )

    if existing_sale:

        raise HTTPException(
            status_code=400,
            detail="Sale number already exists",
        )


    # -----------------------------------------------------
    # Items required
    # -----------------------------------------------------

    if not data.items:

        raise HTTPException(
            status_code=400,
            detail="At least one sale item is required",
        )


    subtotal = Decimal("0")

    sale_items = []


    # =====================================================
    # PROCESS ITEMS
    # =====================================================

    for item in data.items:

        if item.qty <= 0:

            raise HTTPException(
                status_code=400,
                detail="Quantity must be greater than zero",
            )


        if item.rate < 0:

            raise HTTPException(
                status_code=400,
                detail="Rate cannot be negative",
            )


        # -------------------------------------------------
        # Variant
        # -------------------------------------------------

        variant = (
            db.query(ProductVariant)
            .filter(
                ProductVariant.id
                == item.variant_id
            )
            .first()
        )

        if not variant:

            raise HTTPException(
                status_code=404,
                detail=(
                    f"Product variant "
                    f"{item.variant_id} not found"
                ),
            )


        # -------------------------------------------------
        # Current Stock
        # -------------------------------------------------

        current_stock = (
            variant.stock or 0
        )


        if item.qty > current_stock:

            raise HTTPException(
                status_code=400,
                detail=(
                    f"Insufficient stock for "
                    f"variant {item.variant_id}. "
                    f"Available stock: {current_stock}, "
                    f"requested: {item.qty}"
                ),
            )


        # -------------------------------------------------
        # Amount Calculation
        # -------------------------------------------------

        gross_amount = (
            Decimal(item.qty)
            * item.rate
        )


        item_discount = (
            item.discount
            if item.discount > 0
            else Decimal("0")
        )


        taxable_amount = (
            gross_amount
            - item_discount
        )


        if taxable_amount < 0:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Item discount cannot be "
                    "greater than item amount"
                ),
            )


        tax_amount = (
            taxable_amount
            * item.tax_percent
            / Decimal("100")
        )


        final_amount = (
            taxable_amount
            + tax_amount
        )


        subtotal += taxable_amount


        sale_item = SaleItem(

            variant_id=item.variant_id,

            qty=item.qty,

            rate=item.rate,

            discount=item_discount,

            tax_percent=item.tax_percent,

            tax_amount=tax_amount,

            amount=final_amount,
        )


        sale_items.append(
            sale_item
        )


    # =====================================================
    # SALE TOTAL
    # =====================================================

    sale_discount = (
        data.discount
        if data.discount > 0
        else Decimal("0")
    )


    sale_tax = (
        data.tax
        if data.tax > 0
        else Decimal("0")
    )


    grand_total = (
        subtotal
        - sale_discount
        + sale_tax
    )


    if grand_total < 0:

        raise HTTPException(
            status_code=400,
            detail="Grand total cannot be negative",
        )


    # =====================================================
    # CREATE SALE
    # =====================================================

    sale = Sale(

        sale_no=data.sale_no,

        sale_date=data.sale_date,

        customer_name=data.customer_name,

        customer_mobile=data.customer_mobile,

        invoice_no=data.invoice_no,

        remarks=data.remarks,

        subtotal=subtotal,

        discount=sale_discount,

        tax=sale_tax,

        grand_total=grand_total,
    )


    db.add(sale)

    db.flush()


    # =====================================================
    # CREATE SALE ITEMS
    # =====================================================

    for sale_item in sale_items:

        sale_item.sale_id = sale.id

        db.add(sale_item)


    # =====================================================
    # STOCK LEDGER + STOCK REDUCTION
    # =====================================================

    for item in data.items:

        variant = (
            db.query(ProductVariant)
            .filter(
                ProductVariant.id
                == item.variant_id
            )
            .first()
        )


        if not variant:

            raise HTTPException(
                status_code=404,
                detail="Variant not found",
            )


        current_stock = (
            variant.stock or 0
        )


        # -------------------------------------------------
        # Final stock safety check
        # -------------------------------------------------

        if item.qty > current_stock:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Insufficient stock while "
                    "processing sale"
                ),
            )


        # -------------------------------------------------
        # Reduce Stock
        # -------------------------------------------------

        variant.stock = (
            current_stock
            - item.qty
        )


        # -------------------------------------------------
        # Stock Ledger
        # -------------------------------------------------

        ledger = StockLedger(

            variant_id=item.variant_id,

            transaction_type="Sale",

            qty=item.qty,

            reference_no=data.sale_no,

            remarks=(
                "Sale stock deduction"
            ),
        )


        db.add(ledger)


    # =====================================================
    # COMMIT
    # =====================================================

    db.commit()

    db.refresh(sale)

    return sale


# =========================================================
# GET ALL SALES
# =========================================================

@router.get(
    "/",
    response_model=list[SaleResponse],
)
def get_sales(
    db: Session = Depends(get_db),
):

    return (
        db.query(Sale)
        .order_by(
            Sale.id.desc()
        )
        .all()
    )


# =========================================================
# GET SINGLE SALE
# =========================================================

@router.get(
    "/{sale_id}",
    response_model=SaleResponse,
)
def get_sale(
    sale_id: int,
    db: Session = Depends(get_db),
):

    sale = (
        db.query(Sale)
        .filter(
            Sale.id == sale_id
        )
        .first()
    )


    if not sale:

        raise HTTPException(
            status_code=404,
            detail="Sale not found",
        )


    return sale


# =========================================================
# DELETE SALE
# =========================================================

@router.delete(
    "/{sale_id}"
)
def delete_sale(
    sale_id: int,
    db: Session = Depends(get_db),
):

    sale = (
        db.query(Sale)
        .filter(
            Sale.id == sale_id
        )
        .first()
    )


    if not sale:

        raise HTTPException(
            status_code=404,
            detail="Sale not found",
        )


    # =====================================================
    # RESTORE STOCK
    # =====================================================

    for item in sale.items:

        variant = (
            db.query(ProductVariant)
            .filter(
                ProductVariant.id
                == item.variant_id
            )
            .first()
        )


        if variant:

            variant.stock = (
                (variant.stock or 0)
                + item.qty
            )


        # -------------------------------------------------
        # Stock Ledger Reversal
        # -------------------------------------------------

        reversal = StockLedger(

            variant_id=item.variant_id,

            transaction_type="Adjustment",

            qty=item.qty,

            reference_no=(
                f"DELETE-{sale.sale_no}"
            ),

            remarks=(
                "Sale deleted - "
                "stock restored"
            ),
        )


        db.add(reversal)


    # =====================================================
    # DELETE SALE
    # =====================================================

    db.delete(sale)

    db.commit()


    return {
        "message":
            "Sale deleted and stock restored successfully"
    }
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from decimal import Decimal

from database import get_db

from models.sale import (
    Sale,
    SaleItem,
)

from models.product_variant import ProductVariant

from models.stock_ledger import StockLedger

from schemas.sale import (
    SaleCreate,
    SaleResponse,
)


router = APIRouter(
    prefix="/sales",
    tags=["Sales"],
)


# =========================================================
# CREATE SALE
# =========================================================

@router.post(
    "/",
    response_model=SaleResponse,
)
def create_sale(
    data: SaleCreate,
    db: Session = Depends(get_db),
):

    # -----------------------------------------------------
    # Duplicate Sale Number
    # -----------------------------------------------------

    existing_sale = (
        db.query(Sale)
        .filter(
            Sale.sale_no == data.sale_no
        )
        .first()
    )

    if existing_sale:
        raise HTTPException(
            status_code=400,
            detail="Sale number already exists",
        )


    # -----------------------------------------------------
    # Items Required
    # -----------------------------------------------------

    if not data.items:
        raise HTTPException(
            status_code=400,
            detail="At least one sale item is required",
        )


    subtotal = Decimal("0")

    sale_items = []


    # =====================================================
    # PROCESS ITEMS
    # =====================================================

    for item in data.items:

        if item.qty <= 0:
            raise HTTPException(
                status_code=400,
                detail="Quantity must be greater than zero",
            )


        if item.rate < 0:
            raise HTTPException(
                status_code=400,
                detail="Rate cannot be negative",
            )


        # -------------------------------------------------
        # Find Variant
        # -------------------------------------------------

        variant = (
            db.query(ProductVariant)
            .filter(
                ProductVariant.id
                == item.variant_id
            )
            .first()
        )

        if not variant:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"Product variant "
                    f"{item.variant_id} not found"
                ),
            )


        # -------------------------------------------------
        # Amount Calculation
        # -------------------------------------------------

        gross_amount = (
            Decimal(item.qty)
            * item.rate
        )


        item_discount = (
            item.discount
            if item.discount > 0
            else Decimal("0")
        )


        taxable_amount = (
            gross_amount
            - item_discount
        )


        if taxable_amount < 0:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Item discount cannot be "
                    "greater than item amount"
                ),
            )


        tax_amount = (
            taxable_amount
            * item.tax_percent
            / Decimal("100")
        )


        final_amount = (
            taxable_amount
            + tax_amount
        )


        subtotal += taxable_amount


        sale_item = SaleItem(
            variant_id=item.variant_id,
            qty=item.qty,
            rate=item.rate,
            discount=item_discount,
            tax_percent=item.tax_percent,
            tax_amount=tax_amount,
            amount=final_amount,
        )


        sale_items.append(
            sale_item
        )


    # =====================================================
    # SALE TOTAL
    # =====================================================

    sale_discount = (
        data.discount
        if data.discount > 0
        else Decimal("0")
    )


    sale_tax = (
        data.tax
        if data.tax > 0
        else Decimal("0")
    )


    grand_total = (
        subtotal
        - sale_discount
        + sale_tax
    )


    if grand_total < 0:
        raise HTTPException(
            status_code=400,
            detail="Grand total cannot be negative",
        )


    # =====================================================
    # CREATE SALE
    # =====================================================

    sale = Sale(
        sale_no=data.sale_no,
        sale_date=data.sale_date,
        customer_name=data.customer_name,
        customer_mobile=data.customer_mobile,
        invoice_no=data.invoice_no,
        remarks=data.remarks,
        subtotal=subtotal,
        discount=sale_discount,
        tax=sale_tax,
        grand_total=grand_total,
    )


    db.add(sale)

    db.flush()


    # =====================================================
    # CREATE SALE ITEMS
    # =====================================================

    for sale_item in sale_items:

        sale_item.sale_id = sale.id

        db.add(sale_item)


    # =====================================================
    # STOCK UPDATE
    # =====================================================

    for item in data.items:

        variant = (
            db.query(ProductVariant)
            .filter(
                ProductVariant.id
                == item.variant_id
            )
            .first()
        )


        if not variant:
            raise HTTPException(
                status_code=404,
                detail="Variant not found",
            )


        current_stock = (
            variant.stock or 0
        )


        # -------------------------------------------------
        # IMPORTANT
        #
        # Negative stock is allowed.
        #
        # Example:
        # Stock = 5
        # Sale  = 6
        # New Stock = -1
        # -------------------------------------------------

        variant.stock = (
            current_stock
            - item.qty
        )


        # -------------------------------------------------
        # Stock Ledger
        # -------------------------------------------------

        ledger = StockLedger(
            variant_id=item.variant_id,
            transaction_type="Sale",
            qty=item.qty,
            reference_no=data.sale_no,
            remarks="Sale stock deduction",
        )


        db.add(ledger)


    # =====================================================
    # COMMIT
    # =====================================================

    db.commit()

    db.refresh(sale)

    return sale


# =========================================================
# GET ALL SALES
# =========================================================

@router.get(
    "/",
    response_model=list[SaleResponse],
)
def get_sales(
    db: Session = Depends(get_db),
):

    return (
        db.query(Sale)
        .order_by(
            Sale.id.desc()
        )
        .all()
    )


# =========================================================
# GET SINGLE SALE
# =========================================================

@router.get(
    "/{sale_id}",
    response_model=SaleResponse,
)
def get_sale(
    sale_id: int,
    db: Session = Depends(get_db),
):

    sale = (
        db.query(Sale)
        .filter(
            Sale.id == sale_id
        )
        .first()
    )


    if not sale:
        raise HTTPException(
            status_code=404,
            detail="Sale not found",
        )


    return sale


# =========================================================
# DELETE SALE
# =========================================================

@router.delete(
    "/{sale_id}"
)
def delete_sale(
    sale_id: int,
    db: Session = Depends(get_db),
):

    sale = (
        db.query(Sale)
        .filter(
            Sale.id == sale_id
        )
        .first()
    )


    if not sale:
        raise HTTPException(
            status_code=404,
            detail="Sale not found",
        )


    # =====================================================
    # RESTORE STOCK
    # =====================================================

    for item in sale.items:

        variant = (
            db.query(ProductVariant)
            .filter(
                ProductVariant.id
                == item.variant_id
            )
            .first()
        )


        if variant:

            variant.stock = (
                (variant.stock or 0)
                + item.qty
            )


        # -------------------------------------------------
        # Stock Ledger Reversal
        # -------------------------------------------------

        reversal = StockLedger(
            variant_id=item.variant_id,
            transaction_type="Adjustment",
            qty=item.qty,
            reference_no=(
                f"DELETE-{sale.sale_no}"
            ),
            remarks=(
                "Sale deleted - "
                "stock restored"
            ),
        )


        db.add(reversal)


    # =====================================================
    # DELETE SALE
    # =====================================================

    db.delete(sale)

    db.commit()


    return {
        "message":
            "Sale deleted and stock restored successfully"
    }
