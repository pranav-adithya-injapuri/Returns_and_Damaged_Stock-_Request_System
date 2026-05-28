import psycopg2
from psycopg2 import pool
import psycopg2.extras
import logging
from config.db_config import DBConfig

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

db_pool = None

def setup_database():
    """
    Connects to PostgreSQL server and initializes tables and seed data.
    """
    conn = None
    cursor = None
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(
            host=DBConfig.HOST,
            user=DBConfig.USER,
            password=DBConfig.PASSWORD,
            dbname=DBConfig.DATABASE,
            port=DBConfig.PORT
        )
        cursor = conn.cursor()
        
        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create return_requests table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS return_requests (
                id SERIAL PRIMARY KEY,
                pharmacy_name VARCHAR(100) NOT NULL,
                medicine_name VARCHAR(100) NOT NULL,
                batch_number VARCHAR(50) NOT NULL,
                expiry_date DATE NOT NULL,
                quantity INT NOT NULL,
                reason TEXT NOT NULL,
                image_path VARCHAR(255),
                ai_analysis TEXT,
                status VARCHAR(20) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create activity_logs table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS activity_logs (
                id SERIAL PRIMARY KEY,
                action TEXT NOT NULL,
                performed_by VARCHAR(50) NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Insert dummy seed credentials
        cursor.execute("""
            INSERT INTO users (username, password, role)
            VALUES 
            ('admin', 'admin123', 'admin'),
            ('pharmacy', 'pharmacy123', 'pharmacy')
            ON CONFLICT (username) DO NOTHING
        """)
        
        conn.commit()
        logger.info("Database schema checks completed successfully (Database and tables verified).")
        
    except psycopg2.Error as err:
        logger.error(f"Error during automatic database initialization: {err}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def init_db_pool():
    global db_pool
    if db_pool is None:
        # Run database setup before initializing the pool
        setup_database()
        try:
            db_pool = psycopg2.pool.SimpleConnectionPool(
                1, 5,
                host=DBConfig.HOST,
                user=DBConfig.USER,
                password=DBConfig.PASSWORD,
                dbname=DBConfig.DATABASE,
                port=DBConfig.PORT
            )
            logger.info("Database Connection Pool initialized successfully.")
        except psycopg2.Error as err:
            logger.error(f"Error initializing connection pool: {err}")
            db_pool = None

def get_connection():
    if db_pool is None:
        init_db_pool()
    if db_pool is not None:
        return db_pool.getconn()
    # Fallback to direct connection if pool failed to initialize
    return psycopg2.connect(
        host=DBConfig.HOST,
        user=DBConfig.USER,
        password=DBConfig.PASSWORD,
        dbname=DBConfig.DATABASE,
        port=DBConfig.PORT
    )

def release_connection(conn):
    if db_pool is not None:
        db_pool.putconn(conn)
    else:
        conn.close()

def execute_query(query, params=None, commit=False):
    """
    Executes a query and returns result or status.
    For SELECT queries, returns list of dicts.
    For INSERT/UPDATE/DELETE, returns affected rows or lastrowid.
    """
    conn = None
    cursor = None
    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(query, params or ())
        
        if commit:
            conn.commit()
            last_id = None
            if cursor.description:
                # If the query had a RETURNING clause, fetch the returned row
                last_row = cursor.fetchone()
                if last_row and 'id' in last_row:
                    last_id = last_row['id']
            affected = cursor.rowcount
            return {"success": True, "lastrowid": last_id, "affected": affected}
        else:
            result = cursor.fetchall()
            # Convert RealDictRow to standard Python dicts
            return [dict(row) for row in result]
    except psycopg2.Error as err:
        logger.error(f"Database query error: {err}")
        raise err
    finally:
        if cursor:
            cursor.close()
        if conn:
            release_connection(conn)
