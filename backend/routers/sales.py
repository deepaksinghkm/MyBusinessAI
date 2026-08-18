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

from models.customer import (
    Customer,
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

    # =====================================================
    # BILL TO CUSTOMER
    # =====================================================

    bill_to_customer = None

    if data.bill_to_customer_id is not None:

        bill_to_customer = (
            db.query(Customer)
            .filter(
                Customer.id
                == data.bill_to_customer_id
            )
            .first()
        )

        if not bill_to_customer:
            raise HTTPException(
                status_code=404,
                detail="Bill To customer not found",
            )

    # =====================================================
    # SHIP TO CUSTOMER
    # =====================================================

    ship_to_customer = None

    if data.ship_to_customer_id is not None:

        ship_to_customer = (
            db.query(Customer)
            .filter(
                Customer.id
                == data.ship_to_customer_id
            )
            .first()
        )

        if not ship_to_customer:
            raise HTTPException(
                status_code=404,
                detail="Ship To customer not found",
            )

    # =====================================================
    # DEFAULT SHIP TO = BILL TO
    # =====================================================

    if (
        data.bill_to_customer_id is not None
        and data.ship_to_customer_id is None
    ):
        ship_to_customer = bill_to_customer

    subtotal = Decimal("0")
    item_tax_total = Decimal("0")
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

        if item.discount < 0:
            raise HTTPException(
                status_code=400,
                detail="Item discount cannot be negative",
            )

        if item.tax_percent < 0:
            raise HTTPException(
                status_code=400,
                detail="Tax percent cannot be negative",
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

        current_stock = variant.stock or 0

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
        item_tax_total += tax_amount

        sale_item = SaleItem(
            variant_id=item.variant_id,
            qty=item.qty,
            rate=item.rate,
            discount=item_discount,
            tax_percent=item.tax_percent,
            tax_amount=tax_amount,
            amount=final_amount,
        )

        sale_items.append(sale_item)

    # =====================================================
    # SALE TOTAL
    # =====================================================

    sale_discount = (
        data.discount
        if data.discount > 0
        else Decimal("0")
    )

    if sale_discount < 0:
        raise HTTPException(
            status_code=400,
            detail="Sale discount cannot be negative",
        )

    # The frontend sends item tax total in data.tax.
    # Backend recalculates item tax independently for safety.
    # If a sale-level tax is supplied, add only the difference
    # above the calculated item tax; this prevents accidental
    # double-counting from the normal frontend payload.
    supplied_tax = (
        data.tax
        if data.tax > 0
        else Decimal("0")
    )

    if supplied_tax > 0:
        sale_tax = max(
            supplied_tax,
            item_tax_total,
        )
    else:
        sale_tax = item_tax_total

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

        bill_to_customer_id=(
            data.bill_to_customer_id
        ),

        ship_to_customer_id=(
            data.ship_to_customer_id
            if data.ship_to_customer_id is not None
            else data.bill_to_customer_id
        ),

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

        current_stock = variant.stock or 0

        if item.qty > current_stock:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Insufficient stock while "
                    "processing sale"
                ),
            )

        variant.stock = (
            current_stock
            - item.qty
        )

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
        .order_by(Sale.id.desc())
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
        "message": "Sale deleted successfully"
    }