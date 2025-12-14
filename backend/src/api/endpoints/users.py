from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from api import schemas, crud
from api.database import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/", response_model=list[schemas.User])
def read_all_users(db: Session = Depends(get_db)):
    users = crud.get_users(db)
    return users
    
@router.post("/", response_model=schemas.User)
def create_new_user(user: schemas.UserBase, db: Session = Depends(get_db)):
    db_user = crud.create_user(db, user=user)
    return db_user

@router.get("/{user_id}", response_model=schemas.User)
def read_user(user_id: str, db: Session = Depends(get_db)):
    user = crud.get_user(db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{user_id}", response_model=dict)
def delete_user(user_id: str, db: Session = Depends(get_db)):
    success = crud.delete_user(db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": "User deleted successfully"}

@router.put("/{user_id}", response_model=schemas.User)
def update_user(user_id: str, user_update: schemas.UserBase, db: Session = Depends(get_db)):
    updated_user = crud.update_user(db, user_id=user_id, user_update=user_update)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user