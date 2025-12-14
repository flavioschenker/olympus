from sqlalchemy.orm import Session
from api import models, schemas


# Function for Read (Fetching a single user by ID)
def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.public_id == user_id).first()

# Function for Read (Fetching multiple users with pagination)
def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

# Function for Create (Adding a new user)
def create_user(db: Session, user: schemas.UserBase):
    db_user = models.User(
        first_name=user.first_name, 
        last_name=user.last_name, 
        email=user.email
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Function for Delete (Removing a user by ID)
def delete_user(db: Session, user_id: str):
    user = get_user(db, user_id)
    if user:
        db.delete(user)
        db.commit()
        return True
    return False

# Function for Put (Updating user details) - Optional
def update_user(db: Session, user_id: str, user_update: schemas.UserBase):
    user = get_user(db, user_id)
    if user:
        user.first_name = user_update.first_name
        user.last_name = user_update.last_name
        user.email = user_update.email
        db.commit()
        db.refresh(user)
        return user
    return None