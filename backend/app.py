import os
import sys
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load env variables first
load_dotenv()

# Setup paths
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database.db_helper import init_db_pool
from routes.auth_routes import auth_bp
from routes.request_routes import request_bp

app = Flask(__name__)

# Enable CORS for frontend client
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Ensure uploads folder exists
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Register routes under /api
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(request_bp, url_prefix="/api")

# Serve uploaded images statically
@app.route('/uploads/<path:filename>')
def serve_uploads(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# Health Check Route
@app.route('/')
def home():
    return jsonify({
        "success": True,
        "message": "Pharmacy Returns & Damaged Stock Request System API is running successfully."
    })

# Fallback error handlers
@app.errorhandler(404)
def not_found(e):
    return jsonify({"success": False, "message": "API endpoint not found"}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"success": False, "message": "Internal Server Error", "error": str(e)}), 500

# Initialize Database Pool on Startup
init_db_pool()

if __name__ == "__main__":
    # Host on 0.0.0.0 and port 5000
    app.run(host="0.0.0.0", port=5000, debug=True)
