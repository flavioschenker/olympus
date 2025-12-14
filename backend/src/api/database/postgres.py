from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# This is your PostgreSQL connection string, adjust based on your Docker setup
# e.g., 'postgresql://user:password@host:port/dbname'
DATABASE_URL = "postgresql://olympus_user:olympus_password@postgres:5432/olympus_db"

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Configure a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all models
Base = declarative_base()

# Dependency to get a database session for a request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()