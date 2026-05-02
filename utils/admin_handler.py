import jwt
from functools import wraps

from flask import jsonify, request

from config import Config
from repositories.user_repository import find_user_by_id
from utils.jwt_handler import _extract_bearer_token


def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = _extract_bearer_token(request.headers.get("Authorization"))

        if not token:
            return jsonify({"error": "Bearer token missing"}), 401

        try:
            payload = jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        user = find_user_by_id(payload.get("user_id"))

        if not user or user["is_admin"] != 1:
            return jsonify({"error": "Admin access required"}), 403

        return f(*args, **kwargs)

    return decorated
