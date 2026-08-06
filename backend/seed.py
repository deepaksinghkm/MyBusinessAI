from database import SessionLocal
from models.user import User
from utils.security import hash_password

db = SessionLocal()

# Check if admin already exists
admin = db.query(User).filter(User.username == "admin").first()

if not admin:
    admin = User(
        username="admin",
        full_name="Super Admin",
        email="admin@mybusinessai.com",
        password=hash_password("admin123"),
        is_super_admin=True,
        is_active=True
    )

    db.add(admin)
    db.commit()
    print("✅ Super Admin Created Successfully!")
else:
    print("⚠️ Super Admin Already Exists!")

db.close()
