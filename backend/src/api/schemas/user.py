from pydantic import BaseModel

class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str

class User(UserBase):
    public_id: str

    class Config:
        orm_mode = True