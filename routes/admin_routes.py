from flask import Blueprint, jsonify
from utils.admin_handler import admin_required
from repositories.admin_repository import get_all_users, get_all_logs, get_all_tasks

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/users", methods=["GET"])
@admin_required
def users():
    data = get_all_users()
    return jsonify([dict(user) for user in data]), 200

@admin_bp.route("/logs", methods=["GET"])
@admin_required
def logs():
    data = get_all_logs()
    return jsonify([dict(log) for log in data]), 200
    
@admin_bp.route("/tasks", methods=["GET"])
@admin_required
def tasks():
    data = get_all_tasks()
    return jsonify([dict(task) for task in data]), 200