from database.db import get_connection

def get_all_users():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, email, is_admin, created_at FROM users")
    result = cursor.fetchall()
    conn.close()
    return result

def get_all_logs():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, user_id, logged_at, success FROM login_logs ORDER BY logged_at DESC")
    result = cursor.fetchall()
    conn.close()
    return result

def get_all_tasks():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, user_id, title, is_done, created_at FROM tasks")
    result = cursor.fetchall()
    conn.close()
    return result