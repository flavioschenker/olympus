from pydantic import BaseModel

class IngredientBase(BaseModel):
    name: str
    brand: str | None = None
    base_amount: float
    base_unit: str
    calories: float
    protein: float
    carbs: float = 0
    fats: float = 0

class IngredientCreate(IngredientBase):
    pass

class IngredientResponse(IngredientBase):
    public_id: str
    class Config:
        from_attributes = True