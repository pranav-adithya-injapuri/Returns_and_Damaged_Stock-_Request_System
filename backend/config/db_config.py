import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

class DBConfig:
    HOST = os.getenv("DB_HOST", "localhost")
    USER = os.getenv("DB_USER", "root")
    PASSWORD = os.getenv("DB_PASSWORD", "")
    DATABASE = os.getenv("DB_NAME", "pharmacy_returns")
    PORT = int(os.getenv("DB_PORT", 3306))
