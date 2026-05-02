from database.db import get_connection

def create_task(user_id, title, description, created_at):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO tasks (user_id, title, description, is_done, created_at) VALUES (?, ?, ?, ?, ?)",
        (user_id, title, description, 0, created_at)
    )
    conn.commit()
    task_id = cursor.lastrowid
    conn.close()
    return task_id

def get_tasks_by_user_id(user_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks WHERE user_id = ?", (user_id,))
    tasks = cursor.fetchall()
    conn.close()
    return tasks

def get_task_by_id_for_user(task_id, user_id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks WHERE id = ? AND user_id = ?", (task_id, user_id))
    task = cursor.fetchone()
    conn.close()
    return task

def update_tasks_record(task_id, user_id, title, description):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE tasks SET title = ?, description = ? WHERE id = ? AND user_id = ?",
        (title, description, task_id, user_id)
    )

    conn.commit()
    update = cursor.rowcount > 0
    conn.close()
    return update

def toggle_task_done(task_id, user_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE tasks
        SET is_done = CASE
            WHEN is_done = 1 THEN 0
            ELSE 1
        END
        WHERE id = ? AND user_id = ?
        """,
        (task_id, user_id)
    )

    conn.commit()
    toggle = cursor.rowcount > 0
    conn.close()
    return toggle

def delete_task_for_user(task_id, user_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM tasks WHERE id = ? AND user_id = ?",
        (task_id, user_id)
    )

    conn.commit()
    delete = cursor.rowcount > 0
    conn.close()

    return delete