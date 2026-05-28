import os
import uuid
import base64
import logging
from flask import jsonify, request
from database.db_helper import execute_query
from services.gemini_service import analyze_medicine_image

logger = logging.getLogger(__name__)
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'uploads')

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def create_request():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "message": "Request body must be JSON"}), 400

        pharmacy_name = data.get("pharmacy_name")
        medicine_name = data.get("medicine_name")
        batch_number = data.get("batch_number")
        expiry_date = data.get("expiry_date")
        quantity = data.get("quantity")
        reason = data.get("reason")
        image_data = data.get("image_data")  # Base64 string
        image_name = data.get("image_name", "upload.jpg")

        # Validation
        if not all([pharmacy_name, medicine_name, batch_number, expiry_date, quantity, reason]):
            return jsonify({"success": False, "message": "All text fields are required"}), 400

        image_path = None
        ai_analysis = "No image provided for AI analysis."

        # Handle base64 image processing
        if image_data:
            # 1. Clean the base64 prefix
            clean_image_data = image_data
            if "," in image_data:
                clean_image_data = image_data.split(",", 1)[1]

            # Generate unique filename
            unique_filename = f"{uuid.uuid4()}_{image_name}"
            full_path = os.path.join(UPLOAD_FOLDER, unique_filename)
            
            # Save file locally
            with open(full_path, "wb") as fh:
                fh.write(base64.b64decode(clean_image_data))
            
            image_path = f"uploads/{unique_filename}"

            # 2. Process Gemini analysis
            logger.info("Triggering Gemini Image Analysis...")
            ai_analysis = analyze_medicine_image(clean_image_data)
        
        # 3. Store in DB
        insert_query = """
            INSERT INTO return_requests 
            (pharmacy_name, medicine_name, batch_number, expiry_date, quantity, reason, image_path, ai_analysis, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'Pending')
            RETURNING id
        """
        params = (pharmacy_name, medicine_name, batch_number, expiry_date, quantity, reason, image_path, ai_analysis)
        result = execute_query(insert_query, params, commit=True)
        
        # 4. Log activity
        log_query = "INSERT INTO activity_logs (action, performed_by) VALUES (%s, %s)"
        execute_query(log_query, (f"Created return request for '{medicine_name}'", pharmacy_name), commit=True)

        return jsonify({
            "success": True,
            "message": "Request created successfully",
            "data": {
                "id": result["lastrowid"],
                "medicine_name": medicine_name,
                "ai_analysis": ai_analysis,
                "image_path": image_path
            }
        }), 201

    except Exception as e:
        logger.error(f"Error creating return request: {str(e)}")
        return jsonify({
            "success": False,
            "message": "Failed to create return request",
            "error": str(e)
        }), 500

def get_requests():
    try:
        # Support search and status filter query params
        search = request.args.get("search", "")
        status = request.args.get("status", "")
        
        query = "SELECT * FROM return_requests WHERE 1=1"
        params = []
        
        if status:
            query += " AND status = %s"
            params.append(status)
            
        if search:
            query += " AND (medicine_name LIKE %s OR pharmacy_name LIKE %s OR batch_number LIKE %s)"
            search_param = f"%{search}%"
            params.extend([search_param, search_param, search_param])
            
        query += " ORDER BY created_at DESC"
        requests_list = execute_query(query, tuple(params))
        
        # Format date objects for JSON
        for req in requests_list:
            if req.get("expiry_date"):
                req["expiry_date"] = req["expiry_date"].strftime("%Y-%m-%d")
            if req.get("created_at"):
                req["created_at"] = req["created_at"].strftime("%Y-%m-%d %H:%M:%S")

        return jsonify({
            "success": True,
            "message": "Requests retrieved successfully",
            "data": requests_list
        }), 200
    except Exception as e:
        logger.error(f"Error fetching requests: {str(e)}")
        return jsonify({"success": False, "message": "Failed to retrieve requests", "error": str(e)}), 500

