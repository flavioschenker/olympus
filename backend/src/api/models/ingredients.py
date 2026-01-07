from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date, JSON
from sqlalchemy.orm import relationship
from api.database import Base
from api.utils import generate_public_id


class Ingredient(Base):
    __tablename__ = "ingredients"

    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(String(64), unique=True, index=True, default=lambda: generate_public_id("ingredient"))
    name = Column(String, unique=True, index=True)

    brand = Column(String, nullable=True)
    
    base_amount = Column(Float, default=100.0) 
    base_unit = Column(String, default="g")
    
    calories = Column(Float, default=0.0)
    protein = Column(Float, default=0.0)
    carbs = Column(Float, default=0.0)
    fats = Column(Float, default=0.0)
       
    # Relationships
    recipes_link = relationship("RecipeIngredient", back_populates="ingredient")


class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(String(64), unique=True, index=True, default=lambda: generate_public_id("recipe"))
    name = Column(String, index=True)

    instructions = Column(String, nullable=True)
    
    # Relationships
    ingredients_link = relationship("RecipeIngredient", back_populates="recipe")
    meal_plans_link = relationship("MealPlanEntry", back_populates="recipe")

    @property
    def total_calories(self):
        return sum(item.calculated_calories for item in self.ingredients_link)


class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"

    recipe_id = Column(Integer, ForeignKey("recipes.id"), primary_key=True)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), primary_key=True)
    
    amount = Column(Float, nullable=False)
    
    recipe = relationship("Recipe", back_populates="ingredients_link")
    ingredient = relationship("Ingredient", back_populates="recipes_link")

    @property
    def calculated_calories(self):
        return (self.amount / self.ingredient.base_amount) * self.ingredient.calories


class MealPlan(Base):
    __tablename__ = "meal_plans"

    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(String(64), unique=True, index=True, default=lambda: generate_public_id("plan"))
    date = Column(Date, unique=True) # e.g., 2025-12-28
    note = Column(String, nullable=True) # e.g., "36h Deep Fast Start" or "Feeding Day"
    
    entries = relationship("MealPlanEntry", back_populates="meal_plan")


class MealPlanEntry(Base):
    """
    Association Table: Links Recipes to a MealPlan with serving data.
    """
    __tablename__ = "meal_plan_entries"

    id = Column(Integer, primary_key=True, index=True)
    meal_plan_id = Column(Integer, ForeignKey("meal_plans.id"))
    recipe_id = Column(Integer, ForeignKey("recipes.id"))
    
    meal_type = Column(String) # Breakfast, Dinner, Post-Fast
    servings = Column(Float, default=1.0) # 1.5 servings
    
    meal_plan = relationship("MealPlan", back_populates="entries")
    recipe = relationship("Recipe", back_populates="meal_plans_link")