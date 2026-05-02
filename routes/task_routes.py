from flask import Blueprint, jsonify, request

from services.task_services import (
    create_task_for_user,
    delete_task_for_user_service,
    get_task_for_user,
    list_tasks_for_user,
    toggle_task_done_for_user,
    update_task_for_user,
)
from utils.jwt_handler import jwt_required
from utils.request_helper import require_json_body


task_bp = Blueprint("tasks", __name__)


@task_bp.route("/", methods=["POST"])
@jwt_required
def create_task(payload):
    user_id = payload["user_id"]
    data = request.get_json(silent=True)

    error = require_json_body(data)
    if error:
        return jsonify(error), 400

    task_id = create_task_for_user(
        user_id=user_id,
        title=data.get("title"),
        description=data.get("description"),
    )

    if task_id is None:
        return jsonify({"error": "Title is required"}), 400

    return jsonify({"message": "Task created", "task_id": task_id}), 201


@task_bp.route("/", methods=["GET"])
@jwt_required
def get_tasks(payload):
    user_id = payload["user_id"]
    tasks = list_tasks_for_user(user_id)
    return jsonify([dict(task) for task in tasks]), 200


@task_bp.route("/<int:task_id>", methods=["GET"])
@jwt_required
def get_task(payload, task_id):
    user_id = payload["user_id"]
    task = get_task_for_user(task_id, user_id)

    if task is None:
        return jsonify({"error": "Task not found"}), 404

    return jsonify(dict(task)), 200


@task_bp.route("/<int:task_id>", methods=["PUT"])
@jwt_required
def update_task(payload, task_id):
    user_id = payload["user_id"]
    data = request.get_json(silent=True)

    error = require_json_body(data)
    if error:
        return jsonify(error), 400

    updated = update_task_for_user(
        task_id=task_id,
        user_id=user_id,
        title=data.get("title"),
        description=data.get("description"),
    )

    if not updated:
        return jsonify({"error": "Task not found or invalid title"}), 400

    return jsonify({"message": "Task updated successfully"}), 200


@task_bp.route("/<int:task_id>/toggle", methods=["PATCH"])
@jwt_required
def toggle_task(payload, task_id):
    user_id = payload["user_id"]
    toggled = toggle_task_done_for_user(task_id, user_id)

    if not toggled:
        return jsonify({"error": "Task not found"}), 404

    return jsonify({"message": "Task status toggled"}), 200


@task_bp.route("/<int:task_id>", methods=["DELETE"])
@jwt_required
def delete_task(payload, task_id):
    user_id = payload["user_id"]
    deleted = delete_task_for_user_service(task_id, user_id)

    if not deleted:
        return jsonify({"error": "Task not found"}), 404

    return jsonify({"message": "Task deleted successfully"}), 200
