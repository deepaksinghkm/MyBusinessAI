from fastapi import FastAPI
from database import Base, engine

from models.user import User
from models.role import Role
from models.permission import Permission
from models.user_role import UserRole
from models.role_permission import RolePermission

Base.metadata.create_all(bind=engine)

app = FastAPI(title="My Business AI", version="1.0")

@app.get("/")
def home():
    return {
        "status": "success",
        "message": "Welcome to My Business AI"
    }

@app.get("/health")
def health():
    return {
        "server": "running"
    }

@app.get("/products")
def products():
    return [
        {"id": 1, "name": "School Shoes", "price": 499},
        {"id": 2, "name": "Sports Shoes", "price": 799},
        {"id": 3, "name": "Slippers", "price": 299}
    ]
