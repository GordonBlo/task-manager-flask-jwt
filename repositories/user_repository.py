from database.db import get_connection

def find_user_by_email(email):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))     # SELECT query here
    user = cursor.fetchone()
    conn.close()
    return user


def create_user(username, email, password_hash, created_at):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
    "INSERT INTO users (username, email, password_hash, created_at) VALUES (?, ?, ?, ?)",    # INSERT query here
    (username, email, password_hash, created_at)
    )
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()
    return user_id

def find_user_by_id(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))     # SELECT query here
    user = cursor.fetchone()
    conn.close()
    return user