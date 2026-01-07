from sqlalchemy import Column, Integer, String
from api.database import Base
from api.utils import generate_public_id

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(String(64), unique=True, index=True, default=lambda: generate_public_id("user"))
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    