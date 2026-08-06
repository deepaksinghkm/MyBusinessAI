from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db

from models.product import Product
from models.product_variant import ProductVariant
from models.stock_ledger import StockLedger
from models.color import Color
from models.size import Size

router = APIRouter(
    prefix="/catalog",
    tags=["Catalog"]
)


@router.get("/")
def product_catalog(db: Session = Depends(get_db)):

    products = db.query(Product).all()

    result = []

    for product in products:

        variants = db.query(ProductVariant).filter(
            ProductVariant.product_id == product.id
        ).all()

        color_map = {}

        for variant in variants:

            incoming = db.query(
                func.coalesce(func.sum(StockLedger.qty), 0)
            ).filter(
                StockLedger.variant_id == variant.id,
                StockLedger.transaction_type.in_(
                    ["Opening", "Purchase", "Adjustment"]
                )
            ).scalar()

            outgoing = db.query(
                func.coalesce(func.sum(StockLedger.qty), 0)
            ).filter(
                StockLedger.variant_id == variant.id,
                StockLedger.transaction_type == "Sale"
            ).scalar()

            stock = incoming - outgoing

            if stock <= 0:
                continue

            color = db.query(Color).filter(
                Color.id == variant.color_id
            ).first()

            size = db.query(Size).filter(
                Size.id == variant.size_id
            ).first()

            if color.name not in color_map:
                color_map[color.name] = []

            color_map[color.name].append({
                "size": size.name,
                "stock": stock
            })

        if not color_map:
            continue

        result.append({
            "id": product.id,
            "sku": product.sku,
            "name": product.name,
            "image": product.image,
            "mrp": product.mrp,
            "packing": f"{product.packing_qty} Pair / {product.packing_type}",
            "colors": color_map
        })

    return result
