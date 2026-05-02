from flask import Blueprint, jsonify, request
from services.auth_services import register_user, login_user
from utils.request_helper import require_json_body

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register(): 
    data = request.get_json(silent=True)

    error = require_json_body(data)
    if error:
        return jsonify(error), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    result = register_user(username, email, password)

    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True)

    error = require_json_body(data)
    if error:
        return jsonify(error), 400

    email = data.get("email")
    password = data.get("password")

    result = login_user(email, password)

    if "error" in result:
        return jsonify(result), 400
    
    return jsonify(result), 200