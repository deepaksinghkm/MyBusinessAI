from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from decimal import Decimal

from database import get_db

from models.purchase import (
    Purchase,
    PurchaseItem,
)

from models.supplier import Supplier

from models.product_variant import (
    ProductVariant,
)

from models.stock_ledger import (
    StockLedger,
)

from schemas.purchase import (
    PurchaseCreate,
    PurchaseResponse,
)


router = APIRouter(
    prefix="/purchases",
    tags=["Purchases"],
)


# =========================================================
# CREATE PURCHASE
# =========================================================

@router.post(
    "/",
    response_model=PurchaseResponse,
)
def create_purchase(
    data: PurchaseCreate,
    db: Session = Depends(get_db),
):

    # -----------------------------------------------------
    # Purchase number duplicate check
    # -----------------------------------------------------

    existing_purchase = (
        db.query(Purchase)
        .filter(
            Purchase.purchase_no
            == data.purchase_no
        )
        .first()
    )

    if existing_purchase:

        raise HTTPException(
            status_code=400,
            detail="Purchase number already exists",
        )


    # -----------------------------------------------------
    # Supplier check
    # -----------------------------------------------------

    supplier = (
        db.query(Supplier)
        .filter(
            Supplier.id
            == data.supplier_id
        )
        .first()
    )

    if not supplier:

        raise HTTPException(
            status_code=404,
            detail="Supplier not found",
        )


    # -----------------------------------------------------
    # Items required
    # -----------------------------------------------------

    if not data.items:

        raise HTTPException(
            status_code=400,
            detail="At least one purchase item is required",
        )


    subtotal = Decimal("0")

    purchase_items = []

    ledger_entries = []


    # =====================================================
    # PROCESS ITEMS
    # =====================================================

    for item in data.items:

        # -------------------------------------------------
        # Quantity validation
        # -------------------------------------------------

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
        # Calculate amount
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


        purchase_item = PurchaseItem(

            variant_id=item.variant_id,

            qty=item.qty,

            rate=item.rate,

            discount=item_discount,

            tax_percent=item.tax_percent,

            tax_amount=tax_amount,

            amount=final_amount,
        )


        purchase_items.append(
            purchase_item
        )


    # =====================================================
    # PURCHASE TOTAL
    # =====================================================

    purchase_discount = (
        data.discount
        if data.discount > 0
        else Decimal("0")
    )

    purchase_tax = (
        data.tax
        if data.tax > 0
        else Decimal("0")
    )


    grand_total = (
        subtotal
        - purchase_discount
        + purchase_tax
    )


    if grand_total < 0:

        raise HTTPException(
            status_code=400,
            detail="Grand total cannot be negative",
        )


    # =====================================================
    # CREATE PURCHASE
    # =====================================================

    purchase = Purchase(

        purchase_no=data.purchase_no,

        purchase_date=data.purchase_date,

        supplier_id=data.supplier_id,

        invoice_no=data.invoice_no,

        invoice_date=data.invoice_date,

        remarks=data.remarks,

        subtotal=subtotal,

        discount=purchase_discount,

        tax=purchase_tax,

        grand_total=grand_total,
    )


    db.add(purchase)

    db.flush()


    # =====================================================
    # CREATE PURCHASE ITEMS
    # =====================================================

    for purchase_item in purchase_items:

        purchase_item.purchase_id = (
            purchase.id
        )

        db.add(purchase_item)


    # =====================================================
    # STOCK LEDGER
    # =====================================================

    for item in data.items:

        ledger = StockLedger(

            variant_id=item.variant_id,

            transaction_type="Purchase",

            qty=item.qty,

            reference_no=data.purchase_no,

            remarks=(
                f"Purchase from "
                f"{supplier.supplier_name}"
            ),
        )

        db.add(ledger)


        # -------------------------------------------------
        # Keep ProductVariant.stock updated
        # -------------------------------------------------

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


    # =====================================================
    # COMMIT
    # =====================================================

    db.commit()

    db.refresh(purchase)

    return purchase


# =========================================================
# GET ALL PURCHASES
# =========================================================

@router.get(
    "/",
    response_model=list[PurchaseResponse],
)
def get_purchases(
    db: Session = Depends(get_db),
):

    return (
        db.query(Purchase)
        .order_by(
            Purchase.id.desc()
        )
        .all()
    )


# =========================================================
# GET SINGLE PURCHASE
# =========================================================

@router.get(
    "/{purchase_id}",
    response_model=PurchaseResponse,
)
def get_purchase(
    purchase_id: int,
    db: Session = Depends(get_db),
):

    purchase = (
        db.query(Purchase)
        .filter(
            Purchase.id
            == purchase_id
        )
        .first()
    )

    if not purchase:

        raise HTTPException(
            status_code=404,
            detail="Purchase not found",
        )

    return purchase


# =========================================================
# DELETE PURCHASE
# =========================================================

@router.delete(
    "/{purchase_id}"
)
def delete_purchase(
    purchase_id: int,
    db: Session = Depends(get_db),
):

    purchase = (
        db.query(Purchase)
        .filter(
            Purchase.id
            == purchase_id
        )
        .first()
    )

    if not purchase:

        raise HTTPException(
            status_code=404,
            detail="Purchase not found",
        )


    # =====================================================
    # REVERSE STOCK
    # =====================================================

    for item in purchase.items:

        variant = (
            db.query(ProductVariant)
            .filter(
                ProductVariant.id
                == item.variant_id
            )
            .first()
        )

        if variant:

            current_stock = (
                variant.stock or 0
            )

            if current_stock < item.qty:

                raise HTTPException(
                    status_code=400,
                    detail=(
                        "Purchase cannot be deleted "
                        "because current stock is lower "
                        "than purchased quantity"
                    ),
                )

            variant.stock = (
                current_stock
                - item.qty
            )


        # -------------------------------------------------
        # Negative adjustment
        # -------------------------------------------------

        reversal = StockLedger(

            variant_id=item.variant_id,

            transaction_type="Adjustment",

            qty=-item.qty,

            reference_no=(
                f"DELETE-{purchase.purchase_no}"
            ),

            remarks=(
                "Purchase deleted - "
                "stock reversed"
            ),
        )

        db.add(reversal)


    # =====================================================
    # DELETE PURCHASE
    # =====================================================

    db.delete(purchase)

    db.commit()


    return {
        "message":
            "Purchase deleted and stock reversed successfully"
    }
