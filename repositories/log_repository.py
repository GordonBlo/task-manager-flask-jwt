from database.db import get_connection

def log_login(user_id, logged_at, success):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO login_logs (user_id, logged_at, success) VALUES (?, ?, ?)",
         (user_id, logged_at, success)
    )
    conn.commit()
    conn.close()