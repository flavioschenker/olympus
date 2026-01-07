from pydantic import BaseModel
from typing import List, Optional
from datetime import date


class IngredientBase(BaseModel):
    name: str
    brand: Optional[str] = None
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

# Recipe Schemas
class RecipeIngredientCreate(BaseModel):
    ingredient_id: int
    amount: float

class RecipeCreate(BaseModel):
    name: str
    instructions: Optional[str] = None
    ingredients: List[RecipeIngredientCreate]

class RecipeResponse(BaseModel):
    id: int
    name: str
    # You would nest ingredient details here if needed
    class Config:
        from_attributes = True

# Dashboard Summary Schema
class DailySummary(BaseModel):
    date: date
    note: Optional[str] = None
    total_calories: float
    total_protein: float
    total_magnesium: float