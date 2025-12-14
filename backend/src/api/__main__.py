import uvicorn
from fastapi import FastAPI, APIRouter, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from api.database import get_db, Base, engine
from api.endpoints import users_router, items_router
#from api.config import settings

app = FastAPI(version="1.2.3", title="Olympus API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter()
router.include_router(users_router)
router.include_router(items_router)
app.include_router(router, prefix="")

Base.metadata.create_all(bind=engine)

@app.get("/health")
def check_db_availability(db: Session = Depends(get_db)):
    """
    Checks database connection and runs a simple query.
    """
    try:
        # Executes a simple "SELECT 1" query to confirm the connection is active
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "available"}
    except Exception as e:
        # If any exception occurs (e.g., connection refused, credentials failed)
        print(f"Database connection error: {e}")
        raise HTTPException(
            status_code=503, 
            detail={"status": "error", "database": "unavailable"}
        )
