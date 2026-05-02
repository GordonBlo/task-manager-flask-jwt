from datetime import datetime

from repositories.log_repository import log_login
from repositories.user_repository import create_user, find_user_by_email
from utils.jwt_handler import generate_token
from utils.password_handler import check_password, hash_password
from utils.request_helper import normalize_text


def register_user(username, email, password):
    username = normalize_text(username)
    email = normalize_text(email)
    password = normalize_text(password)

    if not username or not email or not password:
        return {"error": "Missing required fields"}

    existing_user = find_user_by_email(email)
    if existing_user:
        return {"error": "Email already exists"}

    password_hash = hash_password(password)
    created_at = datetime.now().isoformat()

    user_id = create_user(username, email, password_hash, created_at)
    return {"message": "User registered successfully", "user_id": user_id}


def login_user(email, password):
    logged_at = datetime.now().isoformat()
    email = normalize_text(email)
    password = normalize_text(password)

    if not email or not password:
        log_login(None, logged_at, 0)
        return {"error": "Missing required fields"}

    user = find_user_by_email(email)
    if not user:
        log_login(None, logged_at, 0)
        return {"error": "Invalid email or password"}

    if not check_password(password, user["password_hash"]):
        log_login(user["id"], logged_at, 0)
        return {"error": "Invalid email or password"}

    token = generate_token(user)
    log_login(user["id"], logged_at, 1)
    return {"message": "Login successful", "token": token}
