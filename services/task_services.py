from datetime import datetime

from repositories.task_repository import (
    create_task,
    delete_task_for_user,
    get_task_by_id_for_user,
    get_tasks_by_user_id,
    toggle_task_done,
    update_tasks_record,
)
from utils.request_helper import normalize_text


def create_task_for_user(user_id, title, description):
    title = normalize_text(title)
    description = normalize_text(description) or ""

    if not title:
        return None

    created_at = datetime.now().isoformat()
    return create_task(user_id, title, description, created_at)


def list_tasks_for_user(user_id):
    return get_tasks_by_user_id(user_id)


def get_task_for_user(task_id, user_id):
    return get_task_by_id_for_user(task_id, user_id)


def update_task_for_user(task_id, user_id, title, description):
    title = normalize_text(title)
    description = normalize_text(description) or ""

    if not title:
        return False

    return update_tasks_record(task_id, user_id, title, description)


def toggle_task_done_for_user(task_id, user_id):
    return toggle_task_done(task_id, user_id)


def delete_task_for_user_service(task_id, user_id):
    return delete_task_for_user(task_id, user_id)
