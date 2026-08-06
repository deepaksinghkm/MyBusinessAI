from sqlalchemy.orm import Session
from models.user import User
from utils.security import verify_password

class AuthService:

    @staticmethod
    def authenticate_user(db: Session, username: str, password: str):
        user = db.query(User).filter(User.username == username).first()

        if not user:
            return None

        if not verify_password(password, user.password):
            return None

        return user