def get_request_by_id(request_id):
    try:
        query = "SELECT * FROM return_requests WHERE id = %s"
        requests_list = execute_query(query, (request_id,))
        
        if not requests_list:
            return jsonify({"success": False, "message": "Request not found"}), 404
            
        req = requests_list[0]
        if req.get("expiry_date"):
            req["expiry_date"] = req["expiry_date"].strftime("%Y-%m-%d")
        if req.get("created_at"):
            req["created_at"] = req["created_at"].strftime("%Y-%m-%d %H:%M:%S")

        return jsonify({
            "success": True,
            "message": "Request retrieved successfully",
            "data": req
        }), 200
    except Exception as e:
        logger.error(f"Error fetching request details: {str(e)}")
        return jsonify({"success": False, "message": "Failed to retrieve request details", "error": str(e)}), 500

def update_status():
    try:
        data = request.get_json()
        request_id = data.get("id")
        new_status = data.get("status")
        admin_username = data.get("admin_username", "Admin")

        if not request_id or not new_status:
            return jsonify({"success": False, "message": "ID and status are required"}), 400

        if new_status not in ["Approved", "Rejected"]:
            return jsonify({"success": False, "message": "Invalid status value"}), 400

        # Check existence
        check_query = "SELECT medicine_name FROM return_requests WHERE id = %s"
        existing = execute_query(check_query, (request_id,))
        if not existing:
            return jsonify({"success": False, "message": "Request not found"}), 404

        medicine_name = existing[0]["medicine_name"]

        # Update
        update_query = "UPDATE return_requests SET status = %s WHERE id = %s"
        execute_query(update_query, (new_status, request_id), commit=True)

        # Log
        log_query = "INSERT INTO activity_logs (action, performed_by) VALUES (%s, %s)"
        execute_query(log_query, (f"Status of request {request_id} ({medicine_name}) updated to '{new_status}'", admin_username), commit=True)

        return jsonify({
            "success": True,
            "message": f"Request status updated to {new_status} successfully",
            "data": {"id": request_id, "status": new_status}
        }), 200
    except Exception as e:
        logger.error(f"Error updating status: {str(e)}")
        return jsonify({"success": False, "message": "Failed to update status", "error": str(e)}), 500

def get_dashboard_stats():
    try:
        # Aggregate counts
        query = """
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected
            FROM return_requests
        """
        stats = execute_query(query)
        result = stats[0] if stats else {"total": 0, "pending": 0, "approved": 0, "rejected": 0}

        # Safe parsing of counts
        total = result.get("total") or 0
        pending = int(result.get("pending") or 0)
        approved = int(result.get("approved") or 0)
        rejected = int(result.get("rejected") or 0)

        # Fetch recent logs
        logs_query = "SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 5"
        recent_logs = execute_query(logs_query)
        for log in recent_logs:
            if log.get("timestamp"):
                log["timestamp"] = log["timestamp"].strftime("%Y-%m-%d %H:%M:%S")

        return jsonify({
            "success": True,
            "message": "Dashboard statistics retrieved successfully",
            "data": {
                "total": total,
                "pending": pending,
                "approved": approved,
                "rejected": rejected,
                "recent_activity": recent_logs
            }
        }), 200
    except Exception as e:
        logger.error(f"Error compiling dashboard stats: {str(e)}")
        return jsonify({"success": False, "message": "Failed to retrieve dashboard stats", "error": str(e)}), 500

def analyze_image_endpoint():
    try:
        data = request.get_json()
        image_data = data.get("image_data")
        
        if not image_data:
            return jsonify({"success": False, "message": "image_data is required"}), 400

        # Clean the base64 prefix
        clean_image_data = image_data
        if "," in image_data:
            clean_image_data = image_data.split(",", 1)[1]

        logger.info("Executing on-demand Gemini analysis...")
        analysis = analyze_medicine_image(clean_image_data)
        
        return jsonify({
            "success": True,
            "message": "Analysis completed successfully",
            "data": {"analysis": analysis}
        }), 200
    except Exception as e:
        logger.error(f"Error running image analysis: {str(e)}")
        return jsonify({"success": False, "message": "Failed to run image analysis", "error": str(e)}), 500
