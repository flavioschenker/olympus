from fastapi import APIRouter
from pydantic import BaseModel

class Item(BaseModel):
    id: int
    name: str
    description: str


router = APIRouter(
    prefix="/items",
    tags=["items"],  # For automatic grouping in Swagger UI
    responses={404: {"description": "Item not found"}},
)

# Get all items
@router.get("/", response_model=list[Item])
async def read_items():
    return [
        Item(id=1, name="Item 1", description="Description 1"),
        Item(id=2, name="Item 2", description="Description 2"),
    ]

# Get item by ID
@router.get("/{item_id}", response_model=Item)
async def read_item(item_id: str):
    return Item(id=5, name=f"Item {item_id}", description=f"Description {item_id}")

# Create a new item
@router.post("/", response_model=Item)
async def create_item(item: Item):
    return item

# Update an existing item
@router.put("/{item_id}", response_model=Item)
async def update_item(item_id: str, item: Item):
    return item

# Patch an existing item
@router.patch("/{item_id}", response_model=Item)
async def patch_item(item_id: str, item: Item):
    return item

# Delete an item
@router.delete("/{item_id}")
async def delete_item(item_id: str):
    return {"message": f"Item {item_id} deleted"}

# Head request for an item
@router.head("/{item_id}")
async def head_item(item_id: str):
    return {"message": f"Head request for item {item_id}"}