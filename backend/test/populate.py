import httpx
import asyncio
import logging
from typing import Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Configuration ---
API_BASE_URL = "http://localhost:8000"
USER_ENDPOINT = "/users/"

dummy_users_data: list[Dict[str, str]] = [
    {"first_name": "Alice", "last_name": "Smith", "email": "api.alice@example.com"},
    {"first_name": "Bob", "last_name": "Johnson", "email": "api.bob@example.com"},
    {"first_name": "Charlie", "last_name": "Brown", "email": "api.charlie@example.com"},
    {"first_name": "Diana", "last_name": "Prince", "email": "api.diana@example.com"},
    {"first_name": "Ethan", "last_name": "Hawke", "email": "api.ethan@example.com"},
]

async def create_user_via_api(client: httpx.AsyncClient, user_data: Dict[str, str]):
    """Sends a POST request to the /users/ endpoint to create a single user."""
    logging.info(f"Attempting to create user: {user_data['email']}")
    
    try:
        response = await client.post(
            USER_ENDPOINT,
            json=user_data
        )
        
        # Check the response status code
        if response.status_code == 200 or response.status_code == 201:
            # Successfully created (200/201 are common FastAPI success codes)
            created_user = response.json()
            logging.info(f"✅ Success! Created user with public_id: {created_user.get('public_id')}")
        elif response.status_code == 422:
            # Pydantic validation error or similar
            logging.error(f"❌ Failed to create {user_data['email']}. Validation Error: {response.json()}")
        else:
            # Catch other errors (e.g., email duplicate, server error)
            logging.warning(f"⚠️ API Error ({response.status_code}) for {user_data['email']}: {response.text}")
            
    except httpx.ConnectError:
        logging.critical(f"🛑 Connection error: Could not connect to API at {API_BASE_URL}. Is your FastAPI server running?")
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")

async def populate_db_via_api():
    """Main function to loop through dummy data and call the API."""
    
    # Use an AsyncClient for better performance
    async with httpx.AsyncClient(base_url=API_BASE_URL) as client:
        # Create a list of tasks (one for each user creation)
        tasks = [create_user_via_api(client, user) for user in dummy_users_data]
        
        # Run all creation tasks concurrently
        await asyncio.gather(*tasks)
        
    logging.info("\n--- API Population Attempt Complete ---")

if __name__ == "__main__":
    # Ensure this script is run asynchronously
    print(f"Starting API population script, targeting: {API_BASE_URL}")
    asyncio.run(populate_db_via_api())