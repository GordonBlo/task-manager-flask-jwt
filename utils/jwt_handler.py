import datetime
from functools import wraps

import jwt
from flask import jsonify, request

from config import Config


def _extract_bearer_token(auth_header):
    if not auth_header:
        return None

    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None

    return parts[1]


def jwt_required(f):
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

        return f(payload, *args, **kwargs)

    return decorated


def generate_token(user):
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(
        minutes=Config.JWT_EXPIRES_MINUTES
    )

    payload = {
        "user_id": user["id"],
        "username": user["username"],
        "exp": expires_at,
    }

    return jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")
