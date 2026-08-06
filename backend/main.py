from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from fastapi import FastAPI, Depends

from database import Base, engine

# Models
from models.user import User
from models.role import Role
from models.permission import Permission
from models.user_role import UserRole
from models.role_permission import RolePermission
from models.product import Product
from models.brand import Brand
from models.category import Category
from models.color import Color
from models.size import Size
from models.unit import Unit
from models.product_variant import ProductVariant
from models.stock_ledger import StockLedger
from models.settings import Settings
from models.company import Company


# Routers
from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.roles import router as roles_router
from routers.user_roles import router as user_roles_router
from routers.permissions import router as permissions_router
from routers.role_permissions import router as role_permissions_router
from routers.products import router as products_router
from routers.brands import router as brands_router
from routers.categories import router as categories_router
from routers.colors import router as colors_router
from routers.sizes import router as sizes_router
from routers.units import router as units_router
from routers.product_variants import router as product_variants_router
from routers.stock_ledger import router as stock_ledger_router
from routers.product_images import router as product_images_router
from routers.catalog import router as catalog_router
from routers.pdf_catalog import router as pdf_catalog_router
from routers.settings import router as settings_router
from routers.company import router as company_router

# Auth
from utils.auth import get_current_user

# Create Database Tables
Base.metadata.create_all(bind=engine)

# Create Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="My Business AI ERP",
    version="1.0.0",
    description="Enterprise ERP Backend using FastAPI",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
os.makedirs("uploads/products", exist_ok=True)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# Register Routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(roles_router)
app.include_router(user_roles_router)
app.include_router(permissions_router)
app.include_router(role_permissions_router)
app.include_router(categories_router)
app.include_router(products_router)
app.include_router(brands_router)
app.include_router(colors_router)
app.include_router(sizes_router)
app.include_router(units_router)
app.include_router(product_variants_router)
app.include_router(stock_ledger_router)
app.include_router(product_images_router)
app.include_router(catalog_router)
app.include_router(pdf_catalog_router)
app.include_router(settings_router)
app.include_router(company_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to My Business AI ERP"
    }


@app.get("/health")
def health():
    return {
        "status": "Running"
    }


@app.get("/products")
def products():
    return {
        "products": []
    }


@app.get("/dashboard")
def dashboard(current_user=Depends(get_current_user)):
    return {
        "message": "Welcome Dashboard",
        "logged_in_user": current_user
    }
