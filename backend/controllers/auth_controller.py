from flask import jsonify, request
from database.db_helper import execute_query
import logging

logger = logging.getLogger(__name__)

def login_user():
    try:
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        
        if not username or not password:
            return jsonify({
                "success": False,
                "message": "Username and password are required"
            }), 400
            
        # Select query from MySQL
        query = "SELECT id, username, password, role FROM users WHERE username = %s"
        users = execute_query(query, (username,))
        
        if not users:
            return jsonify({
                "success": False,
                "message": "Invalid username or password"
            }), 401
            
        user = users[0]
        # In a real app we would use bcrypt/hash, but user request states: "Dummy authentication (no JWT required, dummy password)"
        if user["password"] != password:
            return jsonify({
                "success": False,
                "message": "Invalid username or password"
            }), 401
            
        # Log successful login activity
        log_query = "INSERT INTO activity_logs (action, performed_by) VALUES (%s, %s)"
        execute_query(log_query, (f"Logged in as {user['role']}", username), commit=True)

        return jsonify({
            "success": True,
            "message": "Login successful",
            "data": {
                "id": user["id"],
                "username": user["username"],
                "role": user["role"]
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return jsonify({
            "success": False,
            "message": "An error occurred during login. Please ensure your database is running and configured correctly.",
            "error": str(e)
        }), 500
