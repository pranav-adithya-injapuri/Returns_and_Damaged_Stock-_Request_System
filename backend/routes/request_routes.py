from flask import Blueprint
from controllers.request_controller import (
    create_request,
    get_requests,
    get_request_by_id,
    update_status,
    get_dashboard_stats,
    analyze_image_endpoint
)

request_bp = Blueprint("requests", __name__)

request_bp.route("/create-request", methods=["POST"])(create_request)
request_bp.route("/requests", methods=["GET"])(get_requests)
request_bp.route("/request/<int:request_id>", methods=["GET"])(get_request_by_id)
request_bp.route("/update-status", methods=["PUT"])(update_status)
request_bp.route("/dashboard-stats", methods=["GET"])(get_dashboard_stats)
request_bp.route("/analyze-image", methods=["POST"])(analyze_image_endpoint)
